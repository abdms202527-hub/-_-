
import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Trash2, Clock, Loader2, AlertCircle } from 'lucide-react';
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
      alert("सूचना सफलतापूर्वक जोड़ दी गई है।");
    } catch (err: any) {
      console.error("Add Notice Error:", err);
      alert("सूचना जोड़ने में त्रुटि: " + (err.message || "Failed to fetch. जाँचें कि Supabase सही से जुड़ा है।"));
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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800 font-devanagari">सूचना प्रबंधन</h1>

      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600 font-devanagari">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 text-blue-600">
               <Megaphone size={20} />
               <h3 className="font-bold font-devanagari">नई सूचना जारी करें</h3>
            </div>
            <textarea 
              placeholder="यहाँ सूचना टाइप करें जो वेबसाइट के टिकर में दिखाई देगी..."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 h-40 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-devanagari text-slate-600 resize-none"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
            <button 
              onClick={handleAdd}
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold font-devanagari shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
              सूचना सूची में जोड़ें
            </button>
         </div>

         <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 font-devanagari mb-6 uppercase tracking-wider">सक्रिय सूचनाएं (ACTIVE)</h3>
            <div className="space-y-4">
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <Loader2 className="animate-spin text-blue-600" />
                </div>
              ) : notices.length > 0 ? (
                notices.map((notice) => (
                  <div key={notice.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-4 group">
                    <div className="flex-1">
                      <p className="font-devanagari text-slate-700">{notice.content}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-[10px] text-slate-400 font-devanagari">
                          <Clock className="inline mr-1" size={12} /> {new Date(notice.created_at).toLocaleDateString()}
                        </span>
                        <button onClick={() => handleDelete(notice.id)} className="text-[10px] text-red-400 font-devanagari hover:underline opacity-0 group-hover:opacity-100 transition-opacity">हटाएं</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-300">
                   <p className="font-devanagari">कोई सक्रिय सूचना नहीं है।</p>
                </div>
              )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminNotices;
