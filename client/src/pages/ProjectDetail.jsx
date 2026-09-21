import React, { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Tag, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  FileCode, 
  ShieldCheck, 
  Layers, 
  Wrench, 
  Share2 
} from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import Breadcrumb from '../components/Breadcrumb';
import PageTransition from '../components/PageTransition';

export default function ProjectDetail() {
  const { projectId } = useParams();
  const { portfolio, services, settings } = useSiteContent();

  const project = useMemo(() => {
    return portfolio.find(p => p.id === projectId);
  }, [portfolio, projectId]);

  if (!project) {
    return <Navigate to="/portfolio" replace />;
  }

  // Related projects
  const relatedProjects = useMemo(() => {
    return portfolio
      .filter(p => p.id !== project.id && (p.category === project.category || true))
      .slice(0, 3);
  }, [portfolio, project]);

  return (
    <PageTransition className="bg-brand-neutral min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb 
            items={[
              { label: 'Engineering Portfolio', path: '/portfolio' },
              { label: project.title }
            ]} 
          />
        </div>
      </div>

      {/* Case Study Hero */}
      <section className="bg-brand-slate text-white py-14 sm:py-16 relative overflow-hidden border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-brand-orange text-white font-mono uppercase font-bold px-2.5 py-0.5 rounded">
                {project.category}
              </span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-300 font-mono">Case Study #{project.id.toUpperCase()}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {project.title}
            </h1>

            <p className="text-base text-slate-300 leading-relaxed">
              {project.summary}
            </p>

            {/* Meta Tags Strip */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800">
              <div>
                <span className="text-[11px] uppercase font-bold text-slate-400 block">Client Type</span>
                <span className="text-xs sm:text-sm font-semibold text-slate-200">{project.clientType}</span>
              </div>
              <div>
                <span className="text-[11px] uppercase font-bold text-slate-400 block">Punjab Location</span>
                <span className="text-xs sm:text-sm font-semibold text-slate-200">{project.location}</span>
              </div>
              <div>
                <span className="text-[11px] uppercase font-bold text-slate-400 block">Completion Year</span>
                <span className="text-xs sm:text-sm font-semibold text-slate-200">{project.year}</span>
              </div>
              <div>
                <span className="text-[11px] uppercase font-bold text-slate-400 block">Quality Status</span>
                <span className="text-xs sm:text-sm font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Handed Over
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Engineering Case Study Narrative & Blueprint Schematics */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Technical Blueprint Mockup Graphic */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 sm:p-8 relative overflow-hidden shadow-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-brand-orange" />
                  <span className="text-xs font-mono text-slate-300 tracking-wider uppercase">
                    Shop Drawing & Assembly Schematic • {project.id}
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                  CAD REV 3.2
                </span>
              </div>

              {/* Schematic Grid Visualizer */}
              <div className="h-64 sm:h-80 rounded-lg border border-dashed border-slate-700 bg-slate-950/80 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-40 pointer-events-none" />
                
                <div className="relative z-10 space-y-3 max-w-md">
                  <div className="w-12 h-12 rounded-full bg-brand-blue/30 border border-brand-blue/50 flex items-center justify-center text-white mx-auto">
                    <Wrench className="w-6 h-6 text-brand-orange" />
                  </div>
                  <h4 className="text-sm font-bold text-white tracking-wide">
                    {project.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-mono">
                    Fabricated at House of Engineers Lahore Works. High-tensile steel cold-forming, precision jig alignment, and full-immersion hot-dip galvanizing.
                  </p>
                  <div className="pt-2 flex justify-center gap-2 text-[11px] font-mono text-slate-300">
                    <span className="bg-slate-800/90 px-2.5 py-1 rounded border border-slate-700">Lahore Shop Erection</span>
                    <span className="bg-slate-800/90 px-2.5 py-1 rounded border border-slate-700">100% Pre-Drilled</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Engineering Case Study Breakdown */}
            <section className="bg-white rounded-xl border border-brand-border p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-2xl font-bold text-brand-slate tracking-tight">
                Project Scope & Engineering Execution
              </h2>
              
              <div className="prose prose-sm max-w-none text-brand-charcoal space-y-4 text-sm leading-relaxed">
                <p>
                  {project.details}
                </p>
                <p>
                  Every load-bearing component was pre-engineered at our Lahore fabrication works using automated roll-forming and CNC cold saws before undergoing surface treatment. On-site installation required strict coordination with client factory operating shifts to ensure zero operational downtime during the erection phase.
                </p>
              </div>

              {/* Quality & Safety Standard Checklist */}
              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold text-brand-slate uppercase tracking-wider mb-4">
                  Quality Assurance Protocols Enforced
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2.5 text-xs text-brand-charcoal">
                    <CheckCircle2 className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <span>Zinc coating thickness measured with digital magnetic gauge (ASTM A123)</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-brand-charcoal">
                    <CheckCircle2 className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <span>AWS D1.1 structural welding code compliance with visual & dye inspection</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-brand-charcoal">
                    <CheckCircle2 className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <span>Torque wrench verification for Grade 8.8 Dacromet-coated anchor bolts</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-brand-charcoal">
                    <CheckCircle2 className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <span>Pre-assembly dry fit in workshop prior to dispatch across Punjab</span>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Right: Technical Spec Sheet & Quote Callout */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Spec Sheet Table */}
            <div className="bg-white rounded-xl border border-brand-border p-6 shadow-sm">
              <h3 className="text-sm font-bold text-brand-slate uppercase tracking-wider mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-blue" />
                <span>Technical Specifications</span>
              </h3>
              
              <div className="space-y-3">
                {Object.entries(project.specs || {}).map(([key, value]) => {
                  const label = key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase());
                  return (
                    <div key={key} className="pb-3 border-b border-slate-100 last:border-none">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        {label}
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-brand-slate block mt-0.5">
                        {value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Request Quote Card */}
            <div className="bg-brand-slate text-white rounded-xl p-6 shadow-md border border-slate-800">
              <h4 className="text-base font-bold text-white mb-2">
                Require Similar Fabrication?
              </h4>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                We provide custom engineering estimates for industrial clients, commercial projects, and EPC contractors.
              </p>
              
              <Link 
                to="/quote" 
                className="w-full btn-accent py-2.5 text-center flex items-center justify-center gap-2 text-xs font-bold shadow-sm"
              >
                <span>Request Project Proposal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Return to Portfolio Link */}
            <div className="text-center">
              <Link 
                to="/portfolio" 
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue hover:text-brand-blue-dark"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to All Case Studies</span>
              </Link>
            </div>

          </div>

        </div>

        {/* Bottom Related Projects Grid */}
        {relatedProjects.length > 0 && (
          <div className="mt-16 pt-10 border-t border-brand-border">
            <h3 className="text-xl font-bold text-brand-slate tracking-tight mb-6">
              More Industrial Engineering Projects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map(rel => (
                <Link
                  key={rel.id}
                  to={`/portfolio/${rel.id}`}
                  className="bg-white rounded-xl border border-brand-border p-5 hover:border-brand-blue/40 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-brand-orange">
                      {rel.category} • {rel.location}
                    </span>
                    <h4 className="text-sm font-bold text-brand-slate group-hover:text-brand-blue transition-colors mt-1">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-brand-charcoal line-clamp-2 mt-2 leading-relaxed">
                      {rel.summary}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-brand-blue">
                    <span>View Project Specs</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </PageTransition>
  );
}
