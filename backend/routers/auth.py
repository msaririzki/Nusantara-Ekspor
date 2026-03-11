# ==========================================
# Nusantara Ekspor - Auth Router
# ==========================================

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from schemas.user import UserCreate, UserLogin, UserResponse, Token
from services.auth_service import register_user, authenticate_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=Token, status_code=201)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    """Register a new UMKM or Buyer account."""
    user = await register_user(db, user_data)
    from utils.security import create_access_token

    token = create_access_token(data={"sub": user.id, "role": user.role})
    return Token(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    """Login and receive JWT token."""
    user, token = await authenticate_user(db, credentials.email, credentials.password)
    return Token(
        access_token=token,
        user=UserResponse.model_validate(user),
    )
