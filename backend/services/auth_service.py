# ==========================================
# Nusantara Ekspor - Auth Service
# ==========================================

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from models.user import User
from schemas.user import UserCreate
from utils.security import hash_password, verify_password, create_access_token


async def register_user(db: AsyncSession, user_data: UserCreate) -> User:
    """Register a new user."""
    # Check if email already exists
    result = await db.execute(select(User).where(User.email == user_data.email))
    existing = result.scalar_one_or_none()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email sudah terdaftar",
        )

    if user_data.role not in ("umkm", "buyer"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role harus 'umkm' atau 'buyer'",
        )

    user = User(
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        full_name=user_data.full_name,
        company_name=user_data.company_name,
        role=user_data.role,
        phone=user_data.phone,
        address=user_data.address,
    )

    db.add(user)
    await db.flush()
    await db.refresh(user)
    return user


async def authenticate_user(db: AsyncSession, email: str, password: str) -> tuple[User, str]:
    """Authenticate a user and return user + JWT token."""
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password salah",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akun Anda dinonaktifkan",
        )

    token = create_access_token(data={"sub": user.id, "role": user.role})
    return user, token
