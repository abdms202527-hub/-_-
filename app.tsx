import React, { useState, useEffect, useRef } from 'react';
import { Menu, Calendar, Heart, Lock, LogOut, Upload, Home, Image as ImageIcon, Plus, Trash2, Save, Info, Phone, MapPin, Clock, CreditCard } from 'lucide-react';
import { AppState, AartiTiming, TempleEvent, GalleryImage } from './types';
import { getData, saveData, checkAdminAuth } from './datastore';
import { getDivineThought } from './gemini';
import { INITIAL_DATA } from './constants';

// --- Global Components ---

const ScrollingBanner = ({ message }: { message: string }) => (
  <div className="bg-[#FF9933] text-white py-1 overflow-hidden border-y border-[#FFD700] shadow-sm">
    <div className="animate-marquee whitespace-nowrap text-lg font-bold">
      <span className="mx-4">ॐ {message} ॐ</span>
      <span className="mx-4">ॐ {message} ॐ</span>
      <span className="mx-4">ॐ {message} ॐ</span>
      <span className="mx-4">ॐ {message} ॐ</span>
    </div>
  </div>
);

const Navbar = ({ onNavigate, currentPage, mainHeading }: { onNavigate: (page: string) => void, currentPage: string, mainHeading: string }) => (
  <nav className="sticky top-0 z-50 bg-[#800000] text-white shadow-lg border-b-4 border-[#FFD700]">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center h-20">
        <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
          <span className="text-3xl mr-2">ॐ</span>
          <h1 className="devotional-font text-xl md:text-3xl font-bold tracking-wider text-[#FFD700]">
            {mainHeading}
          </h1>
        </div>
        
        <div className="hidden md:flex space-x-8 font-medium">
          {['home', 'gallery', 'events', 'donation', 'contact'].map(page => (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className={`capitalize transition-colors duration-200 hover:text-[#FFD700] ${currentPage === page ? 'text-[#FFD700] border-b-2 border-[#FFD700]' : ''}`}
            >
              {page === 'home' ? 'मुख्य' : page === 'gallery' ? 'गैलरी' : page === 'events' ? 'कार्यक्रम' : page === 'donation' ? 'दान' : 'संपर्क'}
            </button>
          ))}
          <button onClick={() => onNavigate('admin')} className="text-[#FFD700] flex items-center hover:scale-105 transition-transform">
            <Lock size={16} className="mr-1" /> एडमिन
          </button>
        </div>

        <div className="md:hidden flex items-center" onClick={() => onNavigate('admin')}>
          <Menu className="text-[#FFD700]" />
        </div>
      </div>
    </div>
  </nav>
);

