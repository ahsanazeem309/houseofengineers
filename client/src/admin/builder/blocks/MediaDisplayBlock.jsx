import React from 'react';
import BlockContainer from './BlockContainer';
import SafeImage from '../../../components/SafeImage';

export const MediaDisplayBlock = ({ content = {}, styling = {} }) => {
  const {
    badge = '',
    title = '',
    caption = '',
    layout = 'single', // 'single', 'two-column', 'banner'
    primaryImage = '',
    primaryAlt = 'Manufacturing Facility Showcase',
    secondaryImage = '',
    secondaryAlt = 'Assembly & Quality Inspection',
    aspectRatio = '16/9'
  } = content;

  return (
    <BlockContainer styling={styling}>
      {(title || badge) && (
        <div className="text-center max-w-3xl mx-auto mb-10">
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

      {layout === 'two-column' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
          <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
            <SafeImage
              src={primaryImage}
              alt={primaryAlt}
              aspectRatio={aspectRatio !== 'auto' ? aspectRatio : undefined}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
            <SafeImage
              src={secondaryImage || primaryImage}
              alt={secondaryAlt}
              aspectRatio={aspectRatio !== 'auto' ? aspectRatio : undefined}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 max-w-5xl mx-auto group">
          <SafeImage
            src={primaryImage}
            alt={primaryAlt}
            aspectRatio={layout === 'banner' ? '21/9' : aspectRatio !== 'auto' ? aspectRatio : undefined}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
        </div>
      )}

      {caption && (
        <p className="text-xs sm:text-sm text-slate-400 text-center mt-4 italic max-w-2xl mx-auto">
          {caption}
        </p>
      )}
    </BlockContainer>
  );
};

export default MediaDisplayBlock;
