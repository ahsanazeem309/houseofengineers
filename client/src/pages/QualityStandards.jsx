import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  CheckCircle2, 
  FileCheck, 
  Award, 
  AlertTriangle, 
  Scale, 
  ArrowRight, 
  FileText 
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import PageTransition from '../components/PageTransition';

export default function QualityStandards() {
  const standardsList = [
    {
      code: 'ASTM A123 / A123M',
      title: 'Standard Specification for Zinc (Hot-Dip Galvanized) Coatings on Iron and Steel Products',
      scope: 'Applied to all exterior solar mounting channels, structural purlins, and gantry members. Ensures 80µm to 100µm minimum zinc coating for 25+ years corrosion barrier.',
      testingMethod: 'Digital magnetic flux coating thickness gauge (ASTM E376)'
    },
    {
      code: 'AWS D1.1 / D1.1M',
      title: 'Structural Welding Code — Steel',
      scope: 'Enforced across all MIG and TIG structural jointing for cantilever canopies, parking sheds, and warehouse trusses. Ensures full penetration butt welds and defect-free fillet welds.',
      testingMethod: 'Visual inspection (VT), Liquid dye penetrant testing (PT), Ultrasonic testing (UT)'
    },
    {
      code: 'ASTM A36 / Q235B',
      title: 'Standard Specification for Carbon Structural Steel',
      scope: 'Base structural steel standard for high-tensile cold-formed channels, baseplates, and bracketry. Yield strength min 235-250 MPa, tensile strength 370-500 MPa.',
      testingMethod: 'Mill Test Certificate (MTC EN 10204 3.1) traceability for every raw coil and heat number'
    },
    {
      code: 'DIN ISO 2768-m',
      title: 'General Tolerances for Linear and Angular Dimensions',
      scope: 'Standard tolerance grade for our lathe turning, cylindrical grinding, and mechanical power press stamping dies.',
      testingMethod: 'Calibrated digital micrometers, three-point internal bore gauges, and dynamic balancing'
    }
  ];

  const inspectionStages = [
    {
      stage: '01',
      name: 'Raw Material Verification',
      desc: 'Checking incoming steel coils and tool steel billets against Mill Test Certificates (MTC). Performing spark testing and hardness verification.'
    },
    {
      stage: '02',
      name: 'In-Process Fabrication QC',
      desc: 'First-article inspection for roll-formed purlins, hole spacing, and miter angles. Checking weld root pass and interpass temperatures.'
    },
    {
      stage: '03',
      name: 'Post-Coating & Galvanizing Audit',
      desc: 'Measuring zinc coating thickness across 10 random points per ton. Checking adhesion and clearing all threaded holes of excess zinc.'
    },
    {
      stage: '04',
      name: 'Pre-Dispatch Dry Assembly Fit',
      desc: 'Trial assembly of modular truss frames and cantilever bays at the Lahore workshop before loading onto dispatch flatbeds.'
    }
  ];

  return (
    <PageTransition className="bg-brand-neutral min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Quality Assurance & Standards' }]} />
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-brand-slate text-white py-16 relative overflow-hidden border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand-orange/20 border border-brand-orange/30 text-brand-orange text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Quality Assurance & Compliance Silo</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Engineering Standards & Inspection Protocols
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              We fabricate to international standards including ASTM, AWS, and ISO. Every batch of steel is tracked from mill receipt through fabrication and hot-dip galvanizing to final on-site erection across Punjab.
            </p>
          </div>
        </div>
      </section>

      {/* Standards List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-brand-slate tracking-tight">
            International Compliance Standards
          </h2>
          <p className="text-sm text-brand-charcoal mt-1">
            Standard specifications benchmarked across our Lahore fabrication works.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {standardsList.map((std, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-brand-border p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="inline-block text-xs font-mono font-bold bg-brand-neutral text-brand-blue border border-brand-border px-2.5 py-1 rounded mb-3">
                  {std.code}
                </div>
                <h3 className="text-base font-bold text-brand-slate mb-2">
                  {std.title}
                </h3>
                <p className="text-xs text-brand-charcoal leading-relaxed mb-4">
                  {std.scope}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-start gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-600 font-medium">
                  <strong className="text-brand-slate">Testing Method:</strong> {std.testingMethod}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 4-Stage Quality Control Protocol */}
        <div className="mt-16 bg-white rounded-xl border border-brand-border p-6 sm:p-8 shadow-sm">
          <h3 className="text-xl font-bold text-brand-slate mb-6 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-brand-blue" />
            <span>4-Stage Quality Gate Inspection Process</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {inspectionStages.map((stage, idx) => (
              <div key={idx} className="p-5 rounded-lg bg-slate-50 border border-slate-200 relative">
                <div className="text-3xl font-extrabold text-brand-blue/20 font-mono mb-2">{stage.stage}</div>
                <h4 className="text-sm font-bold text-brand-slate mb-1.5">{stage.name}</h4>
                <p className="text-xs text-brand-charcoal leading-relaxed">{stage.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Callout Box */}
        <div className="mt-12 bg-brand-slate text-white rounded-xl p-8 border border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div>
            <h4 className="text-lg font-bold text-white mb-1">Need Certified Mill Test Reports for Your Project?</h4>
            <p className="text-xs text-slate-300 max-w-xl">
              We supply Mill Test Certificates (MTC), galvanizing test reports, and weld inspection documentation with all commercial procurement orders.
            </p>
          </div>
          <Link to="/contact" className="btn-accent text-xs py-3 px-6 shrink-0 font-bold flex items-center gap-2">
            <span>Request Documentation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </PageTransition>
  );
}
