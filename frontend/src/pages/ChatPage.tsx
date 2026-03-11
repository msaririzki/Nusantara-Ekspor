// ==========================================
// Nusantara Ekspor - Chat B2B Page
// ==========================================

import { useState } from 'react';
import {
  Send, Zap, Search, MoreVertical, Phone, Video,
  Globe, CheckCheck, Clock, Circle, ChevronLeft
} from 'lucide-react';
import { dummyChatRooms, dummyChatMessages } from '../data/dummy';
import type { ChatRoom, ChatMessage } from '../types';

function TranslateBadge() {
  return (
    <div className="flex items-center gap-1 mt-2 text-[10px] text-purple-400">
      <Zap size={10} />
      <span>Auto-translated by Gemini</span>
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
  const [activeRoom, setActiveRoom] = useState<ChatRoom>(dummyChatRooms[0]);
  const [messages] = useState<ChatMessage[]>(dummyChatMessages);
  const [newMessage, setNewMessage] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);

  const roomMessages = messages.filter((m) => m.roomId === activeRoom.id);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    // In real app, this would send via WebSocket
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
          {dummyChatRooms.map((room) => (
            <ChatSidebarItem
              key={room.id}
              room={room}
              isActive={activeRoom.id === room.id}
              onClick={() => {
                setActiveRoom(room);
                setShowSidebar(false);
              }}
            />
          ))}
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
                {activeRoom.buyerName.charAt(0)}
              </div>
              {activeRoom.isOnline && (
                <Circle size={8} className="absolute bottom-0 right-0 text-emerald-400 fill-emerald-400" />
              )}
            </div>
            <div>
              <div className="text-white font-medium text-sm">{activeRoom.buyerName}</div>
              <div className="flex items-center gap-1.5">
                <Globe size={10} className="text-gray-500" />
                <span className="text-gray-500 text-xs">{activeRoom.buyerCountry}</span>
                <span className="text-gray-600 text-xs">•</span>
                <span className={`text-xs ${activeRoom.isOnline ? 'text-emerald-400' : 'text-gray-500'}`}>
                  {activeRoom.isOnline ? 'Online' : 'Offline'}
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
            Auto-translation aktif — Pesan otomatis diterjemahkan oleh Gemini AI
          </span>
          <span className="text-purple-400">✨</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-1">
          {roomMessages.length > 0 ? (
            roomMessages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} isOwn={msg.senderId === 'u1'} />
            ))
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={32} className="text-gray-600" />
                </div>
                <p className="text-gray-400">Mulai percakapan dengan {activeRoom.buyerName}</p>
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
                placeholder="Ketik pesan dalam Bahasa Indonesia..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="input-field !pr-20"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                  🇮🇩 ID → 🇺🇸 EN
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
