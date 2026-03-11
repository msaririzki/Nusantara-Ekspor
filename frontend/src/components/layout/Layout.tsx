// ==========================================
// Nusantara Ekspor - Layout Component
// ==========================================

import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatbotWidget from '../chatbot/ChatbotWidget';

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 lg:pt-20">
        <Outlet />
      </main>
      <Footer />
      <ChatbotWidget />
    </div>
  );
}
