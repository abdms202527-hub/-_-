
import React, { useState, useEffect } from 'react';
import { Users, Zap, Book, Star, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { supabase } from './lib/supabase.ts';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalVisitors: 0,
    todayVisits: 0,
    totalPublications: 0,
    popularMagazine: 'N/A'
  });
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Using HEAD to just get the count efficiently
        const pubCount = await supabase.from('publications').select('*', { count: 'exact', head: true });
        const visCount = await supabase.from('analytics').select('*', { count: 'exact', head: true });
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayCount = await supabase.from('analytics')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today.toISOString());

        const { data: recentLogs } = await supabase.from('analytics')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        setStats({
          totalVisitors: visCount.count || 0,
          todayVisits: todayCount.count || 0,
          totalPublications: pubCount.count || 0,
          popularMagazine: 'शुभ शगुन'
        });

        if (recentLogs) setLogs(recentLogs);
      } catch (err) {
        console.error("Dashboard load error", err);
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
        <p className="font-devanagari">डैशबोर्ड लोड हो रहा है...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Users className="text-blue-600" />} label="कुल आगंतुक" value={stats.totalVisitors.toString()} />
        <StatCard icon={<Zap className="text-orange-500" />} label="आज के विजिट" value={stats.todayVisits.toString()} />
        <StatCard icon={<Book className="text-purple-500" />} label="कृत प्रकाशन" value={stats.totalPublications.toString()} />
        <StatCard icon={<Star className="text-yellow-500" />} label="लोकप्रिय पत्रिका" value={stats.popularMagazine} subValue="समाज की..." />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800 font-devanagari">लाइव विज़िटर लॉग</h3>
          <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider">Active Logs</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 font-devanagari text-sm">
              <tr>
                <th className="px-6 py-4">समय</th>
                <th className="px-6 py-4">डिवाइस</th>
                <th className="px-6 py-4">प्लेटफ़ॉर्म</th>
                <th className="px-6 py-4">पाथ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 text-sm">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">{new Date(log.created_at).toLocaleTimeString()}</td>
                  <td className="px-6 py-4">{log.device}</td>
                  <td className="px-6 py-4">{log.platform}</td>
                  <td className="px-6 py-4 font-mono text-[10px]">{log.path}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-400 font-devanagari">अभी तक कोई लॉग दर्ज नहीं हुआ है।</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, subValue }: { icon: React.ReactNode, label: string, value: string, subValue?: string }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center">
      {icon}
    </div>
    <div>
      <p className="text-slate-500 font-devanagari text-sm">{label}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-2xl font-bold text-slate-800">{value}</h4>
        {subValue && <span className="text-xs text-slate-400 font-devanagari">{subValue}</span>}
      </div>
    </div>
  </div>
);

export default AdminDashboard;
