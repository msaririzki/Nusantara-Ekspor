# ==========================================
# Nusantara Ekspor - Database Configuration
# ==========================================

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker, Session

from config import settings

# Database URL must be set — use standard PostgreSQL format
# Format: postgresql://user:password@db.<project>.supabase.co:5432/postgres
db_url = settings.DATABASE_URL

if not db_url:
    raise RuntimeError(
        "DATABASE_URL belum diisi di backend/.env!\n"
        "Contoh SQLite   : sqlite:///./db.sqlite\n"
        "Contoh Supabase : postgresql://postgres:<password>@db.<project>.supabase.co:5432/postgres"
    )

# Normalise asyncpg prefix → plain psycopg2 (jika ada sisa URL asyncpg)
if db_url.startswith("postgresql+asyncpg://"):
    db_url = db_url.replace("postgresql+asyncpg://", "postgresql://", 1)

# Engine args — SQLite perlu check_same_thread=False
is_sqlite = db_url.startswith("sqlite")
connect_args = {"check_same_thread": False} if is_sqlite else {}

engine = create_engine(
    db_url,
    echo=settings.DEBUG,
    connect_args=connect_args,
    # Connection pool settings (skip for SQLite yang tidak support pool)
    **({} if is_sqlite else {
        "pool_pre_ping": True,
        "pool_recycle": 300,
        "pool_size": 5,
        "max_overflow": 10,
    })
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """Base class for all database models."""
    pass


def get_db():
    """Dependency to get database session (sync — FastAPI runs in thread pool)."""
    db: Session = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def init_db():
    """Initialize database tables (sync)."""
    Base.metadata.create_all(bind=engine)
