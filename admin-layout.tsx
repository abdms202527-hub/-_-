
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LogOut, Home, Database, Menu, X, ChevronRight } from 'lucide-react';
import { ADMIN_SIDEBAR_LINKS } from './constants.tsx';
import { isSupabaseConfigured } from './lib/supabase.ts';

interface AdminLayoutProps {
  onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ onLogout }) => {
  const location = useLocation();
  const isConnected = isSupabaseConfigured();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 overflow-x-hidden">
      {/* Mobile Header / Navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-[#0f172a] z-[60] flex items-center justify-between px-6 border-b border-white/5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-lg border border-white/10">A</div>
          <h1 className="text-lg font-black text-white font-devanagari tracking-tight leading-none">एडमिन पैनल</h1>
        </div>
        <button 
          onClick={toggleSidebar}
          className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white active:scale-90 transition-transform"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar - Responsive implementation */}
      <aside className={`
        fixed lg:sticky top-0 inset-y-0 left-0 z-[70] 
        w-72 bg-[#0f172a] text-slate-300 flex flex-col 
        transition-transform duration-500 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        border-r border-white/5 shadow-2xl
      `}>
        {/* Sidebar Header */}
        <div className="p-8 hidden lg:flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/40 border border-white/10">A</div>
          <div>
            <h1 className="text-xl font-black text-white font-devanagari leading-none">एडमिन कंसोल</h1>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Administrator</p>
          </div>
        </div>

        {/* Back to Site Button */}
        <div className="px-4 mt-20 lg:mt-0 mb-6">
           <Link to="/" className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-slate-800/30 hover:bg-slate-800 text-slate-400 hover:text-white transition-all font-devanagari text-sm border border-white/5 group">
              <Home size={18} />
              <span className="font-bold flex-1">वेबसाइट पर वापस जाएं</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
           </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          {ADMIN_SIDEBAR_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-devanagari ${
                location.pathname === link.path || (link.path !== '/admin' && location.pathname.startsWith(link.path))
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 font-bold'
                  : 'hover:bg-slate-800/50 hover:text-white text-slate-400'
              }`}
            >
              <div className={location.pathname === link.path ? 'scale-110 transition-transform' : ''}>
                {link.icon}
              </div>
              <span className="text-sm">{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer Area */}
        <div className="p-6 border-t border-white/5 space-y-6">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest font-devanagari ${isConnected ? 'bg-green-500/10 text-green-400 border border-green-500/10' : 'bg-red-500/10 text-red-400 border border-red-500/10'}`}>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span>{isConnected ? 'सिस्टम ऑनलाइन' : 'सिस्टम ऑफलाइन'}</span>
          </div>

          <button 
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 rounded-2xl transition-all font-devanagari text-sm font-bold border border-transparent hover:border-red-500/20 active:scale-95"
          >
            <LogOut size={20} />
            <span>लॉगआउट करें</span>
          </button>
        </div>
      </aside>

      {/* Sidebar Overlay (Mobile Only) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[65] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full min-h-screen lg:p-10 p-4 pt-24 lg:pt-10 overflow-x-hidden">
        <div className="max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
