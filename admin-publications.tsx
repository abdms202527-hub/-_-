
import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit2, Loader2, AlertCircle, X, Check, Star, RefreshCw } from 'lucide-react';
import { supabase, convertDriveLink } from './lib/supabase.ts';
import { Publication } from './types.ts';

const BOOK_PLACEHOLDER = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=200&auto=format&fit=crop";

const AdminPublications: React.FC = () => {
  const [search, setSearch] = useState('');
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(['पत्रिका', 'विशेषांक']);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  
  const initialFormState = { title: '', category: 'पत्रिका', year: new Date().getFullYear().toString(), flipbook_url: '', cover_url: '', description: '', is_latest: true };
  const [formData, setFormData] = useState(initialFormState);

  const showStatus = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const fetchPubs = async () => {
    try {
      setLoading(true);
      const [pubRes, settingsRes] = await Promise.all([
        supabase.from('publications').select('*').order('created_at', { ascending: false }),
        supabase.from('site_settings').select('value').eq('key', 'publication_categories').maybeSingle()
      ]);
      if (pubRes.error) throw pubRes.error;
      setPublications(pubRes.data || []);
      if (settingsRes.data?.value) setCategories(JSON.parse(settingsRes.data.value));
    } catch (err: any) { 
      showStatus("डेटा लोड करने में विफल", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPubs(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.flipbook_url) {
      showStatus("कृपया शीर्षक और लिंक भरें", "error");
      return;
    }

    try {
      setSaving(true);
      
      // Drive Link को डायरेक्ट इमेज लिंक में बदलें
      const finalCoverUrl = convertDriveLink(formData.cover_url);
      
      const payload: any = {
        title: formData.title,
        category: formData.category,
        year: formData.year,
        flipbook_url: formData.flipbook_url,
        cover_url: finalCoverUrl,
        description: formData.description,
        is_latest: formData.is_latest,
        updated_at: new Date().toISOString()
      };

      if (editingId) {
        payload.id = editingId;
      }

      const { error } = await supabase.from('publications').upsert(payload);
      
      if (error) throw error;
      
      showStatus(editingId ? "प्रकाशन अपडेट हुआ!" : "नया प्रकाशन जोड़ा गया!");
      setIsModalOpen(false);
      fetchPubs();
    } catch (err: any) { 
      console.error("Save Error:", err);
      showStatus("सुरक्षित करने में त्रुटि: " + err.message, "error");
    } finally { 
      setSaving(false); 
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("क्या आप इस प्रकाशन को हटाना चाहते हैं?")) return;
    try {
      const { error } = await supabase.from('publications').delete().eq('id', id);
      if (error) throw error;
      showStatus("प्रकाशन हटा दिया गया।");
      fetchPubs();
    } catch (err: any) {
      showStatus("हटाने में त्रुटि: " + err.message, "error");
    }
  };

  const filtered = publications.filter(p => (p.title || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8 animate-fade-in pb-10 relative">
      {/* Status Toast */}
      {statusMsg && (
        <div className={`fixed bottom-10 right-10 z-[200] px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right duration-300 flex items-center gap-3 border ${statusMsg.type === 'success' ? 'bg-blue-600 text-white border-blue-500' : 'bg-red-600 text-white border-red-500'}`}>
          {statusMsg.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
          <span className="font-devanagari font-bold">{statusMsg.text}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <span className="text-blue-600 text-sm font-devanagari flex items-center gap-2 mb-1">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div> डेटाबेस मैनेजमेंट
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 font-devanagari">प्रकाशन प्रबंधन</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchPubs} className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 transition-colors shadow-sm">
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={() => { setEditingId(null); setFormData(initialFormState); setIsModalOpen(true); }} 
            className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold font-devanagari flex items-center justify-center gap-2 shadow-xl shadow-blue-100 transition-all active:scale-95"
          >
            <Plus size={20} />
            <span>नया प्रकाशन जोड़ें</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 flex items-center gap-4 shadow-sm group focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
        <Search size={22} className="text-slate-300 group-focus-within:text-blue-500 transition-colors" />
        <input 
          type="text" 
          placeholder="पत्रिका का नाम या साल से खोजें..." 
          className="flex-1 outline-none font-devanagari text-slate-600 bg-transparent py-1" 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
        />
      </div>

      <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-20 text-center flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="font-devanagari text-slate-400">प्रकाशन लोड हो रहे हैं...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest font-devanagari">
                <tr className="border-b border-slate-50">
                  <th className="px-8 py-6">कवर</th>
                  <th className="px-8 py-6">पत्रिका का विवरण</th>
                  <th className="px-8 py-6">श्रेणी</th>
                  <th className="px-8 py-6 text-right">कार्रवाई</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(p => (
                  <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                       <div className="w-12 h-16 rounded-lg overflow-hidden shadow-md border-2 border-white bg-slate-100">
                          <img 
                            src={p.cover_url || BOOK_PLACEHOLDER} 
                            className="w-full h-full object-cover" 
                            alt=""
                            onError={(e) => { (e.target as HTMLImageElement).src = BOOK_PLACEHOLDER; }}
                          />
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <p className="font-bold text-slate-800 font-devanagari text-base">{p.title}</p>
                       <p className="text-xs text-slate-400 font-devanagari mt-1 flex items-center gap-2">वर्ष: {p.year}</p>
                    </td>
                    <td className="px-8 py-6">
                       <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider font-devanagari border border-blue-100">{p.category}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => { setEditingId(p.id); setFormData({...p}); setIsModalOpen(true); }} 
                            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          >
                            <Edit2 size={18}/>
                          </button>
                          <button 
                            onClick={() => handleDelete(p.id)} 
                            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 size={18}/>
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center flex flex-col items-center gap-6 text-slate-300">
             <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center">
                <Search size={32} />
             </div>
             <p className="font-devanagari text-xl font-bold">कोई प्रकाशन नहीं मिला</p>
          </div>
        )}
      </div>

      {/* Modern Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[95vh] animate-in zoom-in-95 duration-300">
            {/* Form Section */}
            <div className="flex-1 p-8 md:p-10 space-y-8 overflow-y-auto no-scrollbar">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black font-devanagari text-slate-800">{editingId ? "प्रकाशन संपादित करें" : "नया प्रकाशन जोड़ें"}</h2>
                <button onClick={() => setIsModalOpen(false)} className="md:hidden text-slate-400"><X size={24} /></button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest font-devanagari ml-1">पत्रिका का नाम (शीर्षक)</label>
                  <input 
                    type="text" 
                    placeholder="शीर्षक दर्ज करें" 
                    required 
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-devanagari focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest font-devanagari ml-1">श्रेणी चुनें</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-devanagari outline-none appearance-none cursor-pointer" 
                      value={formData.category} 
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest font-devanagari ml-1">प्रकाशन वर्ष</label>
                    <input 
                      type="text" 
                      placeholder="2024" 
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-devanagari outline-none" 
                      value={formData.year} 
                      onChange={e => setFormData({...formData, year: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest font-devanagari ml-1">Flipbook लिंक (URL)</label>
                  <input 
                    type="url" 
                    placeholder="https://example.com/flipbook" 
                    required 
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-mono text-xs outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" 
                    value={formData.flipbook_url} 
                    onChange={e => setFormData({...formData, flipbook_url: e.target.value})} 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest font-devanagari ml-1">कवर इमेज लिंक (URL)</label>
                  <input 
                    type="url" 
                    placeholder="Google Drive लिंक यहाँ पेस्ट करें..." 
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-mono text-xs outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" 
                    value={formData.cover_url} 
                    onChange={e => setFormData({...formData, cover_url: e.target.value})} 
                  />
                  <p className="text-[10px] text-slate-400 font-devanagari italic ml-1">Google Drive लिंक को हम स्वचालित रूप से इमेज में बदल देंगे।</p>
                </div>

                <button 
                  type="submit" 
                  disabled={saving} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-bold font-devanagari text-lg shadow-xl shadow-blue-100 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {saving ? <Loader2 className="animate-spin" size={24} /> : <Check size={24} />}
                  <span>{editingId ? "बदलाव सुरक्षित करें" : "प्रकाशन सुरक्षित करें"}</span>
                </button>
              </form>
            </div>

            {/* Preview Section */}
            <div className="hidden md:flex w-80 bg-slate-50 p-10 flex-col items-center justify-center border-l border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-full blur-3xl -mr-16 -mt-16"></div>
              
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 relative z-10">लाइव प्रीव्यू</p>
              
              <div className="relative z-10 w-44 h-60 bg-white rounded-2xl shadow-2xl border-4 border-white overflow-hidden group">
                <img 
                  src={convertDriveLink(formData.cover_url) || BOOK_PLACEHOLDER} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" 
                  alt="Preview"
                  onError={(e) => { (e.target as HTMLImageElement).src = BOOK_PLACEHOLDER; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              <div className="mt-6 text-center space-y-1 relative z-10">
                <p className="font-bold text-slate-800 font-devanagari text-sm truncate max-w-[200px]">{formData.title || "पत्रिका का नाम"}</p>
                <p className="text-xs text-blue-600 font-black font-devanagari uppercase tracking-widest">{formData.category} • {formData.year}</p>
              </div>

              <button 
                onClick={() => setIsModalOpen(false)} 
                className="mt-12 text-slate-400 hover:text-red-500 font-bold font-devanagari transition-colors flex items-center gap-2 relative z-10"
              >
                <X size={18} />
                <span>रद्द करें</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPublications;
