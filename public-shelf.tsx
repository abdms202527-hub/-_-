
import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Smartphone, Info, Loader2, AlertCircle, X, Filter, Sparkles, ChevronRight, BookMarked, ArrowRight, Phone, Mail, MapPin, Link as LinkIcon, Facebook, Twitter, Instagram, Youtube, Code2, ExternalLink, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase, convertDriveLink } from './lib/supabase.ts';
import { Publication, Notice } from './types.ts';

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
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if on mobile to show install suggestion
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Catch the PWA install prompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Show the banner because installation is possible
      setShowInstallBanner(true);
    });

    if (isMobile) {
      const bannerHidden = localStorage.getItem('hideInstallBanner');
      // If prompt isn't supported/fired yet, we still show the banner if not hidden
      if (!bannerHidden) setShowInstallBanner(true);
    }

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
        if (pubs.length > 0) {
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

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the system install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      // We've used the prompt, and can't use it again, throw it away
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    } else {
      // Fallback for iOS or if event hasn't fired
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      if (isIOS) {
        alert("आईफोन पर इंस्टॉल करने के लिए:\n1. नीचे 'Share' बटन दबाएं\n2. 'Add to Home Screen' चुनें।");
      } else {
        alert("यह ऐप आपके फोन के लिए तैयार है। अगर सिस्टम प्रॉम्प्ट नहीं दिख रहा है, तो ब्राउज़र के 'Install App' विकल्प का उपयोग करें।");
      }
    }
  };

  const filteredPubs = (category === 'सभी' ? publications : publications.filter(p => p.category === category))
    .filter(p => (p.title || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#fffcf5] selection:bg-orange-200 overflow-x-hidden pb-16 md:pb-0">
      
      {/* SMART INSTALL BANNER */}
      {showInstallBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-in slide-in-from-bottom duration-500 lg:hidden">
           <div className="bg-slate-900 text-white p-4 rounded-3xl shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-2 shadow-lg">
                    <img src={convertDriveLink(settings.logo_url) || LOGO_FALLBACK} className="w-full h-full object-contain" alt="App Icon" />
                 </div>
                 <div>
                    <h4 className="font-devanagari font-black text-sm">समाज की लाइब्रेरी ऐप</h4>
                    <p className="font-devanagari text-[10px] text-slate-400">फोन पर इंस्टॉल करने के लिए बटन दबाएं</p>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <button 
                  onClick={handleInstallClick}
                  className="bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-black font-devanagari shadow-lg active:scale-95"
                 >
                    {deferredPrompt ? 'अभी इंस्टॉल करें' : 'कैसे करें?'}
                 </button>
                 <button onClick={() => { setShowInstallBanner(false); localStorage.setItem('hideInstallBanner', 'true'); }} className="p-2 text-slate-500">
                    <X size={18} />
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Notice Bar */}
      <div className="bg-[#7f1d1d] text-white py-2.5 overflow-hidden border-b border-orange-900/10 relative z-[60] shadow-sm">
        <div className="flex items-center gap-6 animate-marquee whitespace-nowrap">
           <span className="flex items-center gap-2 font-devanagari text-[10px] md:text-xs text-orange-200 font-black uppercase tracking-widest pl-4 shrink-0">
             <Info size={14} /> सूचना:
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
              src={convertDriveLink(settings.logo_url) || LOGO_FALLBACK} 
              className="w-full h-full object-contain" 
              alt="Logo" 
              onError={(e) => { (e.target as any).src = LOGO_FALLBACK; }}
             />
          </div>
          <div className="text-slate-800 overflow-hidden">
             <h1 className="text-xs md:text-xl font-black font-devanagari tracking-tight text-[#7f1d1d] truncate leading-none">
               {settings.headline || "अखिल भारतीय धा. माहेश्वरी सभा"}
             </h1>
             <p className="text-[8px] md:text-[11px] uppercase tracking-[0.1em] font-bold text-orange-600 font-devanagari mt-1 truncate border-t border-orange-100 pt-0.5">
               केन्द्रीय कार्य कारिणी समिति
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

      {/* Hero Section */}
      <header className="relative min-h-[60vh] md:min-h-[75vh] flex flex-col items-center justify-start overflow-hidden pt-28 md:pt-36 pb-4 md:pb-8">
        <div className="absolute inset-0 z-0">
           <img 
            src={convertDriveLink(settings.divine_bg_url) || BG_FALLBACK} 
            alt="Divine Background" 
            className="w-full h-full object-cover object-top opacity-50 mix-blend-multiply"
            onError={(e) => { (e.target as any).src = BG_FALLBACK; }}
           />
           <div className="absolute inset-0 bg-gradient-to-b from-[#1a0505]/80 via-[#1a0505]/40 to-[#fffcf5]"></div>
           <div className="absolute inset-0 bg-gradient-to-t from-[#fffcf5] via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 text-center space-y-3 md:space-y-4 px-6 mb-6 md:mb-10 w-full max-w-6xl mx-auto flex flex-col items-center">
          
          {/* HEADER QUICK LINKS */}
          <div className="mb-4 md:mb-8 flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full px-4">
             <div className="flex items-center gap-2 md:gap-4 p-1.5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
                {importantLinks.length > 0 ? importantLinks.map((link, i) => (
                  <a 
                    key={i} 
                    href={link.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all font-devanagari text-[10px] md:text-xs font-black whitespace-nowrap group"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 opacity-60 group-hover:scale-125 transition-transform"></div>
                    {link.title}
                    <ExternalLink size={10} className="opacity-40 group-hover:opacity-100" />
                  </a>
                )) : (
                  <span className="text-white/40 text-[10px] md:text-xs font-devanagari px-4 py-2 italic font-bold">महत्वपूर्ण लिंक उपलब्ध नहीं</span>
                )}
             </div>
          </div>

          <h2 className="text-4xl md:text-7xl lg:text-8xl font-black font-devanagari leading-tight text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] tracking-tight">
            {settings.hero_title || "समाज की ज्ञान संपदा"}
          </h2>
          
          <div className="flex flex-col items-center gap-3">
            <div className="inline-flex items-center gap-2 px-5 md:px-8 py-2 md:py-3 bg-white/10 border border-white/20 rounded-full text-white text-[10px] md:text-xs font-black font-devanagari uppercase tracking-[0.4em] backdrop-blur-md">
               <Sparkles size={14} className="text-orange-400" /> गौरवशाली विरासत
            </div>
            <p className="text-white/90 max-w-xl mx-auto font-devanagari text-[11px] md:text-lg leading-relaxed font-bold px-4">
              {settings.hero_description || "हमारी संस्कृति और समाज के सभी प्रकाशनों को आधुनिक डिजिटल स्वरूप में अनुभव करें।"}
            </p>
          </div>
        </div>

        {/* Featured Section */}
        <div className="container mx-auto px-4 md:px-6 relative z-10 mt-2">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
              {featuredBooks.map((pub) => (
                <div key={pub.id} className="group relative bg-white/95 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2.5rem] p-3 md:p-6 border border-white shadow-2xl flex flex-row items-center gap-4 md:gap-6 transition-all hover:translate-y-[-8px]">
                   <div className="relative shrink-0 w-24 md:w-32 aspect-[3/4.2] rounded-[1rem] md:rounded-[1.2rem] overflow-hidden shadow-2xl ring-4 ring-white">
                      <img 
                        src={convertDriveLink(pub.cover_url) || COVER_FALLBACK} 
                        alt={pub.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as any).src = COVER_FALLBACK; }}
                      />
                   </div>
                   <div className="flex-1 space-y-2 md:space-y-3 text-left overflow-hidden">
                      <h3 className="text-sm md:text-xl font-black text-slate-800 font-devanagari leading-tight line-clamp-1">{pub.title}</h3>
                      <p className="text-slate-500 font-devanagari text-[9px] md:text-xs leading-relaxed line-clamp-2 italic">
                         {pub.description || "समाज की गतिविधियों से सुसज्जित यह प्रकाशन हमारी एकता का प्रतीक है।"}
                      </p>
                      <a 
                        href={pub.flipbook_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-[#7f1d1d] text-white px-4 md:px-7 py-2 md:py-3 rounded-xl font-black font-devanagari text-[10px] md:text-[13px] shadow-lg active:scale-95 transition-all hover:bg-red-900"
                      >
                         पढ़ें <ArrowRight size={14} />
                      </a>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </header>

      {/* Grid Area */}
      <main className="container mx-auto px-4 md:px-6 -mt-10 md:-mt-16 pb-20 space-y-6 md:space-y-10 relative z-20">
         <section className="bg-white/70 backdrop-blur-md p-6 md:p-10 rounded-[2.5rem] md:rounded-[4rem] border border-white/50 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-orange-100 pb-6 md:pb-8 mb-8 md:mb-12">
               <h4 className="text-lg md:text-3xl font-black text-slate-800 font-devanagari flex items-center gap-4">
                  <div className="w-1.5 md:w-2 h-8 md:h-10 bg-orange-500 rounded-full"></div> डिजिटल लाइब्रेरी सूची
               </h4>
               <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 w-full md:w-auto">
                  {dynamicCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-4 md:px-6 py-2 md:py-3 rounded-2xl font-devanagari text-[10px] md:text-sm font-bold transition-all border-2 whitespace-nowrap ${
                        category === cat ? 'bg-orange-500 text-white border-orange-500 shadow-xl' : 'text-slate-500 border-white bg-white/80 hover:bg-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
               </div>
            </div>

            {/* Book Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-10 md:gap-y-16">
               {filteredPubs.map((pub) => (
                 <a key={pub.id} href={pub.flipbook_url} target="_blank" rel="noreferrer" className="group block text-center">
                    <div className="relative aspect-[3/4.2] rounded-[1.2rem] md:rounded-[1.8rem] overflow-hidden shadow-xl group-hover:-translate-y-3 transition-all duration-500 border-4 border-white ring-1 ring-slate-100 mb-4">
                       <img 
                         src={convertDriveLink(pub.cover_url) || COVER_FALLBACK} 
                         alt={pub.title} 
                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                         onError={(e) => { (e.target as any).src = COVER_FALLBACK; }}
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-[#7f1d1d]/90 via-[#7f1d1d]/40 to-transparent flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="bg-white text-[#7f1d1d] font-black py-2 rounded-xl text-[10px] font-devanagari shadow-lg">पढ़ना शुरू करें</span>
                       </div>
                    </div>
                    <h3 className="font-bold text-slate-700 font-devanagari text-xs md:text-base line-clamp-1 leading-tight group-hover:text-orange-600 transition-colors px-2">{pub.title}</h3>
                    <p className="text-[9px] md:text-[11px] text-slate-400 font-bold font-devanagari mt-1 uppercase tracking-wider">{pub.year}</p>
                 </a>
               ))}
               
               {filteredPubs.length === 0 && (
                 <div className="col-span-full py-24 text-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                       <Search size={32} className="text-slate-200" />
                    </div>
                    <p className="font-devanagari text-slate-400 text-lg font-bold">कोई पुस्तक नहीं मिली।</p>
                 </div>
               )}
            </div>
         </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#1a0505] text-white pt-20 pb-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-900/10 rounded-full blur-3xl -mb-32 -mr-32"></div>

        <div className="container mx-auto px-6 relative z-10">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-12 text-left">
              
              <div className="space-y-8">
                 <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-white rounded-2xl p-2 shadow-2xl ring-4 ring-white/10">
                       <img src={convertDriveLink(settings.logo_url) || LOGO_FALLBACK} className="w-full h-full object-contain" alt="Logo" />
                    </div>
                    <div>
                       <h5 className="font-black font-devanagari text-2xl text-orange-400 leading-tight">
                         {settings.headline || "अखिल भारतीय धा. माहेश्वरी सभा"}
                       </h5>
                    </div>
                 </div>
                 <p className="text-white/70 font-devanagari text-sm md:text-base leading-relaxed font-bold">
                    {settings.hero_description || "हमारी डिजिटल लाइब्रेरी समाज के ज्ञान, संस्कृति और गौरवशाली इतिहास को सुरक्षित रखने और उसे अगली पीढ़ी तक पहुँचाने का एक विनम्र प्रयास है।"}
                 </p>
                 <div className="flex gap-4">
                    <a href={settings.footer_facebook || "#"} target="_blank" rel="noreferrer" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-orange-500 transition-all border border-white/5"><Facebook size={24} /></a>
                    <a href={settings.footer_twitter || "#"} target="_blank" rel="noreferrer" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-orange-500 transition-all border border-white/5"><Twitter size={24} /></a>
                    <a href={settings.footer_instagram || "#"} target="_blank" rel="noreferrer" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-orange-500 transition-all border border-white/5"><Instagram size={24} /></a>
                    <a href={settings.footer_youtube || "#"} target="_blank" rel="noreferrer" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-orange-500 transition-all border border-white/5"><Youtube size={24} /></a>
                 </div>
              </div>

              <div className="space-y-8">
                 <h6 className="text-lg font-black font-devanagari uppercase tracking-[0.2em] text-white flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div> महत्वपूर्ण लिंक्स
                 </h6>
                 <ul className="space-y-5 font-devanagari text-base">
                    {importantLinks.length > 0 ? importantLinks.map((link, i) => (
                      <li key={i}>
                        <a href={link.url} target="_blank" rel="noreferrer" className="text-white/60 hover:text-orange-400 flex items-center gap-3 transition-all group font-bold">
                          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform text-orange-500" /> {link.title}
                        </a>
                      </li>
                    )) : (
                      <>
                        <li><a href="#" className="text-white/60 hover:text-orange-400 transition-all font-bold flex items-center gap-2"><ChevronRight size={16} /> मुख्य पृष्ठ</a></li>
                        <li><a href="#" className="text-white/60 hover:text-orange-400 transition-all font-bold flex items-center gap-2"><ChevronRight size={16} /> सभा के बारे में</a></li>
                      </>
                    )}
                 </ul>
              </div>

              <div className="space-y-8">
                 <h6 className="text-lg font-black font-devanagari uppercase tracking-[0.2em] text-white flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div> संपर्क करें
                 </h6>
                 <div className="space-y-6 font-devanagari text-sm md:text-base">
                    <div className="flex items-start gap-4 text-white/70">
                       <MapPin className="text-orange-500 shrink-0 mt-1" size={24} />
                       <span className="leading-relaxed font-bold">
                         {settings.footer_address || "अखिल भारतीय धा. माहेश्वरी सभा, केन्द्रीय कार्यालय, राजस्थान"}
                       </span>
                    </div>
                    <div className="flex items-center gap-4 text-white/70 hover:text-white transition-colors">
                       <Phone className="text-orange-500 shrink-0" size={24} />
                       <span className="font-black text-lg">{settings.footer_phone || "+91 0000-000000"}</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/70 hover:text-white transition-colors">
                       <Mail className="text-orange-500 shrink-0" size={24} />
                       <span className="font-black text-lg">{settings.footer_email || "info@maheshwarisabha.com"}</span>
                    </div>
                 </div>
              </div>

              <div className="space-y-8 bg-white/5 p-10 rounded-[2.5rem] border border-white/5 backdrop-blur-sm shadow-2xl">
                 <h6 className="text-lg font-black font-devanagari uppercase tracking-[0.2em] text-white">डिजिटल सहायता</h6>
                 <p className="text-xs md:text-sm font-devanagari text-white/60 leading-relaxed font-black">
                    वेबसाइट या पब्लिकेशन से संबंधित किसी भी समस्या के लिए हमें संदेश भेजें।
                 </p>
                 <a href={`https://wa.me/91${settings.footer_whatsapp || "9039363610"}`} className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-black font-devanagari py-5 rounded-2xl text-base md:text-lg shadow-2xl transition-all active:scale-95">
                    व्हाट्सएप पर जुड़ें
                 </a>
              </div>
           </div>

           {/* Developer Credit Block - Restored and Styled */}
           <div className="mb-10 p-4 md:p-6 bg-white/5 rounded-2xl border border-white/10 text-center shadow-sm group hover:border-orange-500/30 transition-all duration-300">
              <p className="text-white font-devanagari text-sm md:text-base flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3">
                 <span className="text-slate-400 font-semibold italic">एप्लीकेशन डिजाइन & डेवलप by</span>
                 <span className="text-orange-500 font-black tracking-wide drop-shadow-sm">
                   पीयूष कुमार जगदीश चन्द्र भंसाली
                 </span>
              </p>
           </div>

           <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-center gap-6">
              <p className="text-white/50 font-devanagari text-sm md:text-base font-bold text-center">
                 {settings.footer_copyright || "© 2026 अखिल भारतीय धा. माहेश्वरी सभा. सर्वाधिकार सुरक्षित।"}
              </p>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicShelf;
