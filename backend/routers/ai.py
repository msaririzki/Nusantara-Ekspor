# ==========================================
# Nusantara Ekspor - AI Router (Translate & Chatbot)
# ==========================================

from fastapi import APIRouter

from schemas.chat import TranslateRequest, TranslateResponse, ChatbotRequest, ChatbotResponse
from services.gemini_service import translate_text, chat_with_assistant

router = APIRouter(prefix="/api/ai", tags=["AI Services"])


@router.post("/translate", response_model=TranslateResponse)
async def translate(request: TranslateRequest):
    """Translate text using Gemini AI."""
    translated = await translate_text(
        text=request.text,
        source_language=request.source_language,
        target_language=request.target_language,
    )

    return TranslateResponse(
        original_text=request.text,
        translated_text=translated,
        source_language=request.source_language,
        target_language=request.target_language,
    )


@router.post("/chatbot", response_model=ChatbotResponse)
async def chatbot(request: ChatbotRequest):
    """Get response from the Export Assistant Chatbot."""
    reply = await chat_with_assistant(request.message)
    return ChatbotResponse(reply=reply)
