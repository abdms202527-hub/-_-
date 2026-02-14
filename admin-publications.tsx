
import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit2, ExternalLink, Loader2, AlertCircle, BookOpen, X, Image as ImageIcon, Check, Calendar, Tag, Link as LinkIcon, Type, Sparkles } from 'lucide-react';
import { supabase } from './lib/supabase.ts';
import { Publication } from './types.ts';

// सुरक्षित प्लेसहोल्डर इमेज
const BOOK_PLACEHOLDER = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=200&auto=format&fit=crop";

const AdminPublications: React.FC = () => {
  const [search, setSearch] = useState('');
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(['पत्रिका', 'विशेषांक']);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  const initialFormState = {
    title: '',
    category: 'पत्रिका',
    year: new Date().getFullYear().toString(),
    flipbook_url: '',
    cover_url: '',
    description: '',
    is_latest: true
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchPubs = async () => {
    try {
      setLoading(true);
      setError(null);
      const [pubRes, settingsRes] = await Promise.all([
        supabase.from('publications').select('*').order('created_at', { ascending: false }),
        supabase.from('site_settings').select('value').eq('key', 'publication_categories').maybeSingle()
      ]);

      if (pubRes.error) throw pubRes.error;
      setPublications(pubRes.data || []);
      
      if (settingsRes.data && settingsRes.data.value) {
        const parsedCats = JSON.parse(settingsRes.data.value);
        setCategories(parsedCats);
        if (!editingId) setFormData(prev => ({ ...prev, category: parsedCats[0] || 'पत्रिका' }));
      }
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

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ ...initialFormState, category: categories[0] || 'पत्रिका' });
    setIsModalOpen(true);
  };

  const openEditModal = (pub: Publication) => {
    setEditingId(pub.id);
    setFormData({
      title: pub.title || '',
      category: pub.category || 'पत्रिका',
      year: pub.year || '',
      flipbook_url: pub.flipbook_url || '',
      cover_url: pub.cover_url || '',
      description: pub.description || '',
      is_latest: pub.is_latest ?? true
    });
    setIsModalOpen(true);
  };

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.flipbook_url) {
      alert("कृपया शीर्षक और लिंक URL अवश्य भरें।");
      return;
    }

    try {
      setSaving(true);
      
      const payload = editingId 
        ? { ...formData, id: editingId, updated_at: new Date().toISOString() }
        : formData;

      const { error } = await supabase.from('publications').upsert(payload);

      if (error) throw error;
      
      setIsModalOpen(false);
      fetchPubs();
      alert(editingId ? "प्रकाशन सफलतापूर्वक अपडेट किया गया!" : "नया प्रकाशन सफलतापूर्वक जोड़ा गया!");
    } catch (err: any) {
      console.error("Save Error:", err);
      alert("डेटा सेव करने में त्रुटि: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const filtered = publications.filter(p => 
    (p.title || '').toLowerCase().includes(search.toLowerCase()) || 
    (p.year || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in pb-10 relative">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-blue-600 text-sm font-devanagari flex items-center gap-2 mb-1">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div> डिजिटल आर्काइव प्रबंधन
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 font-devanagari tracking-tight">प्रकाशन प्रबंधन</h1>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-[1.5rem] font-bold font-devanagari flex items-center justify-center gap-2 shadow-xl shadow-blue-200 transition-all active:scale-95 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          <span>नया प्रकाशन जोड़ें</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-center gap-4 text-red-600 font-devanagari shadow-sm">
          <AlertCircle size={24} />
          <p className="font-bold">{error}</p>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4 group">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-focus-within:bg-blue-50 group-focus-within:text-blue-600 transition-all shrink-0">
          <Search size={20} />
        </div>
        <input 
          type="text"
          placeholder="पत्रिका का शीर्षक या वर्ष से खोजें..."
          className="flex-1 outline-none text-slate-700 font-devanagari text-base md:text-lg bg-transparent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Desktop View Table */}
      <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-80 gap-6">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-slate-400 font-devanagari text-lg animate-pulse">लाइब्रेरी लोड हो रही है...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-slate-50/50 text-slate-400 font-devanagari text-[10px] uppercase tracking-[0.2em] font-black border-b border-slate-100">
                <tr>
                  <th className="px-8 py-6">कवर इमेज</th>
                  <th className="px-8 py-6">विवरण</th>
                  <th className="px-8 py-6">श्रेणी व वर्ष</th>
                  <th className="px-8 py-6 text-center">लिंक</th>
                  <th className="px-8 py-6 text-right">एक्शन</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-8 py-6">
                      <div className="w-14 h-20 md:w-16 md:h-24 rounded-xl overflow-hidden shadow-lg border-2 border-slate-100 group-hover:scale-105 transition-transform duration-500 bg-slate-50 flex items-center justify-center shrink-0">
                        <img 
                          src={p.cover_url || BOOK_PLACEHOLDER} 
                          alt="cover" 
                          className="w-full h-full object-cover" 
                          onError={(e) => { 
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; 
                            target.src = BOOK_PLACEHOLDER; 
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1 max-w-xs md:max-w-md">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 font-devanagari text-base md:text-lg truncate">{p.title}</span>
                          {p.is_latest && (
                            <span className="bg-green-100 text-green-600 text-[8px] md:text-[9px] px-2 py-0.5 rounded-lg font-black font-devanagari uppercase shrink-0">NEW</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 font-devanagari line-clamp-1">{p.description || "कोई विवरण नहीं..."}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-700 font-bold font-devanagari text-xs md:text-sm bg-slate-100 px-3 py-1 rounded-full w-fit whitespace-nowrap">{p.category}</span>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest pl-1">{p.year}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <a 
                        href={p.flipbook_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-white hover:bg-blue-600 font-bold font-devanagari text-xs transition-all bg-blue-50 px-4 py-2.5 rounded-xl border border-blue-100 shadow-sm whitespace-nowrap"
                       >
                         <ExternalLink size={14} /> खोलें
                       </a>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          title="Edit Publication"
                          className="p-3 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" 
                          onClick={() => openEditModal(p)}
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          title="Delete Publication"
                          className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" 
                          onClick={() => handleDelete(p.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {!loading && filtered.length === 0 && (
          <div className="py-20 text-center text-slate-300 font-devanagari italic text-lg">प्रकाशनों की सूची खाली है।</div>
        )}
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 backdrop-blur-md bg-slate-900/40 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row animate-in zoom-in-95 duration-300 max-h-[95vh]">
            
            {/* Form Section */}
            <div className="flex-1 p-6 md:p-12 space-y-6 md:space-y-8 overflow-y-auto">
              <div className="flex items-center justify-between">
                <div>
                   <h2 className="text-2xl md:text-3xl font-black text-slate-800 font-devanagari tracking-tight">
                     {editingId ? "प्रकाशन विवरण सुधारें" : "नया प्रकाशन जोड़ें"}
                   </h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shrink-0">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="col-span-full">
                    <label className="block text-[10px] md:text-xs font-devanagari text-slate-400 mb-2 ml-1">पत्रिका का नाम (शीर्षक)</label>
                    <div className="relative">
                      <input 
                        type="text" required placeholder="शीर्षक दर्ज करें"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 md:py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-500/10 font-devanagari transition-all text-sm md:text-base"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                      />
                      <Type className="absolute left-4 top-3.5 md:top-4 text-slate-300" size={18} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] md:text-xs font-devanagari text-slate-400 mb-2 ml-1">श्रेणी चुनें</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 md:py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-500/10 font-devanagari transition-all appearance-none text-sm md:text-base"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                      >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                      <Tag className="absolute left-4 top-3.5 md:top-4 text-slate-300" size={18} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] md:text-xs font-devanagari text-slate-400 mb-2 ml-1">प्रकाशन वर्ष/महीना</label>
                    <div className="relative">
                      <input 
                        type="text" placeholder="2026 या फरवरी 2026"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 md:py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-500/10 font-devanagari transition-all text-sm md:text-base"
                        value={formData.year}
                        onChange={(e) => setFormData({...formData, year: e.target.value})}
                      />
                      <Calendar className="absolute left-4 top-3.5 md:top-4 text-slate-300" size={18} />
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label className="block text-[10px] md:text-xs font-devanagari text-slate-400 mb-2 ml-1">Flipbook लिंक (URL)</label>
                    <div className="relative">
                      <input 
                        type="url" required placeholder="https://..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 md:py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-500/10 font-mono text-xs transition-all"
                        value={formData.flipbook_url}
                        onChange={(e) => setFormData({...formData, flipbook_url: e.target.value})}
                      />
                      <LinkIcon className="absolute left-4 top-3.5 md:top-4 text-slate-300" size={18} />
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label className="block text-[10px] md:text-xs font-devanagari text-slate-400 mb-2 ml-1">कवर इमेज लिंक (URL)</label>
                    <div className="relative">
                      <input 
                        type="url" placeholder="मीडिया गैलरी से लिंक यहाँ पेस्ट करें"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 md:py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-500/10 font-mono text-xs transition-all"
                        value={formData.cover_url}
                        onChange={(e) => setFormData({...formData, cover_url: e.target.value})}
                      />
                      <ImageIcon className="absolute left-4 top-3.5 md:top-4 text-slate-300" size={18} />
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label className="block text-[10px] md:text-xs font-devanagari text-slate-400 mb-2 ml-1">विवरण (संक्षिप्त)</label>
                    <textarea 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-blue-500/10 font-devanagari h-24 resize-none transition-all text-sm md:text-base"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={saving}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 md:py-5 rounded-2xl font-bold font-devanagari text-lg md:text-xl shadow-2xl shadow-blue-200 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {saving ? <Loader2 className="animate-spin" size={24} /> : <Check size={24} />}
                  <span>{editingId ? "बदलाव सुरक्षित करें" : "प्रकाशन सुरक्षित करें"}</span>
                </button>
              </form>
            </div>

            {/* Preview Side */}
            <div className="w-full lg:w-96 bg-slate-50 p-8 md:p-12 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-slate-100 shrink-0">
               <div className="text-center space-y-6 w-full">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">लाइव प्रीव्यू</span>
                  <div className="w-40 md:w-56 aspect-[3/4.2] rounded-[1.5rem] md:rounded-[2.5rem] bg-white shadow-2xl overflow-hidden border-[6px] md:border-[10px] border-white flex items-center justify-center ring-1 ring-slate-200 mx-auto transition-transform hover:scale-105 duration-500">
                    <img 
                      src={formData.cover_url || BOOK_PLACEHOLDER} 
                      className="w-full h-full object-cover" 
                      alt="Preview" 
                      onError={(e) => { 
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = BOOK_PLACEHOLDER; 
                      }} 
                    />
                  </div>
                  <div className="space-y-2 max-w-[250px] mx-auto">
                    <h4 className="font-bold text-slate-800 font-devanagari text-sm md:text-base line-clamp-2">{formData.title || "पत्रिका का नाम"}</h4>
                    <p className="text-[10px] text-orange-500 font-black font-devanagari uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full inline-block">{formData.category || 'CATEGORY'}</p>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest block">{formData.year || 'YEAR'}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPublications;
