# ==========================================
# Nusantara Ekspor - FastAPI Main Application
# ==========================================

from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse

from config import settings
from database import init_db
from routers import auth, products, ai, chat


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: initialize resources on startup."""
    print("🚀 Nusantara Ekspor Backend starting up...")
    try:
        import asyncio
        await asyncio.get_event_loop().run_in_executor(None, init_db)
        print("✅ Database initialized")
    except Exception as e:
        print(f"⚠️  Database connection failed at startup: {e}")
        print("   → App tetap berjalan, request ke DB akan gagal hingga koneksi pulih.")
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

# Mount uploads directory untuk local file storage
upload_dir = Path("uploads")
upload_dir.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Global exception handler — kembalikan detail error ke frontend
@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    exc_name = type(exc).__name__
    exc_str = str(exc)

    # Tangkap error koneksi database (psycopg2 / SQLAlchemy)
    is_db_error = any(keyword in exc_str for keyword in [
        "getaddrinfo", "could not translate host", "Connection refused",
        "connection failed", "psycopg2", "OperationalError", "could not connect"
    ])
    if is_db_error:
        return JSONResponse(
            status_code=503,
            content={
                "detail": "Database tidak bisa diakses.",
                "error": exc_name,
            }
        )

    # Re-raise HTTPException tetap dengan status aslinya
    from fastapi import HTTPException as FastAPIHTTPException
    if isinstance(exc, FastAPIHTTPException):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

    # Fallback: log detail error di server
    import traceback
    print(f"[ERROR] Unhandled exception: {exc_name}: {exc_str}")
    print(traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {exc_name} - {exc_str}"}
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


# Menerima file upload lokal sudah di-setup pada endpoint terkait



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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=3000, reload=True)
