import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSiteContent } from '../context/SiteContentContext';
import { 
  Wrench, 
  Sun, 
  Cog, 
  Hammer, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck, 
  Factory, 
  Truck, 
  Award, 
  Layers, 
  MapPin, 
  Zap, 
  Calculator 
} from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import AnimatedCounter from '../components/AnimatedCounter';
import PageTransition from '../components/PageTransition';

export default function Home() {
  const { settings, services } = useSiteContent();

  const valueProps = [
    {
      title: 'Precision Lathe Turning Bays',
      description: 'Geared industrial lathe centers turning shafts up to Ø600mm x 2500mm with high-tolerance cylindrical grinding and keyway slotting.',
      icon: Cog,
      metric: '±0.01mm Tolerance'
    },
    {
      title: 'Mechanical Power Press Fleet',
      description: 'Heavy 20-Ton to 150-Ton stamping presses dedicated to rapid batch punching, progressive dies, and solar mounting bracket embossing.',
      icon: Factory,
      metric: '150T Press Fleet'
    },
    {
      title: 'AWS D1.1 Certified Welding',
      description: 'Argon (TIG), high-capacity MIG/MAG, and arc welding stations delivering certified full-penetration structural joints for high-wind canopies.',
      icon: Hammer,
      metric: 'AWS D1.1 Certified'
    },
    {
      title: 'Integrated Aluminum Foundry',
      description: 'Pattern shop and gravity sand casting foundry producing architectural balcony grills, bespoke machine housings, and custom brackets.',
      icon: Layers,
      metric: 'A356 Foundry Melts'
    }
  ];

  const clientSegments = [
    { name: 'Commercial Plazas & Banks', desc: 'Solar canopies, parking sheds & vault framing' },
    { name: 'Textile & Industrial Plants', desc: 'Drive shafts, high-tensile brackets & conveyor rollers' },
    { name: 'Construction Contractors', desc: 'Pre-engineered trusses, columns & structural assemblies' },
    { name: 'Agricultural Estates', desc: 'Solar tube-well mounts & heavy agricultural implements' },
  ];

  return (
    <PageTransition className="space-y-16 sm:space-y-24">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-brand-slate via-slate-900 to-brand-slate text-white pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            
            {/* Top Verification Tag */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand-blue/30 border border-brand-blue/50 text-slate-200 text-xs font-semibold tracking-wide"
            >
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              <span>Lahore Industrial Workshop &bull; Precision Metal Fabrication</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight"
            >
              {settings?.heroHeadline || 'Precision Industrial Engineering & Custom Metal Fabrication'}
            </motion.h1>

            {/* Sub-headline */}
            <motion.p 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed"
            >
              {settings?.heroSubheadline || 'From certified solar mount structures to precision lathe machining and bespoke architectural metalwork across Punjab.'}
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <Link
                to="/services"
                className="btn-primary py-3.5 px-6 text-sm sm:text-base font-bold shadow-md flex items-center justify-center gap-2"
              >
                <span>Explore Capabilities Silos</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/quote"
                className="btn-accent py-3.5 px-6 text-sm sm:text-base font-bold shadow-md flex items-center justify-center gap-2"
              >
                <span>Interactive Quote Estimator</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Fast Metric Badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-8 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              {(settings?.metricBadges || [
                { title: 'Turnkey Installation', desc: 'Active Across All Punjab Districts' },
                { title: 'Custom Die & Mold', desc: 'High-Tolerance Micron Lathe Turning' },
                { title: 'Commercial & Residential', desc: 'Heavy Gantry & High-Tensile Framing' }
              ]).map((badge, idx) => (
                <div key={idx} className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-lg flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      {badge.title}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {badge.desc}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. ANIMATED INDUSTRIAL METRIC STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-20">
        <div className="bg-white rounded-xl border border-brand-border shadow-md p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-brand-blue font-mono">
              <AnimatedCounter to={50} suffix="+ MW" />
            </div>
            <div className="text-xs font-bold text-brand-slate uppercase tracking-wider mt-1">Solar Frameworks Fabricated</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Across Punjab Industrial Zones</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-brand-slate font-mono">
              <AnimatedCounter to={150} suffix=" Tons" />
            </div>
            <div className="text-xs font-bold text-brand-slate uppercase tracking-wider mt-1">Stamping Press Fleet</div>
            <div className="text-[11px] text-slate-400 mt-0.5">High-Speed Batch Punching</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-brand-orange font-mono">
              <AnimatedCounter to={145} suffix=" km/h" />
            </div>
            <div className="text-xs font-bold text-brand-slate uppercase tracking-wider mt-1">Certified Wind Resistance</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Monsoon & Storm Resilient</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-mono">
              <AnimatedCounter to={25} suffix="+ Years" />
            </div>
            <div className="text-xs font-bold text-brand-slate uppercase tracking-wider mt-1">HDG ASTM A123 Coating</div>
            <div className="text-[11px] text-slate-400 mt-0.5">80-100µm Hot-Dip Galvanized</div>
          </div>
        </div>
      </section>

      {/* 3. DEDICATED SILO DIVISIONS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-blue">
              <span>Engineering Divisions</span>
              <span>&bull;</span>
              <span>Dedicated Technical Silos</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-slate tracking-tight">
              Core Fabrication Silos
            </h2>
            <p className="text-sm sm:text-base text-brand-charcoal max-w-2xl">
              Each division operates specialized equipment at our Lahore workshop with dedicated technical specifications, calculations, and compliance protocols.
            </p>
          </div>
          <Link
            to="/services"
            className="text-xs sm:text-sm font-bold text-brand-blue hover:text-brand-blue-dark flex items-center gap-1.5 shrink-0"
          >
            <span>View All Engineering Silos</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 Interactive Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {(services || []).slice(0, 3).map((service) => (
            <ServiceCard key={service.id} service={service} isDetailed={false} />
          ))}
        </div>
      </section>

      {/* 4. VALUE PROPOSITION & MACHINERY HIGHLIGHT */}
      <section className="bg-white py-16 border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-3 py-1 rounded">
              Direct In-House Manufacturing
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-slate tracking-tight">
              Lahore Workshop Machinery & Capabilities
            </h2>
            <p className="text-sm sm:text-base text-brand-charcoal">
              Unlike sales intermediaries, House of Engineers manufactures and machines all components in-house at our Lahore engineering workshop—guaranteeing certified material grades, repeatable tolerances, and direct factory pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueProps.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={index}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="bg-brand-neutral border border-brand-border rounded-xl p-6 flex flex-col justify-between hover:border-brand-blue/50 transition-colors shadow-sm"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-brand-blue text-white flex items-center justify-center">
                        <Icon className="w-5 h-5 text-brand-orange stroke-[2.2]" />
                      </div>
                      <span className="text-[11px] font-mono font-bold bg-white text-brand-slate px-2 py-0.5 rounded border border-slate-200">
                        {item.metric}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-brand-slate">
                      {item.title}
                    </h3>
                    <p className="text-xs text-brand-charcoal leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Silo Links Bar */}
          <div className="mt-12 pt-8 border-t border-slate-200 flex flex-wrap items-center justify-center gap-4 text-xs">
            <Link to="/workshop" className="btn-outline py-2.5 px-4 font-bold flex items-center gap-2">
              <Factory className="w-4 h-4 text-brand-blue" />
              <span>Tour Workshop Machinery Fleet →</span>
            </Link>
            <Link to="/quality-standards" className="btn-outline py-2.5 px-4 font-bold flex items-center gap-2">
              <Award className="w-4 h-4 text-brand-orange" />
              <span>Review ASTM & AWS Standards →</span>
            </Link>
            <Link to="/portfolio" className="btn-outline py-2.5 px-4 font-bold flex items-center gap-2">
              <Wrench className="w-4 h-4 text-brand-blue" />
              <span>Inspect Case Studies & Blueprints →</span>
            </Link>
          </div>

          {/* Client Sector Alignment Strip */}
          <div className="mt-8 pt-8 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            {clientSegments.map((segment, sIdx) => (
              <div key={sIdx} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
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

      {/* 5. CALL TO ACTION BANNER: CAD DRAWING & INTERACTIVE RFQ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-brand-blue text-white rounded-2xl p-8 sm:p-12 shadow-technical-lg relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-brand-orange text-white">
              B2B Procurement &amp; Engineering Estimating
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Have Technical CAD Drawings or Project Blueprints?
            </h2>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              Submit your AutoCAD DWG/PDF drawings, BOM (Bill of Materials), or request an on-site structural engineer consultation anywhere across Punjab. Our estimating desk provides itemized quotes within 24 hours.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/quote"
                className="btn-accent py-3.5 px-6 text-sm font-bold shadow-md flex items-center justify-center gap-2"
              >
                <span>Launch Interactive Quote Estimator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/923001234567?text=Hello%20House%20of%20Engineers%2C%20I%20have%20CAD%20drawings%20for%20an%20engineering%20quotation"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-white py-3.5 px-6 text-sm font-semibold flex items-center justify-center gap-2"
              >
                <span>WhatsApp Procurement Desk (+92 300 123 4567)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </PageTransition>
  );
}
