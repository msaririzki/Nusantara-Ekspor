# ==========================================
# Nusantara Ekspor - Chat Models
# ==========================================

import uuid
from datetime import datetime

from sqlalchemy import String, Text, DateTime, ForeignKey, Integer, func
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class ChatRoom(Base):
    """Chat room for B2B communication between UMKM and Buyer."""

    __tablename__ = "chat_rooms"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    umkm_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id"), nullable=False, index=True
    )
    buyer_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id"), nullable=False, index=True
    )
    product_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("products.id"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class ChatMessage(Base):
    """Individual chat message with translation support."""

    __tablename__ = "chat_messages"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    room_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("chat_rooms.id"), nullable=False, index=True
    )
    sender_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id"), nullable=False
    )
    original_message: Mapped[str] = mapped_column(Text, nullable=False)
    translated_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    original_language: Mapped[str] = mapped_column(String(5), default="id")
    target_language: Mapped[str | None] = mapped_column(String(5), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    @property
    def is_translated(self) -> bool:
        return self.translated_message is not None
