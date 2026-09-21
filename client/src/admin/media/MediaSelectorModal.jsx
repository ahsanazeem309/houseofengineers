import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, 
  Search, 
  UploadCloud, 
  Image as ImageIcon, 
  Check, 
  Link2, 
  Loader2, 
  Plus 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import UploadDropzone from './UploadDropzone';

export default function MediaSelectorModal({
  isOpen,
  onClose,
  onSelect,
  onSelectAsset,
  currentUrl = '',
  title = 'Select Media Asset'
}) {
  const { token } = useAuth();
  const selectCallback = onSelectAsset || onSelect;
  const getAuthToken = () => token || localStorage.getItem('hoe_admin_token') || localStorage.getItem('token') || '';

  const [activeTab, setActiveTab] = useState('library'); // 'library' | 'upload' | 'external'
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  
  // External URL tab state
  const [externalUrl, setExternalUrl] = useState(currentUrl || '');
  const [externalAlt, setExternalAlt] = useState('');

  // Fetch Assets
  const fetchLibrary = useCallback(async () => {
    if (!isOpen || activeTab !== 'library') return;
    setLoading(true);
    try {
      const authToken = getAuthToken();
      const params = new URLSearchParams({
        page: '1',
        limit: '36',
        search: search.trim()
      });
      const res = await fetch(`/api/admin/media?${params.toString()}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAssets(data.assets || []);
      }
    } catch (err) {
      console.error('Error fetching selector assets:', err);
    } finally {
      setLoading(false);
    }
  }, [isOpen, activeTab, search, token]);

  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (activeTab === 'external') {
      if (!externalUrl.trim()) return;
      if (selectCallback) {
        selectCallback({
          url: externalUrl.trim(),
          altText: externalAlt.trim(),
          dimensions: { width: 0, height: 0 }
        });
      }
      onClose();
    } else {
      if (!selectedAsset) return;
      if (selectCallback) {
        selectCallback({
          url: selectedAsset.url,
          altText: selectedAsset.altText || selectedAsset.originalName || '',
          dimensions: selectedAsset.dimensions || { width: 0, height: 0 }
        });
      }
      onClose();
    }
  };

  const handleUploadDone = (uploadedAssets) => {
    if (uploadedAssets && uploadedAssets.length > 0) {
      setSelectedAsset(uploadedAssets[0]);
      setActiveTab('library');
      fetchLibrary();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full h-[85vh] overflow-hidden shadow-2xl border border-brand-border flex flex-col animate-fadeIn">
        
        {/* Modal Top Bar */}
        <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-brand-blue" />
            <h3 className="text-base font-bold text-brand-slate">
              {title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-white gap-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'library'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-slate-500 hover:text-brand-slate'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Media Library</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'upload'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-slate-500 hover:text-brand-slate'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload New</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('external')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'external'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-slate-500 hover:text-brand-slate'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>Direct Image URL</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          
          {/* TAB 1: MEDIA LIBRARY */}
          {activeTab === 'library' && (
            <div className="space-y-4 h-full flex flex-col">
              {/* Search Bar */}
              <div className="relative max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search library assets..."
                  className="w-full text-xs pl-9 pr-4 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-brand-blue outline-none"
                />
              </div>

              {/* Gallery Grid */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="py-20 text-center space-y-2">
                    <Loader2 className="w-6 h-6 animate-spin text-brand-blue mx-auto" />
                    <span className="text-xs text-slate-500">Loading library assets...</span>
                  </div>
                ) : assets.length === 0 ? (
                  <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-xl space-y-3">
                    <ImageIcon className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs text-slate-500">No media assets found matching query.</p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('upload')}
                      className="btn-primary text-xs py-1.5 px-3"
                    >
                      Upload an Asset
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pr-1">
                    {assets.map((asset) => {
                      const isSelected = selectedAsset?.id === asset.id || currentUrl === asset.url;
                      return (
                        <div
                          key={asset.id}
                          onClick={() => setSelectedAsset(asset)}
                          onDoubleClick={() => {
                            setSelectedAsset(asset);
                            onSelect({
                              url: asset.url,
                              altText: asset.altText || asset.originalName || '',
                              dimensions: asset.dimensions || { width: 0, height: 0 }
                            });
                            onClose();
                          }}
                          className={`group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all bg-slate-100 flex flex-col justify-end ${
                            isSelected
                              ? 'border-brand-blue ring-4 ring-brand-blue/20'
                              : 'border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          <img
                            src={asset.url}
                            alt={asset.altText || asset.filename}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://placehold.co/400x300/1e293b/ffffff?text=Asset';
                            }}
                          />

                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-brand-blue text-white flex items-center justify-center shadow-md">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}

                          <div className="relative z-10 p-1 bg-slate-900/80 backdrop-blur-xs text-[10px] font-mono text-white truncate text-center">
                            {asset.altText || asset.filename}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD DROPZONE */}
          {activeTab === 'upload' && (
            <div className="max-w-xl mx-auto py-4">
              <UploadDropzone onUploadSuccess={handleUploadDone} />
            </div>
          )}

          {/* TAB 3: EXTERNAL URL */}
          {activeTab === 'external' && (
            <div className="max-w-md mx-auto py-8 space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-slate uppercase tracking-wider mb-1">
                  External Image URL
                </label>
                <input
                  type="url"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:border-brand-blue outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-slate uppercase tracking-wider mb-1">
                  Alt Text / Accessibility Label
                </label>
                <input
                  type="text"
                  value={externalAlt}
                  onChange={(e) => setExternalAlt(e.target.value)}
                  placeholder="Image description..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:border-brand-blue outline-none"
                />
              </div>

              {externalUrl && (
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-500 block mb-1">Live Image Preview:</span>
                  <div className="h-44 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden flex items-center justify-center">
                    <img
                      src={externalUrl}
                      alt={externalAlt}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/400x300/e2e8f0/64748b?text=Invalid+Image+URL';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500 truncate max-w-md">
            {activeTab === 'library' && selectedAsset ? (
              <span>Selected: <strong className="text-brand-slate">{selectedAsset.altText || selectedAsset.filename}</strong> ({selectedAsset.dimensions?.width}×{selectedAsset.dimensions?.height}px)</span>
            ) : (
              <span>Choose an asset or enter an external URL</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline text-xs py-2 px-4 font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={activeTab === 'library' ? !selectedAsset : !externalUrl.trim()}
              onClick={handleConfirm}
              className="btn-accent text-xs py-2 px-5 font-bold disabled:opacity-40"
            >
              Insert Selected Asset
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
