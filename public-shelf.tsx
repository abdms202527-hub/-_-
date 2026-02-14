
import React, { useState, useEffect } from 'react';
import { Search, BookOpen, ExternalLink, Smartphone, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const PublicShelf: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('सभी');

  const categories = ['सभी', 'पत्रिका', 'विशेषांक', 'स्मृति लेख', 'कार्यकारिणी'];

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      {/* Top Banner / Ticker */}
      <div className="bg-slate-900 text-white py-3 overflow-hidden border-b border-slate-800">
        <div className="flex items-center gap-6 animate-marquee whitespace-nowrap">
           <span className="flex items-center gap-2 font-devanagari text-sm text-blue-400 font-bold">
             <Info size={16} /> महत्वपूर्ण सूचना:
           </span>
           <span className="font-devanagari text-sm tracking-wide">
             अखिल भारतीय धा. माहेश्वरी सभा केन्द्रीय कार्यकारिणी समिति की नई पत्रिका "शुभ शगुन" अब लाइव है! कृपया यहाँ से पढ़ना शुरू करें।
           </span>
           <span className="mx-8 opacity-20">|</span>
           <span className="font-devanagari text-sm tracking-wide">
             डिजिटल लाइब्रेरी का नया संस्करण अब मोबाइल फ्रेंडली हो गया है।
           </span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
               <BookOpen className="text-white" size={24} />
            </div>
            <div>
               <h1 className="text-xl font-bold text-slate-800 font-devanagari leading-tight">
                 अखिल भारतीय धा. माहेश्वरी सभा केन्द्रीय कार्यकारिणी समिति
               </h1>
               <p className="text-xs text-slate-400 font-devanagari">डिजिटल लाइब्रेरी एवं आर्काइव</p>
            </div>
          </div>
          
          <Link to="/admin" className="hidden md:flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-devanagari text-sm">
             एडमिन लॉगिन
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-12 border-b border-slate-100">
         <div className="container mx-auto px-4 text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 font-devanagari">
              समाज की ज्ञान संपदा, अब <span className="text-blue-600">आपके हाथ में</span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-devanagari">
              हमारी डिजिटल लाइब्रेरी पर समाज के सभी गौरवशाली प्रकाशनों को पढ़ना शुरू करें। आप यहाँ से सभी विशेषांक और पत्रिकाएँ एक्सेस कर सकते हैं।
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

      {/* Categories */}
      <div className="container mx-auto px-4 py-8">
         <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-6 py-2 rounded-full font-devanagari text-sm whitespace-nowrap transition-all ${
                  category === cat 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                    : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
         </div>

         {/* Magazine Grid */}
         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mt-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((m) => (
              <div key={m} className="group cursor-pointer">
                 <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-xl shadow-slate-200/50 group-hover:-translate-y-2 transition-transform duration-500 border-4 border-white">
                    <img 
                      src={`https://picsum.photos/seed/${m}/400/533`} 
                      alt="cover" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                       <button className="bg-white text-blue-600 font-bold py-2 rounded-lg text-sm font-devanagari shadow-lg">
                          अभी पढ़ें
                       </button>
                    </div>
                    {m === 1 && (
                      <span className="absolute top-3 left-3 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded font-devanagari font-bold uppercase shadow">नवीनतम</span>
                    )}
                 </div>
                 <div className="mt-4 space-y-1">
                    <h3 className="font-bold text-slate-800 font-devanagari text-sm group-hover:text-blue-600 transition-colors line-clamp-1">
                      शुभ शगुन - वर्ष 2024
                    </h3>
                    <p className="text-[10px] text-slate-400 font-devanagari uppercase tracking-wider">पत्रिका (MAGAZINE)</p>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-20 py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
           <div className="space-y-4">
              <h4 className="font-bold text-slate-800 font-devanagari">हमारे बारे में</h4>
              <p className="text-slate-500 text-sm font-devanagari leading-relaxed">
                अखिल भारतीय धा. माहेश्वरी सभा केन्द्रीय कार्यकारिणी समिति की ओर से यह डिजिटल लाइब्रेरी आपके लिए समर्पित है। यहाँ आप समाज के ऐतिहासिक और सामयिक प्रकाशन देख सकते हैं।
              </p>
           </div>
           <div className="space-y-4">
              <h4 className="font-bold text-slate-800 font-devanagari">संपर्क जानकारी</h4>
              <p className="text-slate-500 text-sm font-devanagari flex items-center gap-2">
                 अधिक जानकारी के लिए संपर्क | +91 9039363610
              </p>
              <p className="text-xs text-slate-400 font-devanagari">
                Application developed by Piyush Kumar Bhansali
              </p>
           </div>
           <div className="space-y-4">
              <h4 className="font-bold text-slate-800 font-devanagari">सिंक लिंक</h4>
              <div className="flex items-center gap-2">
                 <input 
                   disabled 
                   value="library.sync/mobile" 
                   className="flex-1 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-xs font-mono"
                 />
                 <button className="bg-slate-800 text-white p-2 rounded-lg hover:bg-slate-700 transition-colors">
                    <Smartphone size={16} />
                 </button>
              </div>
           </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-100 text-center text-[10px] text-slate-400 uppercase tracking-widest font-devanagari">
          © 2025-27 डिजिटल लाइब्रेरी। अखिल भारतीय धा. माहेश्वरी सभा केन्द्रीय कार्यकारिणी समिति द्वारा सर्वाधिकार सुरक्षित।
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 30s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .font-devanagari {
          font-family: 'Noto Sans Devanagari', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default PublicShelf;
