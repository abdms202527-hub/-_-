
import React, { useState, useEffect } from 'react';
import { Save, Smartphone, Palette, Globe, Phone, Image as ImageIcon, Settings, Loader2 } from 'lucide-react';
import { supabase } from './lib/supabase';

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      const { data } = await supabase.from('site_settings').select('*');
      if (data) {
        const map = data.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
        setSettings(map);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const updates = Object.entries(settings).map(([key, value]) => ({
      key,
      value,
      updated_at: new Date().toISOString()
    }));

    // Upsert all settings
    const { error } = await supabase.from('site_settings').upsert(updates, { onConflict: 'key' });
    setSaving(false);

    if (!error) {
      alert("सेटिंग्स सफलतापूर्वक अपडेट कर दी गई हैं!");
    } else {
      alert("Error: " + error.message);
    }
  };

  if (loading) {
    return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800 font-devanagari">वेबसाइट सेटिंग्स</h1>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold font-devanagari flex items-center gap-2 shadow-xl shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          सभी सेटिंग्स अपडेट करें
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-orange-50 p-8 rounded-[2rem] border border-orange-100 flex flex-col items-center text-center">
           <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white mb-4">
              <Smartphone size={24} />
           </div>
           <h3 className="text-xl font-bold text-orange-900 font-devanagari mb-2">मोबाइल सिंक</h3>
           <p className="text-orange-700/70 font-devanagari text-sm mb-6 max-w-xs">
             अपनी सेटिंग्स को मोबाइल ऐप के साथ तुरंत सिंक करने के लिए यहाँ क्लिक करें।
           </p>
           <button className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-2xl font-bold font-devanagari shadow-lg shadow-orange-200 transition-all w-full">
             शॉर्ट सिंक लिंक बनाएं
           </button>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
             <Palette className="text-blue-600" size={20} />
             <h3 className="text-lg font-bold text-slate-800 font-devanagari">लोगो और ब्रांडिंग</h3>
          </div>
          <div className="space-y-4">
            <SettingsField 
              label="मुख्य लोगो URL" 
              value={settings.logo_url || ''} 
              onChange={(v) => handleChange('logo_url', v)} 
              icon={<ImageIcon size={18} />}
            />
            <SettingsField 
              label="मुख्य हेडलाइन (TITLE)" 
              value={settings.headline || ''} 
              onChange={(v) => handleChange('headline', v)} 
            />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
           <div className="flex items-center gap-3">
             <Globe className="text-blue-600" size={20} />
             <h3 className="text-lg font-bold text-slate-800 font-devanagari">वेबसाइट टेक्स्ट सामग्री</h3>
           </div>
           <div>
              <label className="block text-xs font-devanagari text-slate-400 mb-1.5 ml-1">हीरो सेक्शन विवरण</label>
              <textarea 
                rows={4}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-devanagari resize-none"
                value={settings.hero_description || ''}
                onChange={(e) => handleChange('hero_description', e.target.value)}
              />
           </div>
           <SettingsField 
              label="'हमारे बारे में' फुटर टेक्स्ट" 
              value={settings.footer_about || ''} 
              onChange={(v) => handleChange('footer_about', v)} 
           />
        </div>

        <div className="space-y-8">
           <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <ImageIcon className="text-orange-500" size={20} />
                <h3 className="text-lg font-bold text-slate-800 font-devanagari">दिव्य चित्र एवं पृष्ठभूमि</h3>
              </div>
              <div className="space-y-4">
                <SettingsField label="बैकग्राउंड पैटर्न URL" value={settings.bg_pattern || ''} onChange={(v) => handleChange('bg_pattern', v)} />
                <SettingsField label="श्रीनाथजी / दिव्य विग्रह URL" value={settings.divine_img || ''} onChange={(v) => handleChange('divine_img', v)} />
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <Phone className="text-green-500" size={20} />
                <h3 className="text-lg font-bold text-slate-800 font-devanagari">संपर्क एवं फुटर सेटिंग्स</h3>
              </div>
              <div className="space-y-4">
                <SettingsField label="संपर्क जानकारी (CONTACT INFO)" value={settings.contact_info || ''} onChange={(v) => handleChange('contact_info', v)} />
                <SettingsField label="फुटर कॉपीराइट टेक्स्ट" value={settings.footer_copyright || ''} onChange={(v) => handleChange('footer_copyright', v)} />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const SettingsField = ({ label, value, onChange, icon }: { label: string, value: string, onChange: (v: string) => void, icon?: React.ReactNode }) => (
  <div>
    <label className="block text-xs font-devanagari text-slate-400 mb-1.5 ml-1">{label}</label>
    <div className="relative group">
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-devanagari pr-10"
      />
      <div className="absolute right-3 top-3 text-slate-300 group-focus-within:text-blue-400 transition-colors">
        {icon || <Settings size={18} />}
      </div>
    </div>
  </div>
);

export default AdminSettings;
