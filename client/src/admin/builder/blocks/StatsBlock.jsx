import React from 'react';
import BlockContainer from './BlockContainer';

export const StatsBlock = ({ content = {}, styling = {} }) => {
  const {
    badge = 'KEY PERFORMANCE METRICS',
    title = 'Engineered for Impact Across Pakistan',
    stats = [
      { value: '500+', label: 'Projects Completed', description: 'Utility-scale & commercial builds' },
      { value: '150 MW+', label: 'Solar Structures Fabricated', description: 'Fixed tilt & elevated canopy mounting' },
      { value: '99.8%', label: 'Quality Acceptance Rate', description: 'Zero defect tolerance inspection' },
      { value: '25+ Yrs', label: 'Design Service Life', description: 'Hot-dip galvanized ASTM A123' }
    ]
  } = content;

  return (
    <BlockContainer styling={styling}>
      {(title || badge) && (
        <div className="text-center max-w-3xl mx-auto mb-14">
          {badge && (
            <div className="inline-block px-3 py-1 rounded text-xs font-bold uppercase tracking-wider text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 mb-3">
              {badge}
            </div>
          )}
          {title && (
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              {title}
            </h2>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm text-center group hover:border-yellow-400/40 hover:bg-slate-800/60 transition-all duration-300 shadow-xl"
          >
            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300 mb-2 font-mono group-hover:scale-105 transition-transform duration-300">
              {stat.value}
            </div>
            <div className="text-base font-bold text-white mb-1">
              {stat.label}
            </div>
            {stat.description && (
              <div className="text-xs text-slate-400 leading-relaxed">
                {stat.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </BlockContainer>
  );
};

export default StatsBlock;
