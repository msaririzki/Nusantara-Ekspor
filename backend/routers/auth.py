# ==========================================
# Nusantara Ekspor - Auth Router
# ==========================================

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from schemas.user import UserCreate, UserLogin, UserResponse, Token
from services.auth_service import register_user, authenticate_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=Token, status_code=201)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new UMKM or Buyer account."""
    user = register_user(db, user_data)
    from utils.security import create_access_token

    token = create_access_token(data={"sub": user.id, "role": user.role})
    return Token(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login and receive JWT token."""
    user, token = authenticate_user(db, credentials.email, credentials.password)
    return Token(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


from schemas.user import ForgotPasswordRequest, ResetPasswordRequest
from fastapi import HTTPException
import uuid
from datetime import datetime, timedelta, timezone
from services.email_service import send_reset_password_email
from models.user import User
from utils.security import get_password_hash

@router.post("/forgot-password", status_code=200)
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Sennd a password reset link to user's email."""
    # 1. Look up user by email
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        # Prevent email enumeration by always returning success string
        return {"message": "Jika email terdaftar, tautan pengaturan ulang kata sandi telah dikirimkan."}

    # 2. Generate token and expiry
    reset_token = str(uuid.uuid4())
    # Kedaluwarsa dalam 1 jam (gunakan utcnow manual handling atau timezone-aware)
    expire_time = datetime.now(timezone.utc) + timedelta(hours=1)

    user.reset_password_token = reset_token
    user.reset_password_expires = expire_time
    db.commit()

    # 3. Create reset link (harus mengarah ke frontend path /reset-password?token=...)
    # Untuk local testing & tunnel ini akan kita harcode dulu, atau ambil dari env
    # Namun lebih baik kita set default ke url pengirim. Kita butuh BASE_URL frontend 
    # Di mode produksi, frontend base bisa diambil logic cors atau request headers 
    from config import settings
    # Defaulting request origin. Menggunakan setting origin pertama jika ada
    frontend_url = settings.CORS_ORIGINS[0] if settings.CORS_ORIGINS else "http://localhost:5173"
    reset_link = f"{frontend_url}/reset-password?token={reset_token}"

    # 4. Send email
    success = send_reset_password_email(user.email, reset_link)
    if not success:
        # For security, we might still return ok or just log.
        print("Warning: unable to send email via Resend.")

    return {"message": "Jika email terdaftar, tautan pengaturan ulang kata sandi telah dikirimkan."}


@router.post("/reset-password", status_code=200)
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Reset user password using token."""
    
    # Check if token exists
    user = db.query(User).filter(User.reset_password_token == request.token).first()
    
    if not user:
        raise HTTPException(status_code=400, detail="Token reset kata sandi tidak valid atau tidak ditemukan.")

    # Check if expired
    # Convert user expires to aware datetime if naive (sqlite returns naive depending on setup)
    expires = user.reset_password_expires
    if expires.tzinfo is None:
        expires = expires.replace(tzinfo=timezone.utc)
        
    now = datetime.now(timezone.utc)
    if now > expires:
        # Clear token if expired
        user.reset_password_token = None
        user.reset_password_expires = None
        db.commit()
        raise HTTPException(status_code=400, detail="Token reset kata sandi telah kedaluwarsa.")

    # Apply new password
    hashed_pass = get_password_hash(request.new_password)
    user.hashed_password = hashed_pass
    
    # Clear the token
    user.reset_password_token = None
    user.reset_password_expires = None
    db.commit()

    return {"message": "Kata sandi Anda berhasil diperbarui. Silakan masuk dengan sandi baru!"}
