# ==========================================
# Nusantara Ekspor - FastAPI Main Application
# ==========================================

import os
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from config import settings
from database import init_db
from routers import auth, products, ai, chat


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: initialize resources on startup."""
    print("🚀 Nusantara Ekspor Backend starting up...")
    await init_db()
    print("✅ Database initialized")
    yield
    print("👋 Nusantara Ekspor Backend shutting down...")


app = FastAPI(
    title=settings.APP_NAME,
    description=(
        "API Backend untuk platform Nusantara Ekspor — "
        "membantu UMKM Indonesia melakukan ekspor ke pasar global. "
        "Dilengkapi dengan fitur Auto-Translate dan Chatbot Asisten Ekspor "
        "bertenaga Gemini AI."
    ),
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(ai.router)
app.include_router(chat.router)


@app.get("/api/health", tags=["Root"])
async def health_check():
    """Health check for monitoring."""
    return {"status": "healthy", "name": settings.APP_NAME, "version": settings.APP_VERSION}


# ==========================================
# Serve Frontend Static Files (Production)
# ==========================================
# Frontend dist folder is at ../frontend/dist
frontend_dist = Path(__file__).parent.parent / "frontend" / "dist"

if frontend_dist.exists():
    # Mount static assets (JS, CSS, images)
    app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="assets")

    # Serve vite.svg and other root-level static files
    @app.get("/vite.svg", include_in_schema=False)
    async def vite_svg():
        svg_path = frontend_dist / "vite.svg"
        if svg_path.exists():
            return FileResponse(str(svg_path))

    # Catch-all: serve index.html for SPA client-side routing
    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str):
        # Don't serve index.html for API routes
        if full_path.startswith("api/") or full_path.startswith("docs") or full_path.startswith("redoc") or full_path.startswith("openapi"):
            return
        file_path = frontend_dist / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(str(file_path))
        return FileResponse(str(frontend_dist / "index.html"))
else:
    @app.get("/", tags=["Root"])
    async def root():
        return {
            "name": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "status": "running",
            "message": "🇮🇩 Nusantara Ekspor API — Bawa Produk Kebanggaanmu Mendunia!",
            "frontend": "Build frontend terlebih dahulu: cd frontend && npm run build",
        }
