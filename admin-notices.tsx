
import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Trash2, Clock, Loader2, AlertCircle, Bell } from 'lucide-react';
import { supabase } from './lib/supabase.ts';
import { Notice } from './types.ts';

const AdminNotices: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [newContent, setNewContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.from('notices').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setNotices(data);
    } catch (err: any) {
      console.error("Notice fetch error", err);
      setError("सूचनाएं लोड करने में विफल: " + (err.message || "Network Error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleAdd = async () => {
    if (!newContent.trim()) {
       alert("कृपया सूचना टाइप करें।");
       return;
    }
    try {
      setSaving(true);
      const { error: insertError } = await supabase.from('notices').insert({ 
        content: newContent, 
        active: true 
      });
      
      if (insertError) throw insertError;
      
      setNewContent('');
      fetchNotices();
    } catch (err: any) {
      console.error("Add Notice Error:", err);
      alert("सूचना जोड़ने में त्रुटि: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("क्या आप इस सूचना को हटाना चाहते हैं?")) return;
    try {
      const { error } = await supabase.from('notices').delete().eq('id', id);
      if (error) throw error;
      fetchNotices();
    } catch (err: any) {
      alert("डिलीट करने में त्रुटि: " + err.message);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div>
        <span className="text-blue-600 text-sm font-devanagari flex items-center gap-2 mb-1">
           <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div> वेबसाइट सूचनाएं
        </span>
        <h1 className="text-4xl font-black text-slate-800 font-devanagari tracking-tight">सूचना प्रबंधन</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-center gap-4 text-red-600 font-devanagari shadow-sm">
          <AlertCircle size={24} />
          <p className="font-bold">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {/* Input Card */}
         <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-[60px] opacity-50 -mr-16 -mt-16"></div>
            <div className="flex items-center gap-4 text-blue-600 relative z-10">
               <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <Megaphone size={24} />
               </div>
               <h3 className="text-xl font-bold font-devanagari">नई सूचना जारी करें</h3>
            </div>
            
            <textarea 
              placeholder="यहाँ सूचना टाइप करें जो वेबसाइट के टिकर में दिखाई देगी..."
              className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] p-8 h-48 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-devanagari text-slate-600 text-lg resize-none placeholder:text-slate-300"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
            
            <button 
              onClick={handleAdd}
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-2xl font-bold font-devanagari text-xl shadow-xl shadow-blue-200 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={24} /> : <Plus size={24} />}
              <span>सूचना सूची में जोड़ें</span>
            </button>
         </div>

         {/* List Card */}
         <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xs font-black text-slate-400 font-devanagari uppercase tracking-[0.2em]">सक्रिय सूचनाएं (ACTIVE)</h3>
               <div className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-green-100">Live</div>
            </div>
            
            <div className="space-y-4 overflow-y-auto pr-2 max-h-[500px] flex-1">
              {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4 text-slate-300">
                  <Loader2 className="animate-spin text-blue-600" size={32} />
                  <p className="font-devanagari">लोड हो रहा है...</p>
                </div>
              ) : notices.length > 0 ? (
                notices.map((notice) => (
                  <div key={notice.id} className="p-6 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] flex items-start gap-4 group hover:bg-white hover:shadow-lg hover:shadow-slate-100 transition-all duration-300">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 shrink-0">
                       <Bell size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="font-devanagari text-slate-700 leading-relaxed text-sm">{notice.content}</p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-[10px] text-slate-400 font-devanagari flex items-center gap-2">
                          <Clock size={12} /> {new Date(notice.created_at).toLocaleDateString('hi-IN')}
                        </span>
                        <button 
                          onClick={() => handleDelete(notice.id)} 
                          className="text-[10px] text-red-400 font-black font-devanagari hover:text-red-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity p-1"
                        >
                          हटाएं
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-80 flex flex-col items-center justify-center text-slate-300 gap-4">
                   <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center">
                     <Bell size={32} />
                   </div>
                   <p className="font-devanagari text-lg">कोई सक्रिय सूचना नहीं है।</p>
                </div>
              )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminNotices;
