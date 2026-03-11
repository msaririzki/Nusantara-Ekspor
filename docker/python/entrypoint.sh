#!/bin/sh
set -e

echo "==> [Entrypoint] Memulai setup Nusantara Ekspor..."

# 1. Setup .env jika belum ada atau kosong (0 bytes)
if [ ! -s /app/backend/.env ]; then
    echo "==> [Entrypoint] Membuat/mengisi .env dari .env.example..."
    cp /app/backend/.env.example /app/backend/.env
fi

# 2. Populate frontend dist volume (jika masih kosong)
if [ ! -f /usr/share/nginx/html/index.html ] && [ -d /frontend-dist-init ]; then
    echo "==> [Entrypoint] Menyalin file frontend ke volume bersama..."
    cp -r /frontend-dist-init/. /usr/share/nginx/html/
fi

# 3. Pastikan frontend dist juga ada di path yang diharapkan backend
if [ ! -d /app/frontend/dist/assets ] && [ -d /frontend-dist-init ]; then
    echo "==> [Entrypoint] Menyalin frontend dist ke path backend..."
    cp -r /frontend-dist-init/. /app/frontend/dist/
fi

# 4. Inisialisasi database (create tables)
echo "==> [Entrypoint] Menginisialisasi database..."
python -c "
import asyncio
from database import init_db
asyncio.run(init_db())
print('==> [Entrypoint] Database siap!')
"

echo "==> [Entrypoint] Setup selesai! Menjalankan: $@"
exec "$@"
