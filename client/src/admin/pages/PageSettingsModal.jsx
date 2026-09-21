import React, { useState, useEffect } from 'react';
import {
  X,
  Image as ImageIcon,
  Globe,
  Search,
  Share2,
  Check
} from 'lucide-react';
import MediaSelectorModal from '../media/MediaSelectorModal';

export const PageSettingsModal = ({
  isOpen,
  onClose,
  page,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState('draft');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (page) {
      setTitle(page.title || '');
      setSlug(page.slug || '');
      setStatus(page.status || 'draft');
      setMetaTitle(page.seo?.metaTitle || page.title || '');
      setMetaDescription(page.seo?.metaDescription || '');
      setKeywords(Array.isArray(page.seo?.keywords) ? page.seo.keywords.join(', ') : '');
      setOgImage(page.seo?.ogImage || '');
      setError('');
    }
  }, [page, isOpen]);

  if (!isOpen || !page) return null;

  const isHomePage = page.slug === '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Page title cannot be empty.');
      return;
    }

    if (!slug.trim()) {
      setError('Route slug cannot be empty.');
      return;
    }

    setIsSaving(true);
    try {
      const keywordsArray = keywords
        .split(',')
        .map(k => k.trim())
        .filter(Boolean);

      await onSave({
        title: title.trim(),
        slug: slug.trim(),
        status,
        seo: {
          metaTitle: metaTitle.trim() || title.trim(),
          metaDescription: metaDescription.trim(),
          keywords: keywordsArray,
          ogImage: ogImage.trim()
        }
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update page settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Page Route & SEO Settings</h3>
              <p className="text-xs text-slate-400">
                Configure URL routing, search metadata, and social sharing cards
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-sm">
          {error && (
            <div className="p-3 bg-red-950/50 border border-red-800 rounded-lg text-red-400 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Basic Route Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Internal Page Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Solar Canopy Structures"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-400 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Route Slug *
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2 bg-slate-800 border border-r-0 border-slate-700 rounded-l-lg text-slate-400 text-xs font-mono">
                  /
                </span>
                <input
                  type="text"
                  required
                  disabled={isHomePage}
                  value={slug.startsWith('/') ? slug.slice(1) : slug}
                  onChange={(e) => {
                    const cleaned = e.target.value.toLowerCase().replace(/[^a-z0-9\-_/]/g, '-');
                    setSlug(`/${cleaned}`);
                  }}
                  placeholder="solar-canopy-structures"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-r-lg text-white focus:outline-none focus:border-yellow-400 text-xs font-mono disabled:opacity-50"
                />
              </div>
              {isHomePage && (
                <p className="text-[10px] text-slate-500 mt-1">Homepage slug is fixed to root "/".</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Publishing State
            </label>
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={status === 'draft'}
                  onChange={() => setStatus('draft')}
                  className="text-yellow-400 focus:ring-yellow-400 bg-slate-900 border-slate-700"
                />
                <span className="text-xs text-slate-300">Draft (Visible only to editors in builder)</span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={status === 'published'}
                  onChange={() => setStatus('published')}
                  className="text-yellow-400 focus:ring-yellow-400 bg-slate-900 border-slate-700"
                />
                <span className="text-xs text-green-400 font-semibold">Published (Live to public visitors)</span>
              </label>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-yellow-400 mb-3 flex items-center gap-1.5">
              <Search className="w-4 h-4" />
              <span>Search Engine Optimization (SEO)</span>
            </h4>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-300">SEO Meta Title</label>
                  <span className={`text-[10px] ${metaTitle.length > 60 ? 'text-amber-400' : 'text-slate-400'}`}>
                    {metaTitle.length}/60 chars
                  </span>
                </div>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="e.g. Solar Canopy Structures | House of Engineers"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-400 text-xs"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-300">SEO Meta Description</label>
                  <span className={`text-[10px] ${metaDescription.length > 160 ? 'text-amber-400' : 'text-slate-400'}`}>
                    {metaDescription.length}/160 chars
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="High-load solar mounting canopies fabricated with ASTM A123 galvanized steel..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-400 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Meta Keywords (comma separated)
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="solar mounting, galvanized steel, industrial fabrication"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-400 text-xs"
                />
              </div>

              {/* OG Image picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Social Share Image (OpenGraph 1200x630)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                    placeholder="https://... or /uploads/..."
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-400 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setIsMediaModalOpen(true)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-yellow-400 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Select Media</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Social OpenGraph Live Preview */}
          <div className="border-t border-slate-800 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-blue-400" />
              <span>Live Social Media Card Preview (LinkedIn / Facebook / X)</span>
            </h4>

            <div className="max-w-md mx-auto rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shadow-xl">
              <div className="h-44 bg-slate-800 relative overflow-hidden flex items-center justify-center">
                {ogImage ? (
                  <img
                    src={ogImage}
                    alt="Social preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-slate-500 text-xs flex flex-col items-center gap-1">
                    <ImageIcon className="w-8 h-8" />
                    <span>No OG Image Selected (Defaults to Site Logo)</span>
                  </div>
                )}
              </div>
              <div className="p-3.5 space-y-1 bg-slate-900 border-t border-slate-800">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
                  houseofengineers.pk{slug}
                </span>
                <h5 className="text-xs font-bold text-white line-clamp-1">
                  {metaTitle || title || 'House of Engineers Pvt. Ltd.'}
                </h5>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {metaDescription || 'Precision engineering and heavy industrial fabrication.'}
                </p>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-xs shadow-lg shadow-yellow-400/20 flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Media Selector for OG Image */}
      <MediaSelectorModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={(asset) => {
          setOgImage(asset.url);
          setIsMediaModalOpen(false);
        }}
        onSelectAsset={(asset) => {
          setOgImage(asset.url);
          setIsMediaModalOpen(false);
        }}
      />
    </div>
  );
};

export default PageSettingsModal;
