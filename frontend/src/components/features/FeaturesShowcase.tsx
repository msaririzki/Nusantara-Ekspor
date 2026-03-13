// ==========================================
// Nusantara Ekspor - 3 Fitur Andalan Showcase
// ==========================================
// Interactive 3D Globe (R3F) + 3 Premium Feature Cards

import { useState } from 'react';
import { Package, MessageSquare, Bot, Sparkles } from 'lucide-react';
import InteractiveGlobe from './InteractiveGlobe';

// ===== Feature Card Component =====
function FeatureCard({ icon: Icon, title, subtitle, description, accentColor, glowColor, children, isActive, onClick }: {
  icon: typeof Package;
  title: string;
  subtitle: string;
  description: string;
  accentColor: string;
  glowColor: string;
  children?: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`feature-card relative overflow-hidden rounded-2xl border transition-all duration-500 cursor-pointer group
        ${isActive
          ? `bg-white/[0.08] border-${accentColor}-500/40 shadow-2xl shadow-${accentColor}-500/10 scale-[1.02]`
          : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.06] hover:border-white/20'
        }`}
    >
      {/* Glow Effect on Active */}
      {isActive && (
        <div className={`absolute -top-20 -right-20 w-60 h-60 ${glowColor} rounded-full blur-[80px] opacity-30 transition-opacity duration-500`} />
      )}

      <div className="relative p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${
            accentColor === 'cyan' ? 'from-cyan-500 to-teal-600' :
            accentColor === 'emerald' ? 'from-emerald-500 to-green-600' :
            'from-blue-500 to-indigo-600'
          } flex items-center justify-center shadow-lg ${
            accentColor === 'cyan' ? 'shadow-cyan-500/25' :
            accentColor === 'emerald' ? 'shadow-emerald-500/25' :
            'shadow-blue-500/25'
          } group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={28} className="text-white" />
          </div>
          <div className="flex-1">
            <span className={`text-[10px] uppercase tracking-widest font-bold ${
              accentColor === 'cyan' ? 'text-cyan-400' :
              accentColor === 'emerald' ? 'text-emerald-400' :
              'text-blue-400'
            }`}>{subtitle}</span>
            <h3 className="text-xl md:text-2xl font-bold text-white font-display mt-1">{title}</h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-400 leading-relaxed mb-5 text-sm md:text-base">{description}</p>

        {/* Interactive Content (only when active) */}
        <div className={`overflow-hidden transition-all duration-500 ${isActive ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
          {children}
        </div>

        {/* Expand Indicator */}
        <div className={`flex items-center gap-2 mt-3 text-xs font-medium transition-colors duration-300 ${
          isActive
            ? (accentColor === 'cyan' ? 'text-cyan-400' : accentColor === 'emerald' ? 'text-emerald-400' : 'text-blue-400')
            : 'text-gray-500'
        }`}>
          <Sparkles size={14} />
          {isActive ? 'Lihat detail' : 'Klik untuk melihat'}
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div className={`h-[2px] w-full bg-gradient-to-r ${
        accentColor === 'cyan' ? 'from-transparent via-cyan-500 to-transparent' :
        accentColor === 'emerald' ? 'from-transparent via-emerald-500 to-transparent' :
        'from-transparent via-blue-500 to-transparent'
      } ${isActive ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`} />
    </div>
  );
}

// ===== Katalog Digital Interactive =====
function KatalogInteractive() {
  const products = [
    { name: 'Kopi Gayo', emoji: '☕', origin: 'Aceh' },
    { name: 'Tenun Ikat', emoji: '🧶', origin: 'NTT' },
    { name: 'Mutiara Lombok', emoji: '💎', origin: 'NTB' },
    { name: 'Batik Tulis', emoji: '🎨', origin: 'Jogja' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mt-2">
      {products.map((p, i) => (
        <div
          key={p.name}
          className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-cyan-500/10 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-300 group cursor-pointer"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <span className="text-2xl group-hover:scale-125 transition-transform duration-300">{p.emoji}</span>
          <div>
            <div className="text-white text-sm font-semibold">{p.name}</div>
            <div className="text-cyan-400/60 text-[10px]">{p.origin}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ===== Live Chat Interactive =====
function LiveChatInteractive() {
  return (
    <div className="space-y-3 mt-2">
      {/* Indonesian side */}
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-sm shrink-0">🇮🇩</div>
        <div className="bg-white/5 rounded-xl rounded-bl-sm px-4 py-2.5 border border-emerald-500/10 max-w-[80%]">
          <p className="text-white text-sm">"Koleksi batik saya berkualitas premium"</p>
        </div>
      </div>

      {/* AI Translation */}
      <div className="flex items-center justify-center gap-2 py-1">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-emerald-500/30" />
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <Sparkles size={12} className="text-emerald-400" />
          <span className="text-emerald-300 text-[10px] font-bold tracking-wider">GEMINI AI</span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-emerald-500/30" />
      </div>

      {/* Foreign side */}
      <div className="flex items-start gap-2 justify-end">
        <div className="bg-emerald-500/10 rounded-xl rounded-br-sm px-4 py-2.5 border border-emerald-500/20 max-w-[80%]">
          <p className="text-white text-sm">"My batik collection is premium quality"</p>
          <span className="text-emerald-400/50 text-[10px] mt-1 block">Auto-translated ✨</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-sm shrink-0">🇺🇸</div>
      </div>
    </div>
  );
}

// ===== Chatbot Interactive =====
function ChatbotInteractive() {
  return (
    <div className="space-y-3 mt-2">
      {/* User Question */}
      <div className="flex items-start gap-2 justify-end">
        <div className="bg-white/5 rounded-xl rounded-br-sm px-4 py-2.5 border border-white/10 max-w-[85%]">
          <p className="text-white text-sm">"Apa syarat ekspor produk makanan ke Jepang?"</p>
        </div>
      </div>

      {/* Bot Response */}
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
          <Bot size={16} className="text-blue-400" />
        </div>
        <div className="bg-blue-500/5 rounded-xl rounded-bl-sm px-4 py-2.5 border border-blue-500/15 max-w-[85%]">
          <p className="text-gray-300 text-sm leading-relaxed">
            Untuk ekspor makanan ke Jepang, Anda memerlukan:
          </p>
          <ul className="text-gray-400 text-xs mt-2 space-y-1">
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-blue-400" />
              Sertifikat HACCP
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-blue-400" />
              Izin BPOM untuk ekspor
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-blue-400" />
              Label sesuai standar JAS
            </li>
          </ul>
          <div className="flex items-center gap-1 mt-2">
            <span className="inline-flex items-center gap-1 text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Online 24/7
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Main Export =====
export default function FeaturesShowcase() {
  const [activeCard, setActiveCard] = useState(0);

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden" id="fitur-andalan">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 mb-6">
            <Sparkles size={14} className="mr-2" />
            3 FITUR ANDALAN
          </div>
          <h2 className="section-heading text-white mb-4">
            Solusi <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-400">Ekspor Digital</span> Terlengkap
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Tiga fitur canggih bertenaga AI yang dirancang khusus untuk mendobrak tantangan ekspor UMKM Indonesia ke kancah global
          </p>
        </div>

        {/* Interactive 3D Globe — React Three Fiber */}
        <InteractiveGlobe />

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-5 lg:gap-6 mt-8 lg:mt-12">
          <FeatureCard
            icon={Package}
            title="Katalog Digital"
            subtitle="📦 Etalase Premium"
            description="Etalase online premium untuk memajang produk kebanggaan Indonesia. Tampilkan ke importir dari seluruh dunia dengan visual yang memukau."
            accentColor="cyan"
            glowColor="bg-cyan-500"
            isActive={activeCard === 0}
            onClick={() => setActiveCard(0)}
          >
            <KatalogInteractive />
          </FeatureCard>

          <FeatureCard
            icon={MessageSquare}
            title="Live Chat B2B"
            subtitle="💬 Auto-Translate AI"
            description="Negosiasi tanpa kendala bahasa! Chat real-time dengan teknologi Gemini AI yang otomatis menerjemahkan antara bahasa apapun."
            accentColor="emerald"
            glowColor="bg-emerald-500"
            isActive={activeCard === 1}
            onClick={() => setActiveCard(1)}
          >
            <LiveChatInteractive />
          </FeatureCard>

          <FeatureCard
            icon={Bot}
            title="Chatbot Asisten"
            subtitle="🤖 Ekspor 24/7"
            description="Asisten pintar bertenaga Gemini AI yang siap menjawab pertanyaan seputar alur ekspor, regulasi, dokumen, dan izin kapan saja."
            accentColor="blue"
            glowColor="bg-blue-500"
            isActive={activeCard === 2}
            onClick={() => setActiveCard(2)}
          >
            <ChatbotInteractive />
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}
