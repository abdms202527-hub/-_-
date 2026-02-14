
import React, { useState, useEffect } from 'react';
import { Users, Zap, Book, Star, Loader2, Monitor, Smartphone, Globe } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { supabase } from './lib/supabase.ts';

const trendData = [
  { date: '15 जन', count: 30 }, { date: '17 जन', count: 55 }, { date: '19 जन', count: 48 },
  { date: '21 जन', count: 72 }, { date: '23 जन', count: 38 }, { date: '25 जन', count: 52 },
  { date: '27 जन', count: 68 }, { date: '29 जन', count: 42 }, { date: '31 जन', count: 64 },
  { date: '02 फर', count: 38 }, { date: '04 फर', count: 55 }, { date: '06 फर', count: 62 },
  { date: '08 फर', count: 45 }, { date: '10 फर', count: 65 }, { date: '13 फर', count: 58 },
];

const deviceData = [
  { name: 'डेस्कटॉप', value: 65, color: '#2563eb' },
  { name: 'मोबाइल', value: 35, color: '#f97316' },
];

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalVisitors: 2450, // Static defaults to match image
    todayVisits: 42,
    totalPublications: 1,
    popularMagazine: 'शुभ शगुन - समाज की...'
  });
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const { data: recentLogs } = await supabase.from('analytics')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (recentLogs) setLogs(recentLogs);
        
        // Dynamic stats if connected
        const { count: pubCount } = await supabase.from('publications').select('*', { count: 'exact', head: true });
        const { count: visCount } = await supabase.from('analytics').select('*', { count: 'exact', head: true });
        
        if (visCount !== null) setStats(prev => ({ ...prev, totalVisitors: visCount }));
        if (pubCount !== null) setStats(prev => ({ ...prev, totalPublications: pubCount }));
      } catch (err) {
        console.warn("Analytics might be unavailable:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="font-devanagari text-lg">डैशबोर्ड लोड हो रहा है...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      {/* Stats Cards - Matching Image 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard icon={<Users className="text-blue-600" size={28} />} label="कुल आगंतुक" value={stats.totalVisitors.toString()} />
        <StatCard icon={<Zap className="text-orange-500" size={28} />} label="आज के विजिट" value={stats.todayVisits.toString()} />
        <StatCard icon={<Book className="text-purple-500" size={28} />} label="कृत प्रकाशन" value={stats.totalPublications.toString()} />
        <StatCard icon={<Star className="text-yellow-500" size={28} />} label="लोकप्रिय पत्रिका" value={stats.popularMagazine} isCompact />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Trend Chart */}
        <div className="xl:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-800 font-devanagari flex items-center gap-2">
               <Globe className="text-blue-600" size={20} /> विज़िटर ट्रेंड्स (30 दिन)
            </h3>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px'}}
                  itemStyle={{fontFamily: 'Noto Sans Devanagari', fontWeight: 'bold'}}
                />
                <Area type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Distribution */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
           <h3 className="text-xl font-bold text-slate-800 font-devanagari mb-8">डिवाइस डिस्ट्रीब्यूशन</h3>
           <div className="h-64 relative">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
             </ResponsiveContainer>
           </div>
           <div className="mt-8 space-y-4">
              {deviceData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm font-devanagari">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div>
                    <span className="text-slate-500">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-800">{item.value}%</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Live Logs Table - Matching Image Bottom */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800 font-devanagari">लाइव विज़िटर लॉग</h3>
          <span className="bg-green-50 text-green-600 text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-widest flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> LIVE UPDATE
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 font-devanagari text-[10px] uppercase tracking-[0.2em] font-black">
              <tr>
                <th className="px-8 py-5">समय</th>
                <th className="px-8 py-5">डिवाइस</th>
                <th className="px-8 py-5">टोकेहन</th>
                <th className="px-8 py-5 text-right">प्लेटफ़ॉर्म</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-600 text-sm">
              {logs.length > 0 ? logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6 font-medium">{new Date(log.created_at).toLocaleTimeString()}</td>
                  <td className="px-8 py-6">
                     <div className="flex items-center gap-2">
                        {log.device === 'Mobile' ? <Smartphone size={14} className="text-orange-500" /> : <Monitor size={14} className="text-blue-500" />}
                        {log.device}
                     </div>
                  </td>
                  <td className="px-8 py-6 font-mono text-[10px] text-slate-400">{log.id.substring(0, 18)}...</td>
                  <td className="px-8 py-6 text-right">
                    <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-bold">{log.platform}</span>
                  </td>
                </tr>
              )) : (
                <tr>
                   <td colSpan={4} className="px-8 py-12 text-center text-slate-300 font-devanagari italic text-lg">अभी कोई विज़िटर लॉग उपलब्ध नहीं है।</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, isCompact }: { icon: React.ReactNode, label: string, value: string, isCompact?: boolean }) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6 group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-white group-hover:shadow-lg">
      {icon}
    </div>
    <div>
      <p className="text-slate-400 font-devanagari text-xs font-bold uppercase tracking-wider">{label}</p>
      <h4 className={`font-bold text-slate-800 ${isCompact ? 'text-lg mt-1 line-clamp-1' : 'text-3xl'}`}>{value}</h4>
    </div>
  </div>
);

export default AdminDashboard;
