// ==========================================
// Nusantara Ekspor - Register Page
// ==========================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Building2, Phone, Eye, EyeOff, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    phone: '',
    role: 'umkm' as 'umkm' | 'buyer',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  const update = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Password dan konfirmasi password tidak cocok');
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('Password minimal 6 karakter');
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
        phone: formData.phone || undefined,
      });
      navigate(formData.role === 'umkm' ? '/dashboard' : '/catalog', { replace: true });
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Registrasi gagal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xl font-bold font-display text-white">Nusantara</span>
              <span className="text-[10px] font-medium text-blue-400 -mt-1 tracking-widest uppercase">Ekspor</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Buat Akun Baru</h1>
          <p className="text-gray-400">Mulai perjalanan ekspor Anda hari ini</p>
        </div>

        <div className="glass-card p-8">
          {/* Error Message */}
          {localError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
              <span className="text-red-300 text-sm">{localError}</span>
            </div>
          )}

          {/* Role Toggle */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-6">
            {[
              { value: 'umkm', label: '🏭 UMKM / Eksportir' },
              { value: 'buyer', label: '🛒 Buyer / Importir' },
            ].map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => update('role', value)}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  formData.role === value
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Nama Lengkap</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => update('fullName', e.target.value)}
                  className="input-field !pl-11"
                  placeholder="Nama lengkap Anda"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                {formData.role === 'umkm' ? 'Nama Usaha / UMKM' : 'Nama Perusahaan'}
              </label>
              <div className="relative">
                <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => update('companyName', e.target.value)}
                  className="input-field !pl-11"
                  placeholder={formData.role === 'umkm' ? 'Nama UMKM Anda' : 'Nama perusahaan'}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => update('email', e.target.value)}
                  className="input-field !pl-11"
                  placeholder="nama@email.com"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">No. Telepon</label>
              <div className="relative">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  className="input-field !pl-11"
                  placeholder="+62 812 xxxx xxxx"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => update('password', e.target.value)}
                  className="input-field !pl-11 !pr-11"
                  placeholder="Min. 6 karakter"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Konfirmasi Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => update('confirmPassword', e.target.value)}
                  className="input-field !pl-11"
                  placeholder="Ulangi password"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex items-center justify-center gap-2 !mt-6 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Mendaftar...
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Daftar Sekarang
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-400 text-sm">Sudah punya akun? </span>
            <Link to="/login" className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors">
              Masuk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
