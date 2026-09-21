import React from 'react';

export const PADDING_CLASSES = {
  none: 'py-0',
  sm: 'py-8',
  md: 'py-14 sm:py-16',
  lg: 'py-20 sm:py-24',
  xl: 'py-28 sm:py-32'
};

export const WIDTH_CLASSES = {
  boxed: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  wide: 'max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8',
  narrow: 'max-w-4xl mx-auto px-4 sm:px-6',
  full: 'w-full px-4 sm:px-8'
};

export const BG_PRESETS = {
  default: 'bg-transparent',
  dark: 'bg-slate-950',
  navy: 'bg-[#0B1325]',
  gradient: 'bg-gradient-to-b from-slate-950 via-[#0B1325] to-slate-950',
  slate: 'bg-slate-900/60 backdrop-blur-sm',
  highlight: 'bg-gradient-to-r from-yellow-500/10 via-amber-500/5 to-transparent border-y border-yellow-500/20'
};

export const BlockContainer = ({ styling = {}, children, className = '' }) => {
  const paddingY = PADDING_CLASSES[styling.paddingY] || PADDING_CLASSES.md;
  const containerWidth = WIDTH_CLASSES[styling.containerWidth] || WIDTH_CLASSES.boxed;
  const bg = BG_PRESETS[styling.backgroundPreset] || BG_PRESETS.default;

  const customBgStyle = {};
  if (styling.backgroundImage) {
    customBgStyle.backgroundImage = `linear-gradient(rgba(11, 19, 37, ${styling.overlayOpacity || 0.85}), rgba(11, 19, 37, ${styling.overlayOpacity || 0.85})), url(${styling.backgroundImage})`;
    customBgStyle.backgroundSize = 'cover';
    customBgStyle.backgroundPosition = 'center';
  } else if (styling.backgroundColor) {
    customBgStyle.backgroundColor = styling.backgroundColor;
  }

  return (
    <section
      className={`relative w-full overflow-hidden ${bg} ${paddingY} ${className}`}
      style={customBgStyle}
    >
      <div className={containerWidth}>
        {children}
      </div>
    </section>
  );
};

export default BlockContainer;
