import React from 'react';
import BlockContainer from './BlockContainer';

export const SpecsTableBlock = ({ content = {}, styling = {} }) => {
  const {
    badge = 'TECHNICAL SPECIFICATIONS',
    title = 'Standard Engineering & Manufacturing Tolerances',
    description = 'Every structure engineered at House of Engineers complies with international building and metal coating codes.',
    rows = [
      {
        parameter: 'Structural Material',
        specification: 'Hot-Rolled Carbon & High-Strength Alloy Steel',
        standard: 'ASTM A36 / ASTM A572 Gr 50',
        note: 'Certificates with Heat Numbers provided'
      },
      {
        parameter: 'Corrosion Protection',
        specification: 'Hot-Dip Galvanization (85–100 microns)',
        standard: 'ASTM A123 / ISO 1461',
        note: 'Salt spray resistance > 1000 hrs'
      },
      {
        parameter: 'Wind Load Engineering',
        specification: 'Designed for Wind Velocities up to 160 km/h',
        standard: 'ASCE 7-16 / UBC 97',
        note: '3D FEA wind tunnel simulation'
      },
      {
        parameter: 'Fastener Hardware',
        specification: 'Stainless Steel SS304 / High-Tensile 8.8 Grade',
        standard: 'DIN 933 / ISO 3506',
        note: 'Anti-seize coated threads'
      }
    ]
  } = content;

  return (
    <BlockContainer styling={styling}>
      {(title || badge || description) && (
        <div className="text-center max-w-3xl mx-auto mb-10">
          {badge && (
            <div className="inline-block px-3 py-1 rounded text-xs font-bold uppercase tracking-wider text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 mb-3">
              {badge}
            </div>
          )}
          {title && (
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-4">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900/60 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-800/80 border-b border-slate-700 text-slate-300 uppercase tracking-wider text-xs font-semibold">
                <th className="py-4 px-6">Engineering Parameter</th>
                <th className="py-4 px-6">Specification Detail</th>
                <th className="py-4 px-6">Applicable Standard</th>
                <th className="py-4 px-6">Quality Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6 font-semibold text-white">
                    {row.parameter}
                  </td>
                  <td className="py-4 px-6 text-yellow-300/90 font-medium">
                    {row.specification}
                  </td>
                  <td className="py-4 px-6 font-mono text-xs text-slate-400">
                    {row.standard}
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-400">
                    {row.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </BlockContainer>
  );
};

export default SpecsTableBlock;
