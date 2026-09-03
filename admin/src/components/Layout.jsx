import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, Briefcase, Users, MessageSquare,
  Settings, LogOut, Menu, X, ChevronRight, Bell, Monitor
} from 'lucide-react';
import { useAdmin } from '../context/AdminAuth';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/blog', label: 'Blog', icon: FileText },
  { path: '/admin/services', label: 'Services', icon: Briefcase },
  { path: '/admin/team', label: 'Team', icon: Users },
  { path: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
  { path: '/admin/sessions', label: 'Active Sessions', icon: Monitor },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAdmin();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 260 : 80 }}
        className="hidden lg:flex flex-col bg-slate-900 text-white fixed h-full z-30 transition-all"
      >
        <div className="p-4 flex items-center justify-between h-16">
          {sidebarOpen && <div className="font-bold text-xl">IPMC<span className="text-amber-500">∞</span></div>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }>
              <item.icon size={20} />
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-800">
          <button onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg w-full transition-colors">
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />
            <motion.aside initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white z-50 lg:hidden flex flex-col">
              <div className="p-4 flex items-center justify-between h-16">
                <div className="font-bold text-xl">IPMC<span className="text-amber-500">∞</span></div>
                <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-slate-800 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 px-3 space-y-1">
                {navItems.map(item => (
                  <NavLink key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    }>
                    <item.icon size={20} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </NavLink>
                ))}
              </nav>
              <div className="p-3 border-t border-slate-800">
                <button onClick={logout}
                  className="flex items-center gap-3 px-3 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg w-full">
                  <LogOut size={20} />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all ${sidebarOpen ? 'lg:ml-[260px]' : 'lg:ml-[80px]'}`}>
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
              <Menu size={20} />
            </button>
            <div className="text-sm text-gray-500">
              {navItems.find(n => n.path === location.pathname)?.label || 'Dashboard'}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role || 'admin'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
