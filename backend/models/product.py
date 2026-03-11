# ==========================================
# Nusantara Ekspor - Product Model
# ==========================================

import uuid
from datetime import datetime

from sqlalchemy import String, Float, Integer, Boolean, Text, DateTime, ForeignKey, JSON, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class Product(Base):
    """Product model for UMKM catalog items."""

    __tablename__ = "products"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="IDR")
    category: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    images: Mapped[dict] = mapped_column(JSON, default=list)
    specifications: Mapped[dict] = mapped_column(JSON, default=dict)
    min_order: Mapped[int] = mapped_column(Integer, default=1)
    stock: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    owner = relationship("User", back_populates="products", lazy="selectin")
