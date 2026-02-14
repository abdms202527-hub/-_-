
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase.ts';
import PublicShelf from './public-shelf.tsx';
import AdminLayout from './admin-layout.tsx';
import AdminDashboard from './admin-dashboard.tsx';
import AdminPublications from './admin-publications.tsx';
import AdminMedia from './admin-media.tsx';
import AdminNotices from './admin-notices.tsx';
import AdminSettings from './admin-settings.tsx';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    const logVisit = async () => {
      try {
        if (supabase && supabase.from) {
          await supabase.from('analytics').insert({
            device: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
            platform: navigator.userAgent.split(' ')[0],
            path: window.location.hash || '/'
          });
        }
      } catch (err) {
        console.warn("Analytics logging skipped:", err);
      }
    };
    logVisit();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicShelf />} />
        <Route path="/admin" element={isAdmin ? <AdminLayout /> : <Navigate to="/" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="publications" element={<AdminPublications />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="notices" element={<AdminNotices />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
