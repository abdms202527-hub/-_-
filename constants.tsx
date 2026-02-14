
import React from 'react';
// Fixed: 'LayoutPanelBottom' does not exist in lucide-react, using 'LayoutPanelTop' as suggested.
import { LayoutDashboard, BookOpen, Image as ImageIcon, Bell, Settings, Link2, LayoutPanelTop } from 'lucide-react';

export const ADMIN_SIDEBAR_LINKS = [
  { label: 'डैशबोर्ड (एनालिटिक्स)', icon: <LayoutDashboard size={20} />, path: '/admin' },
  { label: 'प्रकाशन प्रबंधन', icon: <BookOpen size={20} />, path: '/admin/publications' },
  { label: 'लिंक प्रबंधन', icon: <Link2 size={20} />, path: '/admin/links' },
  { label: 'मीडिया गैलरी', icon: <ImageIcon size={20} />, path: '/admin/media' },
  { label: 'सूचना (NOTICES)', icon: <Bell size={20} />, path: '/admin/notices' },
  { label: 'वेबसाइट सेटिंग्स', icon: <Settings size={20} />, path: '/admin/settings' },
  { label: 'फुटर सेटिंग्स', icon: <LayoutPanelTop size={20} />, path: '/admin/footer' },
];

export const COLORS = {
  primary: '#2563eb', // Blue-600
  secondary: '#1e293b', // Slate-800
  accent: '#f97316', // Orange-500
  bg: '#f8fafc', // Slate-50
  card: '#ffffff',
  sidebar: '#0f172a', // Slate-900
};
