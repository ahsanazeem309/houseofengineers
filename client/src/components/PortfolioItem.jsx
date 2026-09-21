import React from 'react';
import { 
  Sun, 
  Building, 
  Cog, 
  Layers, 
  Wrench, 
  Shield, 
  Grid, 
  ExternalLink,
  MapPin,
  Maximize2
} from 'lucide-react';

const categoryIcons = {
  'Solar Structures': Sun,
  'Industrial Machinery/Panels': Building,
  'Cast Aluminum': Layers,
  'Custom Parts': Cog,
};

export default function PortfolioItem({ project, onSelect }) {
  const IconComponent = categoryIcons[project.category] || Wrench;

  return (
    <div 
      onClick={() => onSelect(project)}
      className="group bg-white border border-brand-border rounded-lg overflow-hidden shadow-technical hover:shadow-technical-lg hover:border-brand-blue/60 transition-all duration-200 flex flex-col cursor-pointer"
    >
      {/* Visual Technical Preview Graphic Container */}
      <div className="relative h-48 bg-slate-900 border-b border-slate-800 p-5 flex flex-col justify-between overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:14px_14px] pointer-events-none" />
        
        {/* Top Badges */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-orange text-white shadow-sm">
            {project.category}
          </span>
          <span className="text-[11px] font-mono text-slate-300 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-brand-orange" />
            {project.location.split(',')[0]}
          </span>
        </div>

        {/* Central Graphic / Blueprint Indicator */}
        <div className="relative z-10 flex items-center gap-3 py-2">
          <div className="w-12 h-12 rounded-md bg-brand-blue/30 border border-brand-blue/50 flex items-center justify-center text-brand-orange group-hover:scale-110 transition-transform">
            <IconComponent className="w-7 h-7 stroke-[2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              CAD Spec & Verified Build
            </span>
            <span className="text-xs text-slate-200 font-semibold truncate max-w-[200px]">
              {project.clientType}
            </span>
          </div>
        </div>

        {/* Hover overlay hint */}
        <div className="relative z-10 flex items-center justify-between text-slate-400 group-hover:text-white transition-colors text-xs border-t border-slate-800/80 pt-2">
          <span className="font-mono text-[11px]">ID: {project.id}</span>
          <span className="inline-flex items-center gap-1 font-semibold text-brand-orange text-xs">
            <span>View Full Specs</span>
            <Maximize2 className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base font-bold text-brand-slate group-hover:text-brand-blue transition-colors line-clamp-2 leading-snug">
            {project.title}
          </h3>
          <p className="text-xs text-brand-charcoal mt-1.5 line-clamp-2">
            {project.summary}
          </p>
        </div>

        {/* Concise Engineering Specs Grid */}
        <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-start justify-between gap-2">
            <span className="text-slate-500 font-medium shrink-0">Material Gauge:</span>
            <span className="font-mono text-slate-800 text-right truncate font-medium" title={project.specs.materialGauge}>
              {project.specs.materialGauge}
            </span>
          </div>
          <div className="flex items-start justify-between gap-2">
            <span className="text-slate-500 font-medium shrink-0">Process:</span>
            <span className="font-mono text-slate-800 text-right truncate font-medium" title={project.specs.processUsed}>
              {project.specs.processUsed}
            </span>
          </div>
        </div>

        {/* Card Action Button */}
        <div className="pt-2">
          <button
            type="button"
            className="w-full btn-outline text-xs py-2 flex items-center justify-center gap-1.5 group-hover:border-brand-blue group-hover:bg-brand-blue/5 transition-colors"
          >
            <span>Inspect Blueprint Specs</span>
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