const Footer = ({ data }: { data: AppState }) => (
  <footer className="bg-[#4a0000] text-white py-12 mt-20 border-t-4 border-[#FFD700] relative overflow-hidden min-h-[300px] flex flex-col justify-center">
    {data.homepage.footerLeftImage && (
      <img src={data.homepage.footerLeftImage} className="hidden xl:block absolute left-4 bottom-4 w-48 h-48 object-contain opacity-30 pointer-events-none" alt="" />
    )}
    {data.homepage.footerRightImage && (
      <img src={data.homepage.footerRightImage} className="hidden xl:block absolute right-4 bottom-4 w-48 h-48 object-contain opacity-30 pointer-events-none" alt="" />
    )}

    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left relative z-10">
      <div>
        <h3 className="devotional-font text-2xl text-[#FFD700] mb-4">{data.homepage.footerTitle}</h3>
        <p className="text-gray-300">{data.homepage.footerDescription}</p>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-4 text-[#FFD700]">त्वरित संपर्क</h4>
        <p className="flex items-center justify-center md:justify-start gap-2 mb-2"><Info size={16}/> {data.homepage.footerEmail}</p>
        <p className="flex items-center justify-center md:justify-start gap-2 mb-2"><Phone size={16}/> {data.homepage.footerPhone}</p>
        <p className="flex items-center justify-center md:justify-start gap-2"><MapPin size={16}/> {data.homepage.footerAddress}</p>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-4 text-[#FFD700]">दर्शन समय</h4>
        <p className="flex items-center justify-center md:justify-start gap-2 mb-2"><Clock size={16}/> प्रातः: {data.homepage.footerMorningTime}</p>
        <p className="flex items-center justify-center md:justify-start gap-2"><Clock size={16}/> संध्या: {data.homepage.footerEveningTime}</p>
      </div>
    </div>
    <div className="text-center mt-10 pt-8 border-t border-white/10 text-gray-400 relative z-10">
      <p>&copy; 2024 {data.homepage.mainHeading}. समस्त अधिकार सुरक्षित।</p>
    </div>
  </footer>
);

// --- Public Pages ---

const HomeView = ({ data }: { data: AppState }) => (
  <div className="animate-fadeIn">
    <section className="relative h-[70vh] overflow-hidden">
      <img src={data.homepage.heroImage} alt="Temple" className="w-full h-full object-cover brightness-[0.4]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
        <h2 className="devotional-font text-5xl md:text-8xl text-[#FFD700] drop-shadow-2xl mb-6">{data.homepage.heroTitle}</h2>
        <div className="max-w-3xl bg-black/40 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-2xl">
          <p className="text-white text-xl md:text-2xl italic leading-relaxed font-light">
            {data.homepage.welcomeMessage}
          </p>
        </div>
      </div>
    </section>

    <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 md:p-14 rounded-[2rem] shadow-2xl border-l-[12px] border-[#FF9933] flex flex-col justify-center transform transition hover:scale-[1.01]">
          <h3 className="text-[#800000] font-black text-2xl mb-6 flex items-center uppercase tracking-tighter">
            <Heart className="mr-3 text-red-600 animate-pulse" fill="currentColor" /> आज का दिव्य संदेश
          </h3>
          <p className="text-3xl md:text-5xl italic text-gray-800 leading-tight font-serif font-bold text-center md:text-left">
            "{data.homepage.dailyThought}"
          </p>
        </div>

        <div className="bg-white p-3 rounded-[2rem] shadow-2xl border-4 border-[#FFD700] group relative overflow-hidden min-h-[400px]">
          <h3 className="absolute top-6 left-6 z-10 bg-[#800000] text-[#FFD700] px-6 py-2 rounded-full text-sm font-bold shadow-2xl border border-[#FFD700] uppercase tracking-widest">
            आज का दिव्य दर्शन
          </h3>
          <img 
            src={data.homepage.todaysDarshanImage} 
            alt="Today's Darshan" 
            className="w-full h-full object-cover rounded-[1.5rem] group-hover:scale-110 transition-transform duration-1000" 
          />
        </div>
      </div>

      <div className="bg-[#800000] p-8 md:p-12 rounded-[2.5rem] shadow-2xl text-white border-b-[6px] border-[#FFD700]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-5">
             <div className="bg-[#FF9933] p-4 rounded-2xl shadow-xl">
               <Calendar className="text-white" size={32} />
             </div>
             <div className="text-left">
               <h3 className="font-bold text-3xl devotional-font text-[#FFD700] tracking-wide mb-1">आरती समय सारणी</h3>
               <p className="text-orange-200 text-sm">नियमित रूप से शामिल होकर पुण्य लाभ उठाएं</p>
             </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full md:w-auto">
            {data.aartiTimings.map(t => (
              <div key={t.id} className="bg-white/10 px-6 py-4 rounded-2xl border border-white/20 flex flex-col items-center backdrop-blur-sm hover:bg-white/20 transition-all">
                <span className="text-xs font-bold opacity-70 uppercase tracking-[0.2em] mb-2">{t.name}</span>
                <span className="text-2xl font-black text-[#FFD700]">{t.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const GalleryView = ({ data }: { data: AppState }) => (
  <section className="max-w-7xl mx-auto px-4 py-16">
    <div className="text-center mb-16">
      <h2 className="devotional-font text-5xl text-[#800000] mb-4">दिव्य दर्शन गैलरी</h2>
      <div className="h-1.5 w-32 bg-[#FFD700] mx-auto rounded-full"></div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {data.gallery.map(img => (
        <div key={img.id} className="group relative overflow-hidden rounded-3xl shadow-2xl aspect-[4/3] bg-gray-200 cursor-pointer">
          <img src={img.url} alt={img.caption} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
            <p className="text-[#FFD700] font-black text-2xl mb-1">{img.caption}</p>
            <p className="text-white/70 text-sm">ॐ नमो भगवते विठ्ठलाय</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const EventsView = ({ data }: { data: AppState }) => (
  <section className="max-w-5xl mx-auto px-4 py-16">
    <div className="text-center mb-16">
      <h2 className="devotional-font text-5xl text-[#800000] mb-4">आगामी धार्मिक कार्यक्रम</h2>
      <div className="h-1.5 w-32 bg-[#FFD700] mx-auto rounded-full"></div>
    </div>
    <div className="space-y-10">
      {data.events.map(event => (
        <div key={event.id} className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row hover:shadow-2xl transition-shadow">
          <div className="bg-[#800000] text-white p-8 md:w-56 flex flex-col items-center justify-center text-center">
            <Calendar size={48} className="mb-4 text-[#FFD700]" />
            <span className="text-2xl font-black">{new Date(event.date).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' })}</span>
            <span className="text-sm opacity-70">{new Date(event.date).getFullYear()}</span>
          </div>
          <div className="p-10 flex-1">
            <h3 className="text-3xl font-black text-[#800000] mb-4">{event.title}</h3>
            <p className="text-gray-600 leading-relaxed text-lg">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const DonationView = ({ data }: { data: AppState }) => (
  <section className="max-w-5xl mx-auto px-4 py-16">
    <div className="bg-[#FFFDD0] rounded-[3rem] border-4 border-[#FFD700] shadow-2xl p-8 md:p-16 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF9933]/5 rounded-full -mr-32 -mt-32"></div>
      <h2 className="devotional-font text-5xl text-center mb-12 text-[#800000] relative z-10">दान सेवा एवं सहयोग</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-8 bg-white p-10 rounded-[2rem] shadow-xl border-l-[12px] border-[#FF9933]">
          <h3 className="text-3xl font-black text-[#800000] flex items-center gap-3">
            <CreditCard size={28}/> बैंक विवरण
          </h3>
          <div className="space-y-6">
            <div className="group">
              <label className="text-xs text-gray-400 uppercase tracking-widest font-bold">बैंक का नाम</label>
              <p className="text-xl font-bold text-gray-800">{data.donation.bankName}</p>
            </div>
            <div className="group">
              <label className="text-xs text-gray-400 uppercase tracking-widest font-bold">खाता संख्या</label>
              <p className="text-3xl font-black text-[#800000] tracking-tighter">{data.donation.accountNumber}</p>
            </div>
            <div className="group">
              <label className="text-xs text-gray-400 uppercase tracking-widest font-bold">IFSC कोड</label>
              <p className="text-xl font-bold text-gray-800">{data.donation.ifscCode}</p>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <label className="text-xs text-gray-400 uppercase tracking-widest font-bold">UPI ID</label>
              <p className="text-lg font-bold text-[#FF9933]">{data.donation.upiId}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="bg-white p-8 rounded-[3rem] shadow-2xl border-4 border-[#FFD700] transform transition hover:scale-105 duration-500">
            <img src={data.donation.qrCodeUrl} alt="UPI QR" className="w-56 h-56" />
          </div>
          <div className="mt-8">
            <p className="text-[#800000] font-black text-2xl uppercase tracking-widest mb-2">SCAN TO PAY</p>
            <p className="text-gray-500 italic">"दान से ही धन की शुद्धि होती है"</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ContactView = () => (
  <section className="max-w-6xl mx-auto px-4 py-16">
    <div className="text-center mb-16">
      <h2 className="devotional-font text-5xl text-[#800000] mb-4">संपर्क सूत्र</h2>
      <div className="h-1.5 w-32 bg-[#FFD700] mx-auto rounded-full"></div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border-t-[12px] border-[#800000]">
        <h3 className="text-3xl font-black mb-8">सन्देश भेजें</h3>
        <form className="space-y-6" onSubmit={e => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-200 transition-all shadow-inner" placeholder="आपका नाम" />
            <input type="email" className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-200 transition-all shadow-inner" placeholder="ईमेल पता" />
          </div>
          <textarea className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl h-44 outline-none focus:ring-2 focus:ring-orange-200 transition-all shadow-inner" placeholder="आपका सन्देश..."></textarea>
          <button className="w-full bg-[#800000] text-white py-5 rounded-2xl font-black text-xl hover:bg-[#600000] transition-colors shadow-xl">सन्देश भेजें</button>
        </form>
      </div>
      <div className="rounded-[2.5rem] overflow-hidden min-h-[400px] shadow-2xl border-4 border-white relative">
        <iframe 
          title="Temple Location Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.123456789!2d73.8567!3d18.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDMxJzEzLjQiTiA3M8KwNTEnMjQuMSJF!5e0!3m2!1sen!2sin!4v1625000000000!5m2!1sen!2sin" 
          width="100%" height="100%" style={{ border: 0 }} allowFullScreen={false} loading="lazy"
        ></iframe>
      </div>
    </div>
  </section>
);

// --- Admin Panel ---

const AdminPanel = ({ data, onUpdateData, onLogout }: { data: AppState, onUpdateData: React.Dispatch<React.SetStateAction<AppState | null>>, onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState('homepage');
  const [isFetchingThought, setIsFetchingThought] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Refs for file inputs
  const galleryFileRef = useRef<HTMLInputElement>(null);
  const heroFileRef = useRef<HTMLInputElement>(null);
  const footerLeftFileRef = useRef<HTMLInputElement>(null);
  const footerRightFileRef = useRef<HTMLInputElement>(null);

  // Use functional updates to ensure latest state is always used
  const updateHomepage = (field: string, value: any) => {
    onUpdateData(prev => prev ? ({ ...prev, homepage: { ...prev.homepage, [field]: value } }) : prev);
  };

  const updateDonation = (field: string, value: any) => {
    onUpdateData(prev => prev ? ({ ...prev, donation: { ...prev.donation, [field]: value } }) : prev);
  };

  const handleFetchThought = async () => {
    setIsFetchingThought(true);
    const thought = await getDivineThought();
    updateHomepage('dailyThought', thought);
    setIsFetchingThought(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFinalSave = async () => {
    setIsSaving(true);
    try {
      await saveData(data);
      alert('सभी सेटिंग्स सुरक्षित कर दी गई हैं! अब आपकी वेबसाइट अपडेटेड है।');
    } catch (e) {
      alert('सेव करने में समस्या आई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen">
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border-2 border-[#800000]">
        <div className="bg-[#800000] p-8 text-white flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-[#FF9933] p-3 rounded-2xl"><Lock size={24} /></div>
            <h2 className="text-3xl font-black devotional-font tracking-wide">मन्दिर प्रबंधन पोर्टल</h2>
          </div>
          <button onClick={onLogout} className="bg-white/10 hover:bg-white/30 px-8 py-3 rounded-2xl flex items-center gap-2 border border-white/20 transition-all">
            <LogOut size={20} /> लॉगआउट
          </button>
        </div>

        <div className="flex flex-col md:flex-row min-h-[80vh]">
          <div className="w-full md:w-80 bg-gray-50 border-r border-gray-100 p-6 space-y-3 overflow-y-auto">
            {[
              { id: 'homepage', label: 'होमपेज सामग्री', icon: Home },
              { id: 'gallery', label: 'दर्शन एवं गैलरी', icon: ImageIcon },
              { id: 'events', label: 'कार्यक्रम प्रबंधन', icon: Calendar },
              { id: 'aarti', label: 'आरती समय', icon: Clock },
              { id: 'donation', label: 'दान एवं बैंक', icon: CreditCard },
              { id: 'footer', label: 'संपर्क एवं फुटर', icon: Info }
            ].map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                className={`w-full text-left px-6 py-4 rounded-2xl flex items-center gap-4 font-bold transition-all ${activeTab === tab.id ? 'bg-[#FF9933] text-white shadow-xl scale-[1.02]' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                <tab.icon size={22} /> {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 p-8 md:p-12 overflow-y-auto max-h-[80vh] hide-scrollbar">
            {activeTab === 'homepage' && (
              <div className="space-y-8 animate-fadeIn">
                <h3 className="text-2xl font-black text-[#800000] border-b pb-4">होमपेज सेटिंग्स</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">मुख्य शीर्षक</label>
                    <input className="w-full p-4 bg-gray-50 rounded-xl outline-none border focus:border-orange-400" value={data.homepage.mainHeading} onChange={e => updateHomepage('mainHeading', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">हीरो शीर्षक</label>
                    <input className="w-full p-4 bg-gray-50 rounded-xl outline-none border focus:border-orange-400" value={data.homepage.heroTitle} onChange={e => updateHomepage('heroTitle', e.target.value)} />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold text-gray-500">हीरो बैकग्राउंड इमेज (Hero Image)</label>
                    <div className="flex flex-col gap-4">
                      <div className="flex gap-4 items-center">
                        <input className="flex-1 p-4 bg-gray-50 rounded-xl outline-none border focus:border-orange-400" placeholder="Image URL" value={data.homepage.heroImage} onChange={e => updateHomepage('heroImage', e.target.value)} />
                        <button onClick={() => heroFileRef.current?.click()} className="bg-[#800000] text-white p-4 rounded-xl flex items-center gap-2 hover:bg-[#600000] transition-colors shadow-lg">
                          <Upload size={20} /> अपलोड
                        </button>
                        <input type="file" ref={heroFileRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e, base64 => updateHomepage('heroImage', base64))} />
                      </div>
                      <div className="w-full h-48 bg-gray-100 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
                        {data.homepage.heroImage ? (
                          <img src={data.homepage.heroImage} className="w-full h-full object-cover" alt="Hero Preview" />
                        ) : (
                          <span className="text-gray-400 italic">No image selected</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold text-gray-500">स्क्रॉलिंग संदेश</label>
                    <input className="w-full p-4 bg-gray-50 rounded-xl outline-none border focus:border-orange-400" value={data.homepage.scrollingMessage} onChange={e => updateHomepage('scrollingMessage', e.target.value)} />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold text-gray-500">स्वागत संदेश</label>
                    <input className="w-full p-4 bg-gray-50 rounded-xl outline-none border focus:border-orange-400" value={data.homepage.welcomeMessage} onChange={e => updateHomepage('welcomeMessage', e.target.value)} />
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-gray-500">आज का दिव्य विचार</label>
                      <button onClick={handleFetchThought} disabled={isFetchingThought} className="bg-orange-100 text-orange-700 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-orange-200 transition-colors">
                        {isFetchingThought ? 'जेनरेट हो रहा है...' : 'AI से नया विचार पाएँ'}
                      </button>
                    </div>
                    <textarea className="w-full p-4 bg-gray-50 rounded-xl outline-none border focus:border-orange-400 h-24 italic" value={data.homepage.dailyThought} onChange={e => updateHomepage('dailyThought', e.target.value)} />
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'gallery' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="flex justify-between items-center border-b pb-4">
                  <h3 className="text-2xl font-black text-[#800000]">दर्शन एवं गैलरी</h3>
                  <button onClick={() => galleryFileRef.current?.click()} className="bg-[#800000] text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg">
                    <Plus size={20} /> नया चित्र अपलोड करें
                  </button>
                  <input type="file" ref={galleryFileRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e, base64 => onUpdateData(prev => prev ? ({ ...prev, gallery: [{ id: Date.now().toString(), url: base64, caption: 'नया दर्शन' }, ...prev.gallery] }) : prev)))} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.gallery.map(img => (
                    <div key={img.id} className="relative group rounded-3xl overflow-hidden shadow-lg border-2 border-gray-100 bg-white p-2">
                      <img src={img.url} className="w-full h-44 object-cover rounded-2xl mb-4" alt="Gallery" />
                      <input className="w-full p-2 bg-gray-50 rounded-lg border outline-none text-sm mb-4" value={img.caption} onChange={e => onUpdateData(prev => prev ? ({ ...prev, gallery: prev.gallery.map(i => i.id === img.id ? { ...i, caption: e.target.value } : i) }) : prev)} />
                      <div className="flex gap-2">
                        <button onClick={() => updateHomepage('todaysDarshanImage', img.url)} className={`flex-1 text-[10px] py-2 rounded-xl border transition-all font-bold uppercase ${data.homepage.todaysDarshanImage === img.url ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-400 border-gray-200'}`}>✓ आज का दर्शन</button>
                        <button onClick={() => onUpdateData(prev => prev ? ({ ...prev, gallery: prev.gallery.filter(i => i.id !== img.id) }) : prev)} className="bg-red-50 text-red-500 p-2 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="flex justify-between items-center border-b pb-4">
                  <h3 className="text-2xl font-black text-[#800000]">कार्यक्रम प्रबंधन</h3>
                  <button onClick={() => onUpdateData(prev => prev ? ({...prev, events: [{id: Date.now().toString(), title: '', date: '', description: ''}, ...prev.events]}) : prev)} className="bg-[#800000] text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg">
                    <Plus size={20} /> नया कार्यक्रम जोड़ें
                  </button>
                </div>
                <div className="space-y-4">
                  {data.events.map(event => (
                    <div key={event.id} className="bg-white p-6 rounded-[2rem] border-2 border-gray-100 shadow-md space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input className="p-4 bg-gray-50 rounded-xl border outline-none font-bold" placeholder="कार्यक्रम का नाम" value={event.title} onChange={e => onUpdateData(prev => prev ? ({ ...prev, events: prev.events.map(ev => ev.id === event.id ? { ...ev, title: e.target.value } : ev)}) : prev)} />
                        <input type="date" className="p-4 bg-gray-50 rounded-xl border outline-none" value={event.date} onChange={e => onUpdateData(prev => prev ? ({ ...prev, events: prev.events.map(ev => ev.id === event.id ? { ...ev, date: e.target.value } : ev)}) : prev)} />
                      </div>
                      <textarea className="w-full p-4 bg-gray-50 rounded-xl border outline-none h-20" placeholder="विशेष महापूजा और पालखी समारोह..." value={event.description} onChange={e => onUpdateData(prev => prev ? ({ ...prev, events: prev.events.map(ev => ev.id === event.id ? { ...ev, description: e.target.value } : ev)}) : prev)} />
                      <button onClick={() => onUpdateData(prev => prev ? ({ ...prev, events: prev.events.filter(ev => ev.id !== event.id) }) : prev)} className="text-red-500 flex items-center gap-2 font-bold px-2 hover:text-red-700 transition-colors"><Trash2 size={16} /> इस कार्यक्रम को हटाएँ</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'aarti' && (
              <div className="space-y-8 animate-fadeIn">
                <h3 className="text-2xl font-black text-[#800000] border-b pb-4">आरती समय प्रबंधन</h3>
                <div className="space-y-6">
                  {data.aartiTimings.map(aarti => (
                    <div key={aarti.id} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">आरती का नाम</label>
                        <input className="w-full p-4 bg-gray-50 rounded-xl outline-none border font-bold" value={aarti.name} onChange={e => onUpdateData(prev => prev ? ({...prev, aartiTimings: prev.aartiTimings.map(t => t.id === aarti.id ? {...t, name: e.target.value} : t)}) : prev)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">समय</label>
                        <input className="w-full p-4 bg-gray-50 rounded-xl outline-none border font-bold" value={aarti.time} onChange={e => onUpdateData(prev => prev ? ({...prev, aartiTimings: prev.aartiTimings.map(t => t.id === aarti.id ? {...t, time: e.target.value} : t)}) : prev)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'donation' && (
              <div className="space-y-8 animate-fadeIn">
                <h3 className="text-2xl font-black text-[#800000] border-b pb-4">दान सेवा सेटिंग्स</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">बैंक का नाम</label>
                    <input className="w-full p-4 bg-gray-50 rounded-xl outline-none border" value={data.donation.bankName} onChange={e => updateDonation('bankName', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">खाता संख्या (Account No.)</label>
                    <input className="w-full p-4 bg-gray-50 rounded-xl outline-none border" value={data.donation.accountNumber} onChange={e => updateDonation('accountNumber', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">IFSC कोड</label>
                    <input className="w-full p-4 bg-gray-50 rounded-xl outline-none border" value={data.donation.ifscCode} onChange={e => updateDonation('ifscCode', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">UPI ID</label>
                    <input className="w-full p-4 bg-gray-50 rounded-xl outline-none border" value={data.donation.upiId} onChange={e => updateDonation('upiId', e.target.value)} />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold text-gray-500">QR कोड चित्र (URL)</label>
                    <div className="flex gap-4">
                      <input className="flex-1 p-4 bg-gray-50 rounded-xl outline-none border" value={data.donation.qrCodeUrl} onChange={e => updateDonation('qrCodeUrl', e.target.value)} />
                      <div className="w-16 h-16 bg-white rounded-lg border flex items-center justify-center p-1"><img src={data.donation.qrCodeUrl} className="max-w-full max-h-full" alt="QR Preview" /></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'footer' && (
              <div className="space-y-8 animate-fadeIn">
                <h3 className="text-2xl font-black text-[#800000] border-b pb-4">संपर्क एवं फुटर विवरण</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">ईमेल (Email)</label>
                    <input className="w-full p-4 bg-gray-50 rounded-xl outline-none border" value={data.homepage.footerEmail} onChange={e => updateHomepage('footerEmail', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">फोन नम्बर (Phone)</label>
                    <input className="w-full p-4 bg-gray-50 rounded-xl outline-none border" value={data.homepage.footerPhone} onChange={e => updateHomepage('footerPhone', e.target.value)} />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold text-gray-500">मन्दिर का पता (Address)</label>
                    <input className="w-full p-4 bg-gray-50 rounded-xl outline-none border" value={data.homepage.footerAddress} onChange={e => updateHomepage('footerAddress', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">प्रातःकाल दर्शन समय</label>
                    <input className="w-full p-4 bg-gray-50 rounded-xl outline-none border" value={data.homepage.footerMorningTime} onChange={e => updateHomepage('footerMorningTime', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">संध्याकाल दर्शन समय</label>
                    <input className="w-full p-4 bg-gray-50 rounded-xl outline-none border" value={data.homepage.footerEveningTime} onChange={e => updateHomepage('footerEveningTime', e.target.value)} />
                  </div>
                  
                  {/* Footer Left Image Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">फुटर बायीं इमेज (Left Image)</label>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <input className="flex-1 p-3 bg-gray-50 rounded-xl outline-none border text-xs" placeholder="URL" value={data.homepage.footerLeftImage} onChange={e => updateHomepage('footerLeftImage', e.target.value)} />
                        <button onClick={() => footerLeftFileRef.current?.click()} className="bg-[#800000] text-white p-3 rounded-xl hover:bg-[#600000] transition-colors shadow-md">
                          <Upload size={16} />
                        </button>
                        <input type="file" ref={footerLeftFileRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e, base64 => updateHomepage('footerLeftImage', base64))} />
                      </div>
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border self-center">
                        {data.homepage.footerLeftImage && <img src={data.homepage.footerLeftImage} className="w-full h-full object-contain" alt="Left Footer" />}
                      </div>
                    </div>
                  </div>

                  {/* Footer Right Image Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">फुटर दायीं इमेज (Right Image)</label>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <input className="flex-1 p-3 bg-gray-50 rounded-xl outline-none border text-xs" placeholder="URL" value={data.homepage.footerRightImage} onChange={e => updateHomepage('footerRightImage', e.target.value)} />
                        <button onClick={() => footerRightFileRef.current?.click()} className="bg-[#800000] text-white p-3 rounded-xl hover:bg-[#600000] transition-colors shadow-md">
                          <Upload size={16} />
                        </button>
                        <input type="file" ref={footerRightFileRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e, base64 => updateHomepage('footerRightImage', base64))} />
                      </div>
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border self-center">
                        {data.homepage.footerRightImage && <img src={data.homepage.footerRightImage} className="w-full h-full object-contain" alt="Right Footer" />}
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold text-gray-500">फुटर संक्षिप्त विवरण (Footer Description)</label>
                    <textarea className="w-full p-4 bg-gray-50 rounded-xl outline-none border h-24" value={data.homepage.footerDescription} onChange={e => updateHomepage('footerDescription', e.target.value)} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 border-t p-6 flex justify-end">
          <button 
            onClick={handleFinalSave} 
            disabled={isSaving}
            className={`bg-green-600 text-white px-12 py-4 rounded-[1.5rem] font-black text-lg flex items-center gap-3 shadow-2xl transition-all hover:scale-105 ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
          >
            {isSaving ? (
              <>
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                सुरक्षित हो रहा है...
              </>
            ) : (
              <>
                <Save size={24} /> सभी सेटिंग्स सुरक्षित करें (Save All)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [page, setPage] = useState('home');
  const [data, setData] = useState<AppState | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const fetched = await getData();
        setData(fetched || INITIAL_DATA);
      } catch (err) {
        console.warn("Init Fetch Error:", err);
        setData(INITIAL_DATA);
      }
    };
    init();
  }, []);

  if (!data) return (
    <div className="min-h-screen bg-[#FFFDD0] flex flex-col items-center justify-center gap-6">
      <div className="w-24 h-24 border-8 border-[#FF9933] border-t-transparent rounded-full animate-spin"></div>
      <div className="text-3xl font-black devotional-font text-[#800000]">ॐ श्री विठ्ठलाय नमः ॐ</div>
    </div>
  );

  const renderContent = () => {
    if (page === 'admin') {
      if (!isAdmin) {
        return (
          <div className="flex items-center justify-center min-h-[70vh] px-4">
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-t-[12px] border-[#800000] w-full max-w-lg">
              <h2 className="text-3xl font-black mb-8 text-center text-[#800000] devotional-font">एडमिन लॉगिन</h2>
              <form onSubmit={e => {
                e.preventDefault();
                if (checkAdminAuth(adminUser, adminPass)) { setIsAdmin(true); setLoginError(''); }
                else setLoginError('गलत यूज़रनाम या पासवर्ड!');
              }} className="space-y-6">
                <input type="text" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border focus:ring-2 focus:ring-orange-200 outline-none" value={adminUser} onChange={e => setAdminUser(e.target.value)} placeholder="username" />
                <input type="password" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border focus:ring-2 focus:ring-orange-200 outline-none" value={adminPass} onChange={e => setAdminPass(e.target.value)} placeholder="••••••••" />
                {loginError && <div className="text-red-600 text-sm font-bold text-center">{loginError}</div>}
                <button type="submit" className="w-full bg-[#800000] text-white py-5 rounded-2xl font-black text-xl hover:bg-[#600000] shadow-lg transition-colors">लॉगिन करें</button>
              </form>
            </div>
          </div>
        );
      }
      return <AdminPanel data={data} onUpdateData={setData} onLogout={() => setIsAdmin(false)} />;
    }
    switch (page) {
      case 'home': return <HomeView data={data} />;
      case 'gallery': return <GalleryView data={data} />;
      case 'events': return <EventsView data={data} />;
      case 'donation': return <DonationView data={data} />;
      case 'contact': return <ContactView />;
      default: return <HomeView data={data} />;
    }
  };

  return (
    <div className="min-h-screen divine-bg flex flex-col font-mukta selection:bg-orange-100">
      <Navbar onNavigate={setPage} currentPage={page} mainHeading={data.homepage.mainHeading} />
      <ScrollingBanner message={data.homepage.scrollingMessage} />
      <main className="flex-grow">{renderContent()}</main>
      {page !== 'admin' && <Footer data={data} />}
    </div>
  );
}