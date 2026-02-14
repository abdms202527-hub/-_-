
import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Smartphone, Info, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Publication, Notice } from './types';

const PublicShelf: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('सभी');
  const [publications, setPublications] = useState<Publication[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<any>({});

  const categories = ['सभी', 'पत्रिका', 'विशेषांक', 'स्मृति लेख', 'कार्यकारिणी'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Parallel fetching for performance
        const [pubRes, noticeRes, settingsRes] = await Promise.all([
          supabase.from('publications').select('*').order('created_at', { ascending: false }),
          supabase.from('notices').select('*').eq('active', true),
          supabase.from('site_settings').select('*')
        ]);

        if (pubRes.error) throw pubRes.error;
        if (noticeRes.error) throw noticeRes.error;

        if (pubRes.data) setPublications(pubRes.data);
        if (noticeRes.data) setNotices(noticeRes.data);
        
        const settingsMap = (settingsRes.data || []).reduce((acc: any, curr: any) => {
          acc[curr.key] = curr.value;
          return acc;
        }, {});
        setSettings(settingsMap);
      } catch (err: any) {
        console.error("Data fetch error:", err);
        // Error state to inform user instead of blank screen
        setError("डेटा लोड करने में समस्या आई। कृपया रिफ्रेश करें या इंटरनेट चेक करें।");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPubs = publications.filter(p => {
    const titleMatch = (p.title || '').toLowerCase().includes(search.toLowerCase());
    const yearMatch = (p.year || '').toLowerCase().includes(search.toLowerCase());
    const matchesSearch = titleMatch || yearMatch;
    const matchesCat = category === 'सभी' || p.category === category;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      {/* Moving Ticker */}
      <div className="bg-slate-900 text-white py-3 overflow-hidden border-b border-slate-800">
        <div className="flex items-center gap-6 animate-marquee whitespace-nowrap">
           <span className="flex items-center gap-2 font-devanagari text-sm text-blue-400 font-bold">
             <Info size={16} /> महत्वपूर्ण सूचना:
           </span>
           {notices.length > 0 ? notices.map(n => (
             <React.Fragment key={n.id}>
               <span className="font-devanagari text-sm tracking-wide">{n.content}</span>
               <span className="mx-8 opacity-20">|</span>
             </React.Fragment>
           )) : (
             <span className="font-devanagari text-sm tracking-wide">डिजिटल लाइब्रेरी में आपका स्वागत है।</span>
           )}
        </div>
      </div>

      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
               <BookOpen className="text-white" size={24} />
            </div>
            <div>
               <h1 className="text-xl font-bold text-slate-800 font-devanagari leading-tight">
                 {settings.headline || 'अखिल भारतीय धा. माहेश्वरी सभा केन्द्रीय कार्यकारिणी समिति'}
               </h1>
               <p className="text-xs text-slate-400 font-devanagari">डिजिटल लाइब्रेरी एवं आर्काइव</p>
            </div>
          </div>
          <Link to="/admin" className="hidden md:flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-devanagari text-sm">एडमिन लॉगिन</Link>
        </div>
      </header>

      {error && (
        <div className="bg-red-50 border-b border-red-100 p-4">
          <div className="container mx-auto flex items-center gap-3 text-red-600 font-devanagari text-sm">
            <AlertCircle size={18} />
            <p>{error}</p>
          </div>
        </div>
      )}

      <section className="bg-white py-12 border-b border-slate-100">
         <div className="container mx-auto px-4 text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 font-devanagari">
              समाज की ज्ञान संपदा, अब <span className="text-blue-600">आपके हाथ में</span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-devanagari">
              {settings.hero_description || 'हमारी डिजिटल लाइब्रेरी पर समाज के सभी गौरवशाली प्रकाशनों को पढ़ना शुरू करें।'}
            </p>
            <div className="max-w-2xl mx-auto relative group">
               <Search className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
               <input 
                 type="text"
                 placeholder="पत्रिका का शीर्षक या वर्ष खोजें..."
                 className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all font-devanagari"
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
               />
            </div>
         </div>
      </section>

      <div className="container mx-auto px-4 py-8">
         <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-6 py-2 rounded-full font-devanagari text-sm whitespace-nowrap transition-all ${
                  category === cat ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200 hover:border-blue-300'
                }`}
              >
                {cat}
              </button>
            ))}
         </div>

         {loading ? (
           <div className="h-96 flex flex-col items-center justify-center text-slate-400 gap-4">
             <Loader2 className="animate-spin text-blue-600" size={48} />
             <p className="font-devanagari animate-pulse">डेटा लोड हो रहा है...</p>
           </div>
         ) : (
           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mt-8">
              {filteredPubs.map((pub) => (
                <a key={pub.id} href={pub.flipbook_url} target="_blank" rel="noreferrer" className="group cursor-pointer">
                   <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-xl group-hover:-translate-y-2 transition-transform duration-500 border-4 border-white">
                      <img 
                        src={pub.cover_url || 'https://via.placeholder.com/400x533?text=No+Cover'} 
                        alt={pub.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x533?text=Cover+Not+Found';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="bg-white text-blue-600 font-bold py-2 rounded-lg text-sm text-center font-devanagari shadow-lg">अभी पढ़ें</span>
                      </div>
                      {pub.is_latest && (
                        <span className="absolute top-3 left-3 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded font-devanagari font-bold uppercase shadow">नवीनतम</span>
                      )}
                   </div>
                   <div className="mt-4 space-y-1">
                      <h3 className="font-bold text-slate-800 font-devanagari text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">{pub.title}</h3>
                      <p className="text-[10px] text-slate-400 font-devanagari uppercase tracking-wider">{pub.category} • {pub.year}</p>
                   </div>
                </a>
              ))}
              {filteredPubs.length === 0 && !loading && (
                <div className="col-span-full text-center py-32 bg-white rounded-3xl border border-dashed border-slate-200">
                  <p className="text-slate-400 font-devanagari text-lg mb-2">कोई पत्रिका नहीं मिली।</p>
                  <p className="text-slate-300 font-devanagari text-sm">सर्च कीवर्ड बदलें या एडमिन पैनल से नया प्रकाशन जोड़ें।</p>
                </div>
              )}
           </div>
         )}
      </div>

      <footer className="bg-white border-t border-slate-200 mt-20 py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
           <div className="space-y-4">
              <h4 className="font-bold text-slate-800 font-devanagari">हमारे बारे में</h4>
              <p className="text-slate-500 text-sm font-devanagari leading-relaxed">
                {settings.footer_about || 'अखिल भारतीय धा. माहेश्वरी सभा केन्द्रीय कार्यकारिणी समिति की ओर से यह डिजिटल लाइब्रेरी आपके लिए समर्पित है।'}
              </p>
           </div>
           <div className="space-y-4">
              <h4 className="font-bold text-slate-800 font-devanagari">संपर्क जानकारी</h4>
              <p className="text-slate-500 text-sm font-devanagari">
                 {settings.contact_info || 'अधिक जानकारी के लिए संपर्क | +91 9039363610'}
              </p>
              <p className="text-xs text-slate-400 font-devanagari">Application developed by Piyush Kumar Bhansali</p>
           </div>
           <div className="space-y-4">
              <h4 className="font-bold text-slate-800 font-devanagari">सिंक लिंक</h4>
              <div className="flex items-center gap-2">
                 <input disabled value={settings.sync_link || 'library.sync/mobile'} className="flex-1 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-xs font-mono" />
                 <button className="bg-slate-800 text-white p-2 rounded-lg transition-transform active:scale-90"><Smartphone size={16} /></button>
              </div>
           </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-100 text-center text-[10px] text-slate-400 font-devanagari uppercase">
          {settings.footer_copyright || '© 2025-27 डिजिटल लाइब्रेरी। सर्वाधिकार सुरक्षित।'}
        </div>
      </footer>
    </div>
  );
};

export default PublicShelf;
