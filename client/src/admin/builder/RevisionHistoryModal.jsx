import React from 'react';
import { X, History, RotateCcw, Check } from 'lucide-react';

export const RevisionHistoryModal = ({
  isOpen,
  onClose,
  revisions = [],
  currentRevisionId,
  onRestoreRevision
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Revision History</h3>
              <p className="text-xs text-slate-400">
                Track changes and restore past page snapshots
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

        {/* Content List */}
        <div className="p-5 overflow-y-auto divide-y divide-slate-800 space-y-4">
          {(!revisions || revisions.length === 0) ? (
            <div className="text-center py-12 text-slate-500">
              No historical revisions available yet.
            </div>
          ) : (
            revisions.map((rev, idx) => {
              const isCurrent = idx === 0;
              const dateStr = new Date(rev.timestamp).toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short'
              });

              return (
                <div
                  key={rev.id || idx}
                  className={`pt-4 first:pt-0 flex items-center justify-between gap-4 transition-colors ${
                    isCurrent ? 'opacity-100' : 'opacity-85 hover:opacity-100'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        {rev.summary || (isCurrent ? 'Current Working Version' : 'Saved Snapshot')}
                      </span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                          Active
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>{dateStr}</span>
                      <span>•</span>
                      <span>By: <strong className="text-slate-300">{rev.savedBy || 'admin'}</strong></span>
                      <span>•</span>
                      <span>{rev.blocks ? rev.blocks.length : 0} Blocks</span>
                    </div>
                  </div>

                  <div>
                    {isCurrent ? (
                      <div className="flex items-center gap-1.5 text-xs text-green-400 font-medium px-3 py-1.5">
                        <Check className="w-4 h-4" />
                        <span>Current</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to restore the version from ${dateStr}? Unsaved changes will be replaced.`)) {
                            onRestoreRevision(rev.id);
                          }
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-yellow-400 hover:text-slate-950 text-slate-200 text-xs font-semibold border border-slate-700 hover:border-yellow-400 transition-all duration-200"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Restore</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RevisionHistoryModal;
