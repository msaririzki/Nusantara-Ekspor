// ==========================================
// Nusantara Ekspor - Footer Component
// ==========================================

import { Link } from 'react-router-dom';
import { Globe, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold font-display text-white">Nusantara</span>
                <span className="text-[10px] font-medium text-blue-400 -mt-1 tracking-widest uppercase">Ekspor</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Platform digital untuk membantu UMKM Indonesia membawa produk kebanggaan ke pasar global.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Powered by</span>
              <span className="badge-blue text-[10px]">Gemini AI</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Menu</h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Beranda' },
                { to: '/catalog', label: 'Katalog Produk' },
                { to: '/chat', label: 'Chat B2B' },
                { to: '/dashboard', label: 'Dashboard UMKM' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-gray-400 text-sm hover:text-blue-400 transition-colors flex items-center gap-1.5">
                    <ExternalLink size={12} />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Sumber Daya</h3>
            <ul className="space-y-2">
              {['Panduan Ekspor', 'Regulasi Perdagangan', 'FAQ', 'Blog & Artikel'].map((item) => (
                <li key={item}>
                  <span className="text-gray-400 text-sm hover:text-blue-400 transition-colors cursor-pointer flex items-center gap-1.5">
                    <ExternalLink size={12} />
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">Jakarta, Indonesia</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={14} className="text-blue-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">hello@nusantaraekspor.id</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="text-blue-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+62 21 1234 5678</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Globe size={14} className="text-blue-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">www.nusantaraekspor.id</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            © 2025 Nusantara Ekspor. All rights reserved. 🇮🇩
          </p>
          <p className="text-gray-600 text-xs">
            Dibangun dengan ❤️ untuk UMKM Indonesia oleh GenBI
          </p>
        </div>
      </div>
    </footer>
  );
}
