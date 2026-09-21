import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Factory, 
  Cog, 
  Hammer, 
  Layers, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Truck, 
  Ruler, 
  Building 
} from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import Breadcrumb from '../components/Breadcrumb';
import PageTransition from '../components/PageTransition';

export default function WorkshopPage() {
  const { workshopInventory, districts, workshop, settings } = useSiteContent();
  const safeDistricts = (districts && districts.length > 0) ? districts : (workshop?.districts || []);

  const machineryFleet = [
    {
      id: 'presses',
      name: 'Mechanical Power Presses (20-Ton to 150-Ton)',
      category: 'High-Speed Stamping & Blanking',
      specs: 'Stroke length: 60mm - 180mm | Bolster area: up to 1000mm x 750mm | Up to 120 strokes/min',
      description: 'Equipped with pneumatic clutch mechanisms and coil strip feeders for high-volume blanking, continuous punching of solar bracket rails, and automotive vibration damper stamping.',
      tolerances: '±0.05mm hole alignment precision',
      icon: Factory
    },
    {
      id: 'lathes',
      name: 'Heavy Industrial Geared Lathe Centers',
      category: 'Precision Turning & Threading',
      specs: 'Max turning dia: Ø600mm | Bed length: 2,500mm | 3-axis Digital Readout (DRO)',
      description: 'Heavy geared-head lathes capable of turning long industrial drive shafts, paper mill rollers, flanged brass bushings, and chasing metric, Whitworth, and ACME power threads.',
      tolerances: '±0.01mm (10 microns) runout accuracy',
      icon: Cog
    },
    {
      id: 'welding',
      name: 'AWS D1.1 Certified Welding Stations',
      category: 'Heavy Structural Jointing',
      specs: '400A heavy-duty MIG/MAG rigs | AC/DC high-frequency TIG (Argon gas shielded)',
      description: 'Dedicated fabrication bays for full-penetration welding of cantilever parking canopies, crane gantry beams, and pressure piping. Every weld inspected for porosity and undercuts.',
      tolerances: 'AWS D1.1 structural welding code compliant',
      icon: Hammer
    },
    {
      id: 'foundry',
      name: 'Integrated Aluminum Casting Foundry',
      category: 'Foundry & Pattern Development',
      specs: 'A356 & LM6 alloy melts | Gravity die casting & green sand molding',
      description: 'In-house pattern shop converting CAD files into wooden/metallic master molds for architectural balcony panels, decorative perimeter grilles, and custom industrial machinery housings.',
      tolerances: 'Smooth surface finish with zero sand blowholes',
      icon: Layers
    }
  ];

  const stockedMaterials = [
    { name: 'Mild Steel (MS)', grades: 'ASTM A36, Q235B, EN8, EN9', forms: 'Sheets, C-Channels, I-Beams, Solid Rounds' },
    { name: 'Tool Steels', grades: 'AISI D2, H13, O1', forms: 'Precision ground flats and rounds for dies & punches' },
    { name: 'Pre-Galvanized Coil', grades: 'Z275 (275g/m² zinc coating)', forms: '1.5mm to 3.5mm thickness for solar purlins' },
    { name: 'Stainless Steel', grades: 'SS 304, SS 316, SS 316L', forms: 'Food-grade & chemical-resistant pipes, sheets & shafts' },
    { name: 'Foundry Aluminum', grades: 'A356, LM6, 6061-T6', forms: 'High-purity ingots & extruded structural sections' }
  ];

  return (
    <PageTransition className="bg-brand-neutral min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Workshop & Machinery Fleet' }]} />
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-brand-slate text-white py-16 relative overflow-hidden border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand-orange/20 border border-brand-orange/30 text-brand-orange text-xs font-bold uppercase tracking-wider">
              <Factory className="w-3.5 h-3.5" />
              <span>Fabrication Works Silo • Lahore, Punjab</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Machinery Fleet & Engineering Workshop
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Equipped with heavy mechanical power presses, geared industrial lathe centers, certified argon/MIG welding bays, and an integrated aluminum foundry capable of handling multi-ton structural projects.
            </p>

            <div className="pt-4 flex flex-wrap gap-4 text-xs font-mono text-slate-300">
              <div className="bg-slate-800/90 px-3 py-1.5 rounded border border-slate-700 flex items-center gap-2">
                <Zap className="w-4 h-4 text-brand-orange" />
                <span>Dedicated Heavy Industrial Power Backup</span>
              </div>
              <div className="bg-slate-800/90 px-3 py-1.5 rounded border border-slate-700 flex items-center gap-2">
                <Ruler className="w-4 h-4 text-brand-blue" />
                <span>150-Ton Press Stamping Bolster</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workshop Machinery Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-brand-slate tracking-tight">
            Core Production Machinery Fleet
          </h2>
          <p className="text-sm text-brand-charcoal mt-1">
            Inspected and calibrated equipment ensuring repeatable engineering tolerances for every batch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {machineryFleet.map((machine) => {
            const Icon = machine.icon;
            return (
              <div 
                key={machine.id}
                className="bg-white rounded-xl border border-brand-border p-6 sm:p-8 shadow-sm hover:border-brand-blue/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="p-3 bg-brand-neutral rounded-lg text-brand-blue border border-brand-border">
                      <Icon className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded">
                      {machine.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-brand-slate mb-2">
                    {machine.name}
                  </h3>

                  <div className="bg-slate-50 border border-slate-200 rounded p-2.5 text-xs font-mono text-brand-slate mb-3">
                    {machine.specs}
                  </div>

                  <p className="text-xs text-brand-charcoal leading-relaxed mb-4">
                    {machine.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Tolerance:</span>
                  <span className="font-bold text-emerald-600 font-mono">{machine.tolerances}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stocked Raw Materials Inventory */}
        <div className="mt-16 bg-white rounded-xl border border-brand-border p-6 sm:p-8 shadow-sm">
          <h3 className="text-xl font-bold text-brand-slate mb-2 flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-blue" />
            <span>Raw Materials Stocked On-Site</span>
          </h3>
          <p className="text-xs text-brand-charcoal mb-6">
            We maintain active stock of certified prime materials to guarantee rapid turnaround times for urgent fabrication needs across Punjab.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stockedMaterials.map((mat, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <h4 className="text-sm font-bold text-brand-slate">{mat.name}</h4>
                <div className="text-[11px] font-mono text-brand-blue mt-1">Grades: {mat.grades}</div>
                <div className="text-xs text-brand-charcoal mt-1">{mat.forms}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Punjab Logistics & Service Coverage */}
        <div className="mt-12 bg-brand-slate text-white rounded-xl p-8 shadow-md border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-brand-orange text-xs font-bold uppercase tracking-wider">
                <Truck className="w-4 h-4" />
                <span>Punjab-Wide Dispatch & Crane Rigging</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Turnkey Transportation & On-Site Installation
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Our workshop coordinates specialized flatbed transport, mobile hoisting cranes, and certified installation personnel directly from Lahore to job sites across all major industrial clusters of Punjab.
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {safeDistricts.map((district, idx) => (
                  <span key={idx} className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-2.5 py-1 rounded flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-brand-orange" />
                    <span>{district}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-800/80 p-6 rounded-lg border border-slate-700 text-center space-y-4">
              <Building className="w-10 h-10 text-brand-orange mx-auto" />
              <h4 className="text-base font-bold text-white">Visit Our Lahore Workshop</h4>
              <p className="text-xs text-slate-300">
                Procurement managers, structural engineers, and contractors are welcome to inspect our ongoing production runs and material testing facilities.
              </p>
              <Link to="/contact" className="btn-accent text-xs py-2.5 px-5 font-bold inline-flex items-center gap-2">
                <span>Schedule a Workshop Inspection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </PageTransition>
  );
}
