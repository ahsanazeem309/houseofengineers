import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../context/SiteContentContext';
import { 
  Wrench, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Shield, 
  ArrowRight,
  ExternalLink,
  Lock
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings, services } = useSiteContent();

  return (
    <footer className="bg-brand-slate text-slate-300 border-t border-slate-800">
      {/* Primary Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Column 1: Company Profile */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-blue rounded-md flex items-center justify-center text-white">
                <Wrench className="w-5 h-5 text-brand-orange stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-base tracking-tight uppercase">
                  House of Engineers
                </span>
                <span className="text-[10px] text-brand-orange font-bold uppercase tracking-wider">
                  Pvt. Ltd. &bull; Lahore
                </span>
              </div>
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed">
              Industrial engineering and custom metal fabrication firm operating out of Lahore, Punjab. Delivering precision lathe machining, certified solar structures, mechanical press tooling, and bespoke architectural metalwork.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Registered Corporate Fabrication Vendor</span>
            </div>
          </div>

          {/* Column 2: Engineering Capabilities */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-bold uppercase tracking-wider border-b border-slate-700 pb-2">
              Capabilities & Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/services" className="text-slate-300 hover:text-brand-orange transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3.5 h-3.5 text-brand-orange group-hover:translate-x-1 transition-transform" />
                  <span>Solar Mounting Structures</span>
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-300 hover:text-brand-orange transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3.5 h-3.5 text-brand-orange group-hover:translate-x-1 transition-transform" />
                  <span>Precision Lathe Machining</span>
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-300 hover:text-brand-orange transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3.5 h-3.5 text-brand-orange group-hover:translate-x-1 transition-transform" />
                  <span>Press Stamping & Punch Dies</span>
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-300 hover:text-brand-orange transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3.5 h-3.5 text-brand-orange group-hover:translate-x-1 transition-transform" />
                  <span>Industrial Car Parking Sheds</span>
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-300 hover:text-brand-orange transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3.5 h-3.5 text-brand-orange group-hover:translate-x-1 transition-transform" />
                  <span>Cast Aluminum Ornate Grills</span>
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-300 hover:text-brand-orange transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3.5 h-3.5 text-brand-orange group-hover:translate-x-1 transition-transform" />
                  <span>Heavy Security Gates & Grilles</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-bold uppercase tracking-wider border-b border-slate-700 pb-2">
              Corporate Overview
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="text-slate-300 hover:text-white transition-colors">
                  About House of Engineers
                </Link>
              </li>
              <li>
                <Link to="/about#workshop" className="text-slate-300 hover:text-white transition-colors">
                  Workshop Inventory & Machinery
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-slate-300 hover:text-white transition-colors">
                  Project Portfolio & Specs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-white transition-colors">
                  Request Quotation / RFQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-white transition-colors">
                  CAD Drawing Consultation
                </Link>
              </li>
              <li>
                <a 
                  href="https://wa.me/923001234567?text=Inquiry%20regarding%20engineering%20services"
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-brand-orange hover:underline inline-flex items-center gap-1.5"
                >
                  <span>Chat on WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Operational Base & Direct Channels */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-bold uppercase tracking-wider border-b border-slate-700 pb-2">
              Lahore Engineering Desk
            </h3>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <span className="text-slate-300">
                  {settings?.workshopAddress || 'Industrial Area, Lahore, Punjab, Pakistan'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-orange shrink-0" />
                <a href={`tel:${(settings?.primaryPhone || '+923001234567').replace(/[^0-9+]/g, '')}`} className="text-slate-300 hover:text-white transition-colors">
                  {settings?.primaryPhone || '+92 300 123 4567'} (Procurement)
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-orange shrink-0" />
                <a href={`mailto:${settings?.procurementEmail || 'info@houseofengineers.pk'}`} className="text-slate-300 hover:text-white transition-colors">
                  {settings?.procurementEmail || 'info@houseofengineers.pk'}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">
                  {settings?.workingHours || 'Mon – Sat: 08:00 – 18:00 PKT'}<br/>
                  <span className="text-slate-400 text-xs">Emergency breakdown repairs on request</span>
                </span>
              </div>
              <div className="pt-2">
                <Link to="/admin" className="text-xs text-slate-400 hover:text-brand-orange flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin Console Login</span>
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Technical Capabilities Badges */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <span className="bg-slate-800/80 px-3 py-1 rounded text-slate-300 font-mono">
              Lathe Turning Ø600mm
            </span>
            <span className="bg-slate-800/80 px-3 py-1 rounded text-slate-300 font-mono">
              150-Ton Power Press
            </span>
            <span className="bg-slate-800/80 px-3 py-1 rounded text-slate-300 font-mono">
              HDG Galvanizing ASTM A123
            </span>
            <span className="bg-slate-800/80 px-3 py-1 rounded text-slate-300 font-mono">
              AWS D1.1 Certified Welding
            </span>
          </div>
          <span className="text-slate-400">
            Installation Crews Dispatched Throughout Punjab
          </span>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <div>
            &copy; {currentYear} House of Engineers Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex gap-6">
            <span>Corporate Registration: Lahore, Pakistan</span>
            <Link to="/contact" className="hover:text-white transition-colors">Legal & Procurement Notice</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
