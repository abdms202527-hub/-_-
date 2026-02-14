
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LogOut, Home, Database, AlertCircle, CheckCircle2, Globe, Server, Copy, Check } from 'lucide-react';
import { ADMIN_SIDEBAR_LINKS } from './constants.tsx';
import { isSupabaseConfigured } from './lib/supabase.ts';

interface AdminLayoutProps {
  onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ onLogout }) => {
  const location = useLocation();
  const isConnected = isSupabaseConfigured();
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900">
      {/* Sidebar - Precise Image Matching */}
      <aside className="w-72 bg-[#0f172a] text-slate-300 flex flex-col fixed inset-y-0 left-0 z-50 border-r border-white/5 shadow-2xl">
        <div className="p-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/40 border border-white/10">A</div>
          <div>
            <h1 className="text-xl font-black text-white font-devanagari leading-none">एडमिन कंसोल</h1>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Administrator</p>
          </div>
        </div>

        <div className="px-4 mb-6">
           <Link to="/" className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-slate-800/30 hover:bg-slate-800 text-slate-400 hover:text-white transition-all font-devanagari text-sm border border-white/5">
              <Home size={18} />
              <span className="font-bold">वेबसाइट पर वापस जाएं</span>
           </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {ADMIN_SIDEBAR_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-devanagari ${
                location.pathname === link.path || (link.path !== '/admin' && location.pathname.startsWith(link.path))
                  ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30 font-bold'
                  : 'hover:bg-slate-800/50 hover:text-white text-slate-400'
              }`}
            >
              {link.icon}
              <span className="text-sm">{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-6">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest font-devanagari ${isConnected ? 'bg-green-500/10 text-green-400 border border-green-500/10' : 'bg-red-500/10 text-red-400 border border-red-500/10'}`}>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span>{isConnected ? 'सिस्टम ऑनलाइन' : 'सिस्टम ऑफलाइन'}</span>
          </div>

          <button 
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 rounded-2xl transition-all font-devanagari text-sm font-bold border border-transparent hover:border-red-500/20"
          >
            <LogOut size={20} />
            <span>लॉगआउट करें</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 flex-1 p-10 overflow-y-auto">
        {!isConnected ? (
          <div className="max-w-3xl mx-auto mt-4 space-y-8 animate-fade-in">
             <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 relative overflow-hidden">
                <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-blue-50 rounded-full blur-[80px] opacity-50"></div>
                <div className="relative z-10 space-y-8">
                   <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center shadow-inner">
                         <Database size={36} />
                      </div>
                      <h2 className="text-4xl font-black text-slate-800 font-devanagari tracking-tight">डेटाबेस कॉन्फ़िगरेशन</h2>
                   </div>
                   <p className="text-slate-500 font-devanagari text-xl leading-relaxed">
                     आपके डिजिटल आर्काइव को 15,000 यूज़र्स के लिए सक्रिय करने हेतु Vercel में ये कुंजियाँ (Keys) जोड़ें:
                   </p>
                   
                   <div className="bg-[#0f172a] rounded-[2.5rem] p-10 space-y-6 shadow-2xl">
                      <EnvRow label="SUPABASE_URL" value="Project URL (from Supabase)" onCopy={() => copyToClipboard('SUPABASE_URL', 'url')} isCopied={copied === 'url'} />
                      <EnvRow label="SUPABASE_ANON_KEY" value="Anon Public Key (from Supabase)" onCopy={() => copyToClipboard('SUPABASE_ANON_KEY', 'key')} isCopied={copied === 'key'} />
                   </div>

                   <a href="https://vercel.com/dashboard" target="_blank" rel="noreferrer" className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-[2rem] font-bold font-devanagari text-xl shadow-2xl shadow-blue-200 transition-all active:scale-[0.98]">
                      Vercel सेटिंग्स खोलें
                   </a>
                </div>
             </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

const EnvRow = ({ label, value, onCopy, isCopied }: { label: string, value: string, onCopy: () => void, isCopied: boolean }) => (
  <div className="flex items-center justify-between bg-white/5 p-6 rounded-3xl border border-white/10 group hover:bg-white/10 transition-colors">
    <div>
      <code className="text-blue-400 font-bold text-xl block mb-1">{label}</code>
      <p className="text-slate-500 text-xs font-devanagari uppercase tracking-widest">{value}</p>
    </div>
    <button onClick={onCopy} className={`p-4 rounded-2xl transition-all ${isCopied ? 'bg-green-500 text-white scale-110 shadow-lg' : 'bg-white/10 text-slate-400 group-hover:bg-white/20'}`}>
      {isCopied ? <Check size={24} /> : <Copy size={24} />}
    </button>
  </div>
);

export default AdminLayout;
