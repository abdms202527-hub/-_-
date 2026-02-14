
import React, { useState, useEffect } from 'react';
import { Save, Smartphone, Palette, Globe, Phone, Image as ImageIcon, Settings, Loader2, Tag, Plus, X, Type } from 'lucide-react';
import { supabase } from './lib/supabase.ts';

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [newCat, setNewCat] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('site_settings').select('*');
        if (error) throw error;
        if (data) {
          const map = data.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
          setSettings(map);
          
          if (map.publication_categories) {
            setCategories(JSON.parse(map.publication_categories));
          } else {
            setCategories(['पत्रिका', 'विशेषांक', 'स्मृति लेख', 'कार्यकारिणी']);
          }
        }
      } catch (err) {
        console.error("Fetch Settings Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
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
      const updates = [
        ...Object.entries(settings).map(([key, value]) => ({
          key,
          value,
          updated_at: new Date().toISOString()
        })),
        {
          key: 'publication_categories',
          value: JSON.stringify(categories),
          updated_at: new Date().toISOString()
        }
      ];

      const { error } = await supabase.from('site_settings').upsert(updates, { onConflict: 'key' });
      if (error) throw error;
      
      alert("सेटिंग्स और श्रेणियां सफलतापूर्वक सुरक्षित कर दी गई हैं!");
    } catch (err: any) {
      console.error("Save Settings Error:", err);
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-blue-600 text-sm font-devanagari flex items-center gap-2 mb-1">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div> वेबसाइट कॉन्फ़िगरेशन
          </span>
          <h1 className="text-3xl font-black text-slate-800 font-devanagari">वेबसाइट सेटिंग्स</h1>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold font-devanagari flex items-center gap-2 shadow-xl shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          सभी बदलाव सुरक्षित करें
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Branding Section */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Palette size={20} /></div>
             <h3 className="text-lg font-bold text-slate-800 font-devanagari">लोगो और ब्रांडिंग</h3>
          </div>
          <div className="space-y-4">
            <SettingsField label="मुख्य लोगो URL" value={settings.logo_url || ''} onChange={(v) => handleChange('logo_url', v)} icon={<ImageIcon size={18} />} />
            <SettingsField label="वेबसाइट हेडलाइन (Line 1)" value={settings.headline || 'अखिल भारतीय धा. माहेश्वरी सभा'} onChange={(v) => handleChange('headline', v)} icon={<Type size={18} />} />
            <SettingsField label="सब-हेडलाइन (Line 2)" value={settings.sub_headline || 'केन्द्रीय कार्य कारिणी समिति'} onChange={(v) => handleChange('sub_headline', v)} icon={<Type size={18} />} />
          </div>
        </div>

        {/* Categories Section - Dynamic Management */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center"><Tag size={20} /></div>
             <h3 className="text-lg font-bold text-slate-800 font-devanagari">प्रकाशन श्रेणियां (Filter Bar)</h3>
          </div>
          
          <div className="space-y-4">
             <div className="flex flex-wrap gap-2 min-h-[50px] p-4 bg-slate-50 rounded-2xl border border-slate-100">
                {categories.map((cat) => (
                  <div key={cat} className="bg-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm border border-slate-100 group">
                     <span className="font-devanagari text-sm font-bold text-slate-700">{cat}</span>
                     <button onClick={() => removeCategory(cat)} className="text-slate-300 hover:text-red-500 transition-colors">
                       <X size={14} />
                     </button>
                  </div>
                ))}
                {categories.length === 0 && <p className="text-slate-400 font-devanagari text-xs italic p-1">कोई श्रेणी नहीं है, कृपया जोड़ें...</p>}
             </div>
             
             <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="नई श्रेणी का नाम (जैसे: स्मारिका)"
                  className="flex-1 bg-white border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 font-devanagari"
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                />
                <button 
                  onClick={addCategory}
                  className="bg-slate-900 text-white px-6 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-colors"
                >
                  <Plus size={18} /> जोड़ें
                </button>
             </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center"><Globe size={20} /></div>
             <h3 className="text-lg font-bold text-slate-800 font-devanagari">होम पेज कंटेंट</h3>
           </div>
           <div className="space-y-4">
              <div>
                <label className="block text-xs font-devanagari text-slate-400 mb-1.5 ml-1">मुख्य विवरण (Hero Description)</label>
                <textarea 
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-devanagari resize-none"
                  value={settings.hero_description || ''}
                  onChange={(e) => handleChange('hero_description', e.target.value)}
                />
              </div>
              <SettingsField label="'हमारे बारे में' संक्षिप्त" value={settings.footer_about || ''} onChange={(v) => handleChange('footer_about', v)} />
           </div>
        </div>

        {/* Contact/Footer */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center"><Phone size={20} /></div>
             <h3 className="text-lg font-bold text-slate-800 font-devanagari">संपर्क और फुटर</h3>
           </div>
           <div className="space-y-4">
             <SettingsField label="संपर्क जानकारी (Footer)" value={settings.contact_info || ''} onChange={(v) => handleChange('contact_info', v)} />
             <SettingsField label="कॉपीराइट टेक्स्ट" value={settings.footer_copyright || ''} onChange={(v) => handleChange('footer_copyright', v)} />
           </div>
        </div>
      </div>
    </div>
  );
};

const SettingsField = ({ label, value, onChange, icon }: { label: string, value: string, onChange: (v: string) => void, icon?: React.ReactNode }) => (
  <div>
    <label className="block text-xs font-devanagari text-slate-400 mb-1.5 ml-1">{label}</label>
    <div className="relative">
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-devanagari pr-10" />
      <div className="absolute right-3 top-3 text-slate-300">{icon || <Settings size={18} />}</div>
    </div>
  </div>
);

export default AdminSettings;
