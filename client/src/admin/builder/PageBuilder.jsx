import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import {
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  EyeOff,
  Save,
  UploadCloud,
  History,
  Sliders,
  Plus,
  ArrowLeft,
  Undo2,
  Redo2,
  CheckCircle2
} from 'lucide-react';

import CanvasBlock from './CanvasBlock';
import ComponentInspector from './ComponentInspector';
import RevisionHistoryModal from './RevisionHistoryModal';
import PageSettingsModal from '../pages/PageSettingsModal';
import { BLOCK_DEFINITIONS, getBlockDefinition, BLOCK_MAP } from './blocks';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

export const PageBuilder = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();

  // Core Page & Canvas State
  const [page, setPage] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [activeDragId, setActiveDragId] = useState(null);

  // Viewport & Mode
  const [viewport, setViewport] = useState('desktop'); // 'desktop', 'tablet', 'mobile'
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Undo / Redo History
  const [historyPast, setHistoryPast] = useState([]);
  const [historyFuture, setHistoryFuture] = useState([]);

  // Modals & UI Trays
  const [isInserterOpen, setIsInserterOpen] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Status & Notifications
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Setup DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5 // Avoid accidental drags when clicking
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  // Toast Helper
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch page data from server
  const fetchPage = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE}/admin/pages/${pageId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success && data.page) {
        setPage(data.page);
        setBlocks(data.page.blocks || []);
        if (data.page.blocks && data.page.blocks.length > 0) {
          setSelectedBlockId(data.page.blocks[0].id);
        }
      } else {
        showToast(data.message || 'Failed to load page');
      }
    } catch (err) {
      console.error('Fetch page error:', err);
      showToast('Network error while loading page.');
    } finally {
      setLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  // Helper to push history state
  const recordHistory = (newBlocks) => {
    setHistoryPast(prev => [...prev.slice(-20), JSON.parse(JSON.stringify(blocks))]);
    setHistoryFuture([]);
    setBlocks(newBlocks);
  };

  const handleUndo = useCallback(() => {
    if (historyPast.length === 0) return;
    const previous = historyPast[historyPast.length - 1];
    setHistoryPast(prev => prev.slice(0, prev.length - 1));
    setHistoryFuture(prev => [JSON.parse(JSON.stringify(blocks)), ...prev]);
    setBlocks(previous);
  }, [historyPast, blocks]);

  const handleRedo = useCallback(() => {
    if (historyFuture.length === 0) return;
    const next = historyFuture[0];
    setHistoryFuture(prev => prev.slice(1));
    setHistoryPast(prev => [...prev, JSON.parse(JSON.stringify(blocks))]);
    setBlocks(next);
  }, [historyFuture, blocks]);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveDraft();
      } else if (e.key === 'Escape') {
        setSelectedBlockId(null);
        setIsInserterOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, blocks]);

  // Block Manipulation Handlers
  const handleUpdateBlock = (id, updatedBlock) => {
    const newBlocks = blocks.map(b => b.id === id ? updatedBlock : b);
    recordHistory(newBlocks);
  };

  const handleAddBlock = (type) => {
    const def = getBlockDefinition(type);
    if (!def) return;
    const newBlock = def.createDefault();
    const newBlocks = [...blocks, newBlock];
    recordHistory(newBlocks);
    setSelectedBlockId(newBlock.id);
    setIsInserterOpen(false);
    showToast(`Added "${def.label}" to canvas`);
  };

  const handleDuplicateBlock = (id) => {
    const index = blocks.findIndex(b => b.id === id);
    if (index === -1) return;
    const target = blocks[index];
    const duplicated = {
      ...JSON.parse(JSON.stringify(target)),
      id: `block-${target.type}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    };
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, duplicated);
    recordHistory(newBlocks);
    setSelectedBlockId(duplicated.id);
    showToast('Block duplicated');
  };

  const handleDeleteBlock = (id) => {
    if (blocks.length <= 1) {
      if (!window.confirm('This is the only block on the page. Are you sure you want to remove it?')) {
        return;
      }
    }
    const newBlocks = blocks.filter(b => b.id !== id);
    recordHistory(newBlocks);
    if (selectedBlockId === id) {
      setSelectedBlockId(newBlocks.length > 0 ? newBlocks[0].id : null);
    }
    showToast('Block deleted');
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newBlocks = arrayMove(blocks, index, index - 1);
    recordHistory(newBlocks);
  };

  const handleMoveDown = (index) => {
    if (index === blocks.length - 1) return;
    const newBlocks = arrayMove(blocks, index, index + 1);
    recordHistory(newBlocks);
  };

  // DnD Drag Handlers
  const handleDragStart = (event) => {
    setActiveDragId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex(b => b.id === active.id);
      const newIndex = blocks.findIndex(b => b.id === over.id);
      const newBlocks = arrayMove(blocks, oldIndex, newIndex);
      recordHistory(newBlocks);
    }
    setActiveDragId(null);
  };

  // Save Draft to Backend
  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE}/admin/pages/${pageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          blocks,
          summary: `Saved draft (${blocks.length} blocks)`
        })
      });
      const data = await res.json();
      if (data.success && data.page) {
        setPage(data.page);
        showToast('Draft changes saved successfully.');
      } else {
        showToast(data.message || 'Failed to save draft.');
      }
    } catch (err) {
      console.error('Save draft error:', err);
      showToast('Network error while saving draft.');
    } finally {
      setIsSaving(false);
    }
  };

  // Publish Page to Live Storefront
  const handlePublish = async () => {
    if (!window.confirm('Publish these layout changes live to the storefront? Visitors will see this updated version immediately.')) {
      return;
    }
    setIsPublishing(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE}/admin/pages/${pageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'published',
          blocks,
          summary: `Published live release (${blocks.length} blocks)`
        })
      });
      const data = await res.json();
      if (data.success && data.page) {
        setPage(data.page);
        showToast('Page published live to storefront!');
      } else {
        showToast(data.message || 'Failed to publish page.');
      }
    } catch (err) {
      console.error('Publish error:', err);
      showToast('Network error while publishing.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Revert to historical revision
  const handleRestoreRevision = async (revisionId) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE}/admin/pages/${pageId}/revert/${revisionId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success && data.page) {
        setPage(data.page);
        setBlocks(data.page.blocks || []);
        setIsRevisionModalOpen(false);
        showToast('Page rolled back to chosen snapshot.');
      } else {
        showToast(data.message || 'Rollback failed.');
      }
    } catch (err) {
      console.error('Rollback error:', err);
      showToast('Network error while rolling back.');
    }
  };

  // Update Page Settings (SEO, title, slug)
  const handleSavePageSettings = async (settingsData) => {
    const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
    const res = await fetch(`${API_BASE}/admin/pages/${pageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(settingsData)
    });
    const data = await res.json();
    if (data.success && data.page) {
      setPage(data.page);
      showToast('Page settings updated.');
    } else {
      throw new Error(data.message || 'Failed to update settings');
    }
  };

  // Currently selected block instance
  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  // Responsive Canvas Wrapper Styling
  const canvasWidthClass = {
    desktop: 'w-full',
    tablet: 'max-w-[768px] mx-auto shadow-2xl rounded-2xl border-4 border-slate-700 overflow-hidden my-6',
    mobile: 'max-w-[390px] mx-auto shadow-2xl rounded-3xl border-8 border-slate-700 overflow-hidden my-6'
  }[viewport] || 'w-full';

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wide">Loading Page Visual Builder...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col h-screen overflow-hidden text-slate-200 selection:bg-yellow-400 selection:text-slate-950">
      {/* ======================================================== */}
      {/* 1. TOP BUILDER TOOLBAR                                    */}
      {/* ======================================================== */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-40 shrink-0 select-none shadow-md">
        {/* Left: Back Link & Page Metadata */}
        <div className="flex items-center gap-3">
          <Link
            to="/admin/pages"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Back to Pages Manager"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white tracking-wide truncate max-w-xs sm:max-w-md">
                {page?.title || 'Untitled Page'}
              </h1>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  page?.status === 'published'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                }`}
              >
                {page?.status || 'draft'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Route: {page?.slug}
            </span>
          </div>
        </div>

        {/* Center: Viewport Switcher & Undo/Redo & Preview */}
        <div className="hidden md:flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {/* Viewport Toggles */}
          <div className="flex items-center border-r border-slate-800 pr-1 mr-1">
            <button
              type="button"
              onClick={() => setViewport('desktop')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewport === 'desktop' ? 'bg-yellow-400 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="Desktop View (100%)"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewport('tablet')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewport === 'tablet' ? 'bg-yellow-400 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewport('mobile')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewport === 'mobile' ? 'bg-yellow-400 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile View (390px)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {/* Undo / Redo */}
          <button
            type="button"
            onClick={handleUndo}
            disabled={historyPast.length === 0}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={historyFuture.length === 0}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-slate-800 mx-1" />

          {/* Live Preview Toggle */}
          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              isPreviewMode
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Toggle Live Visitor Preview"
          >
            {isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{isPreviewMode ? 'Exit Preview' : 'Preview'}</span>
          </button>
        </div>

        {/* Right: History, Settings, Save, Publish */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsRevisionModalOpen(true)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Revision History & Rollback"
          >
            <History className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setIsSettingsModalOpen(true)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Page & SEO Settings"
          >
            <Sliders className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-slate-400" />
            <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-slate-950 text-xs font-bold shadow-md shadow-yellow-400/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{isPublishing ? 'Publishing...' : 'Publish'}</span>
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. MAIN WORKSPACE: CANVAS + COMPONENT INSPECTOR          */}
      {/* ======================================================== */}
      <div className="flex-1 flex overflow-hidden relative" onClick={() => setSelectedBlockId(null)}>
        {/* Canvas Scroll Area */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
          <div className={`${canvasWidthClass} transition-all duration-300 min-h-[600px] flex flex-col`}>
            {blocks.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
                <div className="w-16 h-16 rounded-2xl bg-yellow-400/10 text-yellow-400 flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Your Page Canvas is Empty</h3>
                <p className="text-sm text-slate-400 max-w-sm mb-6">
                  Add modular building blocks like Hero sections, Rich Text, Grids, or CTA banners to start constructing your layout.
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsInserterOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-yellow-400 text-slate-950 font-bold text-xs hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-400/20 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Insert First Block</span>
                </button>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={blocks.map(b => b.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4 pb-28">
                    {blocks.map((block, index) => (
                      <CanvasBlock
                        key={block.id}
                        block={block}
                        index={index}
                        totalBlocks={blocks.length}
                        isSelected={selectedBlockId === block.id && !isPreviewMode}
                        onSelect={(id) => setSelectedBlockId(id)}
                        onMoveUp={handleMoveUp}
                        onMoveDown={handleMoveDown}
                        onDuplicate={handleDuplicateBlock}
                        onDelete={handleDeleteBlock}
                        isPreviewMode={isPreviewMode}
                      />
                    ))}
                  </div>
                </SortableContext>

                {/* Ghost Drag Overlay */}
                <DragOverlay>
                  {activeDragId ? (
                    <div className="p-4 bg-slate-900 border-2 border-yellow-400 rounded-xl shadow-2xl opacity-90 text-yellow-400 font-bold text-sm">
                      Moving Block...
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </div>
        </main>

        {/* Right Sidebar: Component Inspector (shown when a block is selected and not in preview mode) */}
        {!isPreviewMode && selectedBlock && (
          <div onClick={(e) => e.stopPropagation()}>
            <ComponentInspector
              block={selectedBlock}
              onUpdateBlock={handleUpdateBlock}
              onClose={() => setSelectedBlockId(null)}
            />
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 3. FLOATING QUICK-INSERT BAR                              */}
      {/* ======================================================== */}
      {!isPreviewMode && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2 rounded-2xl shadow-2xl">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsInserterOpen(!isInserterOpen);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-yellow-400/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Block</span>
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. MODAL: BLOCK INSERTER TRAY                             */}
      {/* ======================================================== */}
      {isInserterOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsInserterOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Select a Block to Insert</h3>
                <p className="text-xs text-slate-400">Choose a modular component to add to your page layout</p>
              </div>
              <button
                type="button"
                onClick={() => setIsInserterOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {BLOCK_DEFINITIONS.map(def => {
                const Icon = def.icon;
                return (
                  <button
                    key={def.type}
                    type="button"
                    onClick={() => handleAddBlock(def.type)}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-yellow-400/50 hover:bg-slate-800/60 text-left transition-all group flex items-start gap-3.5"
                  >
                    <div className="w-10 h-10 rounded-lg bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 shrink-0 group-hover:bg-yellow-400 group-hover:text-slate-950 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-yellow-400 transition-colors mb-0.5">
                        {def.label}
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        {def.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. MODAL: REVISION HISTORY                                */}
      {/* ======================================================== */}
      <RevisionHistoryModal
        isOpen={isRevisionModalOpen}
        onClose={() => setIsRevisionModalOpen(false)}
        revisions={page?.revisions || []}
        onRestoreRevision={handleRestoreRevision}
      />

      {/* ======================================================== */}
      {/* 6. MODAL: PAGE SETTINGS & LIVE OPENGRAPH PREVIEW          */}
      {/* ======================================================== */}
      <PageSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        page={page}
        onSave={handleSavePageSettings}
      />

      {/* ======================================================== */}
      {/* 7. TOAST NOTIFICATION POPUP                              */}
      {/* ======================================================== */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white border border-yellow-400/40 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default PageBuilder;
