import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sun, 
  Building, 
  Cog, 
  Layers, 
  Wrench, 
  MapPin, 
  ArrowRight, 
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
    <motion.div 
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group bg-white border border-brand-border rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-brand-blue/60 transition-all flex flex-col"
    >
      {/* Blueprint Visual Container */}
      <div className="relative h-44 bg-slate-900 border-b border-slate-800 p-5 flex flex-col justify-between overflow-hidden">
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

        {/* Central Graphic Indicator */}
        <div className="relative z-10 flex items-center gap-3 py-1">
          <div className="w-10 h-10 rounded-lg bg-brand-blue/30 border border-brand-blue/50 flex items-center justify-center text-brand-orange group-hover:scale-105 transition-transform shrink-0">
            <IconComponent className="w-5 h-5 stroke-[2]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider truncate">
              Lahore Works Build
            </span>
            <span className="text-xs text-slate-200 font-semibold truncate">
              {project.clientType}
            </span>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-slate-400 text-xs border-t border-slate-800/80 pt-1.5">
          <span className="font-mono text-[10px]">{project.year}</span>
          <button 
            type="button"
            onClick={() => onSelect && onSelect(project)}
            className="inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-brand-orange transition-colors"
          >
            <span>Quick Modal</span>
            <Maximize2 className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-sm font-bold text-brand-slate group-hover:text-brand-blue transition-colors line-clamp-2 leading-snug">
            <Link to={`/portfolio/${project.id}`}>
              {project.title}
            </Link>
          </h3>
          <p className="text-xs text-brand-charcoal mt-1.5 line-clamp-2 leading-relaxed">
            {project.summary}
          </p>
        </div>

        {/* Specs snippet */}
        <div className="space-y-1 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-start justify-between gap-2">
            <span className="text-slate-500 font-medium shrink-0">Gauge:</span>
            <span className="font-mono text-brand-slate text-right truncate text-[11px] font-semibold">
              {project.specs?.materialGauge}
            </span>
          </div>
        </div>

        {/* Primary Case Study Silo Action */}
        <div className="pt-2">
          <Link
            to={`/portfolio/${project.id}`}
            className="w-full btn-primary text-xs py-2 flex items-center justify-center gap-1.5 font-bold group-hover:bg-brand-blue-dark transition-colors"
          >
            <span>View Full Case Study Silo</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
