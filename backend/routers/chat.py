# ==========================================
# Nusantara Ekspor - Chat Router (WebSocket)
# ==========================================

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.ext.asyncio import AsyncSession
import json

from database import get_db
from models.chat import ChatRoom, ChatMessage
from models.user import User
from schemas.chat import ChatRoomResponse, ChatMessageResponse, ChatMessageCreate
from services.gemini_service import translate_text
from utils.dependencies import get_current_user
from sqlalchemy import select, or_, desc

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


@router.get("/rooms", response_model=list[ChatRoomResponse])
async def get_chat_rooms(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all chat rooms for the current user."""
    stmt = select(ChatRoom).where(
        or_(
            ChatRoom.umkm_id == current_user.id,
            ChatRoom.buyer_id == current_user.id
        )
    ).order_by(desc(ChatRoom.updated_at))
    
    result = await db.execute(stmt)
    rooms = result.scalars().all()
    
    if not rooms:
        return []
        
    user_ids = {r.umkm_id for r in rooms} | {r.buyer_id for r in rooms}
    users_stmt = select(User).where(User.id.in_(user_ids))
    users_result = await db.execute(users_stmt)
    user_map = {u.id: u for u in users_result.scalars().all()}
    
    response_rooms = []
    for r in rooms:
        other_id = r.buyer_id if current_user.id == r.umkm_id else r.umkm_id
        other_user = user_map.get(other_id)
        
        response_rooms.append({
            "id": r.id,
            "umkm_id": r.umkm_id,
            "buyer_id": r.buyer_id,
            "product_id": r.product_id,
            "created_at": r.created_at,
            "updated_at": r.updated_at,
            "other_user_name": other_user.full_name if other_user else "Unknown",
            "other_user_country": other_user.country if other_user else "Unknown"
        })
        
    return response_rooms


@router.get("/{room_id}/messages", response_model=list[ChatMessageResponse])
async def get_chat_messages(
    room_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all messages for a specific chat room."""
    # Verify user is part of the room
    room_result = await db.execute(select(ChatRoom).where(ChatRoom.id == room_id))
    room = room_result.scalar_one_or_none()
    
    if not room or (room.umkm_id != current_user.id and room.buyer_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to access this room")
        
    stmt = select(ChatMessage).where(ChatMessage.room_id == room_id).order_by(ChatMessage.created_at.asc())
    result = await db.execute(stmt)
    return result.scalars().all()


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

            # NOTE: We can't easily inject a DB session into a websocket route's loop 
            # without managing the lifecycle manually per message or using a new session block.
            # We'll create a new session just for saving this message.
            try:
                from database import async_session
                async with async_session() as session:
                    new_msg = ChatMessage(
                        room_id=room_id,
                        sender_id=sender_id,
                        original_message=original_message,
                        translated_message=translated,
                        original_language=source_lang,
                        target_language=target_lang
                    )
                    session.add(new_msg)
                    
                    # Update room's updated_at
                    room_result = await session.execute(select(ChatRoom).where(ChatRoom.id == room_id))
                    room = room_result.scalar_one_or_none()
                    if room:
                        room.updated_at = func.now()
                    
                    await session.commit()
                    await session.refresh(new_msg)
                    
                    msg_id = new_msg.id
                    created_at = new_msg.created_at.isoformat() if new_msg.created_at else None
            except Exception as db_err:
                print(f"Error saving message to DB: {db_err}")
                msg_id = "temp-" + sender_id
                created_at = None

            response = {
                "id": msg_id,
                "room_id": room_id,
                "sender_id": sender_id,
                "original_message": original_message,
                "translated_message": translated,
                "original_language": source_lang,
                "target_language": target_lang,
                "is_translated": True,
                "created_at": created_at
            }

            await manager.broadcast(response, room_id)

    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket, room_id)
