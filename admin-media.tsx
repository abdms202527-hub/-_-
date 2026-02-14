
import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Trash2, Loader2, AlertCircle, Plus, Camera, Search } from 'lucide-react';
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

  const fetchMedia = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.from('media').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setMedia(data || []);
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
    if (!url) return;
    
    const title = prompt("इमेज का शीर्षक (वैकल्पिक):") || 'Untitled';

    try {
      setSaving(true);
      const { error } = await supabase.from('media').insert({
        url,
        title
      });
      if (error) throw error;
      fetchMedia();
    } catch (err: any) {
      alert("इमेज सेव करने में त्रुटि: " + err.message);
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

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <span className="text-blue-600 text-sm font-devanagari flex items-center gap-2 mb-1">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div> वेबसाइट विजुअल्स
          </span>
          <h1 className="text-4xl font-black text-slate-800 font-devanagari tracking-tight">मीडिया गैलरी</h1>
        </div>
        <button 
          onClick={handleAddImage}
          disabled={saving}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-[1.5rem] font-bold font-devanagari flex items-center gap-2 shadow-xl shadow-orange-100 transition-all active:scale-95 disabled:opacity-50 group"
        >
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
            <Plus size={20} />
          </div>
          <span>लाइब्रेरी में इमेज जोड़ें</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-center gap-4 text-red-600 font-devanagari shadow-sm">
          <AlertCircle size={24} />
          <p className="font-bold">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10 min-h-[500px] flex flex-col relative overflow-hidden">
         <div className="absolute top-0 left-0 w-64 h-64 bg-slate-50 rounded-full blur-[100px] -ml-32 -mt-32"></div>
         
         <div className="flex flex-col gap-2 mb-10 relative z-10">
            <h3 className="text-2xl font-black text-slate-800 font-devanagari tracking-tight">मीडिया लाइब्रेरी</h3>
            <p className="text-slate-400 font-devanagari text-base">वेबसाइट के लिए सभी चित्र यहाँ प्रबंधित करें</p>
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
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 relative z-10">
              {media.map((item) => (
                <div key={item.id} className="group relative aspect-square bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm transition-all hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2 duration-500">
                   <img 
                    src={item.url} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=Invalid+URL'; }}
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-4">
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 w-12 h-12 rounded-2xl text-white hover:bg-red-600 shadow-xl transition-all active:scale-90 flex items-center justify-center hover:rotate-6"
                      >
                        <Trash2 size={22} />
                      </button>
                      <p className="text-[10px] text-white/70 font-devanagari uppercase tracking-widest font-black px-4 text-center">{item.title}</p>
                   </div>
                </div>
              ))}
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
