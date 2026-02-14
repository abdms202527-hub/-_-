
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { ADMIN_SIDEBAR_LINKS } from './constants';

const AdminLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f172a] text-slate-300 flex flex-col fixed inset-y-0 left-0 z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white">A</div>
          <h1 className="text-xl font-bold text-white font-devanagari">एडमिन कंसोल</h1>
        </div>

        <nav className="flex-1 mt-4 px-3 space-y-1">
          {ADMIN_SIDEBAR_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-devanagari ${
                location.pathname === link.path || (link.path !== '/admin' && location.pathname.startsWith(link.path))
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-3 px-4 py-2 w-full text-red-400 hover:bg-red-500/10 rounded-lg transition-colors font-devanagari">
            <LogOut size={20} />
            <span>लॉगआउट करें</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
