
import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Smartphone, Info, Loader2, AlertCircle, X, Filter, Sparkles, ChevronRight, BookMarked } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from './lib/supabase.ts';
import { Publication, Notice } from './types.ts';

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

  // डिफ़ॉल्ट दिव्य छवि (अगर सेटिंग्स में न मिले)
  const defaultBg = "https://images.unsplash.com/photo-1620160640858-6906a2333b25?q=80&w=2070&auto=format&fit=crop"; 

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

        if (pubRes.data) setPublications(pubRes.data);
        if (noticeRes.data) setNotices(noticeRes.data);
        
        const settingsMap = (settingsRes.data || []).reduce((acc: any, curr: any) => {
          acc[curr.key] = curr.value;
          return acc;
        }, {});
        
        setSettings(settingsMap);
        
        // Handle Dynamic Categories
        if (settingsMap.publication_categories) {
          try {
            const parsed = JSON.parse(settingsMap.publication_categories);
            setDynamicCategories(['सभी', ...parsed]);
          } catch(e) {
            setDynamicCategories(['सभी', 'पत्रिका', 'विशेषांक', 'स्मृति लेख', 'कार्यकारिणी']);
          }
        } else {
          setDynamicCategories(['सभी', 'पत्रिका', 'विशेषांक', 'स्मृति लेख', 'कार्यकारिणी']);
        }
        
        // Important links processing
        if (settingsMap.important_links) {
          try {
            setImportantLinks(JSON.parse(settingsMap.important_links));
          } catch(e) {
            console.warn("Links parse error", e);
          }
        } else {
          setImportantLinks([
            { title: 'महेश्वरी सभा के बारे में', url: '#' },
            { title: 'आगामी कार्यक्रम', url: '#' },
            { title: 'सदस्यता अभियान', url: '#' },
            { title: 'सामाजिक नियमावली', url: '#' }
          ]);
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

  const latestPub = publications.find(p => p.is_latest) || publications[0];
  
  const filteredPubs = (category === 'सभी' ? publications : publications.filter(p => p.category === category))
    .filter(p => {
      const titleMatch = (p.title || '').toLowerCase().includes(search.toLowerCase());
      const yearMatch = (p.year || '').toLowerCase().includes(search.toLowerCase());
      return titleMatch || yearMatch;
    });

  return (
    <div className="min-h-screen bg-[#fffcf5] selection:bg-orange-200">
      {/* Marquee Notice Bar */}
      <div className="bg-[#7f1d1d] text-white py-2.5 overflow-hidden border-b border-orange-900/10 relative z-50 shadow-sm">
        <div className="flex items-center gap-6 animate-marquee whitespace-nowrap">
           <span className="flex items-center gap-2 font-devanagari text-xs text-orange-200 font-black uppercase tracking-widest">
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
      <header className="relative min-h-[60vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img 
            src={settings.divine_bg_url || defaultBg} 
            alt="divine" 
            className="w-full h-full object-cover scale-105 transition-all duration-1000"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-[#7f1d1d]/90 via-[#7f1d1d]/40 to-[#fffcf5]"></div>
           <div className="absolute inset-0 backdrop-blur-[1px]"></div>
        </div>

        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 p-8 flex items-center justify-between z-20">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl border border-orange-100 p-2">
               <img src={settings.logo_url || "https://maheshwarisabha.org/logo.png"} className="w-full h-full object-contain" alt="Logo" />
            </div>
            <div className="text-white hidden sm:block">
               {/* Updated Branding Text */}
               <h1 className="text-lg font-black font-devanagari tracking-tight drop-shadow-md">
                 {settings.headline || "अखिल भारतीय धा. माहेश्वरी सभा"}
               </h1>
               <p className="text-[10px] uppercase tracking-[0.1em] font-bold text-orange-200 opacity-90 font-devanagari mt-0.5">
                 {settings.sub_headline || "केन्द्रीय कार्य कारिणी समिति"}
               </p>
            </div>
          </div>
          <Link to="/admin" className="bg-white/10 backdrop-blur-md text-white px-6 py-2.5 rounded-full font-devanagari text-sm font-bold border border-white/20 hover:bg-white hover:text-red-900 transition-all shadow-xl">एडमिन पोर्टल</Link>
        </nav>

        {/* Hero Text */}
        <div className="relative z-10 text-center space-y-6 px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-orange-500/20 backdrop-blur-md border border-orange-400/30 rounded-full text-orange-200 text-[10px] font-black font-devanagari uppercase tracking-[0.3em]">
             <Sparkles size={12} /> ज्ञानम् परमम् ध्येयम्
          </div>
          <h2 className="text-4xl md:text-6xl font-black font-devanagari leading-tight text-white">
            समाज की <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300 drop-shadow-lg">ज्ञान संपदा</span>
          </h2>
          <p className="text-orange-50/80 max-w-xl mx-auto font-devanagari text-base leading-relaxed">
            {settings.hero_description || 'हमारी गौरवशाली विरासत और समाज के सभी प्रकाशनों को आधुनिक डिजिटल स्वरूप में अनुभव करें।'}
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-6 -mt-16 relative z-20 pb-20 space-y-20">
         
         {/* Featured Section (Latest Highlight) */}
         {latestPub && !loading && (
           <section className="max-w-5xl mx-auto">
              <div className="bg-white rounded-[3.5rem] shadow-[0_30px_70px_-20px_rgba(127,29,29,0.15)] border-2 border-white overflow-hidden flex flex-col md:flex-row items-stretch">
                 <div className="md:w-2/5 relative overflow-hidden bg-slate-50">
                    <img 
                      src={latestPub.cover_url || 'https://via.placeholder.com/400x533'} 
                      alt={latestPub.title}
                      className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                    />
                    <div className="absolute top-8 left-0 bg-[#f59e0b] text-white px-6 py-2 rounded-r-2xl font-black font-devanagari text-xs uppercase shadow-xl z-10 flex items-center gap-2">
                       <BookMarked size={16} /> आज का मुख्य आकर्षण
                    </div>
                 </div>
                 <div className="md:w-3/5 p-12 md:p-16 flex flex-col justify-center space-y-8 bg-gradient-to-br from-white to-orange-50/30">
                    <div className="space-y-3">
                       <p className="text-orange-500 font-black font-devanagari text-xs uppercase tracking-[0.2em]">{latestPub.category} • {latestPub.year} संस्करण</p>
                       <h3 className="text-3xl md:text-4xl font-black text-slate-800 font-devanagari leading-tight">{latestPub.title}</h3>
                       <div className="w-16 h-1 bg-orange-200 rounded-full"></div>
                    </div>
                    <p className="text-slate-500 font-devanagari text-lg leading-relaxed line-clamp-3 italic">
                      {latestPub.description || "समाज की नवीनतम गतिविधियों और महत्वपूर्ण सूचनाओं से सुसज्जित यह प्रकाशन हमारी एकता का प्रतीक है। इसे अभी डिजिटल फॉर्मेट में पढ़ें।"}
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                       <a 
                        href={latestPub.flipbook_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-[#7f1d1d] hover:bg-red-800 text-white px-10 py-4 rounded-2xl font-black font-devanagari text-lg shadow-2xl shadow-red-200 transition-all active:scale-95 flex items-center gap-3"
                       >
                         पूरा अंक पढ़ें <ChevronRight size={20} />
                       </a>
                    </div>
                 </div>
              </div>
           </section>
         )}

         {/* Grid Section */}
         <section className="space-y-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-orange-100 pb-8">
               <h4 className="text-2xl font-black text-slate-800 font-devanagari flex items-center gap-3">
                  <div className="w-2 h-8 bg-orange-500 rounded-full"></div> अन्य महत्वपूर्ण प्रकाशन
               </h4>
               
               {/* Categories Bar - DYNAMIC */}
               <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                  {dynamicCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-6 py-2 rounded-full font-devanagari text-sm font-bold whitespace-nowrap transition-all border ${
                        category === cat 
                          ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-100' 
                          : 'text-slate-400 border-slate-200 hover:border-orange-200 hover:text-orange-500'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
               </div>
            </div>

            {loading ? (
              <div className="h-96 flex flex-col items-center justify-center text-orange-300 gap-6">
                <Loader2 className="animate-spin text-orange-500" size={48} />
                <p className="font-devanagari text-xl font-bold animate-pulse">लाइब्रेरी लोड हो रही है...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-12">
                 {filteredPubs.map((pub) => (
                   <a key={pub.id} href={pub.flipbook_url} target="_blank" rel="noreferrer" className="group">
                      <div className="relative aspect-[3/4.2] rounded-[2rem] overflow-hidden shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] group-hover:-translate-y-3 transition-all duration-500 border-2 border-white ring-1 ring-slate-100">
                         <img 
                           src={pub.cover_url || 'https://via.placeholder.com/400x533'} 
                           alt={pub.title} 
                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <span className="bg-white text-red-900 font-black py-3 rounded-xl text-xs text-center font-devanagari shadow-2xl">अभी पढ़ें</span>
                         </div>
                         {pub.is_latest && (
                           <div className="absolute top-3 left-0 bg-red-600 text-white px-3 py-1 rounded-r-lg font-devanagari font-black text-[9px] uppercase tracking-widest shadow-lg">New</div>
                         )}
                      </div>
                      <div className="mt-5 space-y-1 text-center">
                         <h3 className="font-bold text-slate-700 font-devanagari text-sm leading-tight line-clamp-2 group-hover:text-orange-500 transition-colors">{pub.title}</h3>
                         <p className="text-[10px] text-slate-400 font-black font-devanagari uppercase tracking-[0.1em]">{pub.year}</p>
                      </div>
                   </a>
                 ))}
                 {filteredPubs.length === 0 && (
                   <div className="col-span-full py-20 text-center text-slate-400 font-devanagari italic text-lg">
                      इस श्रेणी में अभी कोई प्रकाशन उपलब्ध नहीं है।
                   </div>
                 )}
              </div>
            )}
         </section>
      </main>

      {/* Floating Search Bar */}
      <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end gap-4 pointer-events-none">
         {showSearch && (
           <div className="pointer-events-auto bg-white p-2 rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] border-2 border-orange-50 animate-in slide-in-from-bottom-5 duration-300 w-80 md:w-96">
              <div className="relative">
                <input 
                  type="text" 
                  autoFocus
                  placeholder="पत्रिका खोजें..."
                  className="w-full bg-slate-50 rounded-[2.2rem] py-5 pl-14 pr-12 outline-none font-devanagari text-slate-700 text-lg border-2 border-transparent focus:border-orange-100 transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-400" size={20} />
                <button 
                  onClick={() => { setShowSearch(false); setSearch(''); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors shadow-sm"
                >
                   <X size={18} />
                </button>
              </div>
           </div>
         )}
         
         <button 
           onClick={() => setShowSearch(!showSearch)}
           className="pointer-events-auto w-18 h-18 bg-[#7f1d1d] hover:bg-red-800 text-white rounded-full flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(127,29,29,0.5)] transition-all hover:scale-110 active:scale-90 border-4 border-white group"
         >
           {showSearch ? <X size={28} /> : <Search size={28} className="group-hover:rotate-12 transition-transform" />}
         </button>
      </div>

      {/* Social Themed Footer */}
      <footer className="bg-white border-t border-orange-100 mt-20 pt-20 pb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-50 rounded-full blur-[120px] -mr-48 -mt-48 opacity-40"></div>
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16 relative z-10">
           <div className="col-span-1 md:col-span-1 space-y-6">
              <div className="w-14 h-14 bg-[#7f1d1d] rounded-2xl flex items-center justify-center shadow-xl p-3">
                 <img src={settings.logo_url} className="w-full h-full object-contain brightness-0 invert" alt="logo" />
              </div>
              <p className="text-slate-500 text-sm font-devanagari leading-relaxed">
                {settings.footer_about || 'अखिल भारतीय माहेश्वरी सभा समाज की एकता और प्रगति के लिए समर्पित है। यह डिजिटल लाइब्रेरी हमारे ज्ञान और संस्कारों का केंद्र है।'}
              </p>
           </div>
           
           <div className="space-y-6">
              <h4 className="text-[11px] font-black text-red-900 font-devanagari uppercase tracking-[0.2em]">महत्वपूर्ण लिंक</h4>
              <ul className="space-y-3 font-devanagari text-slate-500 text-sm font-medium">
                 {importantLinks.map((link, idx) => (
                   <li key={idx} className="hover:text-red-900 cursor-pointer transition-colors flex items-center gap-2">
                     <ChevronRight size={14} className="text-orange-400" />
                     <a href={link.url} target="_blank" rel="noreferrer">{link.title}</a>
                   </li>
                 ))}
              </ul>
           </div>

           <div className="space-y-6">
              <h4 className="text-[11px] font-black text-red-900 font-devanagari uppercase tracking-[0.2em]">संपर्क सूत्र</h4>
              <div className="space-y-4">
                 <p className="text-slate-600 text-sm font-devanagari leading-relaxed">
                   {settings.contact_info || 'केन्द्रीय कार्यालय | माहेश्वरी भवन, समाज मार्ग | +91 9039363610'}
                 </p>
                 <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100/50 inline-block">
                    <p className="text-[9px] text-orange-400 font-black uppercase tracking-widest mb-1">Developed By</p>
                    <p className="text-red-900 font-bold font-devanagari text-xs">Piyush Kumar Bhansali</p>
                 </div>
              </div>
           </div>

           <div className="space-y-6">
              <h4 className="text-[11px] font-black text-red-900 font-devanagari uppercase tracking-[0.2em]">मोबाइल एक्सेस</h4>
              <div className="flex items-center gap-3">
                 <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-[10px] font-mono text-slate-400">
                    maheshwari.library/sync
                 </div>
                 <button className="bg-slate-900 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform active:scale-90"><Smartphone size={20} /></button>
              </div>
           </div>
        </div>
        
        <div className="container mx-auto px-6 mt-20 pt-10 border-t border-orange-50 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] text-slate-400 font-devanagari uppercase tracking-[0.2em] font-bold">
            {settings.footer_copyright || '© 2025 अखिल भारतीय माहेश्वरी सभा।'}
          </p>
          <div className="flex items-center gap-8 text-[9px] font-black text-orange-300 uppercase tracking-widest font-devanagari">
             <span>प्राइवेसी पॉलिसी</span>
             <span>नियम व शर्तें</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicShelf;
