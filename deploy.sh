#!/bin/bash

# ==========================================
# Nusantara Ekspor - Deployment Script
# ==========================================
# Skrip ini digunakan untuk memperbarui dan 
# menjalankan aplikasi di Server Produksi (VPS/Cloud).
#
# Penggunaan:
#   bash deploy.sh            → deploy biasa (pertahankan data yang ada)
#   bash deploy.sh --reseed   → deploy + HAPUS & ISI ULANG database

set -e # Hentikan eksekusi jika ada error di tengah jalan

RESEED=false
for arg in "$@"; do
  if [ "$arg" = "--reseed" ]; then
    RESEED=true
  fi
done

echo -e "\n🚀 Memulai Proses Deployment Nusantara Ekspor..."
if [ "$RESEED" = true ]; then
  echo "⚠️  Mode --reseed aktif: Database akan DIKOSONGKAN dan diisi ulang!"
fi

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
        echo "   TIDAK BISA DILANJUTKAN: Mohon edit 'backend/.env' (isi variabel rahasia seperti Database, Gemini, & Resend API Key)."
        exit 1
    else
        echo "   Template .env.example juga tidak ada. Silakan buat 'backend/.env' manual."
        exit 1
    fi
fi

# 4. Pastikan folder data ada
mkdir -p backend/data

# 5. Bangun ulang dan restart container
echo "🏗️  Memperbarui aplikasi menggunakan Docker Cache..."
docker compose up --build -d

# Tunggu app siap
echo "⏳ Menunggu container siap..."
sleep 5

# 6. Migrasi skema: tambahkan kolom yang mungkin belum ada
echo "🗃️  Memeriksa dan memperbarui skema database..."
docker compose exec -T app python -c "
import sqlite3, os
db_path = 'data/db.sqlite'
if not os.path.exists(db_path):
    db_path = 'db.sqlite'
try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    for col, coltype in [
        ('reset_password_token', 'VARCHAR(255)'),
        ('reset_password_expires', 'DATETIME'),
    ]:
        try:
            cursor.execute(f'ALTER TABLE users ADD COLUMN {col} {coltype};')
            print(f'   V Kolom {col} ditambahkan.')
        except Exception:
            print(f'   i Kolom {col} sudah ada.')
    conn.commit()
    conn.close()
except Exception as e:
    print(f'   ! Skema check: {e}')
" || echo "   Peringatan: Pemeriksaan skema gagal, mungkin container belum siap."

# 7. RESEED — Kosongkan & isi ulang database (hanya jika --reseed)
if [ "$RESEED" = true ]; then
    echo ""
    echo "🌱 Menjalankan reseed database..."
    echo "   (Data lama akan dihapus, diganti data realistis baru)"
    docker compose exec -T app sh -c "cd /app/backend && python seed.py"
    echo "✅ Reseed selesai!"
fi

echo -e "\n🎉 Deployment Selesai!"
echo "📡 Aplikasi berjalan di port 8002 melalui Nginx."
echo "   Cloudflare Tunnel arahkan ke: http://localhost:8002"
echo ""
echo "📝 Cek log realtime:"
echo "   docker compose logs -f"

if [ "$RESEED" = true ]; then
    echo ""
    echo "Akun yang tersedia setelah reseed:"
    echo "   UMKM  : zaryelkemiri@gmail.com    | 111111"
    echo "   Buyer : ArabianCompany@gmail.com   | 111111"
fi
echo "=========================================="
