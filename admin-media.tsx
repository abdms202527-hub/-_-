
import React from 'react';
import { Image as ImageIcon, Upload, Search } from 'lucide-react';

const AdminMedia: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <span className="text-blue-600 text-sm font-devanagari flex items-center gap-2">
             <div className="w-1 h-1 rounded-full bg-blue-600"></div> डिजिटल आर्काइव
          </span>
          <h1 className="text-3xl font-bold text-slate-800 font-devanagari">मीडिया गैलरी</h1>
        </div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold font-devanagari flex items-center gap-2 shadow-lg shadow-orange-100 transition-all">
          <Upload size={20} />
          लाइब्रेरी में इमेज जोड़ें
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 min-h-[500px] flex flex-col">
         <div className="flex flex-col gap-6 mb-8">
            <h3 className="text-xl font-bold text-slate-800 font-devanagari">मीडिया लाइब्रेरी</h3>
            <p className="text-slate-400 font-devanagari text-sm">वेबसाइट के लिए सभी चित्र यहाँ प्रबंधित करें</p>
         </div>

         {/* Grid Placeholders */}
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-slate-50 border-2 border-dashed border-slate-100 rounded-3xl flex items-center justify-center group cursor-pointer hover:border-blue-200 transition-colors">
                <div className="text-slate-200 group-hover:text-blue-200 transition-colors">
                  <ImageIcon size={48} />
                </div>
              </div>
            ))}
         </div>

         {/* Empty State message */}
         <div className="flex-1 flex flex-col items-center justify-center text-slate-300 py-12">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
               <ImageIcon size={32} />
            </div>
            <p className="font-devanagari text-lg">आपकी गैलरी अभी खाली है</p>
         </div>
      </div>
    </div>
  );
};

export default AdminMedia;
