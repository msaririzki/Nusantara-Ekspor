// ==========================================
// Nusantara Ekspor - Auth Context
// ==========================================

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authApi, type LoginData, type RegisterData, type AuthResponse } from '../services/api';

interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  companyName: string;
  role: 'umkm' | 'buyer' | 'admin';
  country: string;
  phone: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapUser(apiUser: AuthResponse['user']): AuthUser {
  return {
    id: apiUser.id,
    email: apiUser.email,
    fullName: apiUser.full_name,
    companyName: apiUser.company_name,
    role: apiUser.role as 'umkm' | 'buyer' | 'admin',
    country: apiUser.country,
    phone: apiUser.phone,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('ne_token');
    const savedUser = localStorage.getItem('ne_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('ne_token');
        localStorage.removeItem('ne_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginData) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await authApi.login(data);
      const mappedUser = mapUser(response.user);
      setToken(response.access_token);
      setUser(mappedUser);
      localStorage.setItem('ne_token', response.access_token);
      localStorage.setItem('ne_user', JSON.stringify(mappedUser));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login gagal';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await authApi.register(data);
      const mappedUser = mapUser(response.user);
      setToken(response.access_token);
      setUser(mappedUser);
      localStorage.setItem('ne_token', response.access_token);
      localStorage.setItem('ne_user', JSON.stringify(mappedUser));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registrasi gagal';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ne_token');
    localStorage.removeItem('ne_user');
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
