// ==========================================
// Nusantara Ekspor - Landing Page
// ==========================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Globe2, ShieldCheck, Zap, ChevronRight, Package, MessageSquare } from 'lucide-react';
import { formatCurrency } from '../data/dummy';
import FeaturesShowcase from '../components/features/FeaturesShowcase';
import Pricing from '../components/Pricing';
import type { Product } from '../types';

const mockProducts: Product[] = [
  {
    id: '1',
    userId: '1',
    name: 'Batik Tulis Premium',
    description: 'Batik tulis handmade dari Yogyakarta',
    price: 150000,
    currency: 'IDR',
    category: 'Hortikultura',
    images: ['https://via.placeholder.com/300'],
    specifications: {},
    minOrder: 1,
    stock: 10,
    isActive: true,
    sellerLocation: 'Yogyakarta',
    rating: 4.8,
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01'
  },
  {
    id: '2',
    userId: '2',
    name: 'Kopi Arabica Specialty',
    description: 'Kopi arabica premium dari Bali',
    price: 75000,
    currency: 'IDR',
    category: 'Perkebunan',
    images: ['https://via.placeholder.com/300'],
    specifications: {},
    minOrder: 1,
    stock: 20,
    isActive: true,
    sellerLocation: 'Bali',
    rating: 4.9,
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01'
  },
  {
    id: '3',
    userId: '3',
    name: 'Tenun Ikat Tradisional',
    description: 'Tenun ikat handmade dari NTT',
    price: 200000,
    currency: 'IDR',
    category: 'Hortikultura',
    images: ['https://via.placeholder.com/300'],
    specifications: {},
    minOrder: 1,
    stock: 5,
    isActive: true,
    sellerLocation: 'NTT',
    rating: 4.7,
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01'
  },
  {
    id: '4',
    userId: '4',
    name: 'Madu Hutan Asli',
    description: 'Madu hutan murni dari Kalimantan',
    price: 50000,
    currency: 'IDR',
    category: 'Perkebunan',
    images: ['https://via.placeholder.com/300'],
    specifications: {},
    minOrder: 1,
    stock: 15,
    isActive: true,
    sellerLocation: 'Kalimantan',
    rating: 4.6,
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01'
  }
];

