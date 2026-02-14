
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LogOut, Database, AlertCircle, CheckCircle2, Save, RefreshCcw } from 'lucide-react';
import { ADMIN_SIDEBAR_LINKS } from './constants.tsx';
import { isSupabaseConfigured, saveSupabaseConfig, clearSupabaseConfig } from './lib/supabase.ts';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const isConnected = isSupabaseConfigured();
  const [setupUrl, setSetupUrl] = useState('');
  const [setupKey, setSetupKey] = useState('');

  const handleSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupUrl || !setupKey) {
      alert("कृपया दोनों फील्ड भरें।");
      return;
    }
    saveSupabaseConfig(setupUrl, setupKey);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f172a] text-slate-300 flex flex-col fixed inset-y-0 left-0 z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">A</div>
          <h1 className="text-xl font-bold text-white font-devanagari">एडमिन कंसोल</h1>
        </div>

        <nav className="flex-1 mt-4 px-3 space-y-1">
          {ADMIN_SIDEBAR_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-devanagari ${
                location.pathname === link.path || (link.path !== '/admin' && location.pathname.startsWith(link.path))
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-4">
          <div className={`flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-devanagari ${isConnected ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {isConnected ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            <span>{isConnected ? 'Supabase कनेक्टेड है' : 'Supabase डिस्कनेक्टेड'}</span>
          </div>

          {isConnected && (
            <button 
              onClick={clearSupabaseConfig}
              className="flex items-center gap-3 px-4 py-2 w-full text-slate-500 hover:text-white text-xs font-devanagari transition-colors"
            >
              <RefreshCcw size={14} />
              <span>कनेक्शन रीसेट करें</span>
            </button>
          )}

          <button className="flex items-center gap-3 px-4 py-2 w-full text-red-400 hover:bg-red-500/10 rounded-lg transition-colors font-devanagari">
            <LogOut size={20} />
            <span>लॉगआउट करें</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8 overflow-y-auto">
        {!isConnected ? (
          <div className="max-w-2xl mx-auto mt-10 space-y-8 animate-fade-in">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
               <div className="flex flex-col items-center text-center mb-8">
                  <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                     <Database size={40} />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 font-devanagari">डेटाबेस सेटअप करें</h2>
                  <p className="text-slate-500 mt-2 font-devanagari">एडमिन पैनल शुरू करने के लिए Supabase क्रेडेंशियल डालें</p>
               </div>

               <form onSubmit={handleSetup} className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-700 font-devanagari ml-1">Supabase URL</label>
                     <input 
                       type="text" 
                       placeholder="https://xyz.supabase.co"
                       className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-100 transition-all font-mono text-sm"
                       value={setupUrl}
                       onChange={(e) => setSetupUrl(e.target.value)}
                       required
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-700 font-devanagari ml-1">Anon Public Key</label>
                     <input 
                       type="password" 
                       placeholder="eyJhbGciOiJIUzI1Ni..."
                       className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-100 transition-all font-mono text-sm"
                       value={setupKey}
                       onChange={(e) => setSetupKey(e.target.value)}
                       required
                     />
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl text-amber-700 text-sm font-devanagari flex gap-3">
                     <AlertCircle className="shrink-0" size={18} />
                     <p>यह जानकारी आपके ब्राउज़र में सुरक्षित सेव होगी। अगर आप ब्राउज़र डेटा साफ़ करेंगे, तो आपको इसे फिर से डालना होगा।</p>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-bold font-devanagari shadow-xl shadow-blue-200 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                  >
                    <Save size={20} />
                    कॉन्फ़िगरेशन सेव करें
                  </button>
               </form>
               
               <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                  <p className="text-slate-400 text-xs font-devanagari">
                    कहाँ मिलेगा? Supabase Project &rarr; Settings &rarr; API
                  </p>
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

export default AdminLayout;
