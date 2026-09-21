import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  MapPin, 
  Calendar, 
  Layers, 
  Settings, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  Cpu,
  FileCheck
} from 'lucide-react';

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
      {/* Modal Dialog Card */}
      <div 
        className="bg-white rounded-lg border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-brand-slate text-white px-6 py-4 flex items-center justify-between border-b border-slate-700">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-brand-orange text-white px-2 py-0.5 rounded">
                {project.category}
              </span>
              <span className="text-xs text-slate-300 font-mono">
                Ref: {project.id}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {project.title}
            </h3>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-700 transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Engineering Visual Diagram Graphic */}
          <div className="bg-slate-900 text-slate-200 rounded-md p-6 border border-slate-800 relative overflow-hidden">
            {/* Technical grid backdrop */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
            
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-brand-orange" />
                <span className="text-xs font-mono tracking-wide text-slate-300 uppercase">
                  House of Engineers Quality Certification & Specs
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                  {project.location}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {project.year}
                </span>
              </div>
            </div>

            <div className="py-4">
              <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
                {project.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded font-mono">
                Client: {project.clientType}
              </span>
              <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 px-2.5 py-1 rounded font-mono flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Inspection Passed</span>
              </span>
            </div>
          </div>

          {/* Specifications Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-brand-blue" />
              <span>Precise Engineering & Fabrication Specifications:</span>
            </h4>
            <div className="border border-slate-200 rounded-md overflow-hidden">
              <table className="w-full text-left text-xs sm:text-sm">
                <tbody>
                  {Object.entries(project.specs).map(([key, value], idx) => {
                    const formattedKey = key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (str) => str.toUpperCase());
                    return (
                      <tr 
                        key={key} 
                        className={idx % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'}
                      >
                        <td className="py-2.5 px-4 font-semibold text-slate-600 border-r border-slate-200 w-2/5">
                          {formattedKey}
                        </td>
                        <td className="py-2.5 px-4 font-mono text-slate-900 font-medium">
                          {value}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Project Details Narrative */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Engineering Scope & Site Assembly Notes:
            </h4>
            <p className="text-sm text-brand-charcoal leading-relaxed bg-brand-neutral/80 p-4 rounded-md border border-slate-200/80">
              {project.details}
            </p>
          </div>

        </div>

        {/* Modal Actions Footer */}
        <div className="sticky bottom-0 bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href={`https://wa.me/923001234567?text=${encodeURIComponent(`Hello, I am inquiring regarding the engineering specifications for: ${project.title} (${project.id})`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5"
          >
            <span>Ask Specs on WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="btn-outline text-xs sm:text-sm py-2 px-4 flex-1 sm:flex-none"
            >
              Close
            </button>
            <Link
              to={`/contact?service=${encodeURIComponent(project.category)}&projectRef=${encodeURIComponent(project.id)}`}
              onClick={onClose}
              className="btn-accent text-xs sm:text-sm py-2 px-4 flex items-center gap-1.5 flex-1 sm:flex-none justify-center"
            >
              <span>Request Similar RFQ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
