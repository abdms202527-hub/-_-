
// Import React to resolve namespace error for React.FC usage
import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
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
      alert("डेटा सेव करने में त्रुटि: " + (err.message || "Failed to fetch. जाँचें कि Supabase URL सही है या नहीं।"));
    }
  };

  const filtered = publications.filter(p => (p.title || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-blue-600 text-sm font-devanagari flex items-center gap-2">
             <div className="w-1 h-1 rounded-full bg-blue-600"></div> डिजिटल आर्काइव
          </span>
          <h1 className="text-3xl font-bold text-slate-800 font-devanagari">प्रकाशन प्रबंधन</h1>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold font-devanagari flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          <Plus size={20} /> नया प्रकाशन जोड़ें
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600 font-devanagari">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
        <Search className="text-slate-400" size={20} />
        <input 
          type="text"
          placeholder="शीर्षक से खोजें..."
          className="flex-1 outline-none text-slate-600 font-devanagari"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 className="animate-spin text-blue-600" size={32} />
            <p className="text-slate-400 font-devanagari">लोड हो रहा है...</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 font-devanagari text-sm">
              <tr>
                <th className="px-6 py-4">कवर</th>
                <th className="px-6 py-4">पत्रिका जानकारी</th>
                <th className="px-6 py-4 text-center">लिंक</th>
                <th className="px-6 py-4 text-right">एक्शन</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <img src={p.cover_url || 'https://via.placeholder.com/50x70?text=No+Img'} alt="cover" className="w-10 h-14 rounded object-cover shadow" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 font-devanagari">{p.title}</span>
                      {p.is_latest && <span className="bg-green-100 text-green-600 text-[10px] px-1.5 py-0.5 rounded font-bold font-devanagari">नवीनतम</span>}
                    </div>
                    <p className="text-xs text-slate-400 font-devanagari">{p.category} • {p.year}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                     <a href={p.flipbook_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center justify-center gap-1 text-sm font-devanagari">
                       <ExternalLink size={14} /> देखें
                     </a>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg" onClick={() => handleDelete(p.id)}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-400 font-devanagari">कोई डेटा नहीं मिला।</td>
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
