
import React from 'react';
/* Added Image as ImageIcon and Settings to imports */
import { Save, Smartphone, Palette, Globe, Phone, Image as ImageIcon, Settings } from 'lucide-react';

const AdminSettings: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800 font-devanagari">वेबसाइट सेटिंग्स</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold font-devanagari flex items-center gap-2 shadow-xl shadow-blue-200 transition-all active:scale-95">
          <Save size={20} />
          सभी सेटिंग्स अपडेट करें
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mobile Sync */}
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

        {/* Logo & Branding */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
             <Palette className="text-blue-600" size={20} />
             <h3 className="text-lg font-bold text-slate-800 font-devanagari">लोगो और ब्रांडिंग</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-devanagari text-slate-400 mb-1.5 ml-1">मुख्य लोगो URL</label>
              <div className="relative">
                <input 
                  type="text" 
                  defaultValue="https://lh3.googleusercontent.com/d/18z4-1b-Auds2eOsFG"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-mono text-xs pr-10"
                />
                <ImageIcon className="absolute right-3 top-3 text-slate-300" size={18} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-devanagari text-slate-400 mb-1.5 ml-1">मुख्य हेडलाइन (TITLE)</label>
              <input 
                type="text" 
                defaultValue="समाज की ज्ञान संपदा, अब आपके हाथ में"
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-devanagari"
              />
            </div>
          </div>
        </div>

        {/* Text Content */}
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
                defaultValue="हमारी डिजिटल लाइब्रेरी पर समाज के सभी गौरवशाली प्रकाशनों को पढ़ना शुरू करें।"
              />
           </div>
           <div>
              <label className="block text-xs font-devanagari text-slate-400 mb-1.5 ml-1">'हमारे बारे में' फुटर टेक्स्ट</label>
              <input 
                type="text"
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-devanagari"
                defaultValue="अपने समाज का विशेष विशेषांक।"
              />
           </div>
        </div>

        {/* Divine Background & Contact */}
        <div className="space-y-8">
           <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <ImageIcon className="text-orange-500" size={20} />
                <h3 className="text-lg font-bold text-slate-800 font-devanagari">दिव्य चित्र एवं पृष्ठभूमि</h3>
              </div>
              <div className="space-y-4">
                <SettingsInput label="बैकग्राउंड पैटर्न URL" value="https://lh3.googleusercontent.com/..." />
                <SettingsInput label="श्रीनाथजी / दिव्य विग्रह URL" value="https://lh3.googleusercontent.com/..." />
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <Phone className="text-green-500" size={20} />
                <h3 className="text-lg font-bold text-slate-800 font-devanagari">संपर्क एवं फुटर सेटिंग्स</h3>
              </div>
              <div className="space-y-4">
                <SettingsInput label="संपर्क जानकारी (CONTACT INFO)" value="अधिक जानकारी के लिए संपर्क | +91 9039363610" />
                <SettingsInput label="फुटर कॉपीराइट टेक्स्ट" value="© 2025-27 डिजिटल लाइब्रेरी। सर्वाधिकार सुरक्षित।" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const SettingsInput = ({ label, value }: { label: string, value: string }) => (
  <div>
    <label className="block text-xs font-devanagari text-slate-400 mb-1.5 ml-1">{label}</label>
    <div className="relative group">
      <input 
        type="text" 
        defaultValue={value}
        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-devanagari pr-10"
      />
      {/* Fixed Settings component being missing */}
      <Settings className="absolute right-3 top-3 text-slate-300 group-focus-within:text-blue-400 transition-colors" size={18} />
    </div>
  </div>
);

export default AdminSettings;
