
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, ArrowLeft, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (status: boolean) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    // Default Security Check (Can be changed to Supabase Auth later)
    setTimeout(() => {
      // Updated Master Password as requested: shreekrishnshreeradha@piyush
      if (password === 'shreekrishnshreeradha@piyush') { 
        onLogin(true);
        localStorage.setItem('isAdminAuthenticated', 'true');
        navigate('/admin');
      } else {
        setError(true);
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/10 rounded-full blur-[120px]"></div>

      <div className="max-w-md w-full space-y-8 relative z-10 animate-fade-in">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-[2rem] shadow-2xl shadow-blue-500/20 mb-6 border border-white/10">
             <ShieldCheck className="text-white" size={40} />
          </div>
          <h2 className="text-3xl font-black text-white font-devanagari tracking-tight">एडमिन लॉगिन</h2>
          <p className="text-slate-400 mt-2 font-devanagari">सिर्फ अधिकृत व्यक्तियों के लिए पहुँच</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 shadow-2xl space-y-6">
          <div className="space-y-4">
            <div className="relative group">
               <User className="absolute left-4 top-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
               <input 
                 type="text" 
                 disabled
                 value="admin_user"
                 className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-slate-400 font-mono text-sm outline-none cursor-not-allowed"
               />
            </div>
            <div className="relative group">
               <Lock className="absolute left-4 top-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
               <input 
                 type="password" 
                 placeholder="पासवर्ड दर्ज करें"
                 className={`w-full bg-slate-900/50 border ${error ? 'border-red-500/50 ring-2 ring-red-500/10' : 'border-white/5 group-hover:border-white/20'} rounded-2xl py-4 pl-12 pr-4 text-white font-devanagari outline-none focus:ring-4 focus:ring-blue-500/10 transition-all`}
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 autoFocus
               />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs font-devanagari bg-red-500/10 p-3 rounded-xl border border-red-500/20">
               <AlertCircle size={14} />
               <span>गलत पासवर्ड! कृपया पुनः प्रयास करें।</span>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-bold font-devanagari text-lg shadow-xl shadow-blue-900/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'लॉगिन करें'}
          </button>
        </form>

        <div className="text-center">
           <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors font-devanagari text-sm">
              <ArrowLeft size={16} /> वेबसाइट पर वापस जाएं
           </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
