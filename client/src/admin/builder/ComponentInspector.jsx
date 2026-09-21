import React, { useState } from 'react';
import {
  X,
  Image as ImageIcon,
  Palette,
  FileText,
  Plus,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { getBlockDefinition } from './blocks';
import MediaSelectorModal from '../media/MediaSelectorModal';

export const ComponentInspector = ({
  block,
  onUpdateBlock,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('content'); // 'content', 'media', 'style'
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaTargetField, setMediaTargetField] = useState(''); // e.g. 'content.featuredImage' or 'styling.backgroundImage'

  if (!block) return null;

  const blockDef = getBlockDefinition(block.type);

  // Helper to deep update block content
  const handleContentChange = (field, value) => {
    onUpdateBlock(block.id, {
      ...block,
      content: {
        ...block.content,
        [field]: value
      }
    });
  };

  // Helper to deep update block styling
  const handleStylingChange = (field, value) => {
    onUpdateBlock(block.id, {
      ...block,
      styling: {
        ...block.styling,
        [field]: value
      }
    });
  };

  // Helper for opening media picker
  const openMediaPicker = (fieldPath) => {
    setMediaTargetField(fieldPath);
    setIsMediaModalOpen(true);
  };

  // On asset chosen from modal
  const handleAssetSelect = (asset) => {
    if (!asset || !asset.url) return;
    const url = asset.url;
    if (mediaTargetField.startsWith('content.')) {
      const field = mediaTargetField.replace('content.', '');
      handleContentChange(field, url);
    } else if (mediaTargetField.startsWith('styling.')) {
      const field = mediaTargetField.replace('styling.', '');
      handleStylingChange(field, url);
    } else if (mediaTargetField.startsWith('item.')) {
      // For column items
      const [, idxStr, field] = mediaTargetField.split('.');
      const idx = parseInt(idxStr, 10);
      const items = [...(block.content.items || [])];
      if (items[idx]) {
        items[idx] = { ...items[idx], [field]: url };
        handleContentChange('items', items);
      }
    } else if (mediaTargetField) {
      handleContentChange(mediaTargetField, url);
    }
    setIsMediaModalOpen(false);
  };

  return (
    <aside className="w-80 sm:w-96 bg-slate-900 border-l border-slate-800 flex flex-col h-full z-30 shadow-2xl shrink-0 overflow-hidden text-slate-200">
      {/* Inspector Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
            {blockDef?.icon ? <blockDef.icon className="w-4 h-4" /> : null}
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              {blockDef?.label || block.type}
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              {block.id.split('-').slice(0, 3).join('-')}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title="Close Inspector"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('content')}
          className={`flex-1 py-3 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'content'
              ? 'border-yellow-400 text-yellow-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Content</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('media')}
          className={`flex-1 py-3 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'media'
              ? 'border-yellow-400 text-yellow-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Media</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('style')}
          className={`flex-1 py-3 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'style'
              ? 'border-yellow-400 text-yellow-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Style</span>
        </button>
      </div>

      {/* Tab Body Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs">
        {/* ========================================= */}
        {/* TAB 1: CONTENT TAB                        */}
        {/* ========================================= */}
        {activeTab === 'content' && (
          <div className="space-y-4">
            {/* HERO BLOCK CONTROLS */}
            {block.type === 'hero' && (
              <>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Badge / Tagline</label>
                  <input
                    type="text"
                    value={block.content.badge || ''}
                    onChange={(e) => handleContentChange('badge', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Main Heading</label>
                  <textarea
                    rows={2}
                    value={block.content.heading || ''}
                    onChange={(e) => handleContentChange('heading', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Highlighted Word/Phrase</label>
                  <input
                    type="text"
                    value={block.content.highlightWord || ''}
                    onChange={(e) => handleContentChange('highlightWord', e.target.value)}
                    placeholder="Word in heading to highlight in gold"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Subheading Paragraph</label>
                  <textarea
                    rows={3}
                    value={block.content.subheading || ''}
                    onChange={(e) => handleContentChange('subheading', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Primary CTA Text</label>
                    <input
                      type="text"
                      value={block.content.primaryCtaText || ''}
                      onChange={(e) => handleContentChange('primaryCtaText', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Primary CTA Link</label>
                    <input
                      type="text"
                      value={block.content.primaryCtaLink || ''}
                      onChange={(e) => handleContentChange('primaryCtaLink', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Secondary CTA Text</label>
                    <input
                      type="text"
                      value={block.content.secondaryCtaText || ''}
                      onChange={(e) => handleContentChange('secondaryCtaText', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Secondary CTA Link</label>
                    <input
                      type="text"
                      value={block.content.secondaryCtaLink || ''}
                      onChange={(e) => handleContentChange('secondaryCtaLink', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Text Alignment</label>
                  <select
                    value={block.content.alignment || 'center'}
                    onChange={(e) => handleContentChange('alignment', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  >
                    <option value="center">Center</option>
                    <option value="left">Left</option>
                  </select>
                </div>
              </>
            )}

            {/* RICH TEXT CONTROLS */}
            {block.type === 'richText' && (
              <>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Section Badge</label>
                  <input
                    type="text"
                    value={block.content.badge || ''}
                    onChange={(e) => handleContentChange('badge', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Heading Title</label>
                  <input
                    type="text"
                    value={block.content.title || ''}
                    onChange={(e) => handleContentChange('title', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Lead Highlight Sentence</label>
                  <textarea
                    rows={2}
                    value={block.content.leadText || ''}
                    onChange={(e) => handleContentChange('leadText', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">HTML Body Content</label>
                  <textarea
                    rows={6}
                    value={block.content.html || ''}
                    onChange={(e) => handleContentChange('html', e.target.value)}
                    placeholder="<p>Paragraph text...</p>"
                    className="w-full font-mono text-xs px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-yellow-400"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Supports &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt;. Automatically sanitized.
                  </p>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Callout Box Note</label>
                  <textarea
                    rows={2}
                    value={block.content.callout || ''}
                    onChange={(e) => handleContentChange('callout', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </>
            )}

            {/* COLUMNS GRID CONTROLS */}
            {block.type === 'columnsGrid' && (
              <>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Section Title</label>
                  <input
                    type="text"
                    value={block.content.title || ''}
                    onChange={(e) => handleContentChange('title', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Columns</label>
                    <select
                      value={block.content.columns || 3}
                      onChange={(e) => handleContentChange('columns', parseInt(e.target.value, 10))}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                    >
                      <option value={2}>2 Columns</option>
                      <option value={3}>3 Columns</option>
                      <option value={4}>4 Columns</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Card Style</label>
                    <select
                      value={block.content.cardStyle || 'glass'}
                      onChange={(e) => handleContentChange('cardStyle', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                    >
                      <option value="glass">Glass Frost</option>
                      <option value="bordered">Bordered</option>
                      <option value="elevated">Elevated</option>
                    </select>
                  </div>
                </div>

                {/* Items Repeater */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-slate-400 font-semibold">Grid Cards ({block.content.items?.length || 0})</label>
                    <button
                      type="button"
                      onClick={() => {
                        const items = [...(block.content.items || [])];
                        items.push({
                          title: 'New Service Item',
                          description: 'Description of service capabilities.',
                          iconName: 'cog',
                          linkText: 'Learn More',
                          linkUrl: '/services'
                        });
                        handleContentChange('items', items);
                      }}
                      className="px-2 py-1 bg-yellow-400/10 hover:bg-yellow-400 text-yellow-400 hover:text-slate-950 font-bold rounded flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Card</span>
                    </button>
                  </div>

                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {(block.content.items || []).map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 relative group/card">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-mono text-[11px] text-yellow-400">Card #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const items = [...block.content.items];
                              items.splice(idx, 1);
                              handleContentChange('items', items);
                            }}
                            className="text-red-400/70 hover:text-red-400 p-0.5"
                            title="Remove Card"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={item.title || ''}
                          placeholder="Card Title"
                          onChange={(e) => {
                            const items = [...block.content.items];
                            items[idx].title = e.target.value;
                            handleContentChange('items', items);
                          }}
                          className="w-full px-2 py-1 mb-1.5 bg-slate-900 border border-slate-800 rounded text-white text-[11px]"
                        />
                        <textarea
                          rows={2}
                          value={item.description || ''}
                          placeholder="Card Description"
                          onChange={(e) => {
                            const items = [...block.content.items];
                            items[idx].description = e.target.value;
                            handleContentChange('items', items);
                          }}
                          className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded text-white text-[11px]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* CTA CONTROLS */}
            {block.type === 'cta' && (
              <>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Heading</label>
                  <textarea
                    rows={2}
                    value={block.content.heading || ''}
                    onChange={(e) => handleContentChange('heading', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={block.content.description || ''}
                    onChange={(e) => handleContentChange('description', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Primary Button</label>
                    <input
                      type="text"
                      value={block.content.primaryButtonText || ''}
                      onChange={(e) => handleContentChange('primaryButtonText', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Button Link</label>
                    <input
                      type="text"
                      value={block.content.primaryButtonLink || ''}
                      onChange={(e) => handleContentChange('primaryButtonLink', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>
              </>
            )}

            {/* STATS CONTROLS */}
            {block.type === 'stats' && (
              <>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Section Title</label>
                  <input
                    type="text"
                    value={block.content.title || ''}
                    onChange={(e) => handleContentChange('title', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-slate-400 font-semibold">Stats Items ({block.content.stats?.length || 0})</label>
                    <button
                      type="button"
                      onClick={() => {
                        const stats = [...(block.content.stats || [])];
                        stats.push({ value: '100+', label: 'New Metric', description: 'Metric subtitle' });
                        handleContentChange('stats', stats);
                      }}
                      className="px-2 py-1 bg-yellow-400/10 hover:bg-yellow-400 text-yellow-400 hover:text-slate-950 font-bold rounded flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Metric</span>
                    </button>
                  </div>

                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {(block.content.stats || []).map((stat, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 relative">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-mono text-[11px] text-yellow-400">Stat #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const stats = [...block.content.stats];
                              stats.splice(idx, 1);
                              handleContentChange('stats', stats);
                            }}
                            className="text-red-400/70 hover:text-red-400 p-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={stat.value || ''}
                          placeholder="Value (e.g. 500+)"
                          onChange={(e) => {
                            const stats = [...block.content.stats];
                            stats[idx].value = e.target.value;
                            handleContentChange('stats', stats);
                          }}
                          className="w-full px-2 py-1 mb-1.5 bg-slate-900 border border-slate-800 rounded text-white text-[11px]"
                        />
                        <input
                          type="text"
                          value={stat.label || ''}
                          placeholder="Label (e.g. Projects Done)"
                          onChange={(e) => {
                            const stats = [...block.content.stats];
                            stats[idx].label = e.target.value;
                            handleContentChange('stats', stats);
                          }}
                          className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded text-white text-[11px]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* SPECS TABLE CONTROLS */}
            {block.type === 'specsTable' && (
              <>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Table Title</label>
                  <input
                    type="text"
                    value={block.content.title || ''}
                    onChange={(e) => handleContentChange('title', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-slate-400 font-semibold">Table Rows ({block.content.rows?.length || 0})</label>
                    <button
                      type="button"
                      onClick={() => {
                        const rows = [...(block.content.rows || [])];
                        rows.push({
                          parameter: 'New Parameter',
                          specification: 'Specification value',
                          standard: 'ASTM / DIN',
                          note: 'Inspection notes'
                        });
                        handleContentChange('rows', rows);
                      }}
                      className="px-2 py-1 bg-yellow-400/10 hover:bg-yellow-400 text-yellow-400 hover:text-slate-950 font-bold rounded flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Row</span>
                    </button>
                  </div>

                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {(block.content.rows || []).map((row, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 relative">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-mono text-[11px] text-yellow-400">Row #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const rows = [...block.content.rows];
                              rows.splice(idx, 1);
                              handleContentChange('rows', rows);
                            }}
                            className="text-red-400/70 hover:text-red-400 p-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={row.parameter || ''}
                          placeholder="Parameter"
                          onChange={(e) => {
                            const rows = [...block.content.rows];
                            rows[idx].parameter = e.target.value;
                            handleContentChange('rows', rows);
                          }}
                          className="w-full px-2 py-1 mb-1 bg-slate-900 border border-slate-800 rounded text-white text-[11px]"
                        />
                        <input
                          type="text"
                          value={row.specification || ''}
                          placeholder="Specification"
                          onChange={(e) => {
                            const rows = [...block.content.rows];
                            rows[idx].specification = e.target.value;
                            handleContentChange('rows', rows);
                          }}
                          className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded text-white text-[11px]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ========================================= */}
        {/* TAB 2: MEDIA TAB                          */}
        {/* ========================================= */}
        {activeTab === 'media' && (
          <div className="space-y-5">
            {/* Featured Image (Hero or MediaDisplay) */}
            {(block.type === 'hero' || block.type === 'mediaDisplay') && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="block font-semibold text-white">Primary Image Asset</span>

                {block.content.featuredImage || block.content.primaryImage ? (
                  <div className="relative rounded-lg overflow-hidden border border-slate-700 max-h-44 bg-slate-900">
                    <img
                      src={block.content.featuredImage || block.content.primaryImage}
                      alt="Block visual"
                      className="w-full h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (block.type === 'hero') handleContentChange('featuredImage', '');
                        if (block.type === 'mediaDisplay') handleContentChange('primaryImage', '');
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-950/80 hover:bg-red-900 text-red-300 rounded"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="p-6 border border-dashed border-slate-700 rounded-lg text-center text-slate-500">
                    No image chosen yet
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => openMediaPicker(block.type === 'hero' ? 'content.featuredImage' : 'content.primaryImage')}
                  className="w-full py-2.5 px-3 rounded-lg bg-yellow-400 text-slate-950 font-bold hover:bg-yellow-300 flex items-center justify-center gap-2 transition-colors shadow"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Choose from Media Library</span>
                </button>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Direct Image URL</label>
                  <input
                    type="text"
                    value={block.content.featuredImage || block.content.primaryImage || ''}
                    onChange={(e) => {
                      if (block.type === 'hero') handleContentChange('featuredImage', e.target.value);
                      if (block.type === 'mediaDisplay') handleContentChange('primaryImage', e.target.value);
                    }}
                    placeholder="https://... or /uploads/..."
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-white text-[11px]"
                  />
                </div>
              </div>
            )}

            {/* Background Image for any block */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="block font-semibold text-white">Block Background Image</span>

              {block.styling?.backgroundImage ? (
                <div className="relative rounded-lg overflow-hidden border border-slate-700 max-h-40 bg-slate-900">
                  <img
                    src={block.styling.backgroundImage}
                    alt="Background preview"
                    className="w-full h-28 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleStylingChange('backgroundImage', '')}
                    className="absolute top-2 right-2 p-1 bg-red-950/80 hover:bg-red-900 text-red-300 rounded"
                    title="Remove background image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => openMediaPicker('styling.backgroundImage')}
                className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium flex items-center justify-center gap-2 transition-colors border border-slate-700"
              >
                <ImageIcon className="w-4 h-4 text-yellow-400" />
                <span>Select Background Image</span>
              </button>

              {block.styling?.backgroundImage && (
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Dark Overlay Opacity</span>
                    <span>{Math.round((block.styling.overlayOpacity ?? 0.85) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={block.styling.overlayOpacity ?? 0.85}
                    onChange={(e) => handleStylingChange('overlayOpacity', parseFloat(e.target.value))}
                    className="w-full accent-yellow-400"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* TAB 3: STYLING TAB                        */}
        {/* ========================================= */}
        {activeTab === 'style' && (
          <div className="space-y-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Vertical Padding</label>
              <select
                value={block.styling?.paddingY || 'md'}
                onChange={(e) => handleStylingChange('paddingY', e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
              >
                <option value="none">None (0px)</option>
                <option value="sm">Small (py-8)</option>
                <option value="md">Medium (py-16)</option>
                <option value="lg">Large (py-24)</option>
                <option value="xl">Extra Large (py-32)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Container Width</label>
              <select
                value={block.styling?.containerWidth || 'boxed'}
                onChange={(e) => handleStylingChange('containerWidth', e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
              >
                <option value="narrow">Narrow (max-w-4xl)</option>
                <option value="boxed">Boxed (max-w-7xl)</option>
                <option value="wide">Wide (max-w-[1400px])</option>
                <option value="full">Full Width (100%)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Background Theme Preset</label>
              <select
                value={block.styling?.backgroundPreset || 'default'}
                onChange={(e) => handleStylingChange('backgroundPreset', e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
              >
                <option value="default">Transparent / Default</option>
                <option value="dark">Slate 950 Deep Dark</option>
                <option value="navy">Industrial Navy (#0B1325)</option>
                <option value="gradient">Gradient (Dark to Navy)</option>
                <option value="slate">Frosted Glass Slate</option>
                <option value="highlight">Brand Gold Glow Border</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Media Selector Modal Integration */}
      <MediaSelectorModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={handleAssetSelect}
        onSelectAsset={handleAssetSelect}
      />
    </aside>
  );
};

export default ComponentInspector;
