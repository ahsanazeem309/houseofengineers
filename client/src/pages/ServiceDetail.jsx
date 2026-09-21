import React, { useState, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Cog, 
  Hammer, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Calculator, 
  ArrowRight, 
  ChevronDown, 
  Phone, 
  Download, 
  Layers, 
  Clock, 
  MapPin, 
  AlertCircle 
} from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import Breadcrumb from '../components/Breadcrumb';
import PageTransition from '../components/PageTransition';

// Extended technical silo data for each engineering category
const siloDetails = {
  'solar-mounting': {
    metaTitle: 'Solar Mounting Structures | Certified High-Tensile HDG Frameworks Lahore',
    badge: 'Solar Structural Engineering Silo',
    leadHeadline: 'Certified 145 km/h Wind-Resilient Solar Mounting Frameworks',
    subText: 'Engineered for rooftop commercial arrays, industrial canopies, and utility-scale solar farms across Punjab. Hot-dip galvanized to ASTM A123 for 25+ years rust-free operational life.',
    heroMetric: { value: '50+ MW', label: 'Solar Frameworks Fabricated Across Punjab' },
    standards: ['ASTM A123 HDG Standard', 'Q235B / ASTM A36 Steel', 'UBC Wind Shear Zone 2B/3', 'AWS D1.1 Welding'],
    calculator: {
      type: 'solar',
      title: 'Solar Structural Steel Estimator',
      desc: 'Calculate estimated structural steel tonnage and required mounting purlins based on your solar system capacity (kW).'
    },
    workflowSteps: [
      { step: '01', title: 'Wind-Load & Roof Structural Audit', desc: 'Analyzing rooftop dead load, seismic zoning, and monsoon wind turbulence (up to 145 km/h).' },
      { step: '02', title: 'CNC Roll-Forming & Slotted Punching', desc: 'Automated fabrication of C-channels, purlins, and bracing with precision slotted holes for rapid bolt assembly.' },
      { step: '03', title: 'Hot-Dip Galvanizing (80-100 Microns)', desc: 'Full-immersion zinc coating complying with ASTM A123 standards to ensure 25-year corrosion protection.' },
      { step: '04', title: 'Punjab On-Site Turnkey Assembly', desc: 'Pre-assembled modular sections delivered and anchored using chemical epoxy anchors or non-penetrating ballast.' }
    ],
    faqs: [
      { q: 'What steel grades are used for your solar mounting structures?', a: 'We fabricate using Q235B and high-yield cold-formed structural steel conforming to ASTM A36. Structural members are rolled in thicknesses from 2.0mm to 3.5mm depending on wind shear requirements.' },
      { q: 'Do your structures require roof puncturing?', a: 'For commercial flat roofs, we engineer ballasted non-penetrating systems with EPDM rubber pads that protect the waterproofing layer. For high-wind elevated canopies, we chemically anchor to structural concrete columns without compromising roof integrity.' },
      { q: 'What is the zinc coating thickness for rust protection in Punjab?', a: 'All exterior members undergo Hot-Dip Galvanizing (HDG) with a minimum coating thickness of 80 to 100 microns (550+ g/m² zinc weight) in accordance with ASTM A123, ensuring zero maintenance even in industrial sulfur atmospheres.' }
    ]
  },
  'precision-machining': {
    metaTitle: 'Precision Machining & Tooling | High-Tolerance Lathe & Die Stamping Lahore',
    badge: 'Precision Machining & Tooling Silo',
    leadHeadline: 'Micron-Level Lathe Turning, Progressive Tooling & Stamping Dies',
    subText: 'Fabricating custom components, replacement machine shafts, and progressive stamping dies for textile mills, packaging plants, and automotive vendors across Punjab.',
    heroMetric: { value: '±0.01 mm', label: 'Machining Tolerance Maintained' },
    standards: ['DIN ISO 2768 Precision', 'AISI D2 & H13 Tool Steels', '55+ HRC Induction Hardening', 'Dynamic Balancing'],
    calculator: {
      type: 'machining',
      title: 'Batch Production & Tooling Estimator',
      desc: 'Estimate material requirements and turnaround timeline for high-volume lathe turned parts and stamped brackets.'
    },
    workflowSteps: [
      { step: '01', title: 'Metallurgical Analysis & CAD Ingestion', desc: 'Reviewing 2D/3D CAD models, material certifications (EN8/EN19/D2), and establishing geometric tolerances.' },
      { step: '02', title: 'Heavy Lathe Turning & Wire EDM', desc: 'Precision cylindrical turning, taper cutting, keyway broaching, and high-speed CNC wire cutting.' },
      { step: '03', title: 'Heat Treatment & Case Hardening', desc: 'Controlled atmosphere induction hardening, quenching, and tempering to achieve specified Rockwell hardness.' },
      { step: '04', title: 'Micrometer QC & Dynamic Balancing', desc: '100% dimensional verification using digital micrometers, bore gauges, and dynamic balancing up to 3,000 RPM.' }
    ],
    faqs: [
      { q: 'What tolerances can your machine shop maintain?', a: 'We routinely machine critical bearing fits, internal bores, and spline journals down to ±0.01 mm (10 microns) using digital readout geared lathes and precision cylindrical grinders.' },
      { q: 'Can you reverse-engineer worn or broken imported parts?', a: 'Yes. Our engineers measure your physical sample, perform material hardness testing, draft 2D/3D CAD fabrication drawings, and produce exact replacements within 48 to 72 hours.' },
      { q: 'What is the maximum workpiece capacity of your lathe centers?', a: 'Our heavy-duty industrial lathe centers handle shafts and cylindrical workpieces up to Ø600mm diameter and 2,500mm (2.5 meters) in total bed length.' }
    ]
  },
  'structural-fabrication': {
    metaTitle: 'Structural Steel & Heavy Fabrication | Cantilever Sheds & Aluminum Casting Lahore',
    badge: 'Structural Fabrication & Foundry Silo',
    leadHeadline: 'Heavy Structural Steel Framing, Cantilever Sheds & Architectural Castings',
    subText: 'From 50-car corporate cantilever parking structures to AWS D1.1 certified factory gates, overhead crane runways, and custom ornamental aluminum foundry castings.',
    heroMetric: { value: '150+ Tons', label: 'Monthly Steel Fabrication Capacity' },
    standards: ['AWS D1.1 Structural Welding', 'ASTM A500 Hollow Sections', 'A356 Aluminum Foundry Cast', '2K Epoxy Primers'],
    calculator: {
      type: 'structural',
      title: 'Structural Steel Frame Estimator',
      desc: 'Estimate structural steel tonnage and foundation requirements based on square footage or parking bay count.'
    },
    workflowSteps: [
      { step: '01', title: 'Structural Engineering & Load Calculations', desc: 'Calculating dead load, wind shear, live load, and foundation anchoring requirements per building code.' },
      { step: '02', title: 'Miter Cutting, CNC Bending & Fit-Up', desc: 'High-precision cold sawing, mandrel tube bending, and jig assembly of truss sections.' },
      { step: '03', title: 'AWS Certified Multi-Pass Welding', desc: 'Argon TIG and heavy MIG welding bays delivering full-penetration butt and fillet welds tested for zero defects.' },
      { step: '04', title: 'Sandblasting & Multi-Layer Coating', desc: 'Surface preparation to Sa 2.5 followed by zinc-rich epoxy primer (75µm) and polyurethane topcoat (50µm).' }
    ],
    faqs: [
      { q: 'Do your cantilever car parking sheds require center support pillars?', a: 'No. Our cantilever designs provide completely unobstructed vehicle access with single-column rear cantilever overhangs up to 6.0 meters, engineered to resist severe monsoon wind gusts.' },
      { q: 'What welding certifications do your fabrication bays comply with?', a: 'All structural steel joints adhere to AWS D1.1 structural welding codes. Critical load-bearing joints undergo non-destructive ultrasonic testing (UT) and dye penetrant inspection.' },
      { q: 'Do you provide on-site crane erection across Punjab?', a: 'Yes. Our turnkey teams handle logistics, mobile crane hoisting, high-tensile torque bolting, and on-site touchup coating throughout Lahore, Faisalabad, Multan, and Rawalpindi.' }
    ]
  }
};

