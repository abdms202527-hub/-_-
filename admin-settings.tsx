
import React, { useState, useEffect } from 'react';
import { Save, Smartphone, Palette, Globe, Phone, Image as ImageIcon, Settings, Loader2, Tag, Plus, X, Type, Star } from 'lucide-react';
import { supabase } from './lib/supabase.ts';

const LOGO_PLACEHOLDER = "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=100&auto=format&fit=crop";

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [publications, setPublications] = useState<any[]>([]);
  const [newCat, setNewCat] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [settingsRes, pubsRes] = await Promise.all([
          supabase.from('site_settings').select('*'),
          supabase.from('publications').select('id, title').order('title')
        ]);

        if (settingsRes.data) {
          const map = settingsRes.data.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
          setSettings(map);
          
          if (map.publication_categories) {
            try {
              setCategories(JSON.parse(map.publication_categories));
            } catch (e) {
              setCategories(['पत्रिका', 'विशेषांक', 'स्मृति लेख', 'कार्यकारिणी']);
            }
          } else {
            setCategories(['पत्रिका', 'विशेषांक', 'स्मृति लेख', 'कार्यकारिणी']);
          }
        }
        
        if (pubsRes.data) setPublications(pubsRes.data);
      } catch (err) {
        console.error("Fetch Data Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const addCategory = () => {
    if (!newCat.trim()) return;
    if (categories.includes(newCat.trim())) {
      alert("यह श्रेणी पहले से मौजूद है।");
      return;
    }
    setCategories([...categories, newCat.trim()]);
    setNewCat('');
  };

  const removeCategory = (cat: string) => {
    setCategories(categories.filter(c => c !== cat));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // FIX: Merge everything into one map first to prevent duplicate keys in upsert array
      const finalSettingsMap = {
        ...settings,
        publication_categories: JSON.stringify(categories)
      };

      const updates = Object.entries(finalSettingsMap).map(([key, value]) => ({
        key,
        value: String(value), // Ensure value is a string
        updated_at: new Date().toISOString()
      }));

      // upsert will handle both creation and updates correctly now
      const { error } = await supabase.from('site_settings').upsert(updates, { onConflict: 'key' });
      
      if (error) throw error;
      
      alert("सेटिंग्स सफलतापूर्वक सुरक्षित कर दी गई हैं!");
    } catch (err: any) {
      console.error("Save Settings Error:", err);
      alert("सेटिंग्स सेव करने में त्रुटि: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full min-h-[400px] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-blue-600 text-sm font-devanagari flex items-center gap-2 mb-1">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div> वेबसाइट कॉन्फ़िगरेशन
          </span>
          <h1 className="text-3xl font-black text-slate-800 font-devanagari">वेबसाइट सेटिंग्स</h1>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold font-devanagari flex items-center justify-center gap-2 shadow-xl shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 w-full md:w-auto"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          सभी बदलाव सुरक्षित करें
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Branding Section */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Palette size={20} /></div>
             <h3 className="text-lg font-bold text-slate-800 font-devanagari">ब्रैंडिंग और लोगो</h3>
          </div>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
               <div className="w-24 h-24 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                  <img 
                    src={settings.logo_url || LOGO_PLACEHOLDER} 
                    alt="Logo Preview" 
                    className="w-full h-full object-contain p-2"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = LOGO_PLACEHOLDER;
                    }}
                  />
               </div>
               <div className="flex-1 w-full">
                  <SettingsField label="मुख्य लोगो URL" value={settings.logo_url || ''} onChange={(v) => handleChange('logo_url', v)} icon={<ImageIcon size={18} />} />
                  <p className="text-[10px] text-slate-400 mt-2 font-devanagari">वेबसाइट का मुख्य लोगो यहाँ से बदलें। (इमेज लिंक पेस्ट करें)</p>
               </div>
            </div>
            <SettingsField label="वेबसाइट हेडलाइन (Line 1)" value={settings.headline || ''} onChange={(v) => handleChange('headline', v)} icon={<Type size={18} />} />
            <SettingsField label="सब-हेडलाइन (Line 2)" value={settings.sub_headline || ''} onChange={(v) => handleChange('sub_headline', v)} icon={<Type size={18} />} />
          </div>
        </div>

        {/* Categories Section */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center"><Tag size={20} /></div>
             <h3 className="text-lg font-bold text-slate-800 font-devanagari">प्रकाशन श्रेणियां</h3>
          </div>
          <div className="space-y-4">
             <div className="flex flex-wrap gap-2 min-h-[60px] p-4 bg-slate-50 rounded-2xl border border-slate-100">
                {categories.map((cat) => (
                  <div key={cat} className="bg-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm border border-slate-100">
                     <span className="font-devanagari text-sm font-bold text-slate-700">{cat}</span>
                     <button onClick={() => removeCategory(cat)} className="text-slate-300 hover:text-red-500 transition-colors"><X size={14} /></button>
                  </div>
                ))}
             </div>
             <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="नई श्रेणी का नाम..." 
                  className="flex-1 bg-white border border-slate-100 rounded-xl px-4 py-3 font-devanagari outline-none focus:ring-2 focus:ring-orange-500/20" 
                  value={newCat} 
                  onChange={(e) => setNewCat(e.target.value)} 
                />
                <button 
                  onClick={addCategory} 
                  className="bg-slate-900 text-white px-6 rounded-xl font-bold active:scale-95 transition-transform"
                >
                  <Plus size={18} />
                </button>
             </div>
          </div>
        </div>

        {/* Featured Content Management */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center"><Star size={20} /></div>
             <h3 className="text-lg font-bold text-slate-800 font-devanagari">होम पेज पर हाईलाइट</h3>
          </div>
          <div className="space-y-6">
             <div className="space-y-2">
               <label className="text-xs font-devanagari text-slate-400 ml-1">प्रथम मुख्य पुस्तक</label>
               <select 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 font-devanagari appearance-none"
                  value={settings.hero_book_1 || ''}
                  onChange={(e) => handleChange('hero_book_1', e.target.value)}
                >
                  <option value="">पुस्तक चुनें</option>
                  {publications.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
               </select>
             </div>
             <div className="space-y-2">
               <label className="text-xs font-devanagari text-slate-400 ml-1">द्वितीय मुख्य पुस्तक</label>
               <select 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 font-devanagari appearance-none"
                  value={settings.hero_book_2 || ''}
                  onChange={(e) => handleChange('hero_book_2', e.target.value)}
                >
                  <option value="">पुस्तक चुनें</option>
                  {publications.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
               </select>
             </div>
          </div>
        </div>

        {/* Contact/Footer */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center"><Phone size={20} /></div>
             <h3 className="text-lg font-bold text-slate-800 font-devanagari">संपर्क और फुटर</h3>
           </div>
           <div className="space-y-4">
             <SettingsField label="फ़ोन नंबर (Contact Phone)" value={settings.contact_phone || ''} onChange={(v) => handleChange('contact_phone', v)} icon={<Phone size={18} />} />
             <SettingsField label="संपर्क पता / जानकारी" value={settings.contact_info || ''} onChange={(v) => handleChange('contact_info', v)} />
             <SettingsField label="कॉपीराइट टेक्स्ट" value={settings.footer_copyright || ''} onChange={(v) => handleChange('footer_copyright', v)} />
           </div>
        </div>
      </div>
    </div>
  );
};

const SettingsField = ({ label, value, onChange, icon }: { label: string, value: string, onChange: (v: string) => void, icon?: React.ReactNode }) => (
  <div className="flex-1">
    <label className="block text-[10px] md:text-xs font-devanagari text-slate-400 mb-1.5 ml-1">{label}</label>
    <div className="relative">
      <input 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 md:py-4 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-devanagari pr-10 text-sm md:text-base" 
      />
      <div className="absolute right-3 top-3 md:top-4 text-slate-300">{icon || <Settings size={18} />}</div>
    </div>
  </div>
);

export default AdminSettings;
