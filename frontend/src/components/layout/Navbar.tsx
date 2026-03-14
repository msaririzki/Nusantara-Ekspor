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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/logo.png" alt="Nusra Ekspor" className="h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
            <div className="flex flex-col">
              <div className="flex flex-col">
              <span className="text-lg font-bold font-display text-white tracking-tight group-hover:text-blue-400 transition-colors duration-300">
                Nusra
              </span>
              <span className="text-[10px] font-medium text-emerald-400 -mt-1 tracking-widest uppercase">
                Ekspor
              </span>
            </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1.5 p-1 bg-white/5 rounded-2xl border border-white/5">
            {visibleLinks.map(({ path, label, icon: Icon }) => {
              const active = isActive(path);
              return (
                <Link
                  key={path}
                  to={path}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden group ${active
                      ? 'text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {active && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-emerald-600/80 rounded-xl" />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon size={16} className={active ? "text-white" : "group-hover:text-blue-400 transition-colors"} />
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Auth Area */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 pr-2 py-1.5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors duration-300">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-inner">
                    <User size={16} className="text-white" />
                  </div>
                  <div className="flex flex-col pr-3 border-r border-white/10">
                    <span className="text-white text-xs font-semibold leading-tight">{user?.fullName}</span>
                    <span className="text-emerald-400 text-[10px] font-medium leading-tight uppercase tracking-wider">
                      {user?.role === 'umkm' ? 'UMKM' : 'Buyer'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-200"
                  title="Keluar"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300"
                >
                  <LogIn size={16} />
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="relative group px-5 py-2.5 rounded-xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-600 transition-transform duration-300 group-hover:scale-105"></div>
                  <span className="relative z-10 text-white text-sm font-medium">Daftar Gratis</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white bg-white/5 rounded-xl border border-white/10 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-screen border-t border-white/10 opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="px-4 py-4 space-y-2 bg-slate-900/95">
          {visibleLinks.map(({ path, label, icon: Icon }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${active
                    ? 'bg-gradient-to-r from-blue-600/50 to-emerald-600/50 text-white border border-white/10 shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Icon size={18} className={active ? "text-white" : "text-gray-400"} />
                {label}
              </Link>
            );
          })}

          <div className="pt-4 pb-2 flex flex-col gap-3 border-t border-white/10 mt-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-inner">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">{user?.fullName}</div>
                    <div className="text-emerald-400 text-xs font-medium uppercase tracking-wider">{user?.role === 'umkm' ? 'UMKM' : 'Buyer'}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-400 bg-red-400/10 hover:bg-red-400/20 border border-red-400/20 rounded-xl transition-all"
                >
                  <LogOut size={18} />
                  Keluar
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex justify-center items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                >
                  <LogIn size={18} />
                  Masuk
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex justify-center items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 transition-all shadow-lg"
                >
                  Daftar Gratis
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
