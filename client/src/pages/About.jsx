import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../context/SiteContentContext';
import { 
  Factory, 
  Cog, 
  Hammer, 
  Layers, 
  MapPin, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Truck, 
  Wrench, 
  Clock, 
  Sliders 
} from 'lucide-react';

import Breadcrumb from '../components/Breadcrumb';
import PageTransition from '../components/PageTransition';

const iconMap = {
  Factory,
  Cog,
  Hammer,
  Layers,
  Wrench
};

export default function About() {
  const { workshop, settings } = useSiteContent();
  const machineryInventory = workshop?.inventory || [];
  const punjabDistricts = workshop?.districts || [];

  return (
    <PageTransition className="space-y-12 sm:space-y-16 pb-16">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'About Us' }]} />
        </div>
      </div>
      
      {/* 1. HERO HEADER */}
      <section className="bg-brand-slate text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden -mt-12 sm:-mt-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/20 px-3 py-1 rounded border border-brand-orange/30 inline-block">
              Corporate Profile &amp; Workshop Facility
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Industrial Engineering Rooted in Lahore, Serving Punjab
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              House of Engineers Pvt. Ltd. is a premier light-to-medium industrial engineering and custom fabrication firm. We bridge the gap between rigorous technical design and rugged, dependable shop-floor fabrication.
            </p>
          </div>
        </div>
      </section>

      {/* 2. COMPANY PROFILE & CORE PRINCIPLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
                Established Fabrication Standards
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-slate tracking-tight">
                Built for Rigorous Industrial Demands
              </h2>
            </div>
            
            <p className="text-sm sm:text-base text-brand-charcoal leading-relaxed">
              Operating out of our dedicated fabrication facility in Lahore, House of Engineers Pvt. Ltd. was founded on a straightforward principle: **uncompromising mechanical precision combined with dependable turnaround times**.
            </p>

            <p className="text-sm sm:text-base text-brand-charcoal leading-relaxed">
              Whether producing high-volume stamped solar brackets or turning high-strength alloy shafts for emergency plant overhauls, our engineering staff supervises every stage—from metallurgical grade verification to final dimensional inspection before dispatch.
            </p>

            {/* Core Values Bullets */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-brand-slate">Certified Metallurgical Integrity</h4>
                  <p className="text-xs text-slate-600">Strict adherence to ASTM/JIS raw material specifications (ASTM A36, Q235B, EN8/19).</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-brand-slate">Reliable Project Turnarounds</h4>
                  <p className="text-xs text-slate-600">Dedicated batch scheduling with rapid response for industrial maintenance stoppages.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-brand-slate">Hands-On On-Site Assembly</h4>
                  <p className="text-xs text-slate-600">Our own factory erection crews handle anchoring, torque verification, and structural alignment.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Credentials Box */}
          <div className="bg-brand-neutral border border-brand-border rounded-xl p-8 shadow-technical space-y-6">
            <h3 className="text-lg font-bold text-brand-slate border-b border-slate-200 pb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-blue" />
              <span>Operational Commitments &amp; Quality Metrics</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-md border border-slate-200">
                <div className="text-2xl font-extrabold text-brand-blue">±0.01mm</div>
                <div className="text-xs font-medium text-slate-600 mt-1">Lathe Machining Tolerance</div>
              </div>
              <div className="bg-white p-4 rounded-md border border-slate-200">
                <div className="text-2xl font-extrabold text-brand-orange">150 Tons</div>
                <div className="text-xs font-medium text-slate-600 mt-1">Max Press Stamping Capacity</div>
              </div>
              <div className="bg-white p-4 rounded-md border border-slate-200">
                <div className="text-2xl font-extrabold text-brand-slate">140+ km/h</div>
                <div className="text-xs font-medium text-slate-600 mt-1">Certified Solar Wind Rating</div>
              </div>
              <div className="bg-white p-4 rounded-md border border-slate-200">
                <div className="text-2xl font-extrabold text-emerald-700">100%</div>
                <div className="text-xs font-medium text-slate-600 mt-1">In-House Manufacturing</div>
              </div>
            </div>

            <div className="p-4 bg-brand-blue/5 rounded-md border border-brand-blue/20 text-xs text-brand-charcoal leading-relaxed">
              <strong className="text-brand-blue block mb-1">Safety &amp; Compliance Policy:</strong>
              All structural frames are pre-assembled at our workshop prior to dispatch to ensure effortless field bolting, zero on-site re-drilling, and verified torque tolerances.
            </div>
          </div>
        </div>
      </section>

      {/* 3. WORKSHOP CAPABILITIES & MECHANICAL INVENTORY */}
      <section id="workshop" className="bg-white py-16 border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
              Machinery &amp; Tooling Setup
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-slate tracking-tight">
              Workshop Capabilities &amp; Equipment Breakdown
            </h2>
            <p className="text-sm sm:text-base text-brand-charcoal">
              A comprehensive view of our Lahore mechanical plant, tooling inventory, and processing capacities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {machineryInventory.map((item, index) => {
              const Icon = typeof item.icon === 'string' ? (iconMap[item.icon] || Factory) : (item.icon || Factory);
              return (
                <div 
                  key={index}
                  className="bg-brand-neutral border border-brand-border rounded-lg p-6 sm:p-8 flex flex-col justify-between hover:border-brand-blue/60 transition-all shadow-technical"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="w-12 h-12 rounded-md bg-brand-blue text-white flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-brand-orange stroke-[2.2]" />
                      </div>
                      <span className="text-xs font-mono font-bold uppercase px-2.5 py-1 bg-white text-brand-slate border border-slate-200 rounded">
                        {item.category}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-brand-slate">
                        {item.name}
                      </h3>
                      <div className="text-xs font-mono text-brand-blue font-semibold mt-1">
                        {item.specs}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-brand-charcoal leading-relaxed">
                      {item.description}
                    </p>

                    <div className="pt-3 border-t border-slate-200 text-xs">
                      <span className="font-semibold text-slate-700">Typical Applications: </span>
                      <span className="text-slate-600">{item.applications}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. SERVICE COVERAGE ACROSS PUNJAB */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-slate text-white rounded-xl p-8 sm:p-12 border border-slate-700 shadow-technical-lg">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            
            <div className="lg:col-span-2 space-y-4">
              <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-brand-orange text-white inline-block">
                Provincial Deployment
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Transit &amp; On-Site Installation Teams Across Punjab
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Our logistics and structural installation crews operate throughout all industrial belts and districts in Punjab. We provide self-contained mobilization units equipped with mobile generators, MIG welding rigs, magnetic base drills, and calibrated torque tools.
              </p>

              {/* District Pills Grid */}
              <div className="pt-2 flex flex-wrap gap-2">
                {punjabDistricts.map((district, dIdx) => (
                  <span 
                    key={dIdx}
                    className="bg-slate-800 text-slate-200 px-3 py-1.5 rounded text-xs font-mono border border-slate-700 flex items-center gap-1.5"
                  >
                    <MapPin className="w-3 h-3 text-brand-orange" />
                    <span>{district}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 p-6 rounded-lg space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-slate-700 pb-2">
                Deployment Protocol
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>On-site dimensional survey prior to final fabrication</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Cranes and lifting equipment coordination for elevated roofs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Post-assembly inspection &amp; joint torque sign-off report</span>
                </li>
              </ul>
              <Link
                to="/contact"
                className="btn-accent w-full text-xs py-2.5 flex items-center justify-center gap-2"
              >
                <span>Book Site Survey</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      </section>
    </PageTransition>
  );
}
