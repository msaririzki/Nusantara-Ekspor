// ==========================================
// Nusantara Ekspor - Chatbot Widget (Gemini AI)
// ==========================================

import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, MinusCircle } from 'lucide-react';
import { dummyChatbotMessages } from '../../data/dummy';
import { aiApi } from '../../services/api';
import type { ChatbotMessage } from '../../types';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatbotMessage[]>(dummyChatbotMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatbotMessage = {
      id: Date.now().toString(),
      content: text,
      role: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Call backend Gemini AI endpoint
      const response = await aiApi.chatbot(text);

      const botMessage: ChatbotMessage = {
        id: (Date.now() + 1).toString(),
        content: response.reply,
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      // Fallback if backend is not available
      const botMessage: ChatbotMessage = {
        id: (Date.now() + 1).toString(),
        content:
          'Maaf, saya sedang tidak bisa terhubung ke server. 😔 Pastikan backend sudah berjalan di `http://localhost:8000`.\n\nUntuk menjalankan backend:\n```\ncd backend\npip install -r requirements.txt\nuvicorn main:app --reload\n```',
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickAction = (question: string) => {
    sendMessage(question);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-500/30 hover:scale-110 active:scale-95 transition-all duration-200 group"
      >
        <Bot size={26} />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full" />

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-slate-800 text-white text-xs px-3 py-2 rounded-lg border border-white/10 whitespace-nowrap shadow-xl">
            ✨ Tanya Asisten Ekspor
          </div>
        </div>
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 w-[360px] sm:w-[400px] animate-slide-up ${
        isMinimized ? 'h-auto' : 'h-[520px]'
      } flex flex-col glass-card overflow-hidden shadow-2xl shadow-black/40`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-emerald-500 p-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Bot size={22} className="text-white" />
          </div>
          <div>
            <div className="text-white font-semibold text-sm flex items-center gap-1.5">
              Asisten Ekspor
              <Sparkles size={14} className="text-amber-300" />
            </div>
            <div className="text-white/70 text-xs">Asisten Ekspor Nusra</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 text-white/70 hover:text-white transition-colors"
          >
            <MinusCircle size={18} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-white/70 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-md'
                      : 'bg-white/10 text-gray-200 rounded-bl-md'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div
                      className="whitespace-pre-line [&_strong]:text-blue-300 [&_strong]:font-semibold"
                      dangerouslySetInnerHTML={{
                        __html: msg.content
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\n/g, '<br/>'),
                      }}
                    />
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 border-t border-white/5 flex gap-2 overflow-x-auto flex-shrink-0">
            {['Apa itu ekspor?', 'Syarat ekspor', 'Dokumen wajib', 'Izin yang diperlukan'].map((q) => (
              <button
                key={q}
                onClick={() => handleQuickAction(q)}
                disabled={isTyping}
                className="flex-shrink-0 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10 flex-shrink-0">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Tanya seputar ekspor..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping}
                className="input-field !py-2.5 text-sm flex-1 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isTyping || !input.trim()}
                className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center text-white hover:from-blue-500 hover:to-blue-400 transition-all hover:scale-105 active:scale-95 flex-shrink-0 disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
