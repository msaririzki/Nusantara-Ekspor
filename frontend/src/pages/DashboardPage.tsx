// ==========================================
// Nusantara Ekspor - Dashboard Page
// ==========================================

import { useState, useEffect, useRef } from 'react';
import {
  Package, Eye, MessageSquare, TrendingUp, Plus, Edit3, Trash2,
  BarChart3, ArrowUpRight, DollarSign, X, Save, Image as ImageIcon, Loader2
} from 'lucide-react';
import { formatCurrency, productCategories } from '../data/dummy';
import type { Product, ProductCategory } from '../types';
import { productsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '' as ProductCategory | '',
    minOrder: 1,
    stock: 0,
    images: [] as string[]
  });

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      // Backend list doesn't strictly filter by user_id yet so we handle it if needed
      // but assuming the backend list logic or we just show what we fetch (if API handles it)
      // Actually standard API list fetches ALL active products. Let's assume we filter by umkm visually for now
      // Or we just call the api. In reality we should pass user_id filter if supported.
      const data = await productsApi.list() as Product[];
      // Filter out only products belong to this user
      setProducts(data.filter(p => p.userId === user?.id));
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      category: product.category as any,
      minOrder: product.minOrder || 1,
      stock: product.stock || 0,
      images: product.images || []
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Yakin ingin menghapus produk ini?')) return;
    try {
      await productsApi.delete(id, token);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      alert('Gagal menghapus produk');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !token) return;

    try {
      setUploadingImage(true);
      const newImages: string[] = [];
      for (const file of files) {
        const res = await productsApi.uploadImage(file, token);
        const safeUrl = res.url.startsWith('/') ? res.url : `/${res.url}`;
        newImages.push(safeUrl);
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(0, 5)
      }));
    } catch (error) {
      alert('Gagal mengupload gambar. Pastikan format JPG/PNG dan ukuran maksimal file tidak terlalu besar.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      setIsSaving(true);
      const payload = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        min_order: formData.minOrder, // Backend masih expect snake_case saat Create/Update
        stock: formData.stock,
        images: formData.images,
        currency: 'IDR'
      };

      if (editingProduct) {
        await productsApi.update(editingProduct.id, payload, token);
      } else {
        await productsApi.create(payload, token);
      }

      setShowForm(false);
      setEditingProduct(null);
      fetchProducts(); // Refresh list
    } catch (error) {
      alert('Terjadi kesalahan saat menyimpan produk.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNew = () => {
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: 0, category: '', minOrder: 1, stock: 0, images: [] });
    setShowForm(true);
  };

  return (
    <div className="min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold font-display text-white mb-2">
              Dashboard <span className="gradient-text">UMKM</span>
            </h1>
            <p className="text-gray-400">Kelola produk dan pantau performa bisnis Anda</p>
          </div>
          <button onClick={handleNew} className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            Tambah Produk
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {[
            {
              icon: Package,
              label: 'Total Produk',
              value: products.length.toString(),
              color: 'text-blue-400',
              bgColor: 'from-blue-500 to-blue-600',
            },
            {
              icon: Eye,
              label: 'Total Views',
              value: '0',
              color: 'text-purple-400',
              bgColor: 'from-purple-500 to-purple-600',
            },
            {
              icon: MessageSquare,
              label: 'Inquiries',
              value: '0',
              color: 'text-emerald-400',
              bgColor: 'from-emerald-500 to-emerald-600',
            },
            {
              icon: DollarSign,
              label: 'Pendapatan',
              value: formatCurrency(0),
              color: 'text-amber-400',
              bgColor: 'from-amber-500 to-amber-600',
              extra: `+0%`,
            },
          ].map(({ icon: Icon, label, value, color, bgColor, extra }) => (
            <div key={label} className="glass-card p-6 group hover:bg-white/10 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon size={22} className="text-white" />
                </div>
                {extra && (
                  <span className="badge-emerald text-xs flex items-center gap-1">
                    <ArrowUpRight size={12} />
                    {extra}
                  </span>
                )}
              </div>
              <div className={`text-2xl font-bold font-display ${color} mb-1`}>{value}</div>
              <div className="text-gray-400 text-sm">{label}</div>
            </div>
          ))}
        </div>

        {/* Mini Chart Area */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <BarChart3 size={20} className="text-blue-400" />
              Performa Bulanan
            </h2>
            <span className="badge-blue">
              <TrendingUp size={12} className="mr-1" />
              +0% bulan ini
            </span>
          </div>
          <div className="flex items-end gap-2 h-32">
            {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md transition-all duration-500 hover:from-blue-500 hover:to-blue-300 cursor-pointer"
                  style={{ height: `${height === 0 ? 5 : height}%`, opacity: height === 0 ? 0.3 : 1 }}
                />
                <span className="text-[10px] text-gray-500">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Products Table */}
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Package size={20} className="text-blue-400" />
              Daftar Produk ({products.length})
            </h2>
          </div>
          <div className="overflow-x-auto min-h-[200px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <Loader2 size={32} className="animate-spin mb-3 text-blue-500" />
                <p>Memuat profil UMKM dan katalog produk...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <Package size={32} className="mb-3 opacity-50" />
                <p>Belum ada produk yang ditambahkan.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Produk</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Kategori</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Harga</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Stok</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Status</th>
                    <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                            {product.images && product.images.length > 0 ? (
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-white/10">
                                <ImageIcon size={20} className="text-gray-500" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-white font-medium text-sm truncate max-w-[200px]">{product.name}</div>
                            <div className="text-gray-500 text-xs">{product.seller}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="badge-blue text-xs">{product.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-emerald-400 font-medium text-sm">{formatCurrency(product.price)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-300 text-sm">{product.stock} pcs</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={product.isActive ? 'badge-emerald text-xs' : 'badge text-xs bg-red-500/20 text-red-300 border border-red-500/30'}>
                          {product.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Product Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
                </h3>
                <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Nama Produk</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="Masukkan nama produk"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Deskripsi</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field resize-none"
                    placeholder="Deskripsikan produk Anda"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Harga (IDR)</label>
                    <input
                      type="text"
                      required
                      value={formData.price === 0 ? '' : formData.price.toLocaleString('id-ID')}
                      onChange={(e) => {
                        // Hanya ambil angka
                        const rawContent = e.target.value.replace(/\D/g, '');
                        // Parse ke int
                        const numericValue = parseInt(rawContent, 10) || 0;
                        setFormData({ ...formData, price: numericValue });
                      }}
                      className="input-field"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Kategori</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                      className="input-field appearance-none"
                    >
                      <option value="" className="bg-gray-800 text-white">Pilih Kategori</option>
                      {productCategories.map((cat) => (
                        <option key={cat} value={cat} className="bg-gray-800 text-white">{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Min. Order</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formData.minOrder.toString().replace(/^0+/, '')}
                      onChange={(e) => setFormData({ ...formData, minOrder: Math.max(1, parseInt(e.target.value) || 0) })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Stok</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.stock.toString().replace(/^0+/, '') || (formData.stock === 0 ? '0' : '')}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                          setFormData({ ...formData, stock: 0 });
                        } else {
                          setFormData({ ...formData, stock: parseInt(val, 10) || 0 });
                        }
                      }}
                      className="input-field"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Gambar Produk (Max 5)</label>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-2">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-white/10">
                        <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                            title="Hapus Gambar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {formData.images.length < 5 && (
                      <div
                        onClick={() => !uploadingImage && fileInputRef.current?.click()}
                        className={`aspect-square border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer ${uploadingImage ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500/30 bg-white/5 hover:bg-white/10'}`}
                      >
                        {uploadingImage ? (
                          <Loader2 size={24} className="text-blue-500 mb-2 animate-spin" />
                        ) : (
                          <ImageIcon size={24} className="text-gray-500 mb-2" />
                        )}
                        <span className="text-gray-400 text-xs text-center px-2">{uploadingImage ? 'Mengunggah...' : 'Klik untuk tambah gambar'}</span>
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={isSaving || uploadingImage} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {editingProduct ? 'Simpan Perubahan' : 'Tambah Produk'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} disabled={isSaving} className="btn-secondary flex-1">
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
