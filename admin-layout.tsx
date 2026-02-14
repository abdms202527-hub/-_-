
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LogOut, Home, Database, AlertCircle, CheckCircle2, Globe, Server, Copy, Check } from 'lucide-react';
import { ADMIN_SIDEBAR_LINKS } from './constants.tsx';
import { isSupabaseConfigured } from './lib/supabase.ts';

const AdminLayout: React.FC = () => {
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
      {/* Sidebar - Matching Image Style */}
      <aside className="w-72 bg-[#0f172a] text-slate-300 flex flex-col fixed inset-y-0 left-0 z-50">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/30">A</div>
          <h1 className="text-2xl font-bold text-white font-devanagari">एडमिन कंसोल</h1>
        </div>

        <div className="px-4 mb-4">
           <Link to="/" className="flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-300 transition-all font-devanagari text-sm border border-slate-700/50">
              <Home size={18} />
              <span>वेबसाइट पर वापस जाएं</span>
           </Link>
        </div>

        <nav className="flex-1 mt-4 px-4 space-y-2">
          {ADMIN_SIDEBAR_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-devanagari ${
                location.pathname === link.path || (link.path !== '/admin' && location.pathname.startsWith(link.path))
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30'
                  : 'hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              {link.icon}
              <span className="font-medium">{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800 space-y-6">
          <div className={`flex items-center gap-3 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest font-devanagari ${isConnected ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
            <span>{isConnected ? 'सिस्टम ऑनलाइन' : 'सिस्टम ऑफलाइन'}</span>
          </div>

          <Link to="/" className="flex items-center gap-3 px-2 text-red-400 hover:text-red-300 transition-colors font-devanagari text-sm font-bold">
            <LogOut size={20} />
            <span>लॉगआउट करें</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 flex-1 p-10 overflow-y-auto">
        {!isConnected ? (
          <div className="max-w-3xl mx-auto mt-4 space-y-8">
             {/* Same Deployment Guide as before */}
             <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden">
                <div className="relative z-10 space-y-8">
                   <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center">
                         <Database size={32} />
                      </div>
                      <h2 className="text-3xl font-black text-slate-800 font-devanagari uppercase tracking-tight">डेटाबेस कॉन्फ़िगरेशन</h2>
                   </div>
                   <p className="text-slate-500 font-devanagari text-lg leading-relaxed">15,000+ यूज़र्स के लिए इस ऐप को सक्रिय करने के लिए Vercel Dashboard में निम्नलिखित वेरिएबल्स सेट करें:</p>
                   
                   <div className="bg-slate-900 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
                      <EnvRow label="SUPABASE_URL" value="आपका Supabase URL" onCopy={() => copyToClipboard('SUPABASE_URL', 'url')} isCopied={copied === 'url'} />
                      <EnvRow label="SUPABASE_ANON_KEY" value="आपका Anon Public Key" onCopy={() => copyToClipboard('SUPABASE_ANON_KEY', 'key')} isCopied={copied === 'key'} />
                   </div>

                   <a href="https://vercel.com/dashboard" target="_blank" rel="noreferrer" className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-3xl font-bold font-devanagari text-xl shadow-2xl shadow-blue-200 transition-all active:scale-[0.98]">
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
  <div className="flex items-center justify-between bg-white/5 p-5 rounded-2xl border border-white/10 group">
    <div>
      <code className="text-blue-400 font-bold text-lg">{label}</code>
      <p className="text-slate-500 text-xs mt-1 uppercase">{value}</p>
    </div>
    <button onClick={onCopy} className={`p-3 rounded-xl transition-all ${isCopied ? 'bg-green-500 text-white' : 'bg-white/10 text-slate-400 group-hover:bg-white/20'}`}>
      {isCopied ? <Check size={20} /> : <Copy size={20} />}
    </button>
  </div>
);

export default AdminLayout;
