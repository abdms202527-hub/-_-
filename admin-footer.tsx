
import React, { useState, useEffect } from 'react';
// Fixed: 'LayoutPanelBottom' does not exist in lucide-react, using 'LayoutPanelTop' as suggested.
import { Save, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, LayoutPanelTop, Loader2, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react';
import { supabase } from './lib/supabase.ts';

const AdminFooter: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({
    footer_address: 'अखिल भारतीय धा. माहेश्वरी सभा, केन्द्रीय कार्यालय, राजस्थान',
    footer_phone: '+91 0000-000000',
    footer_email: 'info@maheshwarisabha.com',
    footer_facebook: '#',
    footer_twitter: '#',
    footer_instagram: '#',
    footer_youtube: '#',
    footer_whatsapp: '9039363610'
  });
  
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
          setSettings(prev => ({ ...prev, ...map }));
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
      const uniqueUpdates = Object.entries(settings).reduce((acc: any[], [key, value]) => {
        if (key.startsWith('footer_')) {
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
      showStatus("फुटर सेटिंग्स सुरक्षित कर दी गई हैं!");
    } catch (err: any) {
      showStatus("त्रुटि: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center gap-4 py-20">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="font-devanagari text-slate-400">फुटर सेटिंग्स लोड हो रही हैं...</p>
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
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div> वेबसाइट जानकारी
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 font-devanagari">फुटर प्रबंधन</h1>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold font-devanagari flex items-center justify-center gap-3 shadow-xl shadow-blue-100 transition-all active:scale-95 disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          <span>फुटर सुरक्षित करें</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Contact Info Section */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
          <div className="flex items-center gap-3 text-slate-800">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center"><Phone size={20} className="text-blue-600" /></div>
            <h3 className="text-xl font-bold font-devanagari">संपर्क विवरण</h3>
          </div>
          
          <div className="space-y-6">
            <SettingsField 
              label="कार्यालय का पता" 
              value={settings.footer_address || ''} 
              onChange={(v: string) => setSettings({...settings, footer_address: v})} 
              icon={<MapPin size={18} />} 
              placeholder="पता दर्ज करें..."
            />
            
            <SettingsField 
              label="संपर्क फ़ोन नंबर" 
              value={settings.footer_phone || ''} 
              onChange={(v: string) => setSettings({...settings, footer_phone: v})} 
              icon={<Phone size={18} />} 
              placeholder="+91 0000-000000"
            />

            <SettingsField 
              label="आधिकारिक ईमेल" 
              value={settings.footer_email || ''} 
              onChange={(v: string) => setSettings({...settings, footer_email: v})} 
              icon={<Mail size={18} />} 
              placeholder="info@example.com"
            />

            <SettingsField 
              label="व्हाट्सएप नंबर (डिजिटल सहायता बटन)" 
              value={settings.footer_whatsapp || ''} 
              onChange={(v: string) => setSettings({...settings, footer_whatsapp: v})} 
              icon={<MessageCircle size={18} />} 
              placeholder="9039363610"
            />
          </div>
        </div>

        {/* Social Media Section */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
          <div className="flex items-center gap-3 text-slate-800">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center"><Facebook size={20} className="text-blue-600" /></div>
            <h3 className="text-xl font-bold font-devanagari">सोशल मीडिया लिंक्स</h3>
          </div>

          <div className="space-y-6">
            <SettingsField 
              label="फेसबुक प्रोफाइल लिंक" 
              value={settings.footer_facebook || ''} 
              onChange={(v: string) => setSettings({...settings, footer_facebook: v})} 
              icon={<Facebook size={18} />} 
              placeholder="https://facebook.com/..."
            />

            <SettingsField 
              label="ट्विटर (X) प्रोफाइल लिंक" 
              value={settings.footer_twitter || ''} 
              onChange={(v: string) => setSettings({...settings, footer_twitter: v})} 
              icon={<Twitter size={18} />} 
              placeholder="https://twitter.com/..."
            />

            <SettingsField 
              label="इंस्टाग्राम प्रोफाइल लिंक" 
              value={settings.footer_instagram || ''} 
              onChange={(v: string) => setSettings({...settings, footer_instagram: v})} 
              icon={<Instagram size={18} />} 
              placeholder="https://instagram.com/..."
            />

            <SettingsField 
              label="यूट्यूब चैनल लिंक" 
              value={settings.footer_youtube || ''} 
              onChange={(v: string) => setSettings({...settings, footer_youtube: v})} 
              icon={<Youtube size={18} />} 
              placeholder="https://youtube.com/..."
            />
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

export default AdminFooter;
