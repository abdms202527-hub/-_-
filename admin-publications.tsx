
import React, { useState } from 'react';
/* Added Image as ImageIcon to imports */
import { Plus, Search, Edit2, Trash2, ExternalLink, Image as ImageIcon } from 'lucide-react';

const AdminPublications: React.FC = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-blue-600 text-sm font-devanagari flex items-center gap-2">
             <div className="w-1 h-1 rounded-full bg-blue-600"></div> डिजिटल आर्काइव
          </span>
          <h1 className="text-3xl font-bold text-slate-800 font-devanagari">प्रकाशन प्रबंधन</h1>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold font-devanagari flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95">
          <Plus size={20} />
          नया प्रकाशन जोड़ें
        </button>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
        <Search className="text-slate-400" size={20} />
        <input 
          type="text"
          placeholder="शीर्षक से खोजें..."
          className="flex-1 outline-none text-slate-600 font-devanagari"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 font-devanagari text-sm">
            <tr>
              <th className="px-6 py-4">कवर इमेज</th>
              <th className="px-6 py-4">पत्रिका जानकारी</th>
              <th className="px-6 py-4 text-center">एक्सेस लिंक</th>
              <th className="px-6 py-4 text-right">एक्शन</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[1].map((p) => (
              <tr key={p} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <img src="https://picsum.photos/seed/mag/100/140" alt="cover" className="w-12 h-16 rounded object-cover shadow" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 font-devanagari">शुभ शगुन - समाज की डिजिटल पत्रिका</span>
                    <span className="bg-green-100 text-green-600 text-[10px] px-1.5 py-0.5 rounded font-devanagari font-bold">नवीनतम</span>
                  </div>
                  <p className="text-xs text-slate-400 font-devanagari">पत्रिका (MAGAZINE) • 2024 विशेषांक</p>
                </td>
                <td className="px-6 py-4 text-center">
                   <button className="text-blue-600 hover:underline flex items-center gap-1 mx-auto text-sm font-devanagari">
                     <ExternalLink size={14} /> लिंक खोलें
                   </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Empty State Mock */}
        {false && (
           <div className="p-20 flex flex-col items-center text-slate-300">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <ImageIcon size={40} />
             </div>
             <p className="font-devanagari text-lg">कोई प्रकाशन नहीं मिला</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default AdminPublications;
