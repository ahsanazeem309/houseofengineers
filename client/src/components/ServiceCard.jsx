import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sun, 
  Cog, 
  Hammer, 
  CheckCircle2, 
  ArrowRight, 
  Sliders,
  FileCode 
} from 'lucide-react';

const iconMap = {
  Sun: Sun,
  Cog: Cog,
  Hammer: Hammer
};

export default function ServiceCard({ service, isDetailed = false }) {
  const IconComponent = iconMap[service.icon] || Cog;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-white border border-brand-border rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-brand-blue/50 transition-all flex flex-col h-full"
    >
      {/* Card Header Strip */}
      <div className="p-6 pb-4 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-start justify-between gap-4">
          <div className="w-12 h-12 rounded-lg bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue shrink-0">
            <IconComponent className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 bg-white text-brand-slate rounded border border-slate-200">
            Lahore Works
          </span>
        </div>

        <h3 className="text-xl font-bold text-brand-slate mt-4 tracking-tight">
          <Link to={`/services/${service.id}`} className="hover:text-brand-blue transition-colors">
            {service.title}
          </Link>
        </h3>
        <p className="text-xs text-brand-orange font-semibold mt-1">
          {service.tagline}
        </p>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
        <div>
          <p className="text-xs sm:text-sm text-brand-charcoal leading-relaxed mb-4">
            {service.description}
          </p>

          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Technical Capabilities:
            </h4>
            <ul className="space-y-1.5">
              {service.features.slice(0, isDetailed ? service.features.length : 3).map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-brand-charcoal">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-blue shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Specifications Preview */}
          {service.specifications && (
            <div className="mt-5 pt-4 border-t border-slate-100">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-brand-orange" />
                <span>Engineering Standards:</span>
              </h4>
              <div className="space-y-1">
                {service.specifications.slice(0, 2).map((spec, sIdx) => (
                  <div key={sIdx} className="flex items-center justify-between text-xs py-0.5">
                    <span className="text-slate-500">{spec.label}:</span>
                    <span className="font-mono text-brand-slate font-bold text-right max-w-[55%] truncate" title={spec.value}>
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Silo Deep-Dive Action Button */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <Link
            to={`/services/${service.id}`}
            className="btn-primary text-xs w-full justify-between group font-bold py-2.5"
          >
            <span>Explore Engineering Silo & Specs</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to={`/quote?discipline=${encodeURIComponent(service.title)}`}
            className="text-[11px] font-semibold text-slate-500 hover:text-brand-orange block text-center transition-colors"
          >
            Fast-Track RFQ For This Division →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
