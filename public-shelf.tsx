
import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Smartphone, Info, Loader2, AlertCircle, X, Filter, Sparkles, ChevronRight, BookMarked, ArrowRight, Phone, Mail, MapPin, Link as LinkIcon, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from './lib/supabase.ts';
import { Publication, Notice } from './types.ts';

// सुरक्षित प्लेसहोल्डर्स
const LOGO_FALLBACK = "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=100&auto=format&fit=crop";
const COVER_FALLBACK = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop";
const BG_FALLBACK = "https://images.unsplash.com/photo-1620160640858-6906a2333b25?q=80&w=2070&auto=format&fit=crop";

const PublicShelf: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('सभी');
  const [publications, setPublications] = useState<Publication[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<any>({});
  const [importantLinks, setImportantLinks] = useState<any[]>([]);
  const [dynamicCategories, setDynamicCategories] = useState<string[]>(['सभी']);
  const [featuredBooks, setFeaturedBooks] = useState<Publication[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [pubRes, noticeRes, settingsRes] = await Promise.all([
          supabase.from('publications').select('*').order('created_at', { ascending: false }),
          supabase.from('notices').select('*').eq('active', true),
          supabase.from('site_settings').select('*')
        ]);

        if (pubRes.error) throw pubRes.error;
        if (noticeRes.error) throw noticeRes.error;

        const pubs = pubRes.data || [];
        setPublications(pubs);
        if (noticeRes.data) setNotices(noticeRes.data);
        
        const settingsMap = (settingsRes.data || []).reduce((acc: any, curr: any) => {
          acc[curr.key] = curr.value;
          return acc;
        }, {});
        
        setSettings(settingsMap);
        
        const featured: Publication[] = [];
        const b1 = pubs.find(p => p.id === settingsMap.hero_book_1);
        const b2 = pubs.find(p => p.id === settingsMap.hero_book_2);
        
        if (b1) featured.push(b1);
        if (b2) featured.push(b2);
        
        if (featured.length === 0 && pubs.length > 0) {
           featured.push(pubs[0]);
           if (pubs.length > 1) featured.push(pubs[1]);
        }
        setFeaturedBooks(featured);

        if (settingsMap.publication_categories) {
          try {
            setDynamicCategories(['सभी', ...JSON.parse(settingsMap.publication_categories)]);
          } catch(e) {
            setDynamicCategories(['सभी', 'पत्रिका', 'विशेषांक']);
          }
        }
        
        if (settingsMap.important_links) {
          try { 
            const links = JSON.parse(settingsMap.important_links);
            setImportantLinks(Array.isArray(links) ? links : []); 
          } catch(e) {
            setImportantLinks([]);
          }
        }

      } catch (err: any) {
        console.error("Data fetch error:", err);
        setError("डेटा लोड करने में समस्या आई।");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPubs = (category === 'सभी' ? publications : publications.filter(p => p.category === category))
    .filter(p => (p.title || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#fffcf5] selection:bg-orange-200 overflow-x-hidden">
      {/* Notice Bar */}
      <div className="bg-[#7f1d1d] text-white py-2.5 overflow-hidden border-b border-orange-900/10 relative z-[60] shadow-sm">
        <div className="flex items-center gap-6 animate-marquee whitespace-nowrap">
           <span className="flex items-center gap-2 font-devanagari text-[10px] md:text-xs text-orange-200 font-black uppercase tracking-widest pl-4 shrink-0">
             <Info size={14} /> महत्वपूर्ण सूचना:
           </span>
           {notices.length > 0 ? notices.map(n => (
             <React.Fragment key={n.id}>
               <span className="font-devanagari text-xs md:text-sm tracking-wide font-medium">{n.content}</span>
               <span className="mx-4 md:mx-8 opacity-30 text-orange-300">|</span>
             </React.Fragment>
           )) : (
             <span className="font-devanagari text-xs md:text-sm tracking-wide">डिजिटल माहेश्वरी लाइब्रेरी में आपका स्वागत है।</span>
           )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-12 left-0 right-0 p-4 md:p-8 flex items-center justify-between z-50">
        <div className="flex items-center gap-3 md:gap-5 bg-white/90 backdrop-blur-md px-3 md:px-6 py-2 md:py-3 rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl shadow-[#7f1d1d]/5 border border-white/50 ring-1 ring-[#7f1d1d]/5 max-w-[85vw]">
          <div className="w-10 h-10 md:w-16 md:h-16 bg-white rounded-xl md:rounded-3xl flex items-center justify-center shadow-md p-1.5 overflow-hidden shrink-0 border border-orange-100">
             <img 
              src={settings.logo_url || LOGO_FALLBACK} 
              className="w-full h-full object-contain" 
              alt="Logo" 
              onError={(e) => { (e.target as any).src = LOGO_FALLBACK; }}
             />
          </div>
          <div className="text-slate-800 overflow-hidden">
             <h1 className="text-xs md:text-xl font-black font-devanagari tracking-tight text-[#7f1d1d] truncate">
               {settings.headline || "अखिल भारतीय धा. माहेश्वरी सभा"}
             </h1>
             <p className="text-[8px] md:text-[11px] uppercase tracking-[0.1em] font-bold text-orange-600 font-devanagari mt-0.5 truncate border-t border-orange-100 pt-0.5">
               {settings.sub_headline || "केन्द्रीय कार्य कारिणी समिति"}
             </p>
          </div>
        </div>
        <Link 
          to="/admin" 
          className="bg-[#7f1d1d] text-white w-12 h-12 md:w-auto md:px-8 md:py-3 rounded-full md:rounded-2xl font-devanagari text-[10px] md:text-sm font-bold flex items-center justify-center shadow-2xl shadow-[#7f1d1d]/20 active:scale-95 transition-transform"
        >
          <Smartphone size={18} className="md:hidden" />
          <span className="hidden md:inline">एडमिन पोर्टल</span>
        </Link>
      </nav>

      {/* Hero Section - Optimized height and centered text */}
      <header className="relative min-h-[65vh] md:min-h-[75vh] flex flex-col items-center justify-start overflow-hidden pt-32 md:pt-40 pb-4 md:pb-8">
        <div className="absolute inset-0 z-0">
           <img 
            src={settings.divine_bg_url || BG_FALLBACK} 
            alt="Divine Background" 
            className="w-full h-full object-cover object-top opacity-50 mix-blend-multiply"
            onError={(e) => { (e.target as any).src = BG_FALLBACK; }}
           />
           {/* Enhanced Dark-Light Shade Effect */}
           <div className="absolute inset-0 bg-gradient-to-b from-[#1a0505]/60 via-[#1a0505]/20 to-[#fffcf5]"></div>
           <div className="absolute inset-0 bg-gradient-to-t from-[#fffcf5] via-transparent to-transparent"></div>
        </div>

        {/* Hero Text - Centered and Resized to 4xl */}
        <div className="relative z-10 text-center space-y-3 md:space-y-4 px-6 mb-8 md:mb-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 bg-[#7f1d1d]/20 border border-white/20 rounded-full text-white text-[8px] md:text-[10px] font-black font-devanagari uppercase tracking-[0.3em] backdrop-blur-md">
             <Sparkles size={12} className="text-orange-400" /> ज्ञानम् परमम् ध्येयम्
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black font-devanagari leading-tight text-white drop-shadow-2xl">
            समाज की <span className="text-orange-400">ज्ञान संपदा</span>
          </h2>
          <p className="text-white/80 max-w-lg mx-auto font-devanagari text-[10px] md:text-sm leading-relaxed font-bold px-4">
            हमारी गौरवशाली विरासत और समाज के सभी प्रकाशनों को आधुनिक डिजिटल स्वरूप में अनुभव करें।
          </p>
        </div>

        {/* Featured Section - Pulled up */}
        <div className="container mx-auto px-4 md:px-6 relative z-10">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
              {featuredBooks.map((pub, idx) => (
                <div key={pub.id} className="group relative bg-white/90 backdrop-blur-xl rounded-[1.2rem] md:rounded-[2rem] p-3 md:p-5 border border-white shadow-2xl flex flex-row items-center gap-4 md:gap-5 transition-all hover:translate-y-[-4px]">
                   <div className="relative shrink-0 w-20 md:w-28 aspect-[3/4.2] rounded-[0.8rem] md:rounded-[1rem] overflow-hidden shadow-xl ring-2 ring-white">
                      <img 
                        src={pub.cover_url || COVER_FALLBACK} 
                        alt={pub.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as any).src = COVER_FALLBACK; }}
                      />
                   </div>
                   <div className="flex-1 space-y-1.5 md:space-y-2 text-left overflow-hidden">
                      <h3 className="text-xs md:text-lg font-black text-slate-800 font-devanagari leading-tight line-clamp-1">{pub.title}</h3>
                      <p className="text-slate-500 font-devanagari text-[9px] md:text-xs leading-relaxed line-clamp-2 italic">
                         {pub.description || "समाज की गतिविधियों से सुसज्जित यह प्रकाशन हमारी एकता का प्रतीक है।"}
                      </p>
                      <a 
                        href={pub.flipbook_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 bg-[#7f1d1d] text-white px-3 md:px-5 py-1.5 md:py-2 rounded-lg font-black font-devanagari text-[9px] md:text-[11px] shadow-lg active:scale-95"
                      >
                         पढ़ें <ArrowRight size={10} />
                      </a>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </header>

      {/* Grid Area - Moved UP (Reduced spacing) */}
      <main className="container mx-auto px-4 md:px-6 -mt-10 md:-mt-16 pb-20 space-y-6 md:space-y-10 relative z-20">
         <section className="bg-white/60 backdrop-blur-md p-5 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-white/50 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-orange-100 pb-5 md:pb-6 mb-6 md:mb-8">
               <h4 className="text-base md:text-2xl font-black text-slate-800 font-devanagari flex items-center gap-3">
                  <div className="w-1 md:w-1.5 h-6 md:h-7 bg-orange-500 rounded-full"></div> डिजिटल लाइब्रेरी सूची
               </h4>
               <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 w-full md:w-auto">
                  {dynamicCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-3 md:px-5 py-1.5 md:py-2.5 rounded-xl font-devanagari text-[9px] md:text-xs font-bold transition-all border-2 whitespace-nowrap ${
                        category === cat ? 'bg-orange-500 text-white border-orange-500 shadow-md' : 'text-slate-500 border-white bg-white/80'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
               </div>
            </div>

            {/* Book Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-4 gap-y-6 md:gap-y-10">
               {filteredPubs.map((pub) => (
                 <a key={pub.id} href={pub.flipbook_url} target="_blank" rel="noreferrer" className="group block">
                    <div className="relative aspect-[3/4.2] rounded-[1rem] md:rounded-[1.5rem] overflow-hidden shadow-md group-hover:-translate-y-2 transition-all duration-500 border-2 md:border-3 border-white ring-1 ring-slate-100">
                       <img 
                         src={pub.cover_url || COVER_FALLBACK} 
                         alt={pub.title} 
                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                         onError={(e) => { (e.target as any).src = COVER_FALLBACK; }}
                       />
                       <div className="absolute inset-0 bg-[#7f1d1d]/80 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="bg-white text-[#7f1d1d] font-black py-1.5 rounded-lg text-[8px] text-center font-devanagari">खोलें</span>
                       </div>
                    </div>
                    <div className="mt-2 text-center">
                       <h3 className="font-bold text-slate-700 font-devanagari text-[10px] md:text-sm line-clamp-1 leading-tight">{pub.title}</h3>
                    </div>
                 </a>
               ))}
               
               {filteredPubs.length === 0 && (
                 <div className="col-span-full py-16 text-center">
                    <p className="font-devanagari text-slate-400 text-xs md:text-base">कोई पुस्तक उपलब्ध नहीं है।</p>
                 </div>
               )}
            </div>
         </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-[#1a0505] text-white pt-12 pb-8 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 text-center">
           <div className="flex flex-col items-center gap-4 mb-10">
              <div className="w-14 h-14 bg-white rounded-xl p-2 shadow-xl">
                 <img src={settings.logo_url || LOGO_FALLBACK} className="w-full h-full object-contain" alt="Logo" />
              </div>
              <div>
                 <h5 className="font-black font-devanagari text-base text-orange-400">{settings.headline || "अखिल भारतीय धा. माहेश्वरी सभा"}</h5>
                 <p className="text-[9px] uppercase tracking-widest font-bold text-white/40 font-devanagari">{settings.sub_headline || "केन्द्रीय कार्य कारिणी समिति"}</p>
              </div>
           </div>
           <p className="text-white/30 font-devanagari text-[10px] mb-8">{settings.footer_copyright || "© 2026 अखिल भारतीय धा. माहेश्वरी सभा."}</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicShelf;
