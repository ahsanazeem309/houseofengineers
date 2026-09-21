import React, { useState, useEffect, useCallback } from 'react';
import { 
  UploadCloud, 
  Search, 
  Filter, 
  Copy, 
  Check, 
  Trash2, 
  ExternalLink, 
  Eye, 
  Sliders, 
  Image as ImageIcon, 
  FileText, 
  X, 
  Loader2, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import UploadDropzone from './UploadDropzone';

export default function MediaManager() {
  const { token, user } = useAuth();

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAssets, setTotalAssets] = useState(0);

  const [showUploadZone, setShowUploadZone] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingAlt, setIsSavingAlt] = useState(false);
  const [editAltText, setEditAltText] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);

  const isSuperadmin = user?.role === 'superadmin';

  // Fetch Media Assets
  const fetchMedia = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        search: search.trim()
      });
      if (selectedType !== 'all') {
        params.append('type', selectedType);
      }

      const res = await fetch(`/api/admin/media?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAssets(data.assets || []);
        setCurrentPage(data.page || 1);
        setTotalPages(data.totalPages || 1);
        setTotalAssets(data.total || 0);
      }
    } catch (err) {
      console.error('Failed to fetch media assets:', err);
    } finally {
      setLoading(false);
    }
  }, [token, search, selectedType]);

  useEffect(() => {
    fetchMedia(currentPage);
  }, [fetchMedia, currentPage]);

  // Copy URL to Clipboard
  const handleCopyUrl = (url, id) => {
    const fullUrl = url.startsWith('http') ? url : window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  // Inspect Asset Modal
  const openInspector = (asset) => {
    setSelectedAsset(asset);
    setEditAltText(asset.altText || '');
    setStatusMessage(null);
  };

  // Save Alt Text
  const handleSaveAlt = async () => {
    if (!selectedAsset) return;
    setIsSavingAlt(true);
    setStatusMessage(null);

    try {
      const res = await fetch(`/api/admin/media/${selectedAsset.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ altText: editAltText })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSelectedAsset(data.asset);
        setAssets(prev => prev.map(a => a.id === data.asset.id ? data.asset : a));
        setStatusMessage({ type: 'success', text: 'Alt text updated successfully.' });
      } else {
        setStatusMessage({ type: 'error', text: data.message || 'Update failed.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Network error updating metadata.' });
    } finally {
      setIsSavingAlt(false);
    }
  };

  // Delete Asset
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this media asset? Any pages referencing this image URL will display a fallback placeholder.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSelectedAsset(null);
        fetchMedia(currentPage);
      } else {
        alert(data.message || 'Failed to delete media asset.');
      }
    } catch (err) {
      alert('Network error deleting asset.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-brand-border shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-brand-slate tracking-tight">
              Media Asset Manager
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-brand-blue border border-slate-200">
              {totalAssets} Assets
            </span>
          </div>
          <p className="text-xs text-brand-charcoal mt-1">
            Upload, optimize, and manage high-resolution engineering blueprints, CAD renders, and workshop photos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowUploadZone(!showUploadZone)}
            className={`btn-primary text-xs py-2.5 px-4 font-bold flex items-center gap-2 shadow-sm ${
              showUploadZone ? 'bg-slate-700 hover:bg-slate-800' : ''
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>{showUploadZone ? 'Hide Upload Zone' : 'Upload New Assets'}</span>
          </button>
        </div>
      </div>

      {/* Collapsible Dropzone */}
      {showUploadZone && (
        <UploadDropzone 
          onUploadSuccess={() => {
            fetchMedia(1);
          }} 
        />
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-brand-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by filename or SEO alt text..."
            className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-blue outline-none"
          />
        </div>

        {/* Filter by Type */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedType}
            onChange={(e) => { setSelectedType(e.target.value); setCurrentPage(1); }}
            className="text-xs py-2 px-3 border border-slate-200 rounded-lg bg-white focus:border-brand-blue outline-none font-medium text-brand-slate"
          >
            <option value="all">All File Formats</option>
            <option value="webp">WebP Optimized</option>
            <option value="png">PNG Images</option>
            <option value="jpeg">JPEG Photos</option>
            <option value="svg">SVG Vector Graphics</option>
          </select>

          <button
            type="button"
            onClick={() => fetchMedia(currentPage)}
            className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-brand-blue hover:bg-slate-50 transition-colors"
            title="Refresh gallery"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-20 text-center bg-white rounded-xl border border-brand-border space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-blue mx-auto" />
          <p className="text-xs text-slate-500">Loading media assets...</p>
        </div>
      ) : assets.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-xl border border-brand-border p-8 space-y-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <ImageIcon className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-brand-slate">No media assets found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {search ? 'Try clearing your search filters.' : 'Upload your first engineering photo or CAD diagram to get started.'}
          </p>
          {!showUploadZone && (
            <button
              type="button"
              onClick={() => setShowUploadZone(true)}
              className="btn-accent text-xs py-2 px-4 font-bold inline-flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Assets</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {assets.map((asset) => {
            const isCopied = copiedId === asset.id;
            return (
              <div
                key={asset.id}
                className="group relative bg-white border border-brand-border rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-brand-blue/60 transition-all flex flex-col justify-between"
              >
                {/* Thumbnail Container */}
                <div 
                  onClick={() => openInspector(asset)}
                  className="relative aspect-square bg-slate-100 cursor-pointer overflow-hidden flex items-center justify-center border-b border-slate-100"
                >
                  <img
                    src={asset.url}
                    alt={asset.altText || asset.filename}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/400x300/1e293b/ffffff?text=Asset+Preview';
                    }}
                  />

                  {/* Format Tag */}
                  <span className="absolute top-1.5 left-1.5 text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-slate-900/80 text-white backdrop-blur-xs">
                    {asset.mimeType?.split('/')[1] || 'IMG'}
                  </span>

                  {/* Hover Quick Overlay */}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openInspector(asset);
                      }}
                      className="p-1.5 rounded-full bg-white text-brand-slate hover:text-brand-blue shadow-sm"
                      title="Inspect metadata"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyUrl(asset.url, asset.id);
                      }}
                      className="p-1.5 rounded-full bg-white text-brand-slate hover:text-brand-orange shadow-sm"
                      title="Copy asset URL"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Card Meta Footer */}
                <div className="p-2.5 space-y-1">
                  <div className="text-[11px] font-semibold text-brand-slate truncate" title={asset.altText || asset.originalName}>
                    {asset.altText || asset.originalName}
                  </div>
                  
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>{asset.dimensions?.width}×{asset.dimensions?.height}</span>
                    <span>{(asset.fileSize / 1024).toFixed(0)} KB</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyUrl(asset.url, asset.id)}
                    className={`w-full mt-1 py-1 px-1.5 rounded text-[10px] font-bold flex items-center justify-center gap-1 transition-colors ${
                      isCopied 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-slate-100 text-slate-600 hover:bg-brand-blue hover:text-white'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="bg-white p-4 rounded-xl border border-brand-border shadow-sm flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Showing page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({totalAssets} items)
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-1.5 border border-slate-200 rounded text-slate-600 hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono font-bold text-brand-slate px-2">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="p-1.5 border border-slate-200 rounded text-slate-600 hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Asset Inspector & Metadata Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-brand-border flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-brand-blue" />
                <h3 className="text-sm font-bold text-brand-slate truncate max-w-sm">
                  Asset Details • {selectedAsset.originalName || selectedAsset.filename}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAsset(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Image Preview Box */}
              <div className="h-64 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden p-2 relative">
                <img
                  src={selectedAsset.url}
                  alt={selectedAsset.altText}
                  className="max-h-full max-w-full object-contain rounded"
                />
                <a
                  href={selectedAsset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 bg-slate-800/90 text-white text-[10px] font-bold px-2 py-1 rounded border border-slate-700 flex items-center gap-1 hover:bg-slate-700 transition-colors"
                >
                  <span>Open Full Size</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Status Notice */}
              {statusMessage && (
                <div className={`p-3 text-xs rounded-lg ${
                  statusMessage.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {statusMessage.text}
                </div>
              )}

              {/* Edit Alt Text Form */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-brand-slate uppercase tracking-wider">
                  SEO Alt Text &amp; Accessibility Label
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editAltText}
                    onChange={(e) => setEditAltText(e.target.value)}
                    placeholder="Describe this engineering graphic for search engines..."
                    className="flex-1 text-xs p-2.5 border border-slate-300 rounded-lg focus:border-brand-blue outline-none"
                  />
                  <button
                    type="button"
                    disabled={isSavingAlt}
                    onClick={handleSaveAlt}
                    className="btn-primary text-xs py-2 px-4 font-bold shrink-0 disabled:opacity-50"
                  >
                    {isSavingAlt ? 'Saving...' : 'Update Alt'}
                  </button>
                </div>
              </div>

              {/* Technical Specifications Matrix */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2 font-mono">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Asset URL:</span>
                  <div className="flex items-center gap-1 max-w-[65%]">
                    <span className="truncate text-brand-blue font-bold">{selectedAsset.url}</span>
                    <button 
                      type="button"
                      onClick={() => handleCopyUrl(selectedAsset.url, 'modal')}
                      className="text-slate-400 hover:text-brand-orange"
                      title="Copy URL"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">MIME Type:</span>
                  <span className="text-brand-slate font-bold">{selectedAsset.mimeType}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Image Dimensions:</span>
                  <span className="text-brand-slate font-bold">{selectedAsset.dimensions?.width} × {selectedAsset.dimensions?.height} px</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">File Weight:</span>
                  <span className="text-brand-slate font-bold">{(selectedAsset.fileSize / 1024).toFixed(1)} KB</span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Uploaded At:</span>
                  <span className="text-slate-700">{new Date(selectedAsset.uploadedAt).toLocaleString()}</span>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 border-t border-slate-100 flex items-center justify-between bg-slate-50">
              {isSuperadmin ? (
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => handleDelete(selectedAsset.id)}
                  className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1.5 p-2 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{isDeleting ? 'Deleting...' : 'Delete Asset'}</span>
                </button>
              ) : (
                <span className="text-[11px] text-slate-400">Editor role (Deletions require Superadmin)</span>
              )}

              <button
                type="button"
                onClick={() => setSelectedAsset(null)}
                className="btn-outline text-xs py-2 px-5 font-semibold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
