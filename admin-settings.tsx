
import React, { useState, useEffect } from 'react';
import { Save, Smartphone, Palette, Globe, Phone, Image as ImageIcon, Settings, Loader2, Tag, Plus, X, Type, Star, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase, convertDriveLink } from './lib/supabase.ts';

const LOGO_PLACEHOLDER = "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=100&auto=format&fit=crop";

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [publications, setPublications] = useState<any[]>([]);
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
        const [settingsRes, pubsRes] = await Promise.all([
          supabase.from('site_settings').select('*'),
          supabase.from('publications').select('id, title').order('title')
        ]);
        if (settingsRes.data) {
          const map = settingsRes.data.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
          setSettings(map);
          if (map.publication_categories) {
            try { setCategories(JSON.parse(map.publication_categories)); } catch (e) { setCategories(['पत्रिका', 'विशेषांक']); }
          } else { setCategories(['पत्रिका', 'विशेषांक']); }
        }
        if (pubsRes.data) setPublications(pubsRes.data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Google Drive लिंक को साफ़ करें अगर वह लोगो URL में है
      const logoUrl = convertDriveLink(settings.logo_url || '');
      
      const finalMap: Record<string, string> = {
        ...settings,
        logo_url: logoUrl,
        publication_categories: JSON.stringify(categories)
      };

      // UNIQUE KEY DEDUPLICATION: एरर रोकने के लिए
      const uniqueUpdates = Object.entries(finalMap).reduce((acc: any[], [key, value]) => {
        if (key && !acc.find(i => i.key === key)) {
          acc.push({ key, value: String(value), updated_at: new Date().toISOString() });
        }
        return acc;
      }, []);

      const { error } = await supabase.from('site_settings').upsert(uniqueUpdates, { onConflict: 'key' });
      if (error) throw error;
      showStatus("सेटिंग्स सुरक्षित कर दी गई हैं!");
    } catch (err: any) {
      showStatus("त्रुटि: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-full flex flex-col items-center justify-center gap-4 py-20"><Loader2 className="animate-spin text-blue-600" size={32} /><p className="font-devanagari text-slate-400">लोड हो रहा है...</p></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20 px-4">
      {statusMsg && (
        <div className={`fixed bottom-10 right-10 z-[1000] px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right duration-300 flex items-center gap-3 border ${statusMsg.type === 'success' ? 'bg-blue-600 text-white border-blue-500' : 'bg-red-600 text-white border-red-500'}`}>
          {statusMsg.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="font-devanagari font-bold">{statusMsg.text}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div><h1 className="text-3xl font-black text-slate-800 font-devanagari">वेबसाइट सेटिंग्स</h1></div>
        <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold font-devanagari flex items-center gap-2 shadow-xl disabled:opacity-50">{saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} सुरक्षित करें</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
          <h3 className="text-lg font-bold font-devanagari">ब्रैंडिंग और लोगो</h3>
          <div className="space-y-4">
            <div className="w-20 h-20 bg-slate-50 border rounded-xl overflow-hidden mb-4"><img src={convertDriveLink(settings.logo_url || '') || LOGO_PLACEHOLDER} className="w-full h-full object-contain p-2" /></div>
            <SettingsField label="मुख्य लोगो URL" value={settings.logo_url || ''} onChange={(v) => setSettings({...settings, logo_url: v})} icon={<ImageIcon size={18} />} />
            <SettingsField label="हेडलाइन" value={settings.headline || ''} onChange={(v) => setSettings({...settings, headline: v})} icon={<Type size={18} />} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
          <h3 className="text-lg font-bold font-devanagari">प्रकाशन श्रेणियां</h3>
          <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-xl">
            {categories.map(cat => <div key={cat} className="bg-white px-3 py-1 rounded-lg flex items-center gap-2 border text-sm font-bold">{cat}<button onClick={() => setCategories(categories.filter(c => c !== cat))}><X size={12}/></button></div>)}
          </div>
          <div className="flex gap-2"><input type="text" className="flex-1 border rounded-xl px-4 py-2 font-devanagari" value={newCat} onChange={e => setNewCat(e.target.value)} /><button onClick={() => { if(newCat) {setCategories([...categories, newCat]); setNewCat('');} }} className="bg-slate-900 text-white px-4 rounded-xl"><Plus size={18}/></button></div>
        </div>
      </div>
    </div>
  );
};

const SettingsField = ({ label, value, onChange, icon }: any) => (
  <div>
    <label className="text-xs font-devanagari text-slate-400 mb-1 block">{label}</label>
    <div className="relative"><input type="text" value={value} onChange={e => onChange(e.target.value)} className="w-full bg-slate-50 border rounded-xl px-4 py-3 font-devanagari pr-10" /><div className="absolute right-3 top-3 text-slate-300">{icon}</div></div>
  </div>
);

export default AdminSettings;
