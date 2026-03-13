// ==========================================
// Nusantara Ekspor - Type Definitions
// ==========================================

export interface User {
  id: string;
  email: string;
  fullName: string;
  companyName: string;
  role: 'umkm' | 'buyer';
  phone?: string;
  address?: string;
  avatar?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  userId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: ProductCategory;
  images: string[];
  specifications: Record<string, string>;
  minOrder: number;
  stock: number;
  isActive: boolean;
  seller?: string;
  sellerLocation?: string;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type ProductCategory =
  | 'Agrikultur'
  | 'Hortikultura'
  | 'Perkebunan'
  | 'Kehutanan';

export interface ChatRoom {
  id: string;
  umkmId: string;
  buyerId: string;
  productId: string;
  buyerName: string;
  buyerAvatar?: string;
  buyerCountry: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isOnline: boolean;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  originalMessage: string;
  translatedMessage?: string;
  originalLanguage: string;
  targetLanguage?: string;
  isTranslated: boolean;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface ChatbotMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalViews: number;
  totalInquiries: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

export interface SearchFilters {
  query: string;
  category: ProductCategory | '';
  minPrice: number;
  maxPrice: number;
  sortBy: 'newest' | 'price-low' | 'price-high' | 'popular';
}
