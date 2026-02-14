
import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Trash2, Loader2, AlertCircle, Plus, Camera, Star, Sparkles, RefreshCw } from 'lucide-react';
import { supabase } from './lib/supabase.ts';

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
      
      if (settingsRes.data) {
        setActiveBgUrl(settingsRes.data.value);
      }
    } catch (err: any) {
      console.error("Media Fetch Error:", err);
      setError("मीडिया लोड करने में विफल: " + (err.message || "Failed to fetch"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleAddImage = async () => {
    const url = prompt("इमेज का URL डालें (e.g., https://example.com/image.jpg):");
    if (!url || !url.startsWith('http')) {
      if(url) alert("कृपया एक वैध URL डालें।");
      return;
    }
    
    const titleInput = prompt("इमेज का शीर्षक (वैकल्पिक):") || 'Untitled Image';

    try {
      setSaving(true);
      // Ensure we explicitly name columns to help PostgREST cache
      const { error: insertError } = await supabase.from('media').insert({
        url: url,
        title: titleInput
      });

      if (insertError) {
        // Fallback for schema cache issues: try inserting without title if it's strictly the problem
        if (insertError.message.includes('title')) {
           const { error: fallbackError } = await supabase.from('media').insert({ url: url });
           if (fallbackError) throw fallbackError;
        } else {
           throw insertError;
        }
      }
      
      fetchMedia();
    } catch (err: any) {
      console.error("Insert Error:", err);
      alert("इमेज सुरक्षित करने में त्रुटि: " + (err.message || "Unknown Database Error"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("क्या आप इस इमेज को हटाना चाहते हैं?")) return;
    try {
      const { error } = await supabase.from('media').delete().eq('id', id);
      if (error) throw error;
      fetchMedia();
    } catch (err: any) {
      alert("हटाने में त्रुटि: " + err.message);
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
      alert("होम पेज बैकग्राउंड सफलतापूर्वक अपडेट कर दिया गया है!");
    } catch (err: any) {
      alert("सेटिंग अपडेट करने में त्रुटि: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <span className="text-blue-600 text-sm font-devanagari flex items-center gap-2 mb-1">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div> वेबसाइट विजुअल्स
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 font-devanagari tracking-tight">मीडिया गैलरी</h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchMedia}
            className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 transition-colors shadow-sm"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={handleAddImage}
            disabled={saving}
            className="flex-1 md:flex-none bg-[#991b1b] hover:bg-red-800 text-white px-8 py-4 rounded-[1.5rem] font-bold font-devanagari flex items-center justify-center gap-2 shadow-xl shadow-red-100 transition-all active:scale-95 disabled:opacity-50 group border border-red-900/10"
          >
            <Plus size={20} />
            <span>लाइब्रेरी में इमेज जोड़ें</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-center gap-4 text-red-600 font-devanagari shadow-sm">
          <AlertCircle size={24} className="shrink-0" />
          <p className="font-bold text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 p-6 md:p-10 min-h-[500px] flex flex-col relative overflow-hidden">
         <div className="absolute top-0 left-0 w-64 h-64 bg-red-50 rounded-full blur-[100px] -ml-32 -mt-32 opacity-40"></div>
         
         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 relative z-10 gap-4">
            <div>
              <h3 className="text-2xl font-black text-slate-800 font-devanagari tracking-tight">मीडिया लाइब्रेरी</h3>
              <p className="text-slate-400 font-devanagari text-sm md:text-base">वेबसाइट के लिए सभी चित्र यहाँ प्रबंधित करें</p>
            </div>
            {saving && (
              <div className="flex items-center gap-2 text-blue-600 font-devanagari text-xs md:text-sm font-bold bg-blue-50 px-4 py-2 rounded-xl animate-pulse">
                <Loader2 className="animate-spin" size={16} /> अपडेट हो रहा है...
              </div>
            )}
         </div>

         {loading ? (
           <div className="flex-1 flex flex-col items-center justify-center gap-6 text-slate-400">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
                <ImageIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600/30" size={24} />
              </div>
              <p className="font-devanagari text-lg animate-pulse">गैलरी लोड हो रही है...</p>
           </div>
         ) : media.length > 0 ? (
           <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 relative z-10">
              {media.map((item) => {
                const isActive = activeBgUrl === item.url;
                return (
                  <div key={item.id} className={`group relative bg-white rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border-2 transition-all hover:shadow-2xl duration-500 ${isActive ? 'border-orange-400 ring-4 ring-orange-500/10' : 'border-slate-100'}`}>
                    <div className="aspect-[4/3] relative">
                      <img 
                        src={item.url} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+Image'; }}
                      />
                      {isActive && (
                        <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-orange-500 text-white px-2 py-0.5 md:px-3 md:py-1 rounded-lg text-[8px] md:text-[10px] font-black font-devanagari uppercase tracking-widest flex items-center gap-1 shadow-lg">
                           <Star size={10} fill="currentColor" /> सक्रिय
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 md:gap-4">
                        <div className="flex gap-2 md:gap-3">
                          <button 
                            onClick={() => handleSetAsBackground(item.url)}
                            title="Set as Hero Background"
                            className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-all active:scale-90 ${isActive ? 'bg-orange-500 text-white cursor-default' : 'bg-white text-[#991b1b] hover:bg-orange-50'}`}
                          >
                            <Sparkles size={18} className="md:w-6 md:h-6" />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="bg-white/10 backdrop-blur-md w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl text-white hover:bg-red-600 transition-all active:scale-90 flex items-center justify-center border border-white/20"
                          >
                            <Trash2 size={18} className="md:w-6 md:h-6" />
                          </button>
                        </div>
                        {!isActive && <p className="text-[8px] md:text-[10px] text-white/70 font-devanagari font-black uppercase tracking-widest">बैकग्राउंड सेट करें</p>}
                      </div>
                    </div>
                    <div className="p-3 md:p-5 flex items-center justify-between">
                      <div className="truncate pr-4">
                        <p className="text-[10px] md:text-xs font-black text-slate-800 font-devanagari truncate">{item.title}</p>
                        <p className="text-[8px] md:text-[10px] text-slate-400 mt-1 uppercase font-bold">{new Date(item.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full shrink-0 ${isActive ? 'bg-orange-500 shadow-lg shadow-orange-500/50' : 'bg-slate-100'}`}></div>
                    </div>
                  </div>
                );
              })}
           </div>
         ) : (
           <div className="flex-1 flex flex-col items-center justify-center text-slate-300 py-12 gap-6 relative z-10">
              <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center shadow-inner">
                 <Camera size={40} className="text-slate-200" />
              </div>
              <div className="text-center">
                <p className="font-devanagari text-2xl font-bold text-slate-400">आपकी गैलरी अभी खाली है</p>
                <p className="font-devanagari text-slate-300 mt-2">पहली इमेज जोड़कर अपनी लाइब्रेरी सजाएं</p>
              </div>
              <button onClick={handleAddImage} className="text-blue-600 font-black font-devanagari hover:bg-blue-50 px-6 py-3 rounded-2xl transition-all border border-blue-100">नई इमेज जोड़ें</button>
           </div>
         )}
      </div>
    </div>
  );
};

export default AdminMedia;
