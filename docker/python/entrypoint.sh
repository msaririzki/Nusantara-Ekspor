#!/bin/sh
set -e

echo "==> [Entrypoint] Memulai setup Nusantara Ekspor..."

# 1. Setup .env jika belum ada atau kosong (0 bytes)
if [ ! -s /app/backend/.env ]; then
    echo "==> [Entrypoint] Membuat/mengisi .env dari .env.example..."
    cp /app/backend/.env.example /app/backend/.env
fi

# 2. Populate frontend dist volume (hanya jika direktori target sudah di-mount)
# Volume frontend-dist dibagi dengan container nginx, bukan selalu ada di sini
NGINX_HTML="/usr/share/nginx/html"
if [ -d "$NGINX_HTML" ] && [ -d /frontend-dist-init ]; then
    echo "==> [Entrypoint] Menyalin (overwrite) file frontend ke volume bersama..."
    cp -r /frontend-dist-init/. "$NGINX_HTML/"
else
    echo "==> [Entrypoint] Melewati copy frontend (volume nginx tidak di-mount di sini)."
fi

# 3. Pastikan frontend dist juga ada di path yang diharapkan backend (untuk SPA serve)
if [ ! -d /app/frontend/dist/assets ] && [ -d /frontend-dist-init ]; then
    echo "==> [Entrypoint] Menyalin frontend dist ke path backend..."
    mkdir -p /app/frontend/dist
    cp -r /frontend-dist-init/. /app/frontend/dist/
fi

# 4. Pastikan folder data tersedia untuk SQLite
mkdir -p /app/backend/data
mkdir -p /app/backend/uploads

# 5. Inisialisasi database (create tables)
echo "==> [Entrypoint] Menginisialisasi database..."
python -c "
from database import init_db
init_db()
print('==> [Entrypoint] Database siap!')
"

echo "==> [Entrypoint] Setup selesai! Menjalankan: $@"
exec "$@"
