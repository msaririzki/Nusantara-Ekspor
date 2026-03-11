# ============================================================
# STAGE 1: Build frontend assets (Node.js)
# ============================================================
FROM node:20-alpine AS node-builder

WORKDIR /build

# Copy package files dulu untuk cache layer
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install

# Copy seluruh frontend source untuk build
COPY frontend/ .
RUN npm run build

# ============================================================
# STAGE 2: Python Application (FastAPI)
# ============================================================
FROM python:3.12-slim

# Install system dependencies
RUN set -eux; \
    apt-get update && apt-get install -y --no-install-recommends \
        curl \
    ; \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend

# Copy requirements dulu untuk cache layer
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy seluruh backend source
COPY backend/ .

# Copy hasil build frontend dari stage 1
COPY --from=node-builder /build/dist /app/frontend/dist

# Simpan salinan frontend dist ke /frontend-dist-init
# (akan di-copy ke named volume saat entrypoint berjalan pertama kali)
RUN cp -r /app/frontend/dist /frontend-dist-init

# Copy & set entrypoint
COPY docker/python/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
