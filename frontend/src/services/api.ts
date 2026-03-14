// ==========================================
// Nusantara Ekspor - API Service
// ==========================================

// Dev: Vite proxy forwards /api → backend (see vite.config.ts, VITE_API_TARGET)
// Prod: request langsung ke domain yang sama (no CORS)
const API_BASE_URL = '';

interface ApiOptions {
  method?: string;
  body?: unknown;
  token?: string;
}

async function apiFetch<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Terjadi kesalahan' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

// ===== Auth API =====

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  company_name: string;
  role: 'umkm' | 'buyer';
  country: string;
  phone?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    company_name: string;
    role: string;
    country: string;
    phone: string | null;
    address: string | null;
    is_active: boolean;
    created_at: string;
  };
}

export const authApi = {
  login: (data: LoginData) =>
    apiFetch<AuthResponse>('/api/auth/login', { method: 'POST', body: data }),

  register: (data: RegisterData) =>
    apiFetch<AuthResponse>('/api/auth/register', { method: 'POST', body: data }),
};

// ===== AI API =====

export interface TranslateData {
  text: string;
  source_language: string;
  target_language: string;
}

export interface TranslateResponse {
  original_text: string;
  translated_text: string;
  source_language: string;
  target_language: string;
}

export interface ChatbotResponse {
  reply: string;
}

export const aiApi = {
  translate: (data: TranslateData) =>
    apiFetch<TranslateResponse>('/api/ai/translate', { method: 'POST', body: data }),

  chatbot: (message: string) =>
    apiFetch<ChatbotResponse>('/api/ai/chatbot', { method: 'POST', body: { message } }),
};

// ===== Products API =====

import type { Product } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapProduct = (data: any): Product => ({
  id: data.id,
  userId: data.user_id,
  name: data.name,
  description: data.description,
  price: data.price,
  currency: data.currency,
  category: data.category,
  images: data.images || [],
  specifications: data.specifications || {},
  minOrder: data.min_order,
  stock: data.stock,
  isActive: data.is_active,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
});

export const productsApi = {
  list: async (params?: { query?: string; category?: string; sort_by?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.query) searchParams.set('query', params.query);
    if (params?.category) searchParams.set('category', params.category);
    if (params?.sort_by) searchParams.set('sort_by', params.sort_by);
    const qs = searchParams.toString();
    const result = await apiFetch<any[]>(`/api/products${qs ? `?${qs}` : ''}`);
    return result.map(mapProduct);
  },

  get: async (id: string) => {
    const result = await apiFetch<any>(`/api/products/${id}`);
    return mapProduct(result);
  },

  create: async (data: unknown, token: string) => {
    const result = await apiFetch<any>('/api/products', { method: 'POST', body: data, token });
    return mapProduct(result);
  },

  update: async (id: string, data: unknown, token: string) => {
    const result = await apiFetch<any>(`/api/products/${id}`, { method: 'PUT', body: data, token });
    return mapProduct(result);
  },

  delete: (id: string, token: string) =>
    apiFetch<void>(`/api/products/${id}`, { method: 'DELETE', token }),

  uploadImage: async (file: File, token: string): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/products/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Gagal mengunggah gambar' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }
};

// ===== Chat B2B API =====

export const chatApi = {
  createRoom: (data: { umkm_id: string; product_id?: string }, token: string) =>
    apiFetch<unknown>('/api/chat/rooms', { method: 'POST', body: data, token }),
    
  getRooms: (token: string) => 
    apiFetch<unknown[]>('/api/chat/rooms', { method: 'GET', token }),
    
  getRoomMessages: (roomId: string, token: string) =>
    apiFetch<unknown[]>(`/api/chat/${roomId}/messages`, { method: 'GET', token }),
};
