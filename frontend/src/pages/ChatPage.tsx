// ==========================================
// Nusantara Ekspor - Chat B2B Page
// ==========================================

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Zap, Search, MoreVertical, Phone, Video, Globe, CheckCheck, Clock, Circle, ChevronLeft, Loader2 } from 'lucide-react';
import type { ChatRoom, ChatMessage } from '../types';
import { useAuth } from '../context/AuthContext';
import { chatApi } from '../services/api';
import { getLanguageCodeFromCountry } from '../utils/language';

function TranslateBadge() {
  return (
    <div className="flex items-center gap-1 mt-2 text-[10px] text-purple-400">
      <Zap size={10} />
      <span>Diterjemahkan otomatis</span>
      <span className="text-purple-500">✨</span>
    </div>
  );
}

function MessageBubble({ message, isOwn }: { message: ChatMessage; isOwn: boolean }) {
  const time = new Date(message.timestamp).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
      <div className={`max-w-[80%] sm:max-w-[65%]`}>
        {/* Original Message */}
        <div className={isOwn ? 'chat-bubble-sent' : 'chat-bubble-received'}>
          <p>{isOwn ? message.originalMessage : (message.translatedMessage || message.originalMessage)}</p>
          {message.isTranslated && <TranslateBadge />}
          <div className={`flex items-center gap-1.5 mt-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <span className={`text-[10px] ${isOwn ? 'text-blue-200' : 'text-gray-500'}`}>{time}</span>
            {isOwn && (
              message.status === 'read' ? (
                <CheckCheck size={12} className="text-blue-200" />
              ) : message.status === 'delivered' ? (
                <CheckCheck size={12} className="text-blue-300/50" />
              ) : (
                <Clock size={10} className="text-blue-200/50" />
              )
            )}
          </div>
        </div>
        {/* Show original if translated and not own */}
        {message.isTranslated && !isOwn && (
          <div className="mt-1.5 px-3">
            <p className="text-[11px] text-gray-500 italic">
              Original ({message.originalLanguage === 'en' ? 'English' : message.originalLanguage === 'zh' ? '中文' : 'Indonesian'}): {message.originalMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ChatSidebarItem({
  room,
  isActive,
  onClick,
}: {
  room: ChatRoom;
  isActive: boolean;
  onClick: () => void;
}) {
  const time = room.lastMessageTime
    ? new Date(room.lastMessageTime).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-start gap-3 p-4 transition-all duration-200 text-left ${
        isActive
          ? 'bg-blue-500/10 border-l-2 border-blue-500'
          : 'hover:bg-white/5 border-l-2 border-transparent'
      }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
          {room.buyerName.charAt(0)}
        </div>
        {room.isOnline && (
          <Circle size={10} className="absolute bottom-0 right-0 text-emerald-400 fill-emerald-400" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-white font-medium text-sm truncate">{room.buyerName}</span>
          <span className="text-gray-500 text-[10px] flex-shrink-0">{time}</span>
        </div>
        <div className="flex items-center gap-1 mb-1">
          <Globe size={10} className="text-gray-500 flex-shrink-0" />
          <span className="text-gray-500 text-xs">{room.buyerCountry}</span>
        </div>
        <p className="text-gray-400 text-xs truncate">{room.lastMessage}</p>
      </div>

      {room.unreadCount > 0 && (
        <span className="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
          {room.unreadCount}
        </span>
      )}
    </button>
  );
}

export default function ChatPage() {
  const { user, token } = useAuth();
  const location = useLocation();
  const initialActiveRoomId = location.state?.activeRoomId;
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);

  // Dynamic target language logic based on country
  const sourceLang = user?.country ? getLanguageCodeFromCountry(user.country) : (user?.role === 'umkm' ? 'id' : 'en');
  const targetLang = activeRoom?.buyerCountry ? getLanguageCodeFromCountry(activeRoom.buyerCountry) : (user?.role === 'umkm' ? 'en' : 'id');

  // Load rooms
  useEffect(() => {
    if (!token) return;

    const loadRooms = async () => {
      try {
        const data: any = await chatApi.getRooms(token);
        // Map backend ChatRoomResponse to frontend ChatRoom type
        const mappedRooms: ChatRoom[] = data.map((r: any) => {
          return {
            id: r.id,
            umkmId: r.umkm_id,
            buyerId: r.buyer_id,
            productId: r.product_id || '',
            buyerName: r.other_user_name || 'Unknown',
            buyerCountry: r.other_user_country || '-',
            unreadCount: 0,
            isOnline: true // Mocked
          };
        });
        setRooms(mappedRooms);
        
        if (mappedRooms.length > 0) {
          if (initialActiveRoomId) {
            const foundRoom = mappedRooms.find(r => r.id === initialActiveRoomId);
            setActiveRoom(foundRoom || mappedRooms[0]);
          } else if (!activeRoom) {
            setActiveRoom(mappedRooms[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load chat rooms", err);
      } finally {
        setIsLoadingRooms(false);
      }
    };

    loadRooms();
  }, [token, user, initialActiveRoomId]);

  // Load messages when active room changes
  useEffect(() => {
    if (!activeRoom || !token) return;

    const loadMessages = async () => {
      setIsLoadingMessages(true);
      try {
        const data: any = await chatApi.getRoomMessages(activeRoom.id, token);
        const mappedMsgs: ChatMessage[] = data.map((m: any) => ({
          id: m.id,
          roomId: m.room_id,
          senderId: m.sender_id,
          originalMessage: m.original_message,
          translatedMessage: m.translated_message,
          originalLanguage: m.original_language,
          targetLanguage: m.target_language,
          isTranslated: m.is_translated,
          timestamp: m.created_at,
          status: 'read'
        }));
        setMessages(mappedMsgs);
      } catch (err) {
        console.error("Failed to load messages", err);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadMessages();

    // WebSocket logic
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/chat/ws/${activeRoom.id}`;
      
    const socket = new WebSocket(wsUrl);
    
    socket.onopen = () => {};
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const incomingMsg: ChatMessage = {
        id: data.id || `temp-${Date.now()}`,
        roomId: data.room_id || activeRoom.id,
        senderId: data.sender_id,
        originalMessage: data.original_message,
        translatedMessage: data.translated_message,
        originalLanguage: data.original_language,
        targetLanguage: data.target_language,
        isTranslated: data.is_translated,
        timestamp: data.created_at || new Date().toISOString(),
        status: 'delivered'
      };
      
      setMessages(prev => [...prev, incomingMsg]);
    };
    
    setWs(socket);

    return () => {
      socket.close();
    };
  }, [activeRoom, token]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !ws || !user) return;
    
    const payload = {
      message: newMessage,
      source_language: sourceLang,
      target_language: targetLang,
      sender_id: user.id
    };
    
    ws.send(JSON.stringify(payload));
    setNewMessage('');
  };

  return (
    <div className="h-[calc(100vh-64px)] lg:h-[calc(100vh-80px)] flex">
      {/* Sidebar */}
      <div
        className={`${
          showSidebar ? 'flex' : 'hidden'
        } lg:flex flex-col w-full lg:w-80 xl:w-96 border-r border-white/10 bg-slate-900/50`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            💬 Chat B2B
          </h2>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari percakapan..."
              className="input-field !py-2.5 !pl-9 text-sm"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {isLoadingRooms ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <Loader2 className="animate-spin w-6 h-6 mr-2" /> Memuat obrolan...
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center p-4 text-gray-500 text-sm">Belum ada obrolan.</div>
          ) : (
            rooms.map((room) => (
              <ChatSidebarItem
                key={room.id}
                room={room}
                isActive={activeRoom?.id === room.id}
                onClick={() => {
                  setActiveRoom(room);
                  setShowSidebar(false);
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${!showSidebar ? 'flex' : 'hidden'} lg:flex flex-col flex-1`}>
        {/* Chat Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSidebar(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-white"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {activeRoom?.buyerName?.charAt(0) || '?'}
              </div>
              {activeRoom?.isOnline && (
                <Circle size={8} className="absolute bottom-0 right-0 text-emerald-400 fill-emerald-400" />
              )}
            </div>
            <div>
              <div className="text-white font-medium text-sm">{activeRoom?.buyerName || 'Pilih Percakapan'}</div>
              <div className="flex items-center gap-1.5">
                <Globe size={10} className="text-gray-500" />
                <span className="text-gray-500 text-xs">{activeRoom?.buyerCountry || '-'}</span>
                <span className="text-gray-600 text-xs">•</span>
                <span className={`text-xs ${activeRoom?.isOnline ? 'text-emerald-400' : 'text-gray-500'}`}>
                  {activeRoom?.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all hidden sm:block">
              <Phone size={18} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all hidden sm:block">
              <Video size={18} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        {/* AI Translation Banner */}
        <div className="px-4 py-2 bg-purple-500/10 border-b border-purple-500/20 flex items-center justify-center gap-2">
          <Zap size={14} className="text-purple-400" />
          <span className="text-purple-300 text-xs font-medium">
            Terjemahan otomatis aktif — Pesan terkirim dalam bahasa penerima
          </span>
          <span className="text-purple-400">✨</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-1">
          {!activeRoom ? (
             <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">Pilih obrolan dari sebelah kiri</p>
             </div>
          ) : isLoadingMessages ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <Loader2 className="animate-spin w-8 h-8 mr-2" /> Memuat pesan...
            </div>
          ) : messages.length > 0 ? (
            messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} isOwn={msg.senderId === user?.id} />
            ))
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={32} className="text-gray-600" />
                </div>
                <p className="text-gray-400">Mulai percakapan dengan {activeRoom?.buyerName}</p>
                <p className="text-gray-500 text-sm mt-1">Pesan akan diterjemahkan secara otomatis</p>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-white/10 bg-slate-900/50">
          <form onSubmit={handleSend} className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={`Ketik pesan / Type message ... (${sourceLang.toUpperCase()})`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={!activeRoom}
                className="input-field !pr-20 disabled:opacity-50"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full uppercase">
                  {sourceLang} → {targetLang}
                </span>
              </div>
            </div>
            <button
              type="submit"
              className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center text-white hover:from-blue-500 hover:to-blue-400 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
