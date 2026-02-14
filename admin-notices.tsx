
import React, { useState } from 'react';
import { Megaphone, Plus, Trash2, Clock } from 'lucide-react';

const AdminNotices: React.FC = () => {
  const [notices, setNotices] = useState([
    { id: '1', content: 'समाज की नई पत्रिका "शुभ शगुन" अब लाइव है!', active: true },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
         <span className="text-blue-600 text-sm font-devanagari flex items-center gap-2">
             <div className="w-1 h-1 rounded-full bg-blue-600"></div> डिजिटल आर्काइव
          </span>
      </div>
      <h1 className="text-3xl font-bold text-slate-800 font-devanagari">सूचना प्रबंधन</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Add Notice */}
         <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 text-blue-600">
               <Megaphone size={20} />
               <h3 className="font-bold font-devanagari">नई सूचना जारी करें</h3>
            </div>
            <textarea 
              placeholder="यहाँ सूचना टाइप करें जो वेबसाइट के टिकर में दिखाई देगी..."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 h-40 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-devanagari text-slate-600 resize-none"
            />
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold font-devanagari shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all">
              <Plus size={20} />
              सूचना सूची में जोड़ें
            </button>
         </div>

         {/* Active Notices */}
         <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 font-devanagari mb-6 uppercase tracking-wider">सक्रिय सूचनाएं (ACTIVE)</h3>
            <div className="space-y-4">
              {notices.length > 0 ? (
                notices.map((notice) => (
                  <div key={notice.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-4 group">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-500">
                      <Megaphone size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="font-devanagari text-slate-700 leading-relaxed">{notice.content}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="flex items-center gap-1.5 text-[10px] text-slate-400 font-devanagari">
                          <Clock size={12} /> अभी सक्रिय
                        </span>
                        <button className="text-[10px] text-red-400 font-devanagari hover:text-red-600 transition-colors">
                          हटाएं
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-300">
                   <p className="font-devanagari">कोई सक्रिय सूचना नहीं है।</p>
                </div>
              )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminNotices;
