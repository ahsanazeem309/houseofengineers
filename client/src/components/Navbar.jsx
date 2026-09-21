import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSiteContent } from '../context/SiteContentContext';
import { 
  Menu, 
  X, 
  Phone, 
  MapPin, 
  Wrench, 
  ChevronRight,
  ShieldCheck,
  Lock
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSiteContent();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Capabilities & Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-brand-border shadow-sm">
      {/* Top Engineering Dispatch Strip */}
      <div className="bg-brand-slate text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-brand-orange" />
              <span>{settings?.workshopAddress || 'Workshop & HQ: Lahore, Punjab, Pakistan'}</span>
            </span>
            <span className="hidden md:inline-block text-slate-600">|</span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Punjab-Wide On-Site Installation Teams</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <a 
              href={`tel:${(settings?.primaryPhone || '+923001234567').replace(/[^0-9+]/g, '')}`} 
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-brand-orange" />
              <span>Procurement Desk: {settings?.primaryPhone || '+92 300 123 4567'}</span>
            </a>
            <span className="text-slate-600">|</span>
            <Link to="/admin" className="text-slate-400 hover:text-brand-orange flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Brand Anchor */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="w-11 h-11 bg-brand-blue rounded-md flex items-center justify-center text-white shadow-sm group-hover:bg-brand-blue-dark transition-colors">
              <Wrench className="w-6 h-6 text-brand-orange stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-brand-slate uppercase">
                  House of Engineers
                </span>
                <span className="text-[10px] uppercase font-bold bg-brand-neutral text-brand-blue border border-brand-blue/20 px-1.5 py-0.5 rounded">
                  Pvt. Ltd.
                </span>
              </div>
              <span className="text-[11px] font-medium text-brand-charcoal tracking-wide">
                Industrial Engineering & Custom Metal Fabrication
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-md relative ${
                    active
                      ? 'text-brand-blue font-semibold bg-brand-neutral'
                      : 'text-brand-charcoal hover:text-brand-blue hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand-blue rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Header Action CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/contact"
              className="btn-accent gap-2 shadow-sm font-semibold text-sm"
            >
              <span>Request a Quote</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/contact"
              className="sm:hidden btn-accent px-3 py-1.5 text-xs font-semibold"
            >
              Quote
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-brand-charcoal hover:text-brand-blue hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-brand-border px-4 pt-2 pb-6 space-y-2 shadow-lg animate-fadeIn">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 text-base font-medium rounded-md transition-colors ${
                  active
                    ? 'bg-brand-neutral text-brand-blue font-bold border-l-4 border-brand-blue'
                    : 'text-brand-charcoal hover:bg-slate-50 hover:text-brand-blue'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-brand-border">
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full btn-accent py-3 text-center flex items-center justify-center gap-2 text-base font-semibold"
            >
              <span>Request a Quote / Submit Drawings</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
