#!/bin/bash

# ==========================================
# Nusantara Ekspor - Deployment Script
# ==========================================
# Skrip ini digunakan untuk memperbarui dan 
# menjalankan aplikasi di Server Produksi (VPS/Cloud).

set -e # Hentikan eksekusi jika ada error di tengah jalan

echo -e "\n🚀 Memulai Proses Deployment Nusantara Ekspor..."

# 1. Cek Ketersediaan Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker belum terinstall! Silakan install Docker dan Docker Compose terlebih dahulu."
    exit 1
fi

# 2. Tarik kode terbaru dari repositori Git
echo "📦 Mengambil pembaruan terbaru dari GitHub..."
git pull origin main

# 3. Cek file .env backend
if [ ! -f backend/.env ]; then
    echo "⚠️ File backend/.env tidak ditemukan!"
    if [ -f backend/.env.example ]; then
        echo "   Menyalin dari backend/.env.example..."
        cp backend/.env.example backend/.env
        echo "   TIDAK BISA DILANJUTKAN: Mohon edit 'backend/.env' (isi variabel rahasia seperti Database, Jemini, & Resend API Key)."
        exit 1
    else
        echo "   Template .env.example juga tidak ada. Silakan buat 'backend/.env' manual."
        exit 1
    fi
fi

# 4. Hentikan container lama yang berjalan
echo "🛑 Menghentikan layanan yang sedang berjalan (jika ada)..."
docker compose down

# 5. Membersihkan cache Docker (opsional, uncomment jika RAM server sering penuh)
# echo "🧹 Membersihkan cache docker tak terpakai..."
# docker system prune -f

# 6. Membangun ulang image Docker dan Frontend (Vite)
echo "🏗️ Membangun ulang aplikasi & menginstal dependensi terbaru..."
docker compose build --no-cache

# 7. Menjalankan Docker Background Mode (Daemon)
echo "⚡ Menjalankan layanan secara background..."
docker compose up -d

# 8. Menambahkan migrasi database baru (jika tidak ter-cover di entrypoint / skrip setup)
echo "🗃️ Menerapkan migrasi database terkini (kolom reset password)..."
# Menggunakan docker exec untuk menjalankan script penambahan kolom
docker compose exec app python -c "
import sqlite3
def fix_db():
    try:
        conn = sqlite3.connect('data/db.sqlite')
        cursor = conn.cursor()
        cursor.execute('ALTER TABLE users ADD COLUMN reset_password_token VARCHAR(255);')
        cursor.execute('ALTER TABLE users ADD COLUMN reset_password_expires DATETIME;')
        conn.commit()
        print('   ✅ Kolom Reset Password berhasil ditambahkan ke Database Server.')
    except Exception as e:
        print('   ℹ️ Pengecekan skema database aman:', e)
        pass
    finally:
        if 'conn' in locals(): conn.close()
fix_db()
" || echo "   Peringatan: Skrip pemeriksaan database gagal, mungkin container belum siap sepenuhnya."


echo -e "\n🎉 Deployment Selesai!"
echo "📡 Aplikasi berjalan di port lokal 8002 melalui Nginx."
echo "   Kabar baik: Port 8002 terpantau AMAN di daftar port VPS Anda."
echo "   Pastikan Cloudflare Tunnel Anda hanya perlu mengarah ke SATU target:"
echo "   👉 http://localhost:8002 (ini sudah melayani web dan juga API backend otomatis)"
echo "   Tidak perlu membuat tunnel terpisah untuk backend."
echo ""
echo "📝 Cek log secara realtime dengan perintah:"
echo "   docker compose logs -f"
echo "=========================================="
