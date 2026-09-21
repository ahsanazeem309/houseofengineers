import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, AlertCircle } from 'lucide-react';

/**
 * SafeImage Component
 * - Robust image loader with loading skeleton
 * - Graceful fallback on 404 or broken links
 * - Auto-resolves /uploads relative URLs to full server endpoints
 * - Native lazy loading and alt-text accessibility
 */
const SafeImage = ({
  src,
  alt = 'House of Engineers',
  className = '',
  fallbackSrc = '',
  aspectRatio = '',
  priority = false,
  containerClassName = '',
  showCaption = false,
  caption = '',
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [resolvedSrc, setResolvedSrc] = useState('');

  useEffect(() => {
    if (!src) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    let url = src;
    // If it's a relative /uploads URL and backend is on another origin, normalize:
    if (url.startsWith('/uploads') && window.location.port !== '5000') {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      url = `${backendUrl.replace(/\/api$/, '')}${url}`;
    }

    setResolvedSrc(url);
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    if (fallbackSrc && resolvedSrc !== fallbackSrc) {
      setResolvedSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
  };

  return (
    <figure className={`relative overflow-hidden ${containerClassName}`}>
      {/* Loading Skeleton */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-slate-800/80 animate-pulse flex items-center justify-center z-10">
          <ImageIcon className="w-8 h-8 text-slate-600 animate-bounce" />
        </div>
      )}

      {/* Fallback Display if Error or Missing */}
      {hasError ? (
        <div className={`w-full bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center p-6 text-center text-slate-500 min-h-[160px] ${className}`}>
          <AlertCircle className="w-10 h-10 text-slate-600 mb-2" />
          <span className="text-xs font-mono tracking-wide text-slate-400">Image Asset Unavailable</span>
          <span className="text-[10px] text-slate-600 mt-1 max-w-xs truncate">{alt || 'No preview available'}</span>
        </div>
      ) : (
        <img
          src={resolvedSrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
          style={aspectRatio ? { aspectRatio } : undefined}
          {...props}
        />
      )}

      {showCaption && caption && (
        <figcaption className="text-xs text-slate-400 mt-2 text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export default SafeImage;
