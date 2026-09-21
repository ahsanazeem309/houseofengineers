import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useSiteContent } from '../context/SiteContentContext';
import { 
  Sun, 
  Cog, 
  Hammer, 
  CheckCircle2, 
  ArrowRight, 
  Sliders, 
  Layers, 
  ShieldCheck, 
  Download,
  FileSpreadsheet,
  PhoneCall
} from 'lucide-react';

export default function Services() {
  const location = useLocation();
  const { services } = useSiteContent();
  const [activeTab, setActiveTab] = useState(services?.[0]?.id || 'solar-mounting');

  useEffect(() => {
    if (services && services.length > 0 && !services.some(s => s.id === activeTab)) {
      setActiveTab(services[0].id);
    }
  }, [services, activeTab]);

  useEffect(() => {
    if (location.hash && services) {
      const targetId = location.hash.replace('#', '');
      const matched = services.find((s) => s.id === targetId);
      if (matched) setActiveTab(matched.id);
    }
  }, [location.hash, services]);

  const activeCategory = services?.find((s) => s.id === activeTab) || services?.[0] || {};

  return (
    <div className="space-y-12 sm:space-y-16 py-8">
      
      {/* 1. HEADER SECTION */}
      <section className="bg-brand-slate text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/20 px-3 py-1 rounded border border-brand-orange/30 inline-block">
              Engineering Capabilities Catalog
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Capabilities &amp; Fabrication Services
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Organized into three core engineering divisions: Certified Solar Mounting Frameworks, High-Tolerance Lathe &amp; Press Tooling, and Heavy Structural Fabrication with Aluminum Foundry Casting.
            </p>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY SELECTOR TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {servicesCategories.map((service) => {
            const isSelected = activeTab === service.id;
            return (
              <button
                key={service.id}
                onClick={() => setActiveTab(service.id)}
                className={`p-5 rounded-lg border text-left transition-all duration-150 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-brand-blue text-white border-brand-blue shadow-technical-md'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-brand-blue/50 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-brand-orange' : 'text-brand-blue'}`}>
                    Division {service.id === 'solar-mounting' ? '01' : service.id === 'precision-machining' ? '02' : '03'}
                  </span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-brand-orange animate-ping" />}
                </div>
                <div className="font-bold text-base sm:text-lg tracking-tight">
                  {service.title}
                </div>
                <div className={`text-xs mt-2 font-medium ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                  {service.tagline}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. DETAILED ACTIVE DIVISION DISPLAY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl border border-brand-border p-6 sm:p-10 shadow-technical space-y-10">
          
          {/* Top Title & Overview */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 pb-8">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-2.5 py-1 rounded">
                Verified Industrial Standard
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-slate tracking-tight">
                {activeCategory.title}
              </h2>
              <p className="text-sm sm:text-base text-brand-charcoal leading-relaxed">
                {activeCategory.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Link
                to={`/contact?service=${encodeURIComponent(activeCategory.title)}`}
                className="btn-accent text-sm py-3 px-6 shadow-sm flex items-center justify-center gap-2"
              >
                <span>Request Custom Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Grid: Capabilities Features & Engineering Specs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Features & Fabrication Scope */}
            <div className="space-y-6">
              <h3 className="text-base font-bold text-brand-slate uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                <CheckCircle2 className="w-5 h-5 text-brand-orange" />
                <span>Scope of Capabilities &amp; Features</span>
              </h3>

              <ul className="space-y-3">
                {activeCategory.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-brand-charcoal leading-relaxed">
                    <div className="w-5 h-5 rounded bg-brand-blue/10 text-brand-blue flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      {idx + 1}
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Verified Sector Applications */}
              <div className="pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  Typical Industrial Deployments in Punjab:
                </h4>
                <div className="space-y-2">
                  {activeCategory.applications.map((app, aIdx) => (
                    <div key={aIdx} className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200/70 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-blue shrink-0" />
                      <span>{app}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Technical Specifications Matrix */}
            <div className="space-y-6">
              <h3 className="text-base font-bold text-brand-slate uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                <Sliders className="w-5 h-5 text-brand-blue" />
                <span>Technical Specifications Matrix</span>
              </h3>

              <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-100/80 text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 font-bold uppercase text-[11px] tracking-wider w-2/5">Parameter</th>
                      <th className="py-3 px-4 font-bold uppercase text-[11px] tracking-wider">Engineered Standard</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeCategory.specifications.map((spec, sIdx) => (
                      <tr 
                        key={sIdx}
                        className={sIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
                      >
                        <td className="py-3 px-4 font-semibold text-slate-600 border-b border-slate-200/80">
                          {spec.label}
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-slate-900 border-b border-slate-200/80">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Quality & Tolerances Guarantee */}
              <div className="bg-brand-neutral p-5 rounded-lg border border-brand-border space-y-3">
                <div className="flex items-center gap-2 text-brand-slate font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Quality Assurance &amp; Field Erection Policy</span>
                </div>
                <p className="text-xs text-brand-charcoal leading-relaxed">
                  Every order includes raw material mill test certificates (MTC) on demand. Pre-galvanized and hot-dip coated members are salt-spray tested, and all turned parts pass through Go/No-Go calibrated gauge checks.
                </p>
                <div className="pt-2 flex items-center justify-between text-xs text-slate-500 font-mono border-t border-slate-200">
                  <span>Factory Location: Lahore</span>
                  <span>Transit: All Punjab Districts</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 4. FAST QUOTATION STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-brand-neutral border border-brand-border rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-brand-slate">
              Need custom die tooling or specialized fabrication not listed?
            </h3>
            <p className="text-xs sm:text-sm text-brand-charcoal">
              Our toolmakers and structural engineers build custom dies, jigs, and fixtures to client CAD vector drawings.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <Link to="/contact" className="btn-primary text-xs sm:text-sm py-2.5 px-5">
              Submit Custom Inquiry
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
