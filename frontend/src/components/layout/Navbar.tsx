// ==========================================
// Nusantara Ekspor - Navbar Component
// ==========================================

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, Package, MessageSquare, LayoutDashboard, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const publicLinks = [
  { path: '/', label: 'Beranda', icon: Globe },
  { path: '/catalog', label: 'Katalog', icon: Package },
];

const protectedLinks = [
  { path: '/chat', label: 'Chat B2B', icon: MessageSquare },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, role: 'umkm' as const },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  // Build visible nav links based on auth status
  const visibleLinks = [
    ...publicLinks,
    ...(isAuthenticated
      ? protectedLinks.filter((link) => !link.role || link.role === user?.role)
      : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold font-display text-white tracking-tight">
                Nusantara
              </span>
              <span className="text-[10px] font-medium text-blue-400 -mt-1 tracking-widest uppercase">
                Ekspor
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {visibleLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(path)
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>

          {/* Auth Area */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* User Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <User size={14} className="text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-xs font-medium leading-tight">{user?.fullName}</span>
                    <span className="text-gray-500 text-[10px] leading-tight uppercase">
                      {user?.role === 'umkm' ? 'UMKM' : 'Buyer'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                >
                  <LogOut size={16} />
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  <LogIn size={16} />
                  Masuk
                </Link>
                <Link to="/register" className="btn-primary text-sm !px-5 !py-2.5">
                  Daftar Gratis
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-900/95 backdrop-blur-xl border-t border-white/10 animate-slide-up">
          <div className="px-4 py-4 space-y-1">
            {visibleLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(path)
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2 border-t border-white/10 mt-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{user?.fullName}</div>
                      <div className="text-gray-500 text-xs">{user?.companyName}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <LogOut size={16} />
                    Keluar
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-secondary text-sm text-center"
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-primary text-sm text-center"
                  >
                    Daftar Gratis
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
