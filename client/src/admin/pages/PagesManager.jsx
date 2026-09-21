import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Plus,
  Search,
  PenTool,
  Sliders,
  ExternalLink,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye
} from 'lucide-react';
import PageSettingsModal from './PageSettingsModal';
import { BLOCK_DEFINITIONS } from '../builder/blocks';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

export const PagesManager = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPageForSettings, setSelectedPageForSettings] = useState(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Create form state
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [starterTemplate, setStarterTemplate] = useState('landing');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const fetchPages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE}/admin/pages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.pages)) {
        setPages(data.pages);
      }
    } catch (err) {
      console.error('Fetch pages error:', err);
      showToast('Error loading pages list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  // Handle Create Page
  const handleCreatePage = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!newTitle.trim() || !newSlug.trim()) {
      setErrorMsg('Please fill in both title and slug.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Build starter blocks based on template choice
      let starterBlocks = [];
      if (starterTemplate === 'landing') {
        const heroDef = BLOCK_DEFINITIONS.find(d => d.type === 'hero');
        const gridDef = BLOCK_DEFINITIONS.find(d => d.type === 'columnsGrid');
        const statsDef = BLOCK_DEFINITIONS.find(d => d.type === 'stats');
        const ctaDef = BLOCK_DEFINITIONS.find(d => d.type === 'cta');
        if (heroDef) starterBlocks.push(heroDef.createDefault());
        if (gridDef) starterBlocks.push(gridDef.createDefault());
        if (statsDef) starterBlocks.push(statsDef.createDefault());
        if (ctaDef) starterBlocks.push(ctaDef.createDefault());
      } else if (starterTemplate === 'technical') {
        const heroDef = BLOCK_DEFINITIONS.find(d => d.type === 'hero');
        const richDef = BLOCK_DEFINITIONS.find(d => d.type === 'richText');
        const specsDef = BLOCK_DEFINITIONS.find(d => d.type === 'specsTable');
        const ctaDef = BLOCK_DEFINITIONS.find(d => d.type === 'cta');
        if (heroDef) starterBlocks.push(heroDef.createDefault());
        if (richDef) starterBlocks.push(richDef.createDefault());
        if (specsDef) starterBlocks.push(specsDef.createDefault());
        if (ctaDef) starterBlocks.push(ctaDef.createDefault());
      } else if (starterTemplate === 'media') {
        const heroDef = BLOCK_DEFINITIONS.find(d => d.type === 'hero');
        const mediaDef = BLOCK_DEFINITIONS.find(d => d.type === 'mediaDisplay');
        const ctaDef = BLOCK_DEFINITIONS.find(d => d.type === 'cta');
        if (heroDef) starterBlocks.push(heroDef.createDefault());
        if (mediaDef) starterBlocks.push(mediaDef.createDefault());
        if (ctaDef) starterBlocks.push(ctaDef.createDefault());
      }

      const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE}/admin/pages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newTitle.trim(),
          slug: newSlug.trim(),
          status: 'draft',
          blocks: starterBlocks
        })
      });

      const data = await res.json();
      if (data.success && data.page) {
        setIsCreateModalOpen(false);
        setNewTitle('');
        setNewSlug('');
        fetchPages();
        showToast(`Page "${data.page.title}" created.`);
      } else {
        setErrorMsg(data.message || 'Failed to create page.');
      }
    } catch (err) {
      console.error('Create page error:', err);
      setErrorMsg('Network error while creating page.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Page
  const handleDeletePage = async (page) => {
    if (page.slug === '/') {
      alert('The root homepage cannot be deleted.');
      return;
    }

    if (!window.confirm(`Are you sure you want to permanently delete page "${page.title}" (${page.slug})? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE}/admin/pages/${page.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Page deleted.');
        fetchPages();
      } else {
        alert(data.message || 'Delete failed. (Ensure you have superadmin privileges)');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Network error while deleting page.');
    }
  };

  // Open settings modal for a specific page
  const openSettings = async (pageId) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE}/admin/pages/${pageId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success && data.page) {
        setSelectedPageForSettings(data.page);
        setIsSettingsModalOpen(true);
      }
    } catch (err) {
      console.error('Error opening settings:', err);
    }
  };

  const handleSaveSettingsFromModal = async (updatedFields) => {
    if (!selectedPageForSettings) return;
    const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
    const res = await fetch(`${API_BASE}/admin/pages/${selectedPageForSettings.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatedFields)
    });
    const data = await res.json();
    if (data.success) {
      fetchPages();
      showToast('Page settings updated successfully.');
    } else {
      throw new Error(data.message || 'Update failed');
    }
  };

  // Filtered pages list
  const filteredPages = pages.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-yellow-400" />
            <span>Pages & CMS Management</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Build, edit, and publish modular landing pages with visual drag-and-drop controls.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-xs shadow-lg shadow-yellow-400/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Page</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search pages by title or route..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-yellow-400"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>

      {/* Pages Table */}
      <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-slate-500 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-xs">Loading pages...</span>
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            No pages found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-6">Page Title & Route</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Layout Structure</th>
                  <th className="py-3.5 px-6">Last Updated</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredPages.map((page) => {
                  const isHome = page.slug === '/';
                  const dateStr = new Date(page.updatedAt || Date.now()).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  return (
                    <tr key={page.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="space-y-0.5">
                          <span className="font-bold text-white text-sm block">
                            {page.title}
                          </span>
                          <span className="text-[11px] font-mono text-yellow-400/90">
                            {page.slug}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            page.status === 'published'
                              ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                              : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              page.status === 'published' ? 'bg-green-400' : 'bg-yellow-400'
                            }`}
                          />
                          <span>{page.status}</span>
                        </span>
                      </td>

                      <td className="py-4 px-6 text-slate-300">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold">{page.blocksCount || 0} Blocks</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400">{page.revisionsCount || 1} Revisions</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-slate-400">
                        {dateStr}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          {/* Launch Builder */}
                          <Link
                            to={`/admin/builder/${page.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-xs shadow transition-all active:scale-95"
                            title="Launch Visual Page Builder"
                          >
                            <PenTool className="w-3.5 h-3.5" />
                            <span>Visual Builder</span>
                          </Link>

                          {/* SEO & Route Settings */}
                          <button
                            type="button"
                            onClick={() => openSettings(page.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700"
                            title="Configure Route & SEO Metadata"
                          >
                            <Sliders className="w-4 h-4" />
                          </button>

                          {/* View Live */}
                          <a
                            href={page.slug}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700"
                            title="View Public Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                          {/* Delete (Hidden for home page) */}
                          {!isHome && (
                            <button
                              type="button"
                              onClick={() => handleDeletePage(page)}
                              className="p-1.5 rounded-lg text-red-400/80 hover:text-red-400 hover:bg-red-950/50 border border-red-900/50"
                              title="Delete Page"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Create New Page */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Create New Page</h3>
                <p className="text-xs text-slate-400">Initialize a new landing page or service silo</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePage} className="space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 bg-red-950/50 border border-red-800 rounded-lg text-red-400">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Page Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (!newSlug) {
                      setNewSlug(`/${e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`);
                    }
                  }}
                  placeholder="e.g. Solar Canopy Structures"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Route Slug *</label>
                <input
                  type="text"
                  required
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  placeholder="/solar-canopy-structures"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Starter Template</label>
                <select
                  value={starterTemplate}
                  onChange={(e) => setStarterTemplate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                >
                  <option value="landing">Industrial Product Landing (Hero + Grid + Stats + CTA)</option>
                  <option value="technical">Technical Specs Page (Hero + RichText + Specs Table + CTA)</option>
                  <option value="media">Visual Showcase (Hero + Media Gallery + CTA)</option>
                  <option value="blank">Blank Canvas (Start with zero blocks)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold shadow-lg shadow-yellow-400/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Page'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {selectedPageForSettings && (
        <PageSettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => {
            setIsSettingsModalOpen(false);
            setSelectedPageForSettings(null);
          }}
          page={selectedPageForSettings}
          onSave={handleSaveSettingsFromModal}
        />
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-yellow-400/40 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs">
          <CheckCircle2 className="w-4 h-4 text-yellow-400" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
};

export default PagesManager;
