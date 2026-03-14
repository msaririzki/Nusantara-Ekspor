import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, LogIn, Eye, EyeOff, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setLocalError('Token reset sandi tidak ditemukan atau tidak valid.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    
    if (!token) {
      setLocalError('Token reset sandi tidak tersedia. Cek kembali tautan email Anda.');
      return;
    }
    
    if (password.length < 6) {
      setLocalError('Kata sandi harus terdiri dari minimal 6 karakter.');
      return;
    }
    
    if (password !== confirmPassword) {
      setLocalError('Kata sandi dan konfirmasi kata sandi tidak cocok.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { authApi } = await import('../services/api');
      await authApi.resetPassword(token, password);
      setResetSuccess(true);
      // Optional: Auto redirect after few seconds
      setTimeout(() => navigate('/login'), 5000);
    } catch (err: any) {
      setLocalError(err.message || 'Gagal mengubah kata sandi. Coba lagi atau minta tautan baru.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0">
         <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl opacity-50" />
         <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-2">
            <img src="/logo.png" alt="Nusra Ekspor" className="h-12 w-auto object-contain" />
            <div className="flex flex-col text-left">
              <span className="text-xl font-bold font-display text-white">Nusra</span>
              <span className="text-[10px] font-medium text-amber-500 -mt-1 tracking-widest uppercase">Ekspor</span>
            </div>
          </Link>
        </div>

        <div className="glass-card p-8 sm:p-10 border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl relative overflow-hidden rounded-3xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 opacity-80" />

          {localError && !resetSuccess && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-fade-in">
              <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-red-300 text-sm leading-relaxed">{localError}</span>
            </div>
          )}

          {resetSuccess ? (
            <div className="text-center animate-fade-in py-4">
               <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400 mb-6">
                 <CheckCircle2 size={32} />
               </div>
               <h2 className="text-2xl font-bold text-white mb-3">Sandi Diperbarui!</h2>
               <p className="text-gray-400 text-sm mb-8">
                 Kata sandi akun Anda telah berhasil diubah secara permanen. Anda dapat menggunakan kata sandi baru untuk masuk.
               </p>
               <Link 
                 to="/login"
                 className="inline-flex w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] items-center justify-center gap-2"
               >
                 <LogIn size={18} /> Pergi ke Halaman Login
               </Link>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Atur Ulang Sandi</h2>
                <p className="text-gray-400 text-sm">Silakan buat kata sandi baru untuk akun Anda. Jangan lupa untuk menyimpannya dengan aman.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Kata Sandi Baru</label>
                  <div className="relative group">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-blue-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={password}
                      disabled={isSubmitting || !token}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-800/50 border border-white/5 text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 block py-3 pl-11 pr-12 transition-all"
                      placeholder="Minimal 6 karakter"
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

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Konfirmasi Sandi Baru</label>
                  <div className="relative group">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-blue-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={confirmPassword}
                      disabled={isSubmitting || !token}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-800/50 border border-white/5 text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 block py-3 pl-11 pr-12 transition-all"
                      placeholder="Ketikan ulang kata sandi"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !token}
                  className="w-full py-3.5 mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Merekam Sandi...
                    </>
                  ) : (
                    <>Ubah Kata Sandi</>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
