
import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Upload, Trash2, Loader2, AlertCircle, Plus } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <span className="text-blue-600 text-sm font-devanagari flex items-center gap-2">
             <div className="w-1 h-1 rounded-full bg-blue-600"></div> डिजिटल आर्काइव
          </span>
          <h1 className="text-3xl font-bold text-slate-800 font-devanagari">मीडिया गैलरी</h1>
        </div>
        <button 
          onClick={handleAddImage}
          disabled={saving}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold font-devanagari flex items-center gap-2 shadow-lg shadow-orange-100 transition-all active:scale-95 disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
          लाइब्रेरी में इमेज जोड़ें
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600 font-devanagari">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 min-h-[500px] flex flex-col">
         <div className="flex flex-col gap-2 mb-8">
            <h3 className="text-xl font-bold text-slate-800 font-devanagari">मीडिया लाइब्रेरी</h3>
            <p className="text-slate-400 font-devanagari text-sm">वेबसाइट के लिए सभी चित्र यहाँ प्रबंधित करें</p>
         </div>

         {loading ? (
           <div className="flex-1 flex flex-col items-center justify-center gap-4 text-slate-400">
              <Loader2 className="animate-spin text-blue-600" size={40} />
              <p className="font-devanagari">गैलरी लोड हो रही है...</p>
           </div>
         ) : media.length > 0 ? (
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {media.map((item) => (
                <div key={item.id} className="group relative aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shadow-sm transition-all hover:shadow-md">
                   <img 
                    src={item.url} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=Invalid+URL'; }}
                   />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 p-2 rounded-full text-white hover:bg-red-600 shadow-lg transition-transform active:scale-90"
                      >
                        <Trash2 size={18} />
                      </button>
                   </div>
                   <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                      <p className="text-[10px] text-white font-devanagari truncate">{item.title}</p>
                   </div>
                </div>
              ))}
           </div>
         ) : (
           <div className="flex-1 flex flex-col items-center justify-center text-slate-300 py-12">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                 <ImageIcon size={32} />
              </div>
              <p className="font-devanagari text-lg">आपकी गैलरी अभी खाली है</p>
              <button onClick={handleAddImage} className="mt-4 text-blue-600 font-devanagari hover:underline text-sm">पहली इमेज जोड़ें</button>
           </div>
         )}
      </div>
    </div>
  );
};

export default AdminMedia;
