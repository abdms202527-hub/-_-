
import React, { useState, useEffect } from 'react';
import { Save, Smartphone, Palette, Globe, Phone, Image as ImageIcon, Settings, Loader2, Tag, Plus, X, Type, Star, AlertCircle, CheckCircle, FileText, Copyright, Heading1 } from 'lucide-react';
import { supabase, convertDriveLink } from './lib/supabase.ts';

const LOGO_PLACEHOLDER = "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=100&auto=format&fit=crop";

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [newCat, setNewCat] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const showStatus = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('site_settings').select('*');
        if (error) throw error;
        
        if (data) {
          const map = data.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
          setSettings(map);
          if (map.publication_categories) {
            try { 
              const parsed = JSON.parse(map.publication_categories);
              setCategories(Array.isArray(parsed) ? parsed : ['पत्रिका', 'विशेषांक']); 
            } catch (e) { 
              setCategories(['पत्रिका', 'विशेषांक']); 
            }
          } else { 
            setCategories(['पत्रिका', 'विशेषांक']); 
          }
        }
      } catch (err) { 
        console.error(err); 
        showStatus("डेटा लोड करने में समस्या", "error");
      } finally { 
        setLoading(false); 
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const logoUrl = convertDriveLink(settings.logo_url || '');
      
      const finalMap: Record<string, string> = {
        ...settings,
        logo_url: logoUrl,
        publication_categories: JSON.stringify(categories)
      };

      const uniqueUpdates = Object.entries(finalMap).reduce((acc: any[], [key, value]) => {
        if (key) {
          acc.push({ 
            key, 
            value: String(value || ''), 
            updated_at: new Date().toISOString() 
          });
        }
        return acc;
      }, []);

      const { error } = await supabase.from('site_settings').upsert(uniqueUpdates, { onConflict: 'key' });
      if (error) throw error;
      showStatus("सभी सेटिंग्स सुरक्षित कर दी गई हैं!");
    } catch (err: any) {
      showStatus("त्रुटि: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center gap-4 py-20">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="font-devanagari text-slate-400">सेटिंग्स लोड हो रही हैं...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20 px-4">
      {statusMsg && (
        <div className={`fixed bottom-10 right-10 z-[1000] px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right duration-300 flex items-center gap-3 border ${statusMsg.type === 'success' ? 'bg-blue-600 text-white border-blue-500 shadow-blue-500/20' : 'bg-red-600 text-white border-red-500 shadow-red-500/20'}`}>
          {statusMsg.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="font-devanagari font-bold">{statusMsg.text}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-blue-600 text-sm font-devanagari flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div> कॉन्फ़िगरेशन
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 font-devanagari">वेबसाइट सेटिंग्स</h1>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold font-devanagari flex items-center justify-center gap-3 shadow-xl shadow-blue-100 transition-all active:scale-95 disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          <span>सेटिंग्स सुरक्षित करें</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Branding Section */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
          <div className="flex items-center gap-3 text-slate-800">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center"><Palette size={20} className="text-blue-600" /></div>
            <h3 className="text-xl font-bold font-devanagari">ब्रैंडिंग और लोगो</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-6 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
              <div className="w-20 h-20 bg-white border rounded-2xl overflow-hidden shadow-sm flex items-center justify-center p-2">
                <img 
                  src={convertDriveLink(settings.logo_url || '') || LOGO_PLACEHOLDER} 
                  className="w-full h-full object-contain" 
                  alt="Logo Preview"
                  onError={(e) => { (e.target as HTMLImageElement).src = LOGO_PLACEHOLDER; }}
                />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-devanagari">लोगो प्रीव्यू</p>
                <p className="text-xs text-slate-500 font-devanagari mt-1 leading-relaxed">यहाँ आपका मुख्य लोगो दिखाई देगा जो नेविगेशन और फुटर में उपयोग होता है।</p>
              </div>
            </div>

            <SettingsField 
              label="मुख्य लोगो URL (Google Drive/Direct Link)" 
              value={settings.logo_url || ''} 
              onChange={(v: string) => setSettings({...settings, logo_url: v})} 
              icon={<ImageIcon size={18} />} 
              placeholder="https://..."
            />
            
            <SettingsField 
              label="मुख्य हेडलाइन (शीर्षक)" 
              value={settings.headline || ''} 
              onChange={(v: string) => setSettings({...settings, headline: v})} 
              icon={<Type size={18} />} 
              placeholder="अखिल भारतीय धा. माहेश्वरी सभा"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
          <div className="flex items-center gap-3 text-slate-800">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center"><FileText size={20} className="text-blue-600" /></div>
            <h3 className="text-xl font-bold font-devanagari">मुख्य वेबसाइट कंटेंट</h3>
          </div>

          <div className="space-y-6">
            {/* Added Hero Title field as requested */}
            <SettingsField 
              label="मुख्य शीर्षक (HERO TITLE)" 
              value={settings.hero_title || ''} 
              onChange={(v: string) => setSettings({...settings, hero_title: v})} 
              icon={<Heading1 size={18} />} 
              placeholder="समाज की ज्ञान संपदा"
            />

            <SettingsField 
              label="हीरो सेक्शन विवरण (Hero Subtitle)" 
              value={settings.hero_description || ''} 
              onChange={(v: string) => setSettings({...settings, hero_description: v})} 
              icon={<FileText size={18} />} 
              placeholder="हमारी संस्कृति और समाज के सभी प्रकाशनों को आधुनिक डिजिटल स्वरूप में अनुभव करें।"
            />

            <SettingsField 
              label="फुटर कॉपीराइट टेक्स्ट" 
              value={settings.footer_copyright || ''} 
              onChange={(v: string) => setSettings({...settings, footer_copyright: v})} 
              icon={<Copyright size={18} />} 
              placeholder="© 2026 अखिल भारतीय धा. माहेश्वरी सभा. सर्वाधिकार सुरक्षित।"
            />

            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
              <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest font-devanagari flex items-center gap-2 mb-2">
                <Star size={12} fill="currentColor" /> टिप
              </p>
              <p className="text-[11px] text-blue-700/70 font-devanagari leading-relaxed">
                यहाँ किए गए बदलाव सीधे आपके होम पेज के नीचे के हिस्से (Footer) और ऊपर के बैनर (Hero Section) में दिखाई देंगे।
              </p>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8 lg:col-span-2">
          <div className="flex items-center gap-3 text-slate-800">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center"><Tag size={20} className="text-blue-600" /></div>
            <h3 className="text-xl font-bold font-devanagari">प्रकाशन श्रेणियां (Magazine Categories)</h3>
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap gap-3 p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100">
              {categories.map((cat, idx) => (
                <div key={idx} className="bg-white px-4 py-2 rounded-xl flex items-center gap-3 border border-slate-200 shadow-sm transition-all hover:border-blue-300 group">
                  <span className="text-sm font-bold font-devanagari text-slate-700">{cat}</span>
                  <button 
                    onClick={() => setCategories(categories.filter(c => c !== cat))}
                    className="text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {categories.length === 0 && (
                <p className="text-slate-400 font-devanagari text-sm italic py-2">कोई श्रेणी नहीं जोड़ी गई है।</p>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <input 
                type="text" 
                placeholder="नई श्रेणी का नाम (जैसे: स्मृति लेख, कार्यकारिणी)" 
                className="flex-1 bg-white border border-slate-200 rounded-xl px-5 py-4 font-devanagari outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                value={newCat}
                onChange={e => setNewCat(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), newCat && (setCategories([...categories, newCat]), setNewCat('')))}
              />
              <button 
                onClick={() => { if(newCat) { setCategories([...categories, newCat]); setNewCat(''); } }}
                className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold font-devanagari flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95"
              >
                <Plus size={18} /> जोड़ें
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsField = ({ label, value, onChange, icon, placeholder }: any) => (
  <div className="space-y-2">
    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] font-devanagari ml-1">{label}</label>
    <div className="relative group">
      <input 
        type="text" 
        value={value} 
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)} 
        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-devanagari text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-200 transition-all pr-12 shadow-sm" 
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
        {icon}
      </div>
    </div>
  </div>
);

export default AdminSettings;
