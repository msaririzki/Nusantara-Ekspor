// ==========================================
// Nusantara Ekspor - Product Detail Page
// ==========================================

import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Star, MapPin, Package, ShieldCheck, MessageSquare,
  Share2, Heart, Truck, Clock, CheckCircle2
} from 'lucide-react';
import { dummyProducts, formatCurrency } from '../data/dummy';

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = dummyProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package size={64} className="text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Produk Tidak Ditemukan</h2>
          <Link to="/catalog" className="btn-primary mt-4 inline-flex items-center gap-2">
            <ArrowLeft size={16} />
            Kembali ke Katalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link to="/catalog" className="hover:text-blue-400 transition-colors flex items-center gap-1">
            <ArrowLeft size={14} />
            Katalog
          </Link>
          <span>/</span>
          <span className="text-gray-500">{product.category}</span>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div>
            <div className="glass-card overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="badge-blue">{product.category}</span>
                  {product.isActive && <span className="badge-emerald">Aktif</span>}
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="w-10 h-10 glass-card flex items-center justify-center hover:bg-white/20 transition-colors rounded-xl">
                    <Heart size={18} className="text-white" />
                  </button>
                  <button className="w-10 h-10 glass-card flex items-center justify-center hover:bg-white/20 transition-colors rounded-xl">
                    <Share2 size={18} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              {product.rating && (
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.floor(product.rating!)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-gray-600'
                      }
                    />
                  ))}
                  <span className="text-amber-400 font-medium ml-1">{product.rating}</span>
                  <span className="text-gray-500 text-sm">({product.reviewCount} ulasan)</span>
                </div>
              )}
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold font-display text-white mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-6">
              <MapPin size={16} className="text-blue-400" />
              <span className="text-gray-400">{product.seller}</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-400">{product.sellerLocation}</span>
            </div>

            <div className="glass-card p-6 mb-6">
              <div className="text-sm text-gray-400 mb-1">Harga per unit</div>
              <div className="text-3xl font-bold text-emerald-400 mb-2">
                {formatCurrency(product.price)}
              </div>
              <div className="text-gray-500 text-sm">
                Minimum order: <span className="text-white font-medium">{product.minOrder} pcs</span>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-6">{product.description}</p>

            {/* Quick Facts */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="glass-card p-4 text-center">
                <Truck size={20} className="text-blue-400 mx-auto mb-2" />
                <div className="text-xs text-gray-400">Siap Kirim</div>
                <div className="text-white text-sm font-semibold">Worldwide</div>
              </div>
              <div className="glass-card p-4 text-center">
                <Clock size={20} className="text-purple-400 mx-auto mb-2" />
                <div className="text-xs text-gray-400">Lead Time</div>
                <div className="text-white text-sm font-semibold">7-14 Hari</div>
              </div>
              <div className="glass-card p-4 text-center">
                <ShieldCheck size={20} className="text-emerald-400 mx-auto mb-2" />
                <div className="text-xs text-gray-400">Stok</div>
                <div className="text-white text-sm font-semibold">{product.stock} pcs</div>
              </div>
            </div>

            {/* Specifications */}
            <div className="glass-card p-6 mb-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-blue-400" />
                Spesifikasi Produk
              </h3>
              <div className="space-y-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <span className="text-gray-400 text-sm">{key}</span>
                    <span className="text-white text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/chat" className="btn-primary flex-1 flex items-center justify-center gap-2">
                <MessageSquare size={18} />
                Hubungi Seller
              </Link>
              <button className="btn-accent flex-1 flex items-center justify-center gap-2">
                <Package size={18} />
                Pesan Sampel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
