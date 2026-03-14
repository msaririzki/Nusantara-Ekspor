// ==========================================
// Nusantara Ekspor - Login Page
// ==========================================

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, Eye, EyeOff, AlertCircle, Loader2, ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type ViewState = 'login' | 'forgot_password';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewState, setViewState] = useState<ViewState>('login');

  // Forgot Password States
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string })?.from || '/';

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate(from, { replace: true });
    return null;
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Login gagal. Cek email dan password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    if (!resetEmail) {
      setLocalError('Mohon masukkan alamat email Anda.');
      return;
    }

    setIsSubmitting(true);
    // Simulate API Call for Reset Password
    setTimeout(() => {
      setIsSubmitting(false);
      setResetSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex relative bg-slate-950">

      {/* Left Side: Premium Hero Image (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Abstract Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-blue-900/80 z-10"></div>

        {/* Background Image: Logistics/Export Theme */}
        <img
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop"
          alt="Nusantara Ekspor Logistics"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Content on Image */}
        <div className="relative z-20 flex flex-col justify-center px-16 xl:px-24">
          <Link to="/" className="inline-flex items-center gap-3 mb-10">
            <img src="/logo.png" alt="Nusra Ekspor" className="h-14 w-auto object-contain" />
            <div className="flex flex-col text-left">
              <span className="text-2xl font-bold font-display text-white">Nusra</span>
              <span className="text-xs font-medium text-amber-500 -mt-1 tracking-widest uppercase">Ekspor</span>
            </div>
          </Link>

          <h1 className="text-4xl xl:text-5xl font-bold font-display text-white leading-tight mb-6">
            Jembatan Menuju <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Pasar Global
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-md leading-relaxed">
            Platform B2B terpercaya yang mempertemukan produk kebanggaan UMKM Indonesia dengan pembeli potensial dari seluruh dunia.
          </p>

          {/* Stats/Badges */}
          <div className="flex items-center gap-6 mt-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white/80">🌐</div>
              <div>
                <div className="text-white font-bold">50+</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">Negara</div>
              </div>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white/80">📦</div>
              <div>
                <div className="text-white font-bold">10K+</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">Produk</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login/Reset Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 lg:px-16 xl:px-24 relative overflow-y-auto py-12">
        {/* Mobile Background Elements */}
        <div className="absolute inset-0 lg:hidden">
          <div className="absolute top-1/4 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-md relative z-10">

          {/* Mobile Logo */}
          <div className="text-center mb-10 lg:hidden">
            <Link to="/" className="inline-flex items-center gap-3 mb-2">
              <img src="/logo.png" alt="Nusra Ekspor" className="h-12 w-auto object-contain" />
              <div className="flex flex-col text-left">
                <span className="text-xl font-bold font-display text-white">Nusra</span>
                <span className="text-[10px] font-medium text-amber-500 -mt-1 tracking-widest uppercase">Ekspor</span>
              </div>
            </Link>
          </div>

          {/* Form Container */}
          <div className="glass-card p-8 sm:p-10 border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl relative overflow-hidden transition-all duration-500 rounded-3xl">
            {/* Top decorative gradient line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 opacity-80"></div>

            {/* ERROR NOTICES */}
            {localError && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-fade-in">
                <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-red-300 text-sm leading-relaxed">{localError}</span>
              </div>
            )}
            {location.state && !localError && viewState === 'login' && (
              <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3 animate-fade-in">
                <AlertCircle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-amber-300 text-sm leading-relaxed">Silakan login terlebih dahulu untuk mengakses halaman tersebut.</span>
              </div>
            )}

            {/* --------------------- LOGIN VIEW --------------------- */}
            {viewState === 'login' && (
              <div className="animate-fade-in">
                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">Selamat Datang</h2>
                  <p className="text-gray-400 text-sm">Masuk ke akun Anda untuk melanjutkan aktivitas ekspor-impor.</p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <div className="relative group">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-blue-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-800/50 border border-white/5 text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 block py-3 pl-11 pr-4 transition-all"
                        placeholder="contoh@perusahaan.com"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-300">Password</label>
                      <button
                        type="button"
                        onClick={() => {
                          setViewState('forgot_password');
                          setLocalError('');
                        }}
                        className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Lupa password?
                      </button>
                    </div>
                    <div className="relative group">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-blue-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-800/50 border border-white/5 text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 block py-3 pl-11 pr-12 transition-all"
                        placeholder="••••••••"
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Otentikasi...
                      </>
                    ) : (
                      <>
                        <LogIn size={18} />
                        Masuk Ke Akun
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                  <span className="text-gray-400 text-sm">Belum bermitra dengan Nusra? </span>
                  <Link to="/register" className="text-white text-sm font-semibold hover:text-blue-400 transition-colors underline decoration-white/30 hover:decoration-blue-400/50 underline-offset-4">
                    Daftar Sekarang
                  </Link>
                </div>
              </div>
            )}

            {/* --------------------- FORGOT PASSWORD VIEW --------------------- */}
            {viewState === 'forgot_password' && (
              <div className="animate-fade-in">
                <button
                  onClick={() => {
                    setViewState('login');
                    setLocalError('');
                    setResetSuccess(false);
                  }}
                  className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6 group"
                >
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Login
                </button>

                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">Atur Ulang Sandi</h2>
                  <p className="text-gray-400 text-sm">
                    Masukkan email terdaftar Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi.
                  </p>
                </div>

                {resetSuccess ? (
                  <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center space-y-4 mb-6">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                      <Send size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-emerald-400 mb-1">Email Terikirim!</h3>
                      <p className="text-sm text-emerald-200/80">
                        Kami telah mengirimkan instruksi ke <span className="text-white font-medium">{resetEmail}</span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleResetSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email Terdaftar</label>
                      <div className="relative group">
                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-purple-400" />
                        <input
                          type="email"
                          required
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          className="w-full bg-slate-800/50 border border-white/5 text-white text-sm rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 block py-3 pl-11 pr-4 transition-all"
                          placeholder="contoh@perusahaan.com"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-medium shadow-lg shadow-purple-500/25 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Mengirim...
                        </>
                      ) : (
                        <>
                          Kirim Tautan Reset
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
            {/* ------------------------------------------------------------- */}
          </div>
        </div>
      </div>
    </div>
  );
}
