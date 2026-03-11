# ==========================================
# Nusantara Ekspor - Chat Router (WebSocket)
# ==========================================

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.ext.asyncio import AsyncSession
import json

from database import get_db
from models.chat import ChatRoom, ChatMessage
from services.gemini_service import translate_text

router = APIRouter(prefix="/api/chat", tags=["Chat"])


class ConnectionManager:
    """Manages WebSocket connections for chat rooms."""

    def __init__(self):
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_id: str):
        await websocket.accept()
        if room_id not in self.active_connections:
            self.active_connections[room_id] = []
        self.active_connections[room_id].append(websocket)

    def disconnect(self, websocket: WebSocket, room_id: str):
        if room_id in self.active_connections:
            self.active_connections[room_id].remove(websocket)
            if not self.active_connections[room_id]:
                del self.active_connections[room_id]

    async def broadcast(self, message: dict, room_id: str):
        if room_id in self.active_connections:
            for connection in self.active_connections[room_id]:
                await connection.send_json(message)


manager = ConnectionManager()


@router.websocket("/ws/{room_id}")
async def websocket_chat(websocket: WebSocket, room_id: str):
    """WebSocket endpoint for real-time B2B chat with auto-translation."""
    await manager.connect(websocket, room_id)

    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)

            original_message = message_data.get("message", "")
            source_lang = message_data.get("source_language", "id")
            target_lang = message_data.get("target_language", "en")
            sender_id = message_data.get("sender_id", "")

            # Auto-translate using Gemini
            translated = await translate_text(original_message, source_lang, target_lang)

            response = {
                "sender_id": sender_id,
                "original_message": original_message,
                "translated_message": translated,
                "original_language": source_lang,
                "target_language": target_lang,
                "is_translated": True,
            }

            await manager.broadcast(response, room_id)

    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket, room_id)
