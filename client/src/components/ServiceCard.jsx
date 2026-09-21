import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sun, 
  Cog, 
  Hammer, 
  CheckCircle2, 
  ArrowRight, 
  Sliders,
  ShieldAlert
} from 'lucide-react';

const iconMap = {
  Sun: Sun,
  Cog: Cog,
  Hammer: Hammer
};

export default function ServiceCard({ service, isDetailed = false }) {
  const IconComponent = iconMap[service.icon] || Cog;

  return (
    <div className="bg-white border border-brand-border rounded-lg overflow-hidden shadow-technical flex flex-col h-full hover:border-brand-blue/50 hover:shadow-technical-md transition-all duration-200">
      {/* Card Header Strip */}
      <div className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-start justify-between gap-4">
          <div className="w-12 h-12 rounded-md bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue shrink-0">
            <IconComponent className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="text-[11px] font-mono font-semibold uppercase px-2.5 py-1 bg-brand-neutral text-brand-slate rounded border border-slate-200">
            Lahore Workshop
          </span>
        </div>

        <h3 className="text-xl font-bold text-brand-slate mt-4 tracking-tight">
          {service.title}
        </h3>
        <p className="text-xs text-brand-orange font-semibold mt-1">
          {service.tagline}
        </p>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
        <div>
          <p className="text-sm text-brand-charcoal leading-relaxed mb-4">
            {service.description}
          </p>

          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Core Technical Capabilities:
            </h4>
            <ul className="space-y-2">
              {service.features.slice(0, isDetailed ? service.features.length : 4).map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-brand-charcoal">
                  <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Specifications Preview */}
          {service.specifications && (
            <div className="mt-6 pt-4 border-t border-dashed border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-brand-blue" />
                <span>Engineering Spec Benchmarks:</span>
              </h4>
              <div className="grid grid-cols-1 gap-1.5">
                {service.specifications.slice(0, isDetailed ? service.specifications.length : 3).map((spec, sIdx) => (
                  <div key={sIdx} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-b-0">
                    <span className="text-slate-500 font-medium">{spec.label}:</span>
                    <span className="font-mono text-slate-800 font-semibold text-right max-w-[55%] truncate" title={spec.value}>
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <Link
            to={`/contact?service=${encodeURIComponent(service.title)}`}
            className="btn-primary text-xs w-full justify-between group"
          >
            <span>Request Specifications / RFQ</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
