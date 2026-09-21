import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Inbox, 
  Settings, 
  Wrench, 
  Layers, 
  Factory, 
  Shield, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X,
  Bell,
  Image as ImageIcon,
  Globe,
  FileCode2,
  CheckCircle2
} from 'lucide-react';

export default function AdminLayout() {
  const { user, isAuthenticated, isLoading, logout, token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newInquiriesCount, setNewInquiriesCount] = useState(0);

  // Redirect if unauthenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Fetch pending inquiry count
  useEffect(() => {
    if (token) {
      fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.stats) {
            setNewInquiriesCount(data.stats.newInquiries || 0);
          }
        })
        .catch(() => {});
    }
  }, [token, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-blue border-t-brand-orange rounded-full animate-spin" />
          <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
            Loading Engineering Admin Console...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { 
      name: 'Inquiries & Leads', 
      path: '/admin/inquiries', 
      icon: Inbox, 
      badge: newInquiriesCount > 0 ? newInquiriesCount : null 
    },
    { name: 'Media Library', path: '/admin/media', icon: ImageIcon },
    { name: 'Pages & Visual Builder', path: '/admin/pages', icon: Globe },
    { name: 'Site Settings & Branding', path: '/admin/settings', icon: Settings },
    { name: 'Services & Capabilities', path: '/admin/services', icon: Wrench },
    { name: 'Portfolio & Projects', path: '/admin/portfolio', icon: Layers },
    { name: 'Workshop & Machinery', path: '/admin/workshop', icon: Factory },
    { name: 'Account Security', path: '/admin/security', icon: Shield },
  ];

  const isNavActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="min-h-screen bg-[#f1f2f4] text-slate-800 flex flex-col antialiased">
      
      {/* Top Shopify-Style Admin Header */}
      <header className="sticky top-0 z-30 bg-[#1a1a1a] text-white border-b border-[#2d2d2d] h-14 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 rounded text-slate-300 hover:text-white hover:bg-[#2d2d2d]"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-brand-orange rounded flex items-center justify-center text-white font-bold text-sm shadow-sm">
              <Wrench className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight uppercase text-white">
                House of Engineers
              </span>
              <span className="text-[10px] bg-brand-blue/60 text-blue-200 px-1.5 py-0.5 rounded font-mono font-semibold">
                Admin Console
              </span>
            </div>
          </Link>
        </div>

        {/* Header Right Channels */}
        <div className="flex items-center gap-4 text-xs">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 bg-[#2d2d2d] hover:bg-[#3d3d3d] text-slate-200 px-3 py-1.5 rounded transition-colors"
          >
            <span>View Live Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-brand-orange" />
          </a>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          {/* Admin User Profile */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-200 truncate max-w-[140px]">
                {user?.name || 'Administrator'}
              </span>
              <span className="text-[10px] text-slate-400 truncate max-w-[140px]">
                {user?.email}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-[#2d2d2d] transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar (Desktop + Mobile Drawer) */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#202223] text-slate-300 flex flex-col justify-between border-r border-[#303030] transition-transform duration-200 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-3 space-y-6">
            
            {/* Mobile close button */}
            <div className="flex lg:hidden items-center justify-between pb-2 border-b border-[#303030]">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Navigation Menu</span>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Group */}
            <div className="space-y-1">
              <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Storefront &amp; CMS
              </div>
              {navItems.map((item) => {
                const active = isNavActive(item);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                      active
                        ? 'bg-[#303030] text-white'
                        : 'text-slate-400 hover:text-white hover:bg-[#282828]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${active ? 'text-brand-orange' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-brand-orange text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full font-mono">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Bottom Sidebar Info */}
          <div className="p-3 border-t border-[#303030] bg-[#1a1a1a] text-slate-500 text-[11px] space-y-1">
            <div className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span className="font-semibold">Vercel Serverless Ready</span>
            </div>
            <div>House of Engineers CMS v2.0</div>
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Backdrop for mobile drawer */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
        />
      )}
    </div>
  );
}
