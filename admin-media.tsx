
import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Trash2, Loader2, AlertCircle, Plus, Camera, Star, Sparkles, RefreshCw } from 'lucide-react';
import { supabase, convertDriveLink } from './lib/supabase.ts';

interface MediaItem {
  id: string;
  url: string;
  title: string;
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
    
    // Google Drive लिंक को डायरेक्ट लिंक में बदलें
    const directUrl = convertDriveLink(url);
    const titleInput = prompt("इमेज का शीर्षक (वैकल्पिक):") || 'Media Image';

    try {
      setSaving(true);
      const { error: insertError } = await supabase.from('media').insert([{ url: directUrl, title: titleInput }]);
      if (insertError) throw insertError;
      showStatus("इमेज सफलतापूर्वक जोड़ी गई!");
      fetchMedia();
    } catch (err: any) {
      if (err.message.includes('schema cache')) {
        alert("डेटाबेस अपडेट हो रहा है। कृपया 5 सेकंड रुकें और फिर SQL रिपेयर कोड चलाएँ।");
      } else {
        showStatus("त्रुटि: " + err.message, "error");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("क्या आप इसे हटाना चाहते हैं?")) return;
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
      const { error } = await supabase.from('site_settings').upsert({
        key: 'divine_bg_url',
        value: url,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });
      if (error) throw error;
      setActiveBgUrl(url);
      showStatus("होम पेज बैकग्राउंड अपडेट हुआ!");
    } catch (err: any) {
      showStatus("अपडेट त्रुटि: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10 px-4 md:px-0">
      {statusMsg && (
        <div className={`fixed bottom-10 right-10 z-[1000] px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right duration-300 flex items-center gap-3 border ${statusMsg.type === 'success' ? 'bg-green-600 text-white border-green-500' : 'bg-red-600 text-white border-red-500'}`}>
          {statusMsg.type === 'success' ? <Star size={20} /> : <AlertCircle size={20} />}
          <span className="font-devanagari font-bold">{statusMsg.text}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-blue-600 text-sm font-devanagari flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div> वेबसाइट विजुअल्स
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 font-devanagari">मीडिया गैलरी</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchMedia} className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 shadow-sm transition-all"><RefreshCw size={20} className={loading ? "animate-spin" : ""} /></button>
          <button onClick={handleAddImage} disabled={saving} className="bg-[#991b1b] text-white px-8 py-4 rounded-2xl font-bold font-devanagari flex items-center gap-2 shadow-xl shadow-red-100 active:scale-95 disabled:opacity-50"><Plus size={20} /> लाइब्रेरी में इमेज जोड़ें</button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 md:p-10 min-h-[500px] flex flex-col relative overflow-hidden">
         {loading ? (
           <div className="flex-1 flex flex-col items-center justify-center gap-4 text-slate-400">
             <Loader2 className="animate-spin text-blue-600" size={32} />
             <p className="font-devanagari">गैलरी लोड हो रही है...</p>
           </div>
         ) : media.length > 0 ? (
           <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 relative z-10">
              {media.map((item) => {
                const isActive = activeBgUrl === item.url;
                return (
                  <div key={item.id} className={`group relative bg-white rounded-[1.5rem] overflow-hidden border-2 transition-all hover:shadow-2xl ${isActive ? 'border-orange-400 ring-4 ring-orange-500/10' : 'border-slate-100'}`}>
                    <div className="aspect-[4/3] relative bg-slate-50">
                      <img src={item.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+Image'; }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
                        <div className="flex gap-2">
                          <button onClick={() => handleSetAsBackground(item.url)} className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-orange-500 text-white' : 'bg-white text-red-800'}`}><Sparkles size={18} /></button>
                          <button onClick={() => handleDelete(item.id)} className="bg-white/20 backdrop-blur-md w-10 h-10 rounded-xl text-white border border-white/20"><Trash2 size={18} /></button>
                        </div>
                      </div>
                      {isActive && <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-lg text-[8px] font-black font-devanagari uppercase">सक्रिय बैकग्राउंड</div>}
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] font-black text-slate-800 font-devanagari truncate">{item.title}</p>
                    </div>
                  </div>
                );
              })}
           </div>
         ) : (
           <div className="flex-1 flex flex-col items-center justify-center text-slate-300 py-12 gap-4">
              <Camera size={40} />
              <p className="font-devanagari text-xl font-bold">गैलरी खाली है</p>
              <button onClick={handleAddImage} className="text-blue-600 font-bold font-devanagari">पहली इमेज जोड़ें</button>
           </div>
         )}
      </div>
    </div>
  );
};

export default AdminMedia;
