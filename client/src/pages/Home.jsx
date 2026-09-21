import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Wrench, 
  Sun, 
  Cog, 
  Hammer, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  ShieldCheck, 
  Cpu, 
  Layers,
  MapPin,
  Clock,
  Compass,
  Building2,
  Factory
} from 'lucide-react';
import { servicesCategories } from '../data/servicesData';
import ServiceCard from '../components/ServiceCard';

export default function Home() {
  const valueProps = [
    {
      title: 'In-House Lathe Machine Setups',
      description: 'Heavy-duty manual and CNC-assisted lathe centers capable of turning shafts up to Ø600mm with high-tolerance cylindrical grinding, threading, and boring.',
      icon: Cog,
      metric: '±0.01mm Tolerance'
    },
    {
      title: 'Heavy Mechanical Power Presses',
      description: 'Fleet of 20-Ton to 150-Ton mechanical stamping presses dedicated to rapid batch punching, blanking, and multi-stage progressive die tooling.',
      icon: Factory,
      metric: '150T Press Fleet'
    },
    {
      title: 'Certified Structural Welding Bays',
      description: 'Argon (TIG), MIG/MAG, and shielded metal arc welding stations compliant with AWS D1.1 structural standards for heavy load-bearing frames.',
      icon: Hammer,
      metric: 'AWS D1.1 Certified'
    },
    {
      title: 'Custom On-Demand B2B Orders',
      description: 'Rapid turnaround for bespoke engineering replacement parts, proprietary machinery modifications, and certified turnkey solar structures.',
      icon: Wrench,
      metric: 'Direct CAD Conversion'
    }
  ];

  const clientSegments = [
    { name: 'Commercial Plazas & Banks', desc: 'Solar arrays, parking canopies & security gates' },
    { name: 'Textile & Industrial Plants', desc: 'Machinery shafts, conveyor parts & rooftop frameworks' },
    { name: 'Construction Contractors', desc: 'Structural steel columns, I-beams & custom brackets' },
    { name: 'Residential Estates', desc: 'Elevated solar structures & architectural cast aluminum' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-brand-slate via-slate-900 to-brand-slate text-white pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden border-b border-slate-800">
        {/* Engineering blueprint subtle grid background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            
            {/* Top Verification Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand-blue/30 border border-brand-blue/50 text-slate-200 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              <span>Lahore Industrial Workshop &bull; Precision Metal Fabrication</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Precision Industrial Engineering &amp; Custom Metal Fabrication
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed">
              From certified solar mount structures to precision lathe machining and bespoke architectural metalwork across Punjab.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/services"
                className="btn-primary py-3.5 px-6 text-base font-semibold shadow-md flex items-center justify-center gap-2"
              >
                <span>Explore Capabilities</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="btn-accent py-3.5 px-6 text-base font-semibold shadow-md flex items-center justify-center gap-2"
              >
                <span>Contact Engineering Team</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Fast Metric Badges */}
            <div className="pt-8 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-md flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Turnkey Installation
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Active Across All Punjab Districts
                  </span>
                </div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-md flex items-center gap-3">
                <Cog className="w-5 h-5 text-brand-orange shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Custom Die &amp; Mold
                  </span>
                  <span className="text-[11px] text-slate-400">
                    High-Tolerance Micron Lathe Turning
                  </span>
                </div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-md flex items-center gap-3">
                <Building2 className="w-5 h-5 text-brand-blue-light shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Commercial &amp; Residential
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Heavy Gantry &amp; High-Tensile Framing
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CORE CAPABILITIES PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-blue">
              <span>Fabrication Divisions</span>
              <span>&bull;</span>
              <span>Direct Manufacturing</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-slate tracking-tight">
              Core Engineering Capabilities
            </h2>
            <p className="text-sm sm:text-base text-brand-charcoal max-w-2xl">
              Equipped with in-house heavy mechanical power presses, lathe turning bays, argon welding rigs, and aluminum casting facilities.
            </p>
          </div>
          <Link
            to="/services"
            className="text-sm font-semibold text-brand-blue hover:text-brand-blue-dark flex items-center gap-1.5 shrink-0"
          >
            <span>View All Detailed Specifications</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 Interactive Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {servicesCategories.map((service) => (
            <ServiceCard key={service.id} service={service} isDetailed={false} />
          ))}
        </div>
      </section>

      {/* 3. VALUE PROPOSITION: DIRECT FABRICATION ADVANTAGES */}
      <section className="bg-white py-16 border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-3 py-1 rounded">
              In-House Machine Inventory
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-slate tracking-tight">
              Direct Fabrication Advantages
            </h2>
            <p className="text-sm sm:text-base text-brand-charcoal">
              Unlike brokerage firms, House of Engineers manufactures and machines all components in-house at our Lahore engineering workshop—guaranteeing verified material grades, strict tolerances, and competitive factory rates.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueProps.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index}
                  className="bg-brand-neutral border border-brand-border rounded-lg p-6 flex flex-col justify-between hover:border-brand-blue/50 transition-colors"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded bg-brand-blue text-white flex items-center justify-center">
                        <Icon className="w-5 h-5 text-brand-orange stroke-[2.2]" />
                      </div>
                      <span className="text-[11px] font-mono font-bold bg-white text-brand-slate px-2 py-0.5 rounded border border-slate-200">
                        {item.metric}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-brand-slate">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-brand-charcoal leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Client Sector Alignment Strip */}
          <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            {clientSegments.map((segment, sIdx) => (
              <div key={sIdx} className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-xs font-bold text-slate-800 block">
                  {segment.name}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  {segment.desc}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. CALL TO ACTION BANNER: CAD DRAWING & SITE CONSULTATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-brand-blue text-white rounded-xl p-8 sm:p-12 shadow-technical-lg relative overflow-hidden">
          {/* Blueprint grid effect */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-brand-orange text-white">
              B2B Procurement &amp; Engineering Consultation
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Have Technical CAD Drawings or Project Blueprints?
            </h2>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              Submit your AutoCAD DWG/PDF drawings, BOM (Bill of Materials), or request an on-site structural engineer consultation anywhere across Punjab. Our estimating desk provides itemized quotes within 24 hours.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/contact"
                className="btn-accent py-3 px-6 text-sm font-bold shadow-md flex items-center justify-center gap-2"
              >
                <span>Share Drawings / Request Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/923001234567?text=Hello%20House%20of%20Engineers%2C%20I%20have%20CAD%20drawings%20for%20an%20engineering%20quotation"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-white py-3 px-6 text-sm font-semibold flex items-center justify-center gap-2"
              >
                <span>Consult on WhatsApp (+92 300 123 4567)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

function ChevronRight(props) {
  return (
    <svg 
      {...props} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
    </svg>
  );
}
