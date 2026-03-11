// ==========================================
// Nusantara Ekspor - Protected Route
// ==========================================

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'umkm' | 'buyer';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="text-blue-500 animate-spin" />
          <p className="text-gray-400">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md">
          <h2 className="text-xl font-bold text-white mb-2">Akses Ditolak</h2>
          <p className="text-gray-400 mb-4">
            Halaman ini hanya tersedia untuk akun{' '}
            <span className="text-blue-400 font-semibold">
              {requiredRole === 'umkm' ? 'UMKM / Eksportir' : 'Buyer / Importir'}
            </span>
          </p>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
