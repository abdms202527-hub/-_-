
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
import AdminLinks from './admin-links.tsx';
import AdminLogin from './admin-login.tsx';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAdminAuthenticated') === 'true';
  });

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

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAdminAuthenticated');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicShelf />} />
        
        {/* Admin Section Protection */}
        <Route 
          path="/admin/login" 
          element={!isAuthenticated ? <AdminLogin onLogin={setIsAuthenticated} /> : <Navigate to="/admin" />} 
        />
        
        <Route 
          path="/admin" 
          element={isAuthenticated ? <AdminLayout onLogout={handleLogout} /> : <Navigate to="/admin/login" />}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="publications" element={<AdminPublications />} />
          <Route path="links" element={<AdminLinks />} />
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
