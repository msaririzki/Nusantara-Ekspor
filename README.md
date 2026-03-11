<p align="center">
  <img src="https://img.shields.io/badge/🇮🇩-Nusantara_Ekspor-blue?style=for-the-badge&labelColor=0f172a" alt="Nusantara Ekspor" />
</p>

<h1 align="center">🌏 Nusantara Ekspor</h1>

<p align="center">
  <strong>Bawa Produk Kebanggaanmu Mendunia</strong>
</p>

<p align="center">
  Platform digital bertenaga AI untuk membantu UMKM Indonesia melakukan ekspor ke pasar global.<br/>
  Tanpa kendala bahasa, tanpa bingung regulasi.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Gemini_AI-8E75B2?style=flat-square&logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white" alt="SQLite" />
</p>

---

## 📑 Daftar Isi

1. [Tentang Project](#-tentang-project)
2. [Fitur Utama](#-fitur-utama)
3. [Tech Stack](#-tech-stack)
4. [Arsitektur](#-arsitektur)
5. [Prasyarat](#-prasyarat)
6. [Quick Start Lokal](#-quick-start-lokal)
7. [Deploy dengan Docker](#-deploy-dengan-docker)
8. [API Reference](#-api-reference)
9. [Peta Repositori](#-peta-repositori)
10. [Environment Variables](#-environment-variables)
11. [Kontribusi](#-kontribusi)

---

## 🎯 Tentang Project

**Nusantara Ekspor** adalah platform e-commerce B2B yang dirancang khusus untuk menjembatani UMKM Indonesia dengan pembeli internasional. Platform ini mengintegrasikan teknologi **Gemini AI** dari Google untuk menyediakan fitur terjemahan otomatis dan chatbot asisten ekspor, sehingga pelaku UMKM dapat bernegosiasi lintas bahasa dan memahami proses ekspor dengan mudah.

### Mengapa Nusantara Ekspor?

| Masalah | Solusi |
|---------|--------|
| 🗣️ Kendala bahasa dalam negosiasi B2B | Auto-translate real-time oleh Gemini AI |
| 📦 Kesulitan memasarkan produk ke luar negeri | Katalog digital premium + pencarian canggih |
| ❓ Bingung regulasi dan prosedur ekspor | Chatbot asisten ekspor 24/7 |
| 💰 Biaya platform ekspor mahal | Open-source dan gratis untuk memulai |

---

## ✨ Fitur Utama

### 📦 Katalog Produk Digital
- Etalase online premium untuk memajang produk UMKM Indonesia
- Pencarian, filter kategori, dan sorting (terbaru, harga termurah/termahal)
- Detail produk lengkap: foto, harga, spesifikasi, minimum order
- Manajemen produk CRUD untuk pemilik (buat, edit, hapus)

### 💬 Live Chat B2B + Auto-Translate
- Chat real-time via WebSocket antara UMKM dan buyer internasional
- **Terjemahan otomatis** menggunakan Gemini AI (ID ↔ EN ↔ ZH, dll)
- Sistem ruang chat (room) untuk negosiasi per transaksi

### 🤖 Chatbot Asisten Ekspor 24/7
- Asisten pintar bertenaga Gemini AI
- Menjawab pertanyaan seputar alur ekspor, syarat kelayakan produk, dokumen, dan izin yang diperlukan
- Tersedia kapan saja tanpa batasan waktu

### 🔐 Autentikasi & Otorisasi
- Registrasi dan login dengan JWT token
- Dua role: **UMKM** (penjual/eksportir) dan **Buyer** (pembeli internasional)
- Protected routes untuk halaman yang membutuhkan login

---

## 🛠️ Tech Stack

### Frontend
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| React | 19.2 | UI library |
| TypeScript | 5.9 | Type safety |
| Vite | 7.3 | Build tool & dev server |
| Tailwind CSS | 3.4 | Utility-first CSS |
| React Router | 7.13 | Client-side routing |
| Lucide React | 0.577 | Icon library |

### Backend
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| FastAPI | 0.115 | Web framework (async) |
| SQLAlchemy | 2.0 | ORM (async) |
| SQLite + aiosqlite | — | Database (file-based) |
| Uvicorn | 0.34 | ASGI server |
| Google GenAI | 1.x | Gemini AI integration |
| python-jose | 3.3 | JWT authentication |
| Passlib + bcrypt | — | Password hashing |
| WebSockets | 14.1 | Real-time chat |

### DevOps
| Teknologi | Fungsi |
|-----------|--------|
| Docker + Docker Compose | Containerization |
| Nginx | Reverse proxy + static file server |

---

## 🏗️ Arsitektur

```
                          ┌─────────────────────────────────┐
                          │          Browser / Client        │
                          └──────────────┬──────────────────┘
                                         │
                                    :8002 (Docker)
                                    :5173 (Lokal)
                                         │
                          ┌──────────────▼──────────────────┐
                          │        Nginx (Reverse Proxy)     │
                          │     Port 80 → Docker :8002       │
                          └──────────────┬──────────────────┘
                                         │
                    ┌────────────────────┬┴───────────────────┐
                    │                    │                     │
            /api/* /docs /ws/*     /assets/*            /* (SPA)
                    │                    │                     │
                    ▼                    └──────────┬──────────┘
         ┌──────────────────┐                       │
         │   FastAPI :8000   │            Frontend Static Files
         │   (Uvicorn ASGI)  │            (React + Vite build)
         └────────┬─────────┘
                  │
     ┌────────────┼────────────┐
     │            │            │
     ▼            ▼            ▼
┌─────────┐ ┌─────────┐ ┌──────────┐
│ SQLite  │ │ Gemini  │ │ WebSocket│
│   DB    │ │   AI    │ │  Manager │
└─────────┘ └─────────┘ └──────────┘
```

---

## 📋 Prasyarat

### Development Lokal
- **Python** 3.12+
- **Node.js** 20+  &  **npm**
- **Git**

### Deploy (Docker)
- **Docker** 20+ & **Docker Compose** v2
- **Git**

---

## 🚀 Quick Start Lokal

### 1. Clone repository

```bash
git clone https://github.com/msaririzki/Nusantara-Ekspor.git
cd Nusantara-Ekspor
```

### 2. Setup Backend

```bash
cd backend

# Buat virtual environment
python -m venv venv

# Aktifkan virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env → isi GEMINI_API_KEY

# Jalankan server
uvicorn main:app --reload
```

Backend berjalan di `http://localhost:8000`

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Jalankan dev server
npm run dev
```

Frontend berjalan di `http://localhost:5173`

### 4. Buka Aplikasi

Buka browser → `http://localhost:5173`

> **💡 Tips:** API Documentation tersedia di `http://localhost:8000/docs` (Swagger UI) dan `http://localhost:8000/redoc` (ReDoc).

---

## 🐳 Deploy dengan Docker

### 1. Clone & Setup Environment

```bash
git clone https://github.com/msaririzki/Nusantara-Ekspor.git
cd Nusantara-Ekspor

# Setup environment
cp backend/.env.example backend/.env
nano backend/.env  # Isi GEMINI_API_KEY, SECRET_KEY, dll
```

### 2. Build & Jalankan

```bash
docker compose build
docker compose up -d
```

### 3. Akses Aplikasi

| URL | Keterangan |
|-----|------------|
| `http://server-ip:8002` | Halaman utama |
| `http://server-ip:8002/docs` | Swagger API Docs |
| `http://server-ip:8002/redoc` | ReDoc API Docs |
| `http://server-ip:8002/api/health` | Health check |

### Perintah Berguna

```bash
# Lihat log
docker compose logs -f

# Restart services
docker compose restart

# Stop semua containers
docker compose down

# Rebuild setelah perubahan kode
docker compose build --no-cache
docker compose up -d

# Update setelah git pull (source code di-mount, cukup restart)
git pull
docker compose restart app
```

> **📍 Port:** Default `8002`. Ubah via environment variable `WEB_PORT` jika perlu.

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `POST` | `/api/auth/register` | Registrasi akun baru | ❌ |
| `POST` | `/api/auth/login` | Login dan dapatkan JWT token | ❌ |

### Products

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `GET` | `/api/products` | Daftar produk (search, filter, sort) | ❌ |
| `GET` | `/api/products/{id}` | Detail produk | ❌ |
| `POST` | `/api/products` | Buat produk baru | ✅ UMKM |
| `PUT` | `/api/products/{id}` | Edit produk | ✅ Owner |
| `DELETE` | `/api/products/{id}` | Hapus produk | ✅ Owner |

### AI Services

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `POST` | `/api/ai/translate` | Terjemahan teks via Gemini AI | ❌ |
| `POST` | `/api/ai/chatbot` | Chat dengan Asisten Ekspor AI | ❌ |

### Chat (WebSocket)

| Protocol | Endpoint | Deskripsi |
|----------|----------|-----------|
| `WS` | `/api/chat/ws/{room_id}` | Real-time B2B chat + auto-translate |

### System

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/health` | Health check |

---

## 📁 Peta Repositori

```
Nusantara-Ekspor/
├── 📂 backend/                    # FastAPI Backend
│   ├── 📂 models/                 # SQLAlchemy models
│   │   ├── user.py                # Model User (UMKM/Buyer)
│   │   ├── product.py             # Model Product
│   │   └── chat.py                # Model ChatRoom & ChatMessage
│   ├── 📂 routers/                # API route handlers
│   │   ├── auth.py                # Register & Login
│   │   ├── products.py            # CRUD Products
│   │   ├── ai.py                  # Translate & Chatbot
│   │   └── chat.py                # WebSocket Chat
│   ├── 📂 schemas/                # Pydantic schemas (request/response)
│   ├── 📂 services/               # Business logic
│   │   ├── auth_service.py        # Auth logic
│   │   └── gemini_service.py      # Gemini AI integration
│   ├── 📂 utils/                  # Utilities
│   │   ├── dependencies.py        # FastAPI dependencies
│   │   └── security.py            # JWT & password hashing
│   ├── main.py                    # FastAPI app entry point
│   ├── config.py                  # Configuration (env vars)
│   ├── database.py                # Database engine & session
│   ├── requirements.txt           # Python dependencies
│   ├── .env.example               # Template environment variables
│   └── .env                       # Actual env (git-ignored)
│
├── 📂 frontend/                   # React + Vite Frontend
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── 📂 auth/           # ProtectedRoute
│   │   │   ├── 📂 chatbot/        # ChatbotWidget
│   │   │   └── 📂 layout/         # Navbar, Footer, Layout
│   │   ├── 📂 context/            # AuthContext (JWT state)
│   │   ├── 📂 pages/              # Halaman aplikasi
│   │   │   ├── LandingPage.tsx    # Halaman utama
│   │   │   ├── CatalogPage.tsx    # Katalog produk
│   │   │   ├── ProductDetailPage  # Detail produk
│   │   │   ├── DashboardPage.tsx  # Dashboard UMKM
│   │   │   ├── ChatPage.tsx       # Halaman chat B2B
│   │   │   ├── LoginPage.tsx      # Halaman login
│   │   │   └── RegisterPage.tsx   # Halaman registrasi
│   │   ├── 📂 services/           # API client (fetch wrapper)
│   │   ├── 📂 data/               # Dummy data
│   │   ├── 📂 types/              # TypeScript types
│   │   ├── App.tsx                # Router configuration
│   │   └── main.tsx               # Entry point
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── index.html
│
├── 📂 docker/                     # Docker configuration
│   ├── 📂 python/
│   │   ├── Dockerfile             # Multi-stage: Node build + Python
│   │   └── entrypoint.sh          # Container startup script
│   └── 📂 nginx/
│       └── default.conf           # Nginx reverse proxy config
│
├── docker-compose.yml             # Docker orchestration
├── .dockerignore                  # Docker build exclusions
├── .gitignore                     # Git exclusions
└── README.md                      # 📖 Anda sedang membacanya!
```

---

## ⚙️ Environment Variables

Konfigurasi dilakukan melalui file `backend/.env`:

| Variable | Deskripsi | Default |
|----------|-----------|---------|
| `DATABASE_URL` | URL koneksi database | `sqlite+aiosqlite:///./nusantara_ekspor.db` |
| `SECRET_KEY` | Secret key untuk JWT | `dev-secret-key-change-in-production` |
| `ALGORITHM` | Algoritma JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Masa berlaku token (menit) | `60` |
| `GEMINI_API_KEY` | API Key Google Gemini AI | *(wajib diisi)* |
| `APP_NAME` | Nama aplikasi | `Nusantara Ekspor` |
| `APP_VERSION` | Versi aplikasi | `1.0.0` |
| `DEBUG` | Mode debug | `true` |
| `CORS_ORIGINS` | Allowed origins (koma separated) | `http://localhost:5173,http://localhost:3000` |

> **⚠️ Penting:** Jangan lupa isi `GEMINI_API_KEY` dengan API Key dari [Google AI Studio](https://aistudio.google.com/apikey).

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan buat *pull request* atau buka *issue* untuk saran dan perbaikan.

```bash
# Fork repo → Clone → Buat branch
git checkout -b fitur/fitur-baru

# Commit perubahan
git commit -m "feat: tambah fitur baru"

# Push dan buat Pull Request
git push origin fitur/fitur-baru
```

---

<p align="center">
  Dibuat dengan ❤️ untuk UMKM Indonesia 🇮🇩
</p>
