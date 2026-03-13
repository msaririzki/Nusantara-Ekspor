// ==========================================
// Nusantara Ekspor - Dummy Data
// ==========================================

import type { DashboardStats, ChatbotMessage } from '../types';

export const dummyDashboardStats: DashboardStats = {
  totalProducts: 8,
  totalViews: 12450,
  totalInquiries: 89,
  totalRevenue: 45600000,
  monthlyGrowth: 23.5,
};

export const dummyChatbotMessages: ChatbotMessage[] = [
  {
    id: 'cb1',
    content: 'Halo! 👋 Saya Asisten Ekspor Nusantara. Saya siap membantu Anda memahami proses ekspor dari Indonesia. Silakan tanyakan apa saja seputar:\n\n• Alur dan prosedur ekspor\n• Syarat kelayakan produk\n• Dokumen dan izin yang diperlukan\n• Regulasi perdagangan internasional\n\nApa yang ingin Anda ketahui?',
    role: 'assistant',
    timestamp: '2025-03-10T10:00:00',
  },
];

export const productCategories = [
  'Agrikultur',
  'Hortikultura',
  'Perkebunan',
  'Kehutanan',
] as const;

export const formatCurrency = (amount: number, currency: string = 'IDR'): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
