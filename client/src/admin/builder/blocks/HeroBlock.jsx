import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import BlockContainer from './BlockContainer';
import SafeImage from '../../../components/SafeImage';

export const HeroBlock = ({ content = {}, styling = {} }) => {
  const {
    badge = 'HOUSE OF ENGINEERS',
    heading = 'High-Precision Engineering & Industrial Manufacturing',
    highlightWord = 'Engineering',
    subheading = 'Delivering turnkey solar mounting structures, pre-engineered steel buildings, and heavy fabrication solutions across Pakistan.',
    primaryCtaText = 'Explore Capabilities',
    primaryCtaLink = '/services',
    secondaryCtaText = 'Request Consultation',
    secondaryCtaLink = '/contact',
    featuredImage = '',
    featuredImageAlt = 'Engineering Showcase',
    alignment = 'center'
  } = content;

  const isCentered = alignment === 'center';
  const hasFeaturedImage = Boolean(featuredImage);

  return (
    <BlockContainer styling={styling} className="relative">
      <div className={`grid gap-12 items-center ${hasFeaturedImage ? 'lg:grid-cols-12' : 'max-w-4xl mx-auto'}`}>
        <div className={`${hasFeaturedImage ? 'lg:col-span-7' : ''} ${isCentered && !hasFeaturedImage ? 'text-center' : 'text-left'}`}>
          {badge && (
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-6 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 shadow-sm ${isCentered && !hasFeaturedImage ? 'mx-auto' : ''}`}>
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
              <span>{badge}</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight mb-6">
            {heading.split(new RegExp(`(${highlightWord})`, 'gi')).map((part, i) =>
              part.toLowerCase() === (highlightWord || '').toLowerCase() ? (
                <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 font-extrabold">
                  {part}
                </span>
              ) : (
                part
              )
            )}
          </h1>

          {subheading && (
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl font-normal">
              {subheading}
            </p>
          )}

          <div className={`flex flex-wrap gap-4 ${isCentered && !hasFeaturedImage ? 'justify-center' : 'justify-start'}`}>
            {primaryCtaText && (
              <Link
                to={primaryCtaLink || '/contact'}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-yellow-400 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-yellow-400/20 hover:bg-yellow-300 hover:shadow-yellow-400/40 transition-all duration-200 group"
              >
                <span>{primaryCtaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}

            {secondaryCtaText && (
              <Link
                to={secondaryCtaLink || '/contact'}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold text-sm tracking-wide border border-slate-700 transition-all duration-200"
              >
                <span>{secondaryCtaText}</span>
              </Link>
            )}
          </div>
        </div>

        {hasFeaturedImage && (
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900/50 backdrop-blur-sm group">
              <SafeImage
                src={featuredImage}
                alt={featuredImageAlt}
                className="w-full h-auto object-cover max-h-[460px] group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        )}
      </div>
    </BlockContainer>
  );
};

export default HeroBlock;
