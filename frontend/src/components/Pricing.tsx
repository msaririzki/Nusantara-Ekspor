import { Check, Star, Zap, Crown } from 'lucide-react';

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Free',
    price: 'Rp 0',
    period: '/bulan',
    description: 'Cocok untuk UMKM yang baru mulai ekspor',
    features: [
      'Upload hingga 5 produk',
      'Akses katalog dasar',
      'Chat B2B terjemahan otomatis',
      'Support email',
      'Analytics dasar'
    ],
    cta: 'Mulai Gratis',
    icon: Star
  },
  {
    name: 'Premium',
    price: 'Rp 299.000',
    period: '/bulan',
    description: 'Untuk UMKM yang serius mengembangkan ekspor',
    features: [
      'Upload hingga 50 produk',
      'Akses katalog premium',
      'Chat B2B prioritas',
      'AI Market Intelligence',
      'Analytics lanjutan',
      'Support prioritas',
      'Custom branding'
    ],
    popular: true,
    cta: 'Pilih Premium',
    icon: Zap
  },
  {
    name: 'Medium',
    price: 'Rp 99.000',
    period: '/bulan',
    description: 'Untuk UMKM yang mulai berkembang',
    features: [
      'Upload hingga 20 produk',
      'Akses katalog standar',
      'Chat B2B terjemahan prioritas',
      'Analytics menengah',
      'Support chat',
      'Marketing tools dasar'
    ],
    cta: 'Pilih Medium',
    icon: Crown
  }
];

export default function Pricing() {
  return (
    <section className="py-20 lg:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="badge-blue mb-4 inline-flex">
            <Star size={14} className="mr-1.5" />
            Paket Layanan
          </div>
          <h2 className="section-heading text-white mb-4">
            Pilih Paket yang <span className="gradient-text">Tepat</span> untuk Bisnis Anda
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Mulai dari gratis hingga solusi enterprise. Semua paket dirancang untuk membantu UMKM Indonesia sukses di pasar global.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start"> {/* Tambahkan items-start agar kartu tidak stretching aneh */}
          {pricingTiers.map((tier, index) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.name}
                /* PERBAIKAN: overflow-hidden dihapus jika tier.popular, dan z-index ditingkatkan */
                className={`glass-card relative group transition-all duration-300 ${
                  tier.popular 
                    ? 'ring-2 ring-blue-500/50 shadow-2xl shadow-blue-500/40 z-20 scale-105' 
                    : 'overflow-hidden z-10'
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {tier.popular && (
                  /* PERBAIKAN: Memastikan badge berada di paling atas (z-30) */
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 w-full flex justify-center">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-xl tracking-wide border border-white/20">
                      Paling Populer
                    </div>
                  </div>
                )}

                <div className={`p-8 ${tier.popular ? 'pt-10' : ''}`}>
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl mb-6 mx-auto shadow-lg">
                    <Icon size={24} className="text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-white text-center mb-2">{tier.name}</h3>
                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold gradient-text">{tier.price}</span>
                    <span className="text-gray-400">{tier.period}</span>
                  </div>
                  <p className="text-gray-400 text-center mb-6 text-sm">{tier.description}</p>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <Check size={16} className="text-emerald-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 ${
                      tier.popular
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:scale-[1.02] shadow-lg shadow-blue-500/25'
                        : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {tier.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400">
            Butuh bantuan memilih paket?{' '}
            <a href="mailto:support@nusantaraekspor.com" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
              Hubungi tim kami
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}