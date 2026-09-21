import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2
} from 'lucide-react';
import { BLOCK_MAP, getBlockDefinition } from './blocks';

const CanvasBlock = ({
  block,
  index,
  totalBlocks,
  isSelected,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  isPreviewMode = false
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: block.id, disabled: isPreviewMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    zIndex: isDragging ? 50 : 1
  };

  const BlockComponent = BLOCK_MAP[block.type];
  const blockDef = getBlockDefinition(block.type);

  if (!BlockComponent) {
    return (
      <div className="p-8 my-4 text-center bg-red-950/40 border border-red-800 rounded-xl text-red-400">
        Unknown block type: <code className="font-mono font-bold">{block.type}</code>
      </div>
    );
  }

  // In preview mode, render clean without canvas editing chrome
  if (isPreviewMode) {
    return (
      <div className="relative">
        <BlockComponent content={block.content} styling={block.styling} />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(block.id);
      }}
      className={`group relative transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-slate-950 shadow-2xl z-20'
          : 'hover:ring-1 hover:ring-slate-600 hover:ring-offset-1 hover:ring-offset-slate-950'
      }`}
    >
      {/* Block Hover/Select Action Bar */}
      <div
        className={`absolute -top-3.5 left-4 right-4 flex items-center justify-between pointer-events-none z-30 transition-opacity duration-200 ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        {/* Left: Drag handle & Block Label */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 text-white rounded-md px-2 py-1 shadow-lg text-xs font-semibold pointer-events-auto">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-0.5 hover:text-yellow-400 text-slate-400"
            title="Drag to reorder block"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] text-yellow-400 uppercase tracking-wider font-mono">
            {blockDef?.label || block.type}
          </span>
        </div>

        {/* Right: Actions (Move, Duplicate, Delete) */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 text-slate-300 rounded-md p-0.5 shadow-lg text-xs pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp(index);
            }}
            disabled={index === 0}
            className="p-1 hover:bg-slate-800 hover:text-white rounded disabled:opacity-30 disabled:hover:bg-transparent"
            title="Move block up"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown(index);
            }}
            disabled={index === totalBlocks - 1}
            className="p-1 hover:bg-slate-800 hover:text-white rounded disabled:opacity-30 disabled:hover:bg-transparent"
            title="Move block down"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-3 bg-slate-700 mx-0.5" />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(block.id);
            }}
            className="p-1 hover:bg-slate-800 hover:text-yellow-400 rounded"
            title="Duplicate block"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(block.id);
            }}
            className="p-1 hover:bg-red-950/60 hover:text-red-400 text-red-400/80 rounded"
            title="Delete block"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Render the actual visual block */}
      <div className="pointer-events-none">
        <BlockComponent content={block.content} styling={block.styling} />
      </div>

      {/* Selected Indicator Ribbon */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-yellow-400/60 pointer-events-none" />
      )}
    </div>
  );
};

export default CanvasBlock;
