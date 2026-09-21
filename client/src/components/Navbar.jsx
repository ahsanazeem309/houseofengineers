import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteContent } from '../context/SiteContentContext';
import { 
  Menu, 
  X, 
  Phone, 
  MapPin, 
  Wrench, 
  ChevronDown, 
  ChevronRight, 
  ShieldCheck, 
  Lock, 
  Sun, 
  Cog, 
  Hammer, 
  Factory, 
  Award, 
  FileText 
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const { settings, services } = useSiteContent();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setServicesDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  }, [location.pathname]);

  const serviceSubpages = [
    {
      id: 'solar-mounting',
      name: 'Solar Mounting Structures',
      desc: '145 km/h Wind-load certified, ASTM A123 hot-dip galvanized C-channels & elevated canopies.',
      path: '/services/solar-mounting',
      icon: Sun,
      color: 'text-brand-orange'
    },
    {
      id: 'precision-machining',
      name: 'Precision Machining & Tooling',
      desc: '±0.01mm lathe turning, progressive punch stamping dies & replacement drive shafts.',
      path: '/services/precision-machining',
      icon: Cog,
      color: 'text-brand-blue'
    },
    {
      id: 'structural-fabrication',
      name: 'Structural Steel & Heavy Fabrication',
      desc: 'Cantilever car parking sheds, factory gates, crane runways & ornamental aluminum casting.',
      path: '/services/structural-fabrication',
      icon: Hammer,
      color: 'text-brand-orange'
    }
  ];

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Workshop Fleet', path: '/workshop' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Quality Standards', path: '/quality-standards' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isServicesActive = location.pathname.startsWith('/services');

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-brand-border shadow-sm">
      {/* Top Industrial Dispatch Strip */}
      <div className="bg-brand-slate text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-brand-orange shrink-0" />
              <span className="truncate">{settings?.workshopAddress || 'Workshop & HQ: Lahore, Punjab, Pakistan'}</span>
            </span>
            <span className="hidden md:inline-block text-slate-600">|</span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Turnkey On-Site Installation Across Punjab</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <a 
              href={`tel:${(settings?.primaryPhone || '+923001234567').replace(/[^0-9+]/g, '')}`} 
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-brand-orange shrink-0" />
              <span>Estimating Desk: {settings?.primaryPhone || '+92 300 123 4567'}</span>
            </a>
            <span className="text-slate-600">|</span>
            <Link to="/admin" className="text-slate-400 hover:text-brand-orange flex items-center gap-1 transition-colors">
              <Lock className="w-3 h-3" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none shrink-0">
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
              <span className="text-[11px] font-medium text-brand-charcoal tracking-wide hidden sm:block">
                Industrial Engineering & Custom Metal Fabrication
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            <Link
              to="/"
              className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors ${
                location.pathname === '/' 
                  ? 'text-brand-blue bg-brand-neutral' 
                  : 'text-brand-charcoal hover:text-brand-blue hover:bg-slate-50'
              }`}
            >
              Home
            </Link>

            {/* Services Dropdown Silo Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                onMouseEnter={() => setServicesDropdownOpen(true)}
                className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
                  isServicesActive
                    ? 'text-brand-blue bg-brand-neutral'
                    : 'text-brand-charcoal hover:text-brand-blue hover:bg-slate-50'
                }`}
                aria-expanded={servicesDropdownOpen}
              >
                <span>Capabilities</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {servicesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                    className="absolute left-0 top-full mt-1 w-80 bg-white rounded-xl shadow-xl border border-brand-border p-2 z-50"
                  >
                    <div className="text-[10px] uppercase font-mono font-bold text-slate-400 px-3 py-1.5 tracking-wider">
                      Engineering Disciplines
                    </div>
                    {serviceSubpages.map((sub) => {
                      const Icon = sub.icon;
                      return (
                        <Link
                          key={sub.id}
                          to={sub.path}
                          className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                          <div className="p-2 bg-slate-100 rounded-md group-hover:bg-brand-blue group-hover:text-white transition-colors shrink-0">
                            <Icon className="w-4 h-4 text-brand-slate group-hover:text-white" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-brand-slate group-hover:text-brand-blue transition-colors">
                              {sub.name}
                            </div>
                            <div className="text-[11px] text-brand-charcoal line-clamp-2 mt-0.5 leading-snug">
                              {sub.desc}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                    <div className="pt-2 mt-1 border-t border-slate-100 px-2 pb-1">
                      <Link 
                        to="/services" 
                        className="text-xs font-bold text-brand-blue hover:text-brand-blue-dark flex items-center justify-between py-1 px-1"
                      >
                        <span>View All Capabilities Overview</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Remaining Nav Links */}
            {navLinks.slice(1).map((link) => {
              const active = location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors ${
                    active
                      ? 'text-brand-blue bg-brand-neutral'
                      : 'text-brand-charcoal hover:text-brand-blue hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Header Action CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/quote"
              className="btn-accent gap-2 shadow-sm font-bold text-xs py-2.5 px-4"
            >
              <span>Request a Quote</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/quote"
              className="sm:hidden btn-accent px-3 py-1.5 text-xs font-bold"
            >
              Quote
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-brand-charcoal hover:text-brand-blue hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-brand-slate" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-brand-border px-4 pt-2 pb-6 space-y-1 shadow-lg overflow-hidden"
          >
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-sm font-semibold rounded-md text-brand-slate hover:bg-slate-50"
            >
              Home
            </Link>

            {/* Mobile Capabilities Accordion */}
            <div>
              <button
                type="button"
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className="w-full flex justify-between items-center px-3 py-2.5 text-sm font-semibold rounded-md text-brand-slate hover:bg-slate-50"
              >
                <span>Capabilities & Services</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
              </button>

              {mobileServicesOpen && (
                <div className="pl-4 pr-2 py-1 space-y-1 bg-slate-50 rounded-lg my-1">
                  {serviceSubpages.map((sub) => (
                    <Link
                      key={sub.id}
                      to={sub.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 px-2 text-xs font-medium text-brand-charcoal hover:text-brand-blue border-b border-slate-200 last:border-none"
                    >
                      {sub.name}
                    </Link>
                  ))}
                  <Link
                    to="/services"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 px-2 text-xs font-bold text-brand-blue"
                  >
                    View All Services Overview →
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/workshop"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-sm font-semibold rounded-md text-brand-slate hover:bg-slate-50"
            >
              Workshop Fleet
            </Link>
            <Link
              to="/portfolio"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-sm font-semibold rounded-md text-brand-slate hover:bg-slate-50"
            >
              Case Studies & Portfolio
            </Link>
            <Link
              to="/quality-standards"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-sm font-semibold rounded-md text-brand-slate hover:bg-slate-50"
            >
              Quality Standards
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-sm font-semibold rounded-md text-brand-slate hover:bg-slate-50"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-sm font-semibold rounded-md text-brand-slate hover:bg-slate-50"
            >
              Contact & Directions
            </Link>

            <div className="pt-3 border-t border-brand-border">
              <Link
                to="/quote"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full btn-accent py-3 text-center flex items-center justify-center gap-2 text-sm font-bold"
              >
                <span>Request a Quote / Submit Drawings</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
