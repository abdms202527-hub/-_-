
import React, { useState, useEffect } from 'react';
import { Link2, Plus, Trash2, Save, Loader2, AlertCircle, ExternalLink, ArrowRight } from 'lucide-react';
import { supabase } from './lib/supabase.ts';

interface ImportantLink {
  title: string;
  url: string;
}

const AdminLinks: React.FC = () => {
  const [links, setLinks] = useState<ImportantLink[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'important_links')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data && data.value) {
        setLinks(JSON.parse(data.value));
      } else {
        // Fallback defaults
        setLinks([
          { title: 'महेश्वरी सभा के बारे में', url: '#' },
          { title: 'आगामी कार्यक्रम', url: '#' },
          { title: 'सदस्यता अभियान', url: '#' }
        ]);
      }
    } catch (err: any) {
      setError("लिंक्स लोड करने में विफल: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedLinks: ImportantLink[]) => {
    try {
      setSaving(true);
      const { error } = await supabase.from('site_settings').upsert({
        key: 'important_links',
        value: JSON.stringify(updatedLinks),
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

      if (error) throw error;
      setLinks(updatedLinks);
    } catch (err: any) {
      alert("सेव करने में त्रुटि: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const addLink = () => {
    if (!newTitle || !newUrl) {
      alert("कृपया शीर्षक और URL दोनों भरें।");
      return;
    }
    const updated = [...links, { title: newTitle, url: newUrl }];
    handleSave(updated);
    setNewTitle('');
    setNewUrl('');
  };

  const removeLink = (index: number) => {
    if (!confirm("क्या आप इस लिंक को हटाना चाहते हैं?")) return;
    const updated = links.filter((_, i) => i !== index);
    handleSave(updated);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div>
        <span className="text-blue-600 text-sm font-devanagari flex items-center gap-2 mb-1">
           <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div> वेबसाइट नेविगेशन
        </span>
        <h1 className="text-4xl font-black text-slate-800 font-devanagari tracking-tight">महत्वपूर्ण लिंक प्रबंधन</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Input Section */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
               <div className="flex items-center gap-3 text-blue-600 mb-2">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Plus size={20} />
                  </div>
                  <h3 className="text-lg font-bold font-devanagari">नया लिंक जोड़ें</h3>
               </div>
               
               <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-devanagari text-slate-400 mb-1.5 ml-1">लिंक का शीर्षक (Title)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. सदस्यता फॉर्म"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-devanagari"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-devanagari text-slate-400 mb-1.5 ml-1">लिंक का URL (Full Path)</label>
                    <input 
                      type="text" 
                      placeholder="https://..."
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-mono text-sm"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={addLink}
                    disabled={saving}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold font-devanagari flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-blue-100"
                  >
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    लिंक सुरक्षित करें
                  </button>
               </div>
            </div>
            
            <div className="bg-orange-50/50 p-6 rounded-[2rem] border border-orange-100">
               <h4 className="text-xs font-black text-orange-800 font-devanagari uppercase tracking-widest mb-3 flex items-center gap-2">
                 <AlertCircle size={14} /> निर्देश
               </h4>
               <p className="text-xs text-orange-700/70 font-devanagari leading-relaxed">
                 ये लिंक्स वेबसाइट के फुटर (सबसे नीचे) में "महत्वपूर्ण लिंक" सेक्शन में दिखाई देंगे। आप इन्हें कभी भी बदल या हटा सकते हैं।
               </p>
            </div>
         </div>

         {/* List Section */}
         <div className="lg:col-span-2">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
               <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-800 font-devanagari">सक्रिय लिंक सूची</h3>
                  <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                    Total: {links.length}
                  </span>
               </div>

               {loading ? (
                 <div className="h-80 flex flex-col items-center justify-center gap-4 text-slate-300">
                   <Loader2 className="animate-spin text-blue-600" size={32} />
                   <p className="font-devanagari">लोड हो रहा है...</p>
                 </div>
               ) : links.length > 0 ? (
                 <div className="divide-y divide-slate-50">
                    {links.map((link, idx) => (
                      <div key={idx} className="p-6 flex items-center justify-between group hover:bg-slate-50/50 transition-all">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-500">
                             <Link2 size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 font-devanagari">{link.title}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5 max-w-xs truncate">{link.url}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <a href={link.url} target="_blank" rel="noreferrer" className="p-3 text-slate-300 hover:text-blue-500 hover:bg-white rounded-xl transition-all shadow-sm">
                             <ExternalLink size={18} />
                           </a>
                           <button 
                             onClick={() => removeLink(idx)}
                             className="p-3 text-slate-300 hover:text-red-500 hover:bg-white rounded-xl transition-all shadow-sm"
                           >
                             <Trash2 size={18} />
                           </button>
                        </div>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="h-80 flex flex-col items-center justify-center text-slate-200 gap-4">
                    <Link2 size={48} className="opacity-20" />
                    <p className="font-devanagari text-lg italic">कोई लिंक नहीं जोड़ा गया है।</p>
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminLinks;
