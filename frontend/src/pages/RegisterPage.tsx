// ==========================================
// Nusantara Ekspor - Register Page (Premium Redesign)
// ==========================================

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail, Lock, User, Building2, Phone, Eye, EyeOff,
  UserPlus, AlertCircle, Loader2, Globe, ArrowRight,
  ArrowLeft, CheckCircle2, Sparkles, ShieldCheck, Package,
  TrendingUp, Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ── Password strength helper ──────────────────────────────────────────────────
function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Lemah', color: 'bg-red-500' };
  if (score <= 2) return { score, label: 'Cukup', color: 'bg-amber-500' };
  if (score <= 3) return { score, label: 'Baik', color: 'bg-yellow-400' };
  return { score, label: 'Kuat', color: 'bg-emerald-500' };
}

// ── Role Card ─────────────────────────────────────────────────────────────────
interface RoleCardProps {
  value: 'umkm' | 'buyer';
  selected: boolean;
  onSelect: () => void;
}

function RoleCard({ value, selected, onSelect }: RoleCardProps) {
  const isUmkm = value === 'umkm';

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer group overflow-hidden ${
        selected
          ? isUmkm
            ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
            : 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20'
          : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/8'
      }`}
    >
      {/* Glow background on selected */}
      {selected && (
        <div className={`absolute inset-0 opacity-10 ${isUmkm ? 'bg-blue-400' : 'bg-emerald-400'} blur-2xl`} />
      )}

      <div className="relative flex items-start gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-all duration-300 ${
          selected
            ? isUmkm ? 'bg-blue-500/30' : 'bg-emerald-500/30'
            : 'bg-white/10 group-hover:bg-white/15'
        }`}>
          {isUmkm ? '🏭' : '🌐'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-white text-base">{isUmkm ? 'UMKM / Eksportir' : 'Buyer / Importir'}</span>
            {selected && (
              <CheckCircle2 size={16} className={isUmkm ? 'text-blue-400' : 'text-emerald-400'} />
            )}
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            {isUmkm
              ? 'Jangkau pasar global & ekspor produk UMKM Indonesia ke seluruh dunia.'
              : 'Temukan produk premium Indonesia langsung dari sumbernya.'}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {isUmkm
              ? ['Dashboard Produk', 'Chat Terjemahan', 'Analitik'].map(t => (
                  <span key={t} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${selected ? 'bg-blue-500/20 text-blue-300' : 'bg-white/10 text-gray-400'}`}>{t}</span>
                ))
              : ['Katalog Global', 'Multi-Bahasa', 'B2B Deals'].map(t => (
                  <span key={t} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${selected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-gray-400'}`}>{t}</span>
                ))
            }
          </div>
        </div>
      </div>
    </button>
  );
}

