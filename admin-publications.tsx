
import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, ExternalLink, Loader2, AlertCircle, BookOpen } from 'lucide-react';
import { supabase } from './lib/supabase.ts';
import { Publication } from './types.ts';

const AdminPublications: React.FC = () => {
  const [search, setSearch] = useState('');
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPubs = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.from('publications').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setPublications(data || []);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError("डेटा लोड करने में विफल: " + (err.message || "Network Error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPubs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("क्या आप वाकई इस प्रकाशन को हटाना चाहते हैं?")) return;
    try {
      const { error } = await supabase.from('publications').delete().eq('id', id);
      if (error) throw error;
      fetchPubs();
    } catch (err: any) {
      alert("डिलीट करने में त्रुटि: " + err.message);
    }
  };

  const handleAdd = async () => {
    const title = prompt("पत्रिका का शीर्षक:");
    if (!title) return;
    const url = prompt("Flipbook URL (e.g., https://online.anyflip.com/...):");
    if (!url) return;
    const cover = prompt("कवर इमेज URL (वैकल्पिक):");

    try {
      const { error } = await supabase.from('publications').insert({
        title,
        flipbook_url: url,
        cover_url: cover || '',
        category: 'पत्रिका',
        year: new Date().getFullYear().toString(),
        is_latest: true
      });

      if (error) throw error;
      fetchPubs();
    } catch (err: any) {
      console.error("Save Error:", err);
      alert("डेटा सेव करने में त्रुटि: " + err.message);
    }
  };

  const filtered = publications.filter(p => (p.title || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-blue-600 text-sm font-devanagari flex items-center gap-2 mb-1">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div> डिजिटल आर्काइव प्रबंधन
          </span>
          <h1 className="text-4xl font-black text-slate-800 font-devanagari tracking-tight">प्रकाशन प्रबंधन</h1>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-[1.5rem] font-bold font-devanagari flex items-center gap-2 shadow-xl shadow-blue-200 transition-all active:scale-95 group"
        >
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-90 transition-transform">
             <Plus size={20} />
          </div>
          <span>नया प्रकाशन जोड़ें</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-center gap-4 text-red-600 font-devanagari shadow-sm">
          <AlertCircle size={24} />
          <p className="font-bold">{error}</p>
        </div>
      )}

      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4 group">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-focus-within:bg-blue-50 group-focus-within:text-blue-600 transition-all">
          <Search size={22} />
        </div>
        <input 
          type="text"
          placeholder="पत्रिका का शीर्षक या वर्ष से खोजें..."
          className="flex-1 outline-none text-slate-700 font-devanagari text-lg bg-transparent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-80 gap-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              <BookOpen className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600" size={24} />
            </div>
            <p className="text-slate-400 font-devanagari text-lg animate-pulse">लाइब्रेरी लोड हो रही है...</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 font-devanagari text-[10px] uppercase tracking-[0.2em] font-black border-b border-slate-100">
              <tr>
                <th className="px-8 py-6">कवर इमेज</th>
                <th className="px-8 py-6">पत्रिका जानकारी</th>
                <th className="px-8 py-6 text-center">एक्सेस लिंक</th>
                <th className="px-8 py-6 text-right">एक्शन</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-6">
                    <div className="w-14 h-20 rounded-xl overflow-hidden shadow-md border-2 border-white group-hover:scale-105 transition-transform duration-500">
                      <img 
                        src={p.cover_url || 'https://via.placeholder.com/100x140?text=No+Cover'} 
                        alt="cover" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-800 font-devanagari text-lg">{p.title}</span>
                      {p.is_latest && (
                        <span className="bg-green-100 text-green-600 text-[10px] px-2 py-1 rounded-lg font-black font-devanagari uppercase tracking-widest">नवीनतम</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 font-devanagari mt-1">{p.category} (MAGAZINE) • {p.year} विशेषांक</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                     <a 
                      href={p.flipbook_url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold font-devanagari text-sm transition-all bg-blue-50 px-4 py-2 rounded-xl border border-blue-100"
                     >
                       <ExternalLink size={16} /> लिंक खोलें
                     </a>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                      </button>
                      <button 
                        className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all" 
                        onClick={() => handleDelete(p.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-4 text-slate-300">
                      <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center">
                        <Search size={32} />
                      </div>
                      <p className="font-devanagari text-xl">कोई डेटा नहीं मिला।</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPublications;