export default function LandingPage() {
  const [featuredProducts] = useState<Product[]>(mockProducts);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse-slow animate-delay-200" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow animate-delay-500" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0f172a_70%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Hero Content */}
            <div className="animate-fade-in">
              <div className="badge-emerald mb-6">
                <Globe2 size={14} className="mr-1.5" />
                Platform Ekspor Digital #1 Indonesia
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold font-display leading-tight mb-6">
                Bawa Produk{' '}
                <span className="gradient-text">Kebanggaanmu</span>
                {' '}Mendunia
              </h1>
              <p className="text-lg lg:text-xl text-gray-400 leading-relaxed mb-8 max-w-lg">
                Platform canggih bertenaga AI untuk membantu UMKM Indonesia melakukan ekspor ke pasar global. 
                Tanpa kendala bahasa, tanpa bingung regulasi.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/catalog" className="btn-primary flex items-center justify-center gap-2 text-lg">
                  Jelajahi Katalog
                  <ArrowRight size={20} />
                </Link>
                <Link to="/register" className="btn-secondary flex items-center justify-center gap-2 text-lg">
                  Mulai Ekspor
                  <ChevronRight size={20} />
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10">
                {[
                  { value: '500+', label: 'Produk UMKM' },
                  { value: '50+', label: 'Negara Tujuan' },
                  { value: '1.2K+', label: 'Transaksi Sukses' },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <div className="text-2xl lg:text-3xl font-bold font-display gradient-text">{value}</div>
                    <div className="text-sm text-gray-500 mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative animate-fade-in animate-delay-200 hidden lg:block">
              <div className="relative">
                {/* Floating Cards */}
                <div className="glass-card p-6 animate-float">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <Package size={24} className="text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">Katalog Digital</div>
                      <div className="text-gray-400 text-sm">8 produk aktif</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {featuredProducts.map((p) => (
                      <div key={p.id} className="aspect-square rounded-lg bg-white/5 overflow-hidden">
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat Preview */}
                <div className="glass-card p-4 mt-4 ml-12 max-w-sm animate-float animate-delay-300">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare size={16} className="text-blue-400" />
                    <span className="text-sm font-medium text-white">Live Chat B2B</span>
                    <span className="badge-emerald text-[10px] ml-auto">Online</span>
                  </div>
                  <div className="space-y-2">
                    <div className="chat-bubble-received text-xs">
                      I'm interested in your batik collection
                      <div className="flex items-center gap-1 mt-1.5 text-[10px] text-gray-400">
                        <Zap size={10} className="text-purple-400" />
                        Auto-translated by Gemini
                      </div>
                    </div>
                    <div className="chat-bubble-sent text-xs ml-auto">
                      Tentu! Kami punya koleksi batik terbaik 🎨
                    </div>
                  </div>
                </div>

                {/* Revenue Card */}
                <div className="glass-card p-4 absolute top-4 -right-4 max-w-[200px] animate-float animate-delay-500">
                  <div className="text-xs text-gray-400 mb-1">Pendapatan Bulan Ini</div>
                  <div className="text-xl font-bold text-emerald-400">Rp 45,6 Jt</div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-emerald-400 text-xs font-medium">+23.5%</span>
                    <span className="text-gray-500 text-xs">vs bulan lalu</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Fitur Andalan — Globe 3D + Interactive Cards */}
      <FeaturesShowcase />

      {/* Featured Products */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12">
            <div>
              <div className="badge-amber mb-4 inline-flex">
                <Star size={14} className="mr-1.5" />
                Produk Pilihan
              </div>
              <h2 className="section-heading text-white">
                Produk <span className="gradient-text">Unggulan</span>
              </h2>
            </div>
            <Link to="/catalog" className="btn-secondary mt-4 sm:mt-0 flex items-center gap-2">
              Lihat Semua
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, i) => (
              <Link
                key={product.id}
                to={`/catalog/${product.id}`}
                className="glass-card-hover overflow-hidden group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                  <span className="absolute top-3 left-3 badge-blue text-[10px]">
                    {product.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-white font-semibold mb-1 line-clamp-1 group-hover:text-blue-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3">{product.sellerLocation}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-bold">
                      {formatCurrency(product.price)}
                    </span>
                    {product.rating && (
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span className="text-gray-400 text-xs">{product.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <Pricing />

      {/* Trust Section */}
      <section className="py-20 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="badge-emerald mb-4 inline-flex">
                  <ShieldCheck size={14} className="mr-1.5" />
                  Dipercaya UMKM Indonesia
                </div>
                <h2 className="section-heading text-white mb-4">
                  Bersama <span className="gradient-text">Memajukan</span> Ekspor Indonesia
                </h2>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Nusantara Ekspor berkomitmen menjadi jembatan digital bagi pengusaha dan UMKM Indonesia 
                  untuk menembus pasar internasional. Dengan teknologi AI dan antarmuka yang intuitif, 
                  siapapun bisa mulai mengekspor produknya.
                </p>
                <Link to="/register" className="btn-accent flex items-center gap-2 w-fit">
                  Gabung Sekarang
                  <ArrowRight size={18} />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Globe2, value: '50+', label: 'Negara Tujuan', color: 'text-blue-400' },
                  { icon: Package, value: '500+', label: 'Produk Terdaftar', color: 'text-emerald-400' },
                  { icon: MessageSquare, value: '10K+', label: 'Pesan Diterjemahkan', color: 'text-purple-400' },
                  { icon: ShieldCheck, value: '99%', label: 'Kepuasan Pengguna', color: 'text-amber-400' },
                ].map(({ icon: Icon, value, label, color }) => (
                  <div key={label} className="glass-card p-6 text-center">
                    <Icon size={24} className={`${color} mx-auto mb-3`} />
                    <div className="text-2xl font-bold font-display text-white">{value}</div>
                    <div className="text-gray-400 text-sm mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-heading text-white mb-6">
            Siap <span className="gradient-text">Memulai Ekspor</span>?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Daftarkan produk UMKM Anda sekarang dan mulai jual ke 50+ negara di seluruh dunia. 
            Gratis untuk memulai!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-lg flex items-center justify-center gap-2">
              Daftar Gratis Sekarang
              <ArrowRight size={20} />
            </Link>
            <Link to="/catalog" className="btn-secondary text-lg flex items-center justify-center gap-2">
              Lihat Katalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