// ── Step Indicator ────────────────────────────────────────────────────────────
function StepIndicator({ currentStep }: { currentStep: 1 | 2 }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      {[1, 2].map((step) => (
        <div key={step} className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
            currentStep === step
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/40 scale-110'
              : currentStep > step
              ? 'bg-emerald-500 text-white'
              : 'bg-white/10 text-gray-400'
          }`}>
            {currentStep > step ? <CheckCircle2 size={16} /> : step}
          </div>
          <span className={`text-xs font-medium transition-colors ${
            currentStep === step ? 'text-white' : 'text-gray-500'
          }`}>
            {step === 1 ? 'Pilih Tipe' : 'Data Akun'}
          </span>
          {step < 2 && <div className={`w-8 h-px transition-colors ${currentStep > 1 ? 'bg-emerald-500' : 'bg-white/15'}`} />}
        </div>
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    phone: '',
    role: 'umkm' as 'umkm' | 'buyer',
    country: 'United States',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = getPasswordStrength(formData.password);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const update = (field: string, value: string) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const goToStep2 = () => {
    setStep(2);
    setLocalError('');
  };

  const goToStep1 = () => {
    setStep(1);
    setLocalError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Password dan konfirmasi password tidak cocok.');
      return;
    }
    if (formData.password.length < 6) {
      setLocalError('Password minimal 6 karakter.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
        company_name: formData.companyName,
        role: formData.role,
        country: formData.role === 'umkm' ? 'Indonesia' : formData.country,
        phone: formData.phone || undefined,
      });
      navigate(formData.role === 'umkm' ? '/dashboard' : '/catalog', { replace: true });
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Registrasi gagal. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full bg-slate-800/50 border border-white/8 text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 block py-3 pl-11 pr-4 placeholder-gray-500 transition-all duration-200 outline-none";

  // ── Konten panel kiri berdasarkan role ──────────────────────────────────────
  const heroPanelContent = {
    umkm: {
      image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070&auto=format&fit=crop',
      imageAlt: 'Pelabuhan Ekspor Indonesia',
      overlayFrom: 'from-slate-950/95',
      overlayVia: 'via-slate-900/85',
      overlayTo: 'to-blue-950/90',
      orb1: 'bg-blue-600/20',
      orb2: 'bg-emerald-600/15',
      badgeBg: 'bg-blue-500/15',
      badgeBorder: 'border-blue-500/30',
      badgeIcon: <Sparkles size={12} className="text-blue-400" />,
      badgeText: 'Untuk Pelaku Ekspor',
      badgeColor: 'text-blue-300',
      title: <>Bergabunglah &<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-400 to-emerald-400">Raih Pasar Global</span></>,
      desc: 'Kelola produk UMKM Anda dan distribusikan ke ribuan buyer potensial dari lebih dari 50 negara di seluruh dunia.',
      features: [
        { icon: <Package size={16} />, text: 'Kelola & tampilkan produk ke pasar internasional', color: 'text-blue-400', bg: 'bg-blue-500/15' },
        { icon: <TrendingUp size={16} />, text: 'Pantau performa penjualan lewat dashboard analitik', color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
        { icon: <ShieldCheck size={16} />, text: 'Chat terjemahan otomatis dengan buyer mancanegara', color: 'text-purple-400', bg: 'bg-purple-500/15' },
      ],
      testimonial: {
        avatar: 'BR',
        avatarColor: 'from-amber-400 to-orange-500',
        quote: '"Berkat Nusra Ekspor, produk batik kami kini sudah masuk pasar Jepang dan Korea!"',
        name: 'Budi R. — Pemilik UMKM Batik Sogan',
      },
    },
    buyer: {
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop',
      imageAlt: 'Business Global Buyer',
      overlayFrom: 'from-slate-950/95',
      overlayVia: 'via-slate-900/85',
      overlayTo: 'to-emerald-950/85',
      orb1: 'bg-emerald-600/20',
      orb2: 'bg-teal-600/15',
      badgeBg: 'bg-emerald-500/15',
      badgeBorder: 'border-emerald-500/30',
      badgeIcon: <Globe size={12} className="text-emerald-400" />,
      badgeText: 'Untuk Buyer Internasional',
      badgeColor: 'text-emerald-300',
      title: <>Temukan Produk<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">Terbaik Indonesia</span></>,
      desc: 'Akses ribuan produk premium UMKM Indonesia langsung dari sumbernya — dengan harga kompetitif dan kualitas terjamin.',
      features: [
        { icon: <Globe size={16} />, text: 'Jelajahi katalog produk dari seluruh Indonesia', color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
        { icon: <Star size={16} />, text: 'Komunikasi mudah dengan penjual via chat multi-bahasa', color: 'text-teal-400', bg: 'bg-teal-500/15' },
        { icon: <ShieldCheck size={16} />, text: 'Transaksi aman dengan supplier terverifikasi', color: 'text-cyan-400', bg: 'bg-cyan-500/15' },
      ],
      testimonial: {
        avatar: 'LK',
        avatarColor: 'from-emerald-400 to-teal-500',
        quote: '"Saya menemukan supplier tapioka terbaik di sini — harga bersaing dan komunikasi sangat mudah!"',
        name: 'Li K. — Importir dari Singapura',
      },
    },
  };

  const panel = heroPanelContent[formData.role];

  return (
    <div className="h-screen overflow-hidden flex relative bg-slate-950">

      {/* ── LEFT PANEL (Desktop) — Dinamis berdasarkan role ─────── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative overflow-hidden flex-col">
        {/* Background Image — berubah per role dengan transisi */}
        <img
          key={panel.image}
          src={panel.image}
          alt={panel.imageAlt}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 animate-fade-in"
        />
        {/* Overlay — warna berubah sesuai role */}
        <div className={`absolute inset-0 bg-gradient-to-br ${panel.overlayFrom} ${panel.overlayVia} ${panel.overlayTo} transition-all duration-700`} />

        {/* Decorative Orbs */}
        <div className={`absolute top-1/4 -right-16 w-72 h-72 ${panel.orb1} rounded-full blur-3xl transition-colors duration-700`} />
        <div className={`absolute bottom-1/3 -left-16 w-64 h-64 ${panel.orb2} rounded-full blur-3xl transition-colors duration-700`} />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full px-14 xl:px-20 py-12">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-3 mb-auto">
            <img src="/logo.png" alt="Nusra Ekspor" className="h-12 w-auto object-contain" />
            <div className="flex flex-col text-left">
              <span className="text-xl font-bold font-display text-white">Nusra</span>
              <span className="text-[10px] font-medium text-amber-500 -mt-1 tracking-widest uppercase">Ekspor</span>
            </div>
          </Link>

          {/* Dynamic Content — key memicu re-render + animasi */}
          <div key={formData.role} className="my-auto animate-fade-in">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${panel.badgeBg} border ${panel.badgeBorder} rounded-full mb-6`}>
              {panel.badgeIcon}
              <span className={`text-xs font-semibold ${panel.badgeColor} tracking-wide uppercase`}>{panel.badgeText}</span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-bold font-display text-white leading-tight mb-5">
              {panel.title}
            </h1>
            <p className="text-base text-gray-400 max-w-sm leading-relaxed mb-10">
              {panel.desc}
            </p>

            {/* Feature List */}
            <div className="space-y-4">
              {panel.features.map(({ icon, text, color, bg }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center ${color} flex-shrink-0 transition-colors duration-500`}>
                    {icon}
                  </div>
                  <span className="text-sm text-gray-300">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom: Testimonial Card — juga berganti */}
          <div key={`${formData.role}-testimonial`} className="mt-auto p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm animate-fade-in">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${panel.testimonial.avatarColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 transition-colors duration-500`}>
                {panel.testimonial.avatar}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-300 italic leading-relaxed">
                  {panel.testimonial.quote}
                </p>
                <p className="text-xs text-gray-500 mt-1 font-medium">{panel.testimonial.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: FORM ─────────────────────────────────────── */}
      <div className="w-full lg:w-[55%] xl:w-1/2 h-screen overflow-y-auto flex justify-center px-5 sm:px-8 lg:px-10 xl:px-14 relative pt-10 pb-8">

        {/* Mobile BG blobs */}
        <div className="absolute inset-0 lg:hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-[460px] relative z-10 animate-fade-in my-auto py-6">

          {/* Mobile Logo */}
          <div className="flex items-center justify-center mb-8 lg:hidden">
            <Link to="/" className="inline-flex items-center gap-3">
              <img src="/logo.png" alt="Nusra Ekspor" className="h-10 w-auto object-contain" />
              <div className="flex flex-col text-left">
                <span className="text-lg font-bold font-display text-white">Nusra</span>
                <span className="text-[9px] font-medium text-amber-500 -mt-1 tracking-widest uppercase">Ekspor</span>
              </div>
            </Link>
          </div>

          {/* ← Tombol Kembali ke Beranda */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors group mb-4 lg:hidden"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Kembali ke Beranda
          </Link>

          {/* Card */}
          <div className="bg-slate-900/70 border border-white/10 rounded-3xl shadow-2xl shadow-black/40 backdrop-blur-2xl overflow-hidden">

            {/* Top Gradient Bar */}
            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500" />

            {/* Tombol Kembali Desktop — dalam card, pojok kiri atas */}
            <div className="hidden lg:flex items-center justify-between px-6 sm:px-8 pt-4 pb-0">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-white transition-all group"
              >
                <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
                <span className="group-hover:text-blue-400 transition-colors">Kembali ke Beranda</span>
              </Link>
            </div>

          <div className="p-6 sm:p-8">

              {/* Heading */}
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-white tracking-tight mb-1">
                  Buat Akun Gratis
                </h2>
                <p className="text-xs text-gray-400">
                  Bergabung dengan ribuan pelaku bisnis Indonesia global.
                </p>
              </div>

              {/* Step Indicator */}
              <StepIndicator currentStep={step} />

              {/* Error */}
              {localError && (
                <div className="mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2.5 animate-fade-in">
                  <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
                  <span className="text-red-300 text-xs leading-relaxed">{localError}</span>
                </div>
              )}

              {/* ── STEP 1: Role Selection ── */}
              {step === 1 && (
                <div className="animate-fade-in">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Saya mendaftar sebagai:</p>

                  <div className="space-y-2.5">
                    <RoleCard value="umkm" selected={formData.role === 'umkm'} onSelect={() => update('role', 'umkm')} />
                    <RoleCard value="buyer" selected={formData.role === 'buyer'} onSelect={() => update('role', 'buyer')} />
                  </div>

                  <button
                    type="button"
                    onClick={goToStep2}
                    className="w-full mt-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                  >
                    Lanjutkan
                    <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}

              {/* ── STEP 2: Form Data — 2-column grid ── */}
              {step === 2 && (
                <form onSubmit={handleSubmit} className="animate-fade-in">
                  <div className="grid grid-cols-2 gap-3">

                    {/* Nama Lengkap */}
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">Nama Lengkap <span className="text-red-400">*</span></label>
                      <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors"><User size={14} /></div>
                        <input type="text" required value={formData.fullName} onChange={(e) => update('fullName', e.target.value)}
                          className={`${inputClass} !pl-9 !py-2.5 !text-xs`} placeholder="Nama lengkap" disabled={isSubmitting} />
                      </div>
                    </div>

                    {/* Nama Usaha / Perusahaan */}
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">
                        {formData.role === 'umkm' ? 'Nama UMKM' : 'Nama Perusahaan'} <span className="text-red-400">*</span>
                      </label>
                      <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors"><Building2 size={14} /></div>
                        <input type="text" required value={formData.companyName} onChange={(e) => update('companyName', e.target.value)}
                          className={`${inputClass} !pl-9 !py-2.5 !text-xs`}
                          placeholder={formData.role === 'umkm' ? 'Nama UMKM' : 'Nama perusahaan'} disabled={isSubmitting} />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">Email <span className="text-red-400">*</span></label>
                      <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors"><Mail size={14} /></div>
                        <input type="email" required value={formData.email} onChange={(e) => update('email', e.target.value)}
                          className={`${inputClass} !pl-9 !py-2.5 !text-xs`} placeholder="email@perusahaan.com" disabled={isSubmitting} />
                      </div>
                    </div>

                    {/* No. Telepon */}
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">No. Telepon</label>
                      <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors"><Phone size={14} /></div>
                        <input type="tel" value={formData.phone} onChange={(e) => update('phone', e.target.value)}
                          className={`${inputClass} !pl-9 !py-2.5 !text-xs`} placeholder="+62 812 xxxx xxxx" disabled={isSubmitting} />
                      </div>
                    </div>

                    {/* Negara Asal — buyer only, full width */}
                    {formData.role === 'buyer' && (
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">Negara Asal <span className="text-red-400">*</span></label>
                        <div className="relative group">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors"><Globe size={14} /></div>
                          <select value={formData.country} onChange={(e) => update('country', e.target.value)}
                            className={`${inputClass} !pl-9 !py-2.5 !text-xs appearance-none cursor-pointer`} disabled={isSubmitting}>
                            <option value="United States">🇺🇸 Amerika Serikat</option>
                            <option value="China">🇨🇳 China</option>
                            <option value="Japan">🇯🇵 Jepang</option>
                            <option value="South Korea">🇰🇷 Korea Selatan</option>
                            <option value="United Kingdom">🇬🇧 Inggris Raya</option>
                            <option value="Australia">🇦🇺 Australia</option>
                            <option value="Singapore">🇸🇬 Singapura</option>
                            <option value="Germany">🇩🇪 Jerman</option>
                            <option value="France">🇫🇷 Prancis</option>
                            <option value="Saudi Arabia">🇸🇦 Arab Saudi</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Password */}
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">Password <span className="text-red-400">*</span></label>
                      <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors"><Lock size={14} /></div>
                        <input type={showPassword ? 'text' : 'password'} required value={formData.password}
                          onChange={(e) => update('password', e.target.value)}
                          className={`${inputClass} !pl-9 !py-2.5 !text-xs !pr-9`}
                          placeholder="Min. 6 karakter" disabled={isSubmitting} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                          {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                      {/* Strength bar inline */}
                      {formData.password && (
                        <div className="flex gap-0.5 mt-1.5">
                          {[1,2,3,4].map((i) => (
                            <div key={i} className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${passwordStrength.score >= i ? passwordStrength.color : 'bg-white/10'}`} />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Konfirmasi Password */}
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">Konfirmasi <span className="text-red-400">*</span></label>
                      <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors"><Lock size={14} /></div>
                        <input type={showConfirmPassword ? 'text' : 'password'} required value={formData.confirmPassword}
                          onChange={(e) => update('confirmPassword', e.target.value)}
                          className={`${inputClass} !pl-9 !py-2.5 !text-xs !pr-9 ${
                            formData.confirmPassword && formData.confirmPassword !== formData.password ? '!border-red-500/50' :
                            formData.confirmPassword && formData.confirmPassword === formData.password ? '!border-emerald-500/50' : ''
                          }`}
                          placeholder="Ulangi password" disabled={isSubmitting} />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                          {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        {formData.confirmPassword && formData.confirmPassword === formData.password && (
                          <CheckCircle2 size={13} className="absolute right-8 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-5">
                    <button type="button" onClick={goToStep1} disabled={isSubmitting}
                      className="flex items-center justify-center gap-1.5 px-4 py-2.5 border border-white/15 text-gray-300 rounded-xl text-sm font-medium hover:bg-white/5 hover:text-white hover:border-white/25 transition-all disabled:opacity-50">
                      <ArrowLeft size={15} /> Kembali
                    </button>
                    <button type="submit" disabled={isSubmitting}
                      className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] disabled:opacity-60 disabled:active:scale-100 flex items-center justify-center gap-2">
                      {isSubmitting ? (<><Loader2 size={16} className="animate-spin" />Mendaftarkan...</>) : (<><UserPlus size={16} />Daftar Sekarang</>)}
                    </button>
                  </div>
                </form>
              )}

              {/* Bottom: Login Link */}
              <div className="mt-4 pt-4 border-t border-white/8 text-center">
                <span className="text-gray-400 text-xs">Sudah punya akun? </span>
                <Link to="/login"
                  className="text-white text-xs font-semibold hover:text-blue-400 transition-colors underline decoration-white/25 hover:decoration-blue-400/50 underline-offset-4">Masuk Sekarang
                </Link>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-gray-600 mt-3 leading-relaxed px-4">
            Dengan mendaftar, Anda menyetujui{' '}
            <span className="text-gray-500 underline cursor-pointer hover:text-gray-400">Syarat &amp; Ketentuan</span>
            {' '}dan{' '}
            <span className="text-gray-500 underline cursor-pointer hover:text-gray-400">Kebijakan Privasi</span>
            {' '}kami.
          </p>
        </div>
      </div>
    </div>
  );
}
