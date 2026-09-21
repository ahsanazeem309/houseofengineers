import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { BLOCK_MAP } from '../admin/builder/blocks';
import { AlertCircle, Home } from 'lucide-react';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

export const DynamicPage = () => {
  const location = useLocation();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const currentPath = location.pathname;

    const fetchPageContent = async () => {
      try {
        setLoading(true);
        setNotFound(false);
        const res = await fetch(`${API_BASE}/content/page?slug=${encodeURIComponent(currentPath)}`);
        const data = await res.json();

        if (isMounted) {
          if (data.success && data.page) {
            setPage(data.page);
            // Update document title & SEO tags
            document.title = data.page.seo?.metaTitle || `${data.page.title} | House of Engineers`;
            
            // Meta description
            let metaDescEl = document.querySelector('meta[name="description"]');
            if (!metaDescEl) {
              metaDescEl = document.createElement('meta');
              metaDescEl.name = 'description';
              document.head.appendChild(metaDescEl);
            }
            if (data.page.seo?.metaDescription) {
              metaDescEl.content = data.page.seo.metaDescription;
            }

            // OpenGraph Title
            let ogTitleEl = document.querySelector('meta[property="og:title"]');
            if (ogTitleEl && (data.page.seo?.metaTitle || data.page.title)) {
              ogTitleEl.content = data.page.seo?.metaTitle || data.page.title;
            }

            // OpenGraph Image
            if (data.page.seo?.ogImage) {
              let ogImageEl = document.querySelector('meta[property="og:image"]');
              if (!ogImageEl) {
                ogImageEl = document.createElement('meta');
                ogImageEl.setAttribute('property', 'og:image');
                document.head.appendChild(ogImageEl);
              }
              ogImageEl.content = data.page.seo.ogImage;
            }
          } else {
            setNotFound(true);
          }
        }
      } catch (err) {
        console.error('Fetch public page error:', err);
        if (isMounted) setNotFound(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPageContent();

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-slate-950 text-slate-400">
        <div className="w-10 h-10 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-sm font-semibold tracking-wide">Loading Page...</span>
      </div>
    );
  }

  if (notFound || !page) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-950 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-950/40 border border-red-800 flex items-center justify-center text-red-400 mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-sm text-slate-400 max-w-md mb-8">
          The requested page either does not exist, or has not yet been published by our engineering team.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-yellow-400 text-slate-950 font-bold text-xs hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-400/20"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    );
  }

  const blocks = page.blocks || [];

  return (
    <div className="w-full bg-slate-950 text-slate-200">
      {blocks.map((block) => {
        const BlockComp = BLOCK_MAP[block.type];
        if (!BlockComp) return null;
        return (
          <BlockComp
            key={block.id}
            content={block.content}
            styling={block.styling}
          />
        );
      })}
    </div>
  );
};

export default DynamicPage;