// Aliases for friendly URLs
const idAliases = {
  'solar-structures': 'solar-mounting',
  'solar-mounting': 'solar-mounting',
  'precision-machining': 'precision-machining',
  'custom-parts': 'precision-machining',
  'structural-fabrication': 'structural-fabrication',
  'industrial-sheds': 'structural-fabrication',
  'architectural-metalwork': 'structural-fabrication'
};

export default function ServiceDetail() {
  const { serviceId } = useParams();
  const { services, portfolio, settings } = useSiteContent();
  const [openFaq, setOpenFaq] = useState(0);

  // Interactive Calculator State
  const [calcInput, setCalcInput] = useState(50); // 50 kW or 500 sq ft
  const [calcTier, setCalcTier] = useState('standard');

  const resolvedId = idAliases[serviceId] || serviceId;
  const service = services.find(s => s.id === resolvedId);
  const silo = siloDetails[resolvedId];

  if (!service || !silo) {
    return <Navigate to="/services" replace />;
  }

  // Calculate dynamic engineering estimates
  const calculatedOutput = useMemo(() => {
    const val = parseFloat(calcInput) || 0;
    if (silo.calculator.type === 'solar') {
      const steelTonnage = (val * 0.045).toFixed(2); // ~45kg per kW
      const purlinCount = Math.ceil(val * 2.8);
      const days = Math.max(3, Math.ceil(val / 25));
      return {
        metric1: `${steelTonnage} MT`,
        metric1Label: 'Estimated High-Tensile Steel Weight',
        metric2: `${purlinCount} Pcs`,
        metric2Label: 'Slotted C-Channels & Purlins',
        metric3: `${days} Days`,
        metric3Label: 'Fabrication & HDG Timeline'
      };
    } else if (silo.calculator.type === 'machining') {
      const units = Math.max(1, val);
      const estHours = (units * 0.35).toFixed(1);
      const days = Math.max(2, Math.ceil(units / 150));
      return {
        metric1: `${units} Pcs`,
        metric1Label: 'Batch Production Volume',
        metric2: `${estHours} Hrs`,
        metric2Label: 'Lathe & Milling Machine Time',
        metric3: `${days} Days`,
        metric3Label: 'Heat Treatment & Final QC'
      };
    } else {
      const sqft = Math.max(100, val);
      const steelTonnage = (sqft * 0.0038).toFixed(2); // ~3.8kg per sq ft
      const bays = Math.ceil(sqft / 300);
      const days = Math.max(5, Math.ceil(sqft / 200));
      return {
        metric1: `${steelTonnage} MT`,
        metric1Label: 'Structural Steel Tonnage',
        metric2: `${bays} Bays`,
        metric2Label: 'Modular Structural Cantilever Bays',
        metric3: `${days} Days`,
        metric3Label: 'Shop Fabrication & Priming'
      };
    }
  }, [calcInput, silo.calculator.type]);

  // Find related portfolio projects
  const relatedProjects = useMemo(() => {
    return portfolio.filter(p => {
      if (resolvedId === 'solar-mounting') return p.category.toLowerCase().includes('solar');
      if (resolvedId === 'precision-machining') return p.category.toLowerCase().includes('custom') || p.category.toLowerCase().includes('parts');
      return p.category.toLowerCase().includes('machinery') || p.category.toLowerCase().includes('cast');
    }).slice(0, 3);
  }, [portfolio, resolvedId]);

  return (
    <PageTransition className="bg-brand-neutral min-h-screen pb-20">
      {/* Silo Breadcrumb Navigation */}
      <div className="bg-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb 
            items={[
              { label: 'Capabilities & Services', path: '/services' },
              { label: service.title }
            ]} 
          />
        </div>
      </div>

      {/* Silo Hero Section */}
      <section className="bg-brand-slate text-white py-16 sm:py-20 relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#e48738_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand-orange/20 border border-brand-orange/30 text-brand-orange text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{silo.badge}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {silo.leadHeadline}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
                {silo.subText}
              </p>

              {/* Compliance Badges */}
              <div className="pt-2 flex flex-wrap gap-2 sm:gap-3">
                {silo.standards.map((std, idx) => (
                  <span key={idx} className="bg-slate-800/80 border border-slate-700 text-slate-300 text-xs px-3 py-1 rounded-md font-mono flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{std}</span>
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link to="/quote" className="btn-accent text-sm py-3 px-6 shadow-md font-semibold gap-2">
                  <span>Get Itemized RFQ Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a 
                  href={`https://wa.me/${settings?.whatsappNumber || '923001234567'}?text=${encodeURIComponent(`Hi House of Engineers, I would like an engineering consultation regarding ${service.title}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline text-white border-slate-600 hover:bg-slate-800 text-sm py-3 px-6 font-semibold"
                >
                  Direct WhatsApp Engineering Desk
                </a>
              </div>
            </div>

            {/* Hero Metric Card */}
            <div className="lg:col-span-4">
              <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-8 shadow-xl text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-lg bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange">
                  {resolvedId === 'solar-mounting' && <Sun className="w-8 h-8 stroke-[2.2]" />}
                  {resolvedId === 'precision-machining' && <Cog className="w-8 h-8 stroke-[2.2]" />}
                  {resolvedId === 'structural-fabrication' && <Hammer className="w-8 h-8 stroke-[2.2]" />}
                </div>
                <div className="text-4xl font-extrabold text-white font-mono tracking-tight">
                  {silo.heroMetric.value}
                </div>
                <div className="text-sm text-slate-300 font-medium">
                  {silo.heroMetric.label}
                </div>
                <div className="pt-4 border-t border-slate-700/80 text-xs text-slate-400 flex items-center justify-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                  <span>Workshop & Hot-Dip Galvanizing in Lahore</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Technical Specs & Interactive Estimator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Full Technical Matrix */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Engineering Overview */}
            <section className="bg-white rounded-xl border border-brand-border p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-brand-slate tracking-tight mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-brand-blue" />
                <span>Technical Specifications & Engineering Matrix</span>
              </h2>
              <p className="text-sm text-brand-charcoal leading-relaxed mb-6">
                All structural and mechanical elements are fabricated at our Lahore workshop adhering to stringent quality control guidelines, calibrated to withstand the demanding thermal and environmental conditions of Punjab.
              </p>

              {/* Spec Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {service.specifications.map((spec, idx) => (
                      <tr key={idx} className={`border-b border-slate-100 ${idx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}`}>
                        <td className="py-3 px-4 text-xs font-bold text-brand-slate uppercase tracking-wider w-1/3 border-r border-slate-100">
                          {spec.label}
                        </td>
                        <td className="py-3 px-4 text-xs sm:text-sm text-brand-charcoal font-medium">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Key Technical Features Checklist */}
              <div className="mt-8 pt-6 border-t border-brand-border">
                <h3 className="text-base font-bold text-brand-slate mb-4">Engineering Inclusions & Build Standards</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-brand-charcoal">
                      <CheckCircle2 className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Interactive Engineering Estimator Tool */}
            <section className="bg-white rounded-xl border border-brand-border p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-brand-orange/10 rounded-lg text-brand-orange">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-brand-slate">{silo.calculator.title}</h3>
                    <p className="text-xs text-brand-charcoal">{silo.calculator.desc}</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold bg-brand-neutral border border-brand-border px-2.5 py-1 rounded text-brand-blue">
                  Live Calculator
                </span>
              </div>

              {/* Input Range Slider */}
              <div className="my-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="calc-slider" className="text-xs font-bold text-brand-slate uppercase tracking-wider">
                    {silo.calculator.type === 'solar' && 'System Capacity (kW)'}
                    {silo.calculator.type === 'machining' && 'Production Batch Quantity (Units)'}
                    {silo.calculator.type === 'structural' && 'Total Area / Footprint (Square Feet)'}
                  </label>
                  <span className="text-base font-extrabold text-brand-blue font-mono">
                    {calcInput} {silo.calculator.type === 'solar' ? 'kW' : silo.calculator.type === 'machining' ? 'Pcs' : 'Sq. Ft.'}
                  </span>
                </div>
                <input 
                  id="calc-slider"
                  type="range" 
                  min={silo.calculator.type === 'solar' ? 10 : silo.calculator.type === 'machining' ? 20 : 200}
                  max={silo.calculator.type === 'solar' ? 1000 : silo.calculator.type === 'machining' ? 5000 : 15000}
                  step={silo.calculator.type === 'solar' ? 10 : silo.calculator.type === 'machining' ? 20 : 100}
                  value={calcInput}
                  onChange={(e) => setCalcInput(e.target.value)}
                  className="w-full accent-brand-blue cursor-pointer h-2 bg-slate-200 rounded-lg"
                  aria-label="Adjust project scope"
                />
              </div>

              {/* Estimator Outputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-brand-neutral rounded-lg p-4 border border-brand-border text-center">
                  <div className="text-2xl font-extrabold text-brand-blue font-mono mb-1">{calculatedOutput.metric1}</div>
                  <div className="text-xs text-brand-charcoal">{calculatedOutput.metric1Label}</div>
                </div>
                <div className="bg-brand-neutral rounded-lg p-4 border border-brand-border text-center">
                  <div className="text-2xl font-extrabold text-brand-slate font-mono mb-1">{calculatedOutput.metric2}</div>
                  <div className="text-xs text-brand-charcoal">{calculatedOutput.metric2Label}</div>
                </div>
                <div className="bg-brand-neutral rounded-lg p-4 border border-brand-border text-center">
                  <div className="text-2xl font-extrabold text-brand-orange font-mono mb-1">{calculatedOutput.metric3}</div>
                  <div className="text-xs text-brand-charcoal">{calculatedOutput.metric3Label}</div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
                <p className="text-[11px] text-slate-500 italic">
                  *Preliminary estimates for estimation purposes. Final BOM determined through PE structural stamped calculations.
                </p>
                <Link to="/quote" className="btn-primary text-xs py-2 px-4 shrink-0 font-semibold gap-1">
                  <span>Lock in Quote For This Scope</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </section>

            {/* 4-Step Fabrication Workflow */}
            <section className="bg-white rounded-xl border border-brand-border p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-brand-slate mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-blue" />
                <span>Shop Fabrication & Quality Control Workflow</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {silo.workflowSteps.map((ws, idx) => (
                  <div key={idx} className="relative p-5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <div className="text-3xl font-extrabold text-brand-orange/30 font-mono mb-2">{ws.step}</div>
                    <h4 className="text-sm font-bold text-brand-slate mb-1.5">{ws.title}</h4>
                    <p className="text-xs text-brand-charcoal leading-relaxed">{ws.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Silo FAQ Accordion */}
            <section className="bg-white rounded-xl border border-brand-border p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-brand-slate mb-6">Frequently Asked Engineering Questions</h3>
              <div className="space-y-3">
                {silo.faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                        className="w-full py-3.5 px-4 text-left flex justify-between items-center gap-4 bg-slate-50 hover:bg-slate-100/80 transition-colors"
                      >
                        <span className="text-xs sm:text-sm font-bold text-brand-slate">{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="p-4 text-xs text-brand-charcoal bg-white border-t border-slate-100 leading-relaxed"
                          >
                            {faq.a}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </section>

          </div>

          {/* Right Column: Sticky Procurement Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Quote Widget */}
            <div className="bg-brand-slate text-white rounded-xl p-6 shadow-md border border-slate-800 sticky top-24">
              <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-orange" />
                <span>Submit Technical Drawings</span>
              </h4>
              <p className="text-xs text-slate-300 mb-5 leading-relaxed">
                Have an AutoCAD DWG, PDF blueprint, or specific Bill of Materials? Upload your requirements for an itemized estimate within 24 business hours.
              </p>

              <Link 
                to="/quote" 
                className="w-full btn-accent py-3 text-center flex items-center justify-center gap-2 text-sm font-bold mb-3 shadow-md"
              >
                <span>Launch RFQ Form</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a 
                href={`tel:${(settings?.primaryPhone || '+923001234567').replace(/[^0-9+]/g, '')}`}
                className="w-full btn-outline border-slate-600 text-white hover:bg-slate-800 py-2.5 text-center flex items-center justify-center gap-2 text-xs font-semibold"
              >
                <Phone className="w-3.5 h-3.5 text-brand-orange" />
                <span>Call Estimator: {settings?.primaryPhone || '+92 300 123 4567'}</span>
              </a>

              <div className="mt-6 pt-5 border-t border-slate-700/80 text-[11px] text-slate-400 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Itemized BOM Pricing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Punjab-Wide Installation Teams</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mill Test Certificates Available</span>
                </div>
              </div>
            </div>

            {/* Related Case Studies in this Silo */}
            {relatedProjects.length > 0 && (
              <div className="bg-white rounded-xl border border-brand-border p-6 shadow-sm">
                <h4 className="text-sm font-bold text-brand-slate uppercase tracking-wider mb-4">
                  Case Studies In This Discipline
                </h4>
                <div className="space-y-4">
                  {relatedProjects.map((proj) => (
                    <Link
                      key={proj.id}
                      to={`/portfolio/${proj.id}`}
                      className="group block p-3 rounded-lg border border-slate-100 hover:border-brand-blue/30 hover:bg-slate-50 transition-all"
                    >
                      <span className="text-[10px] font-mono uppercase font-bold text-brand-orange">
                        {proj.location} • {proj.year}
                      </span>
                      <h5 className="text-xs font-bold text-brand-slate group-hover:text-brand-blue transition-colors mt-0.5 line-clamp-2">
                        {proj.title}
                      </h5>
                      <span className="text-[11px] text-brand-blue font-medium mt-1 inline-flex items-center gap-1">
                        <span>View Project Blueprint</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Link to other Silos */}
            <div className="bg-white rounded-xl border border-brand-border p-6 shadow-sm">
              <h4 className="text-xs font-bold text-brand-slate uppercase tracking-wider mb-3">
                Other Engineering Disciplines
              </h4>
              <ul className="space-y-2 text-xs">
                {services.filter(s => s.id !== resolvedId).map(s => (
                  <li key={s.id}>
                    <Link 
                      to={`/services/${s.id}`} 
                      className="text-brand-charcoal hover:text-brand-blue flex items-center justify-between py-1.5 border-b border-slate-100 group"
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform">{s.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-blue" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      </div>
    </PageTransition>
  );
}
