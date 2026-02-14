
import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Trash2, Loader2, AlertCircle, Plus, Camera, Star, Sparkles, RefreshCw, CheckCircle } from 'lucide-react';
import { supabase, convertDriveLink } from './lib/supabase.ts';

interface MediaItem {
  id: string;
  url: string;
  title: string;
  file_name?: string;
  created_at: string;
}

const AdminMedia: React.FC = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeBgUrl, setActiveBgUrl] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const showStatus = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const fetchMedia = async () => {
    try {
      setLoading(true);
      setError(null);
      const [mediaRes, settingsRes] = await Promise.all([
        supabase.from('media').select('*').order('created_at', { ascending: false }),
        supabase.from('site_settings').select('value').eq('key', 'divine_bg_url').maybeSingle()
      ]);
      if (mediaRes.error) throw mediaRes.error;
      setMedia(mediaRes.data || []);
      if (settingsRes.data) setActiveBgUrl(settingsRes.data.value);
    } catch (err: any) {
      setError("मीडिया लोड करने में विफल: " + (err.message || "Failed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMedia(); }, []);

  const handleAddImage = async () => {
    let url = prompt("इमेज का URL डालें (Google Drive लिंक भी चलेगा):");
    if (!url) return;
    
    // लिंक को यहीं कन्वर्ट करें ताकि भविष्य में समस्या न हो
    const directUrl = convertDriveLink(url);
    const titleInput = prompt("इमेज का शीर्षक (वैकल्पिक):") || 'Media Image';
    
    const safeFileName = titleInput.toLowerCase().replace(/[^\w]/g, '-') + '-' + Date.now();

    try {
      setSaving(true);
      const { error: insertError } = await supabase.from('media').insert([{ 
        url: directUrl, 
        title: titleInput,
        file_name: safeFileName 
      }]);
      
      if (insertError) throw insertError;
      
      showStatus("इमेज सफलतापूर्वक गैलरी में जोड़ी गई!");
      fetchMedia();
    } catch (err: any) {
      console.error("Media Error:", err);
      showStatus("त्रुटि: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!media.find(m => m.id === id)) return;
    if (!confirm("क्या आप इस इमेज को लाइब्रेरी से हटाना चाहते हैं?")) return;
    try {
      const { error } = await supabase.from('media').delete().eq('id', id);
      if (error) throw error;
      showStatus("इमेज हटा दी गई।");
      fetchMedia();
    } catch (err: any) {
      showStatus("त्रुटि: " + err.message, "error");
    }
  };

  const handleSetAsBackground = async (url: string) => {
    try {
      setSaving(true);
      // सीधे इमेज लिंक को site_settings में सेव करें
      const { error } = await supabase.from('site_settings').upsert({
        key: 'divine_bg_url',
        value: url,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });
      
      if (error) throw error;
      
      setActiveBgUrl(url);
      showStatus("होम पेज बैकग्राउंड सफलतापूर्वक अपडेट किया गया!", "success");
    } catch (err: any) {
      console.error("BG Update Error:", err);
      showStatus("अपडेट त्रुटि: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10 px-4 md:px-0">
      {statusMsg && (
        <div className={`fixed bottom-10 right-10 z-[1000] px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right duration-300 flex items-center gap-3 border ${statusMsg.type === 'success' ? 'bg-blue-600 text-white border-blue-500 shadow-blue-500/20' : 'bg-red-600 text-white border-red-500 shadow-red-500/20'}`}>
          {statusMsg.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="font-devanagari font-bold">{statusMsg.text}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-blue-600 text-sm font-devanagari flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div> विजुअल मैनेजमेंट
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 font-devanagari">मीडिया लाइब्रेरी</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchMedia} className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 shadow-sm transition-all"><RefreshCw size={20} className={loading ? "animate-spin" : ""} /></button>
          <button onClick={handleAddImage} disabled={saving} className="bg-[#7f1d1d] text-white px-8 py-4 rounded-2xl font-bold font-devanagari flex items-center gap-2 shadow-xl shadow-red-100 active:scale-95 disabled:opacity-50 transition-all hover:bg-red-900"><Plus size={20} /> नई इमेज जोड़ें</button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 md:p-10 min-h-[500px] flex flex-col relative overflow-hidden">
         {loading ? (
           <div className="flex-1 flex flex-col items-center justify-center gap-4 text-slate-400 py-20">
             <Loader2 className="animate-spin text-blue-600" size={40} />
             <p className="font-devanagari text-lg">गैलरी लोड हो रही है...</p>
           </div>
         ) : media.length > 0 ? (
           <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10 relative z-10">
              {media.map((item) => {
                const isActive = activeBgUrl === item.url;
                return (
                  <div key={item.id} className={`group relative bg-white rounded-[2rem] overflow-hidden border-2 transition-all duration-500 hover:shadow-2xl ${isActive ? 'border-orange-400 ring-4 ring-orange-500/10' : 'border-slate-50'}`}>
                    <div className="aspect-[4/5] relative bg-slate-100">
                      <img 
                        src={item.url} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x500?text=Invalid+Link'; }} 
                      />
                      
                      {/* Overlay Controls */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent flex flex-col items-center justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="flex flex-col gap-2 w-full">
                          <button 
                            onClick={() => handleSetAsBackground(item.url)} 
                            className={`w-full py-3 rounded-xl font-bold font-devanagari text-xs flex items-center justify-center gap-2 transition-all ${isActive ? 'bg-orange-500 text-white' : 'bg-white text-slate-900 hover:bg-orange-50'}`}
                          >
                            <Sparkles size={14} /> {isActive ? "सक्रिय बैकग्राउंड" : "बैकग्राउंड बनाएँ"}
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)} 
                            className="w-full py-3 rounded-xl bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-red-500/50 hover:border-red-500/50 transition-all font-bold font-devanagari text-xs flex items-center justify-center gap-2"
                          >
                            <Trash2 size={14} /> डिलीट करें
                          </button>
                        </div>
                      </div>
                      
                      {isActive && (
                        <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black font-devanagari uppercase tracking-widest shadow-lg flex items-center gap-2">
                           <Star size={10} fill="currentColor" /> ACTIVE
                        </div>
                      )}
                    </div>
                    <div className="p-4 bg-white">
                      <p className="text-xs font-bold text-slate-800 font-devanagari truncate">{item.title}</p>
                      <p className="text-[9px] text-slate-400 mt-1 uppercase font-black tracking-widest">{new Date(item.created_at).toLocaleDateString('hi-IN')}</p>
                    </div>
                  </div>
                );
              })}
           </div>
         ) : (
           <div className="flex-1 flex flex-col items-center justify-center text-slate-300 py-20 gap-6">
              <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center">
                 <Camera size={48} className="text-slate-200" />
              </div>
              <div className="text-center space-y-2">
                <p className="font-devanagari text-2xl font-black text-slate-400">आपकी गैलरी अभी खाली है</p>
                <p className="font-devanagari text-sm text-slate-400">पहली इमेज जोड़कर अपनी लाइब्रेरी सजाएं</p>
              </div>
              <button onClick={handleAddImage} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold font-devanagari shadow-lg hover:bg-blue-700 transition-all">नई इमेज जोड़ें</button>
           </div>
         )}
      </div>
    </div>
  );
};

export default AdminMedia;
