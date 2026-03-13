# ==========================================
# Nusantara Ekspor - Chat Schemas (Pydantic)
# ==========================================

from datetime import datetime
from pydantic import BaseModel


class ChatRoomCreate(BaseModel):
    buyer_id: str
    product_id: str | None = None


class ChatRoomResponse(BaseModel):
    id: str
    umkm_id: str
    buyer_id: str
    product_id: str | None
    created_at: datetime
    updated_at: datetime
    other_user_name: str | None = None
    other_user_country: str | None = None

    class Config:
        from_attributes = True


class ChatMessageCreate(BaseModel):
    original_message: str
    original_language: str = "id"
    target_language: str | None = "en"


class ChatMessageResponse(BaseModel):
    id: str
    room_id: str
    sender_id: str
    original_message: str
    translated_message: str | None
    original_language: str
    target_language: str | None
    created_at: datetime
    is_translated: bool

    class Config:
        from_attributes = True


class TranslateRequest(BaseModel):
    text: str
    source_language: str = "id"
    target_language: str = "en"


class TranslateResponse(BaseModel):
    original_text: str
    translated_text: str
    source_language: str
    target_language: str


class ChatbotRequest(BaseModel):
    message: str


class ChatbotResponse(BaseModel):
    reply: str
