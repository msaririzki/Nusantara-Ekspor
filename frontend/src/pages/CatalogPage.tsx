// ==========================================
// Nusantara Ekspor - Catalog Page
// ==========================================

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Star, MapPin, Package, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { productCategories, formatCurrency } from '../data/dummy';
import type { Product, ProductCategory } from '../types';
import { productsApi } from '../services/api';

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | ''>('');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'popular'>('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setIsLoading(true);
        const data = await productsApi.list() as Product[];
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch catalog', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  const filteredProducts = useMemo(() => {
    let results = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.seller?.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      results = results.filter((p) => p.category === selectedCategory);
    }

    switch (sortBy) {
      case 'price-low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        results.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      default:
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return results;
  }, [products, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold font-display text-white mb-3">
            Katalog <span className="gradient-text">Produk Digital</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Temukan produk-produk unggulan UMKM Indonesia untuk pasar global
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari produk, seller, atau kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field !pl-11"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center gap-2 sm:w-auto"
          >
            <SlidersHorizontal size={16} />
            Filter
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="glass-card p-6 mb-8 animate-slide-up">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Kategori</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as ProductCategory | '')}
                  className="input-field"
                >
                  <option value="">Semua Kategori</option>
                  {productCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Urutkan</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="input-field"
                >
                  <option value="newest">Terbaru</option>
                  <option value="price-low">Harga Terendah</option>
                  <option value="price-high">Harga Tertinggi</option>
                  <option value="popular">Terpopuler</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              !selectedCategory
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            Semua
          </button>
          {productCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center gap-2 mb-6">
          <Package size={16} className="text-gray-400" />
          <span className="text-gray-400 text-sm">
            Menampilkan <span className="text-white font-semibold">{filteredProducts.length}</span> produk
          </span>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Loader2 size={48} className="animate-spin mb-4 text-blue-500" />
            <p className="text-lg">Memuat katalog produk unggulan...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, i) => (
              <Link
                key={product.id}
                to={`/catalog/${product.id}`}
                className="glass-card-hover overflow-hidden group animate-fade-in flex flex-col"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-white/5 flex-shrink-0">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={48} className="text-gray-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 badge-blue text-[10px]">
                    {product.category}
                  </span>
                  {product.rating && product.rating >= 4.8 && (
                    <span className="absolute top-3 right-3 badge-amber text-[10px]">
                      <Star size={10} className="mr-1 fill-amber-400" />
                      Top Rated
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors leading-snug">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mb-3">
                    <MapPin size={12} className="text-gray-500" />
                    <span className="text-gray-500 text-xs">{product.sellerLocation}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-bold text-lg">
                      {formatCurrency(product.price)}
                    </span>
                    {product.rating && (
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span className="text-gray-400 text-xs">{product.rating}</span>
                        <span className="text-gray-500 text-xs">({product.reviewCount || 0})</span>
                      </div>
                    )}
                  </div>
                  <div className="text-gray-500 text-xs mt-2">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    Min. order: {(product as any).min_order ?? product.minOrder ?? 1} pcs
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <Package size={48} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">Produk Tidak Ditemukan</h3>
            <p className="text-gray-400">
              Coba ubah kata kunci pencarian atau filter kategori Anda
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
