import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import BlockContainer from './BlockContainer';

export const CtaBlock = ({ content = {}, styling = {} }) => {
  const {
    badge = 'ACCELERATE YOUR PROJECT',
    heading = 'Ready to Build With Pakistan’s Leading Engineering Facility?',
    description = 'Consult directly with our structural engineers. We provide precision CAD modeling, site feasibility analysis, and rapid quotation within 24 hours.',
    primaryButtonText = 'Request Formal Proposal',
    primaryButtonLink = '/contact',
    secondaryButtonText = 'Direct Hotline: +92 300 0000000',
    secondaryButtonLink = 'tel:+923000000000'
  } = content;

  return (
    <BlockContainer styling={styling}>
      <div className="relative rounded-3xl p-8 sm:p-14 overflow-hidden border border-yellow-500/30 bg-gradient-to-br from-slate-900 via-[#0B1325] to-slate-950 shadow-2xl">
        {/* Glow backdrop decorative effect */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          {badge && (
            <div className="inline-block px-3 py-1 rounded text-xs font-bold uppercase tracking-wider text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 mb-4">
              {badge}
            </div>
          )}

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
            {heading}
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto font-normal">
            {description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {primaryButtonText && (
              <Link
                to={primaryButtonLink || '/contact'}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-yellow-400 text-slate-950 font-bold text-sm tracking-wide shadow-xl shadow-yellow-400/25 hover:bg-yellow-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group"
              >
                <span>{primaryButtonText}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}

            {secondaryButtonText && (
              <a
                href={secondaryButtonLink || '#'}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold text-sm border border-slate-700 hover:border-slate-500 transition-all duration-200"
              >
                <span>{secondaryButtonText}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </BlockContainer>
  );
};

export default CtaBlock;
