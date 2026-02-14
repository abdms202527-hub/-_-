
import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Smartphone, Info, Loader2, AlertCircle, X, Filter, Sparkles, ChevronRight, BookMarked, ArrowRight } from 'lucide-react';
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
  const [showSearch, setShowSearch] = useState(false);
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
        
        // Handle Featured Books
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

        // Categories
        if (settingsMap.publication_categories) {
          try {
            setDynamicCategories(['सभी', ...JSON.parse(settingsMap.publication_categories)]);
          } catch(e) {
            setDynamicCategories(['सभी', 'पत्रिका', 'विशेषांक']);
          }
        }
        
        // Links
        if (settingsMap.important_links) {
          try { setImportantLinks(JSON.parse(settingsMap.important_links)); } catch(e) {}
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
      <div className="bg-[#7f1d1d] text-white py-2.5 overflow-hidden border-b border-orange-900/10 relative z-50 shadow-sm">
        <div className="flex items-center gap-6 animate-marquee whitespace-nowrap">
           <span className="flex items-center gap-2 font-devanagari text-xs text-orange-200 font-black uppercase tracking-widest pl-4">
             <Info size={14} /> महत्वपूर्ण सूचना:
           </span>
           {notices.length > 0 ? notices.map(n => (
             <React.Fragment key={n.id}>
               <span className="font-devanagari text-sm tracking-wide font-medium">{n.content}</span>
               <span className="mx-8 opacity-30 text-orange-300">|</span>
             </React.Fragment>
           )) : (
             <span className="font-devanagari text-sm tracking-wide">डिजिटल माहेश्वरी लाइब्रेरी में आपका स्वागत है।</span>
           )}
        </div>
      </div>

      {/* Hero Section */}
      <header className="relative min-h-[90vh] flex flex-col items-center justify-start overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 z-0">
           <img 
            src={settings.divine_bg_url || BG_FALLBACK} 
            alt="Divine Background" 
            className="w-full h-full object-cover object-top opacity-30 mix-blend-multiply"
            onError={(e) => { (e.target as any).src = BG_FALLBACK; }}
           />
           <div className="absolute inset-0 bg-gradient-to-b from-[#7f1d1d]/10 via-[#fffcf5]/90 to-[#fffcf5]"></div>
           <div className="absolute inset-0 bg-gradient-to-r from-[#fffcf5] via-transparent to-[#fffcf5]"></div>
        </div>

        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 p-8 flex items-center justify-between z-50">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-xl border border-orange-100 p-2.5 overflow-hidden">
               <img 
                src={settings.logo_url || LOGO_FALLBACK} 
                className="w-full h-full object-contain" 
                alt="Logo" 
                onError={(e) => { (e.target as any).src = LOGO_FALLBACK; }}
               />
            </div>
            <div className="text-slate-800">
               <h1 className="text-xl font-black font-devanagari tracking-tight text-[#7f1d1d]">
                 {settings.headline || "अखिल भारतीय धा. माहेश्वरी सभा"}
               </h1>
               <p className="text-[11px] uppercase tracking-[0.1em] font-bold text-orange-600 font-devanagari mt-0.5 border-t border-orange-100 pt-0.5">
                 {settings.sub_headline || "केन्द्रीय कार्य कारिणी समिति"}
               </p>
            </div>
          </div>
          <Link to="/admin" className="bg-[#7f1d1d] text-white px-8 py-3 rounded-2xl font-devanagari text-sm font-bold hover:bg-red-800 transition-all shadow-xl shadow-red-200">एडमिन पोर्टल</Link>
        </nav>

        {/* Hero Text */}
        <div className="relative z-10 text-center space-y-6 px-6 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#7f1d1d]/5 border border-[#7f1d1d]/10 rounded-full text-[#7f1d1d] text-[10px] font-black font-devanagari uppercase tracking-[0.3em]">
             <Sparkles size={12} className="text-orange-500" /> ज्ञानम् परमम् ध्येयम्
          </div>
          <h2 className="text-5xl md:text-7xl font-black font-devanagari leading-tight text-slate-800">
            समाज की <span className="relative inline-block px-2 text-transparent bg-clip-text bg-gradient-to-r from-[#7f1d1d] to-[#f97316]">ज्ञान संपदा</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-devanagari text-lg leading-relaxed font-medium">
            {settings.hero_description || 'हमारी गौरवशाली विरासत और समाज के सभी प्रकाशनों को आधुनिक डिजिटल स्वरूप में अनुभव करें।'}
          </p>
        </div>

        {/* Featured Section */}
        <div className="container mx-auto px-6 relative z-10">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
              {featuredBooks.map((pub, idx) => (
                <div key={pub.id} className="group relative bg-white/60 backdrop-blur-xl rounded-[3.5rem] p-8 border border-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] flex flex-col sm:flex-row items-center gap-8 transition-all hover:translate-y-[-8px]">
                   <div className="relative shrink-0 w-44 aspect-[3/4.2] rounded-[1.5rem] overflow-hidden shadow-2xl ring-4 ring-white">
                      <img 
                        src={pub.cover_url || COVER_FALLBACK} 
                        alt={pub.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => { 
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = COVER_FALLBACK; 
                        }}
                      />
                   </div>
                   <div className="flex-1 space-y-4 text-center sm:text-left">
                      <h3 className="text-2xl font-black text-slate-800 font-devanagari leading-tight line-clamp-2">{pub.title}</h3>
                      <p className="text-slate-500 font-devanagari text-sm leading-relaxed line-clamp-3 italic opacity-80">
                         {pub.description || "समाज की महत्वपूर्ण गतिविधियों और सूचनाओं से सुसज्जित यह प्रकाशन हमारी एकता का प्रतीक है।"}
                      </p>
                      <a 
                        href={pub.flipbook_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-3 bg-[#7f1d1d] text-white px-8 py-3.5 rounded-2xl font-black font-devanagari text-sm shadow-xl shadow-red-200 hover:bg-red-800 transition-all active:scale-95"
                      >
                         अभी पढ़ें <ArrowRight size={16} />
                      </a>
                   </div>
                   <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#fffcf5] border-4 border-white rounded-full flex items-center justify-center font-black text-[#7f1d1d] shadow-lg text-lg">
                      {idx + 1}
                   </div>
                </div>
              ))}
           </div>
        </div>
      </header>

      {/* Grid Area */}
      <main className="container mx-auto px-6 pt-20 pb-20 space-y-20 relative">
         <section className="space-y-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-orange-100 pb-10">
               <h4 className="text-3xl font-black text-slate-800 font-devanagari flex items-center gap-4">
                  <div className="w-3 h-10 bg-orange-500 rounded-full"></div> डिजिटल लाइब्रेरी सूची
               </h4>
               <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
                  {dynamicCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-8 py-3 rounded-2xl font-devanagari text-sm font-bold transition-all border-2 ${
                        category === cat ? 'bg-orange-500 text-white border-orange-500' : 'text-slate-500 border-white bg-white hover:border-orange-200 shadow-sm'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-8 gap-y-16">
               {filteredPubs.map((pub) => (
                 <a key={pub.id} href={pub.flipbook_url} target="_blank" rel="noreferrer" className="group block">
                    <div className="relative aspect-[3/4.2] rounded-[2.5rem] overflow-hidden shadow-lg group-hover:-translate-y-4 transition-all duration-700 border-4 border-white ring-1 ring-slate-100">
                       <img 
                         src={pub.cover_url || COVER_FALLBACK} 
                         alt={pub.title} 
                         className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                         onError={(e) => { 
                           const target = e.target as HTMLImageElement;
                           target.onerror = null;
                           target.src = COVER_FALLBACK; 
                         }}
                       />
                       <div className="absolute inset-0 bg-[#7f1d1d]/90 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
                          <span className="bg-white text-[#7f1d1d] font-black py-3.5 rounded-2xl text-[10px] text-center font-devanagari">पढ़ना शुरू करें</span>
                       </div>
                    </div>
                    <div className="mt-6 text-center">
                       <h3 className="font-bold text-slate-700 font-devanagari text-base line-clamp-2">{pub.title}</h3>
                    </div>
                 </a>
               ))}
            </div>
         </section>
      </main>
    </div>
  );
};

export default PublicShelf;
