import React from 'react';
import BlockContainer from './BlockContainer';
import { Info } from 'lucide-react';

export const RichTextBlock = ({ content = {}, styling = {} }) => {
  const {
    badge = '',
    title = 'Engineered for Performance and Durability',
    leadText = '',
    html = '<p>Our precision manufacturing processes integrate strict ASTM, DIN, and ISO standards to guarantee structural integrity across every fabrication cycle.</p><p>With dedicated in-house quality inspection, certified weld procedures, and robotic plasma cutting, we deliver components that endure extreme operational stresses.</p>',
    callout = '',
    alignment = 'left'
  } = content;

  const isCentered = alignment === 'center';

  return (
    <BlockContainer styling={styling}>
      <div className={`max-w-4xl ${isCentered ? 'mx-auto text-center' : 'text-left'}`}>
        {badge && (
          <div className={`inline-block px-3 py-1 rounded text-xs font-bold uppercase tracking-wider text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 mb-4 ${isCentered ? 'mx-auto' : ''}`}>
            {badge}
          </div>
        )}

        {title && (
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-6">
            {title}
          </h2>
        )}

        {leadText && (
          <p className="text-lg sm:text-xl text-slate-200 font-medium leading-relaxed mb-6 border-l-4 border-yellow-400 pl-4 py-1">
            {leadText}
          </p>
        )}

        {html && (
          <div
            className="prose prose-invert prose-yellow max-w-none text-slate-300 leading-relaxed space-y-4 text-base"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}

        {callout && (
          <div className="mt-8 p-5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-4 text-left shadow-lg">
            <Info className="w-6 h-6 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">Key Operational Note</h4>
              <p className="text-sm text-slate-300">{callout}</p>
            </div>
          </div>
        )}
      </div>
    </BlockContainer>
  );
};

export default RichTextBlock;
