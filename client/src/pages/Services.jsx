import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteContent } from '../context/SiteContentContext';
import Breadcrumb from '../components/Breadcrumb';
import PageTransition from '../components/PageTransition';
import { 
  Sun, 
  Cog, 
  Hammer, 
  CheckCircle2, 
  ArrowRight, 
  Sliders, 
  ShieldCheck, 
  FileText, 
  Layers, 
  ChevronRight, 
  Calculator 
} from 'lucide-react';

const iconMap = {
  Sun: Sun,
  Cog: Cog,
  Hammer: Hammer
};

export default function Services() {
  const location = useLocation();
  const { services, settings } = useSiteContent();
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
  const IconComponent = iconMap[activeCategory.icon] || Cog;

  return (
    <PageTransition className="space-y-12 sm:space-y-16 pb-16">
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Capabilities & Fabrication Silos' }]} />
        </div>
      </div>

      {/* 1. HEADER SECTION */}
      <section className="bg-brand-slate text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden -mt-12 sm:-mt-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/20 px-3 py-1 rounded border border-brand-orange/30 inline-block">
              Engineering Disciplines Hub
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Capabilities &amp; Fabrication Silos
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Explore our three core engineering divisions. Each division features dedicated technical specifications, calculations, and fabrication workflows at our Lahore works.
            </p>
          </div>
        </div>
      </section>

      {/* 2. DEDICATED SILO SELECTOR CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(services || []).map((service, index) => {
            const isSelected = activeTab === service.id;
            const CardIcon = iconMap[service.icon] || Cog;
            return (
              <div
                key={service.id}
                className={`p-6 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-brand-blue text-white border-brand-blue shadow-md ring-2 ring-brand-blue/30'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-brand-blue/50 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-brand-blue'
                    }`}>
                      Division 0{index + 1}
                    </span>
                    <CardIcon className={`w-5 h-5 ${isSelected ? 'text-brand-orange' : 'text-slate-400'}`} />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg tracking-tight">
                    {service.title}
                  </h3>
                  <p className={`text-xs mt-1 font-medium line-clamp-2 ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                    {service.tagline}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/20 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab(service.id)}
                    className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-600 hover:text-brand-blue'}`}
                  >
                    {isSelected ? 'Currently Viewing' : 'Select Division'}
                  </button>
                  <Link
                    to={`/services/${service.id}`}
                    className={`text-xs font-bold flex items-center gap-1 ${
                      isSelected ? 'text-brand-orange hover:underline' : 'text-brand-blue hover:underline'
                    }`}
                  >
                    <span>Open Dedicated Silo</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. ACTIVE DIVISION EXPANDED PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl border border-brand-border p-6 sm:p-10 shadow-sm space-y-10">
          
          {/* Top Title & Overview */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 pb-8">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue">
                  <IconComponent className="w-5 h-5 stroke-[2.2]" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-slate tracking-tight">
                  {activeCategory.title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-brand-charcoal leading-relaxed">
                {activeCategory.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Link
                to={`/services/${activeCategory.id}`}
                className="btn-primary text-xs py-3 px-6 shadow-sm font-bold flex items-center justify-center gap-2"
              >
                <span>Explore Full Silo Page & Specs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/quote"
                className="btn-accent text-xs py-3 px-6 shadow-sm font-bold flex items-center justify-center gap-2"
              >
                <span>Request Custom Quote</span>
              </Link>
            </div>
          </div>

          {/* Grid: Capabilities Features & Engineering Specs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Features & Fabrication Scope */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-brand-slate uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                <CheckCircle2 className="w-4 h-4 text-brand-blue" />
                <span>Scope of Capabilities &amp; Features</span>
              </h3>

              <ul className="space-y-2.5">
                {(activeCategory.features || []).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-brand-charcoal leading-relaxed">
                    <div className="w-4 h-4 rounded bg-brand-blue/10 text-brand-blue flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                      {idx + 1}
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Verified Sector Applications */}
              {activeCategory.applications && (
                <div className="pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                    Typical Punjab Deployments:
                  </h4>
                  <div className="space-y-1.5">
                    {activeCategory.applications.map((app, aIdx) => (
                      <div key={aIdx} className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0" />
                        <span>{app}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Technical Specifications Matrix */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-brand-slate uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                <Sliders className="w-4 h-4 text-brand-orange" />
                <span>Technical Specifications Matrix</span>
              </h3>

              <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 font-bold uppercase text-[10px] tracking-wider w-2/5">Parameter</th>
                      <th className="py-2.5 px-3 font-bold uppercase text-[10px] tracking-wider">Engineered Standard</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(activeCategory.specifications || []).map((spec, sIdx) => (
                      <tr 
                        key={sIdx}
                        className={sIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}
                      >
                        <td className="py-2.5 px-3 font-semibold text-slate-600 border-b border-slate-200/80">
                          {spec.label}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-medium text-slate-900 border-b border-slate-200/80">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Dedicated Silo Callout */}
              <div className="bg-brand-neutral p-5 rounded-lg border border-brand-border space-y-3">
                <div className="flex items-center gap-2 text-brand-slate font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Looking for Technical Calculators & Blueprints?</span>
                </div>
                <p className="text-xs text-brand-charcoal leading-relaxed">
                  Visit the dedicated silo page for {activeCategory.title} to calculate structural steel tonnages, review workshop workflows, and download CAD blueprints.
                </p>
                <Link
                  to={`/services/${activeCategory.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-brand-blue-dark"
                >
                  <span>Go to Dedicated {activeCategory.title} Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 4. FAST QUOTATION STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-brand-slate text-white rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">
              Need custom die tooling or specialized fabrication not listed?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Our toolmakers and structural engineers build custom dies, jigs, and fixtures to client CAD vector drawings.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <Link to="/quote" className="btn-accent text-xs py-2.5 px-5 font-bold">
              Submit Custom Inquiry
            </Link>
          </div>
        </div>
      </section>

    </PageTransition>
  );
}
