import React from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  ShieldCheck,
  Settings,
  Box,
  LifeBuoy,
  BarChart3,
  ArrowRight
} from 'lucide-react';
import BlockContainer from './BlockContainer';
import SafeImage from '../../../components/SafeImage';

const ICON_MAP = {
  lightning: Zap,
  shield: ShieldCheck,
  cog: Settings,
  cube: Box,
  support: LifeBuoy,
  chart: BarChart3
};

export const ColumnsGridBlock = ({ content = {}, styling = {} }) => {
  const {
    badge = 'SERVICES & EXPERTISE',
    title = 'Engineered Capabilities Built for Scale',
    description = 'From design simulation to high-throughput production lines, we support major infrastructure projects nationwide.',
    columns = 3,
    cardStyle = 'glass',
    items = [
      {
        title: 'Solar Mounting Structures',
        description: 'Hot-dip galvanized mounting structures engineered for high wind load resistance (up to 160 km/h).',
        iconName: 'lightning',
        linkText: 'Learn More',
        linkUrl: '/services'
      },
      {
        title: 'Pre-Engineered Steel Buildings',
        description: 'Cost-effective, rapid-deployment industrial sheds and logistics warehouses with customized spans.',
        iconName: 'cube',
        linkText: 'Learn More',
        linkUrl: '/services'
      },
      {
        title: 'Custom Laser & Plasma Cutting',
        description: 'High-precision CNC cutting for carbon steel, stainless steel, and alloy plates up to 30mm thickness.',
        iconName: 'cog',
        linkText: 'Learn More',
        linkUrl: '/services'
      }
    ]
  } = content;

  // Grid column classes
  const gridColClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  }[columns] || 'grid-cols-1 md:grid-cols-3';

  // Card style classes
  const cardClasses = {
    glass: 'bg-slate-900/60 backdrop-blur-md border border-slate-800 hover:border-yellow-400/40 hover:bg-slate-800/60 shadow-xl',
    bordered: 'bg-transparent border border-slate-700/80 hover:border-yellow-400 shadow-md',
    elevated: 'bg-slate-800 border border-slate-700 hover:border-yellow-400 shadow-2xl'
  }[cardStyle] || 'bg-slate-900/60 border border-slate-800';

  return (
    <BlockContainer styling={styling}>
      {/* Section Header */}
      {(title || badge || description) && (
        <div className="text-center max-w-3xl mx-auto mb-14">
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
            <p className="text-base text-slate-300 leading-relaxed font-normal">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Grid items */}
      <div className={`grid gap-6 sm:gap-8 ${gridColClass}`}>
        {items.map((item, idx) => {
          const IconComp = ICON_MAP[item.iconName] || Settings;
          const hasImage = Boolean(item.image);

          return (
            <div
              key={idx}
              className={`rounded-xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 group ${cardClasses}`}
            >
              <div>
                {hasImage ? (
                  <div className="mb-5 rounded-lg overflow-hidden border border-slate-700/50">
                    <SafeImage
                      src={item.image}
                      alt={item.title}
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 mb-5 group-hover:bg-yellow-400 group-hover:text-slate-950 transition-colors duration-300">
                    <IconComp className="w-6 h-6" />
                  </div>
                )}

                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                  {item.description}
                </p>
              </div>

              {item.linkText && (
                <Link
                  to={item.linkUrl || '#'}
                  className="inline-flex items-center gap-2 text-xs font-bold text-yellow-400 tracking-wider uppercase group-hover:underline mt-auto"
                >
                  <span>{item.linkText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </BlockContainer>
  );
};

export default ColumnsGridBlock;
