import React, { useState } from 'react';
import { useSiteContent } from '../context/SiteContentContext';
import { portfolioCategories } from '../data/portfolioData';
import PortfolioItem from '../components/PortfolioItem';
import ProjectModal from '../components/ProjectModal';
import { 
  SlidersHorizontal, 
  Layers, 
  Search,
  CheckCircle2,
  FileCheck
} from 'lucide-react';

export default function Portfolio() {
  const { portfolio } = useSiteContent();
  const portfolioProjects = portfolio || [];
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = portfolioProjects.filter((project) => {
    const matchesCategory = activeCategory === 'All' || project.category === activeCategory;
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.specs.materialGauge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.specs.processUsed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12 sm:space-y-16 py-8">
      
      {/* 1. HERO BANNER */}
      <section className="bg-brand-slate text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/20 px-3 py-1 rounded border border-brand-orange/30 inline-block">
              Engineering Track Record
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Project Portfolio &amp; Technical Gallery
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Explore documented industrial fabrication projects, high-tensile solar mounting structures, precision lathe components, and cast aluminum facade panels completed across Punjab.
            </p>
          </div>
        </div>
      </section>

      {/* 2. CONTROLS: CATEGORY FILTERS & SEARCH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-brand-border shadow-technical space-y-4">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase text-slate-400 mr-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filter:</span>
              </span>
              {portfolioCategories.map((category) => {
                const isSelected = activeCategory === category;
                const count = category === 'All' 
                  ? portfolioProjects.length 
                  : portfolioProjects.filter((p) => p.category === category).length;

                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-3.5 py-1.5 rounded text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-brand-blue text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{category}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Search */}
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search specs, materials, location..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-500 flex items-center gap-2 border-t border-slate-100">
            <FileCheck className="w-3.5 h-3.5 text-brand-orange" />
            <span>Click any project card to inspect detailed material gauges, processes, and assembly specs.</span>
          </div>

        </div>
      </section>

      {/* 3. PROJECT GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-brand-border p-8">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No matching projects found</h3>
            <p className="text-xs text-slate-500 mt-1">Try clearing your search query or selecting another category.</p>
            <button
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
              className="btn-outline text-xs mt-4 py-2 px-4"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <PortfolioItem
                key={project.id}
                project={project}
                onSelect={(proj) => setSelectedProject(proj)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. LIGHTBOX MODAL POPUP */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

    </div>
  );
}
