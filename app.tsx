
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicShelf from './public-shelf';
import AdminLayout from './admin-layout';
import AdminDashboard from './admin-dashboard';
import AdminPublications from './admin-publications';
import AdminMedia from './admin-media';
import AdminNotices from './admin-notices';
import AdminSettings from './admin-settings';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(true); // Mock auth for demo

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<PublicShelf />} />

        {/* Admin Routes */}
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
