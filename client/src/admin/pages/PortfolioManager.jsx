import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSiteContent } from '../../context/SiteContentContext';
import { 
  Layers, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  CheckCircle2, 
  MapPin, 
  Calendar,
  Settings,
  Filter
} from 'lucide-react';

export default function PortfolioManager() {
  const { token } = useAuth();
  const { portfolio: currentPortfolio, refreshContent } = useSiteContent();

  const [portfolio, setPortfolio] = useState(currentPortfolio || []);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const categories = [
    'All',
    'Solar Structures',
    'Industrial Machinery/Panels',
    'Cast Aluminum',
    'Custom Parts'
  ];

  useEffect(() => {
    if (currentPortfolio) setPortfolio(currentPortfolio);
  }, [currentPortfolio]);

  const handleAddNew = () => {
    setEditingProject({
      id: `proj-${Date.now().toString(36)}`,
      title: '',
      category: 'Solar Structures',
      clientType: '',
      location: 'Lahore, Punjab',
      year: new Date().getFullYear().toString(),
      summary: '',
      specs: {
        materialGauge: '',
        processUsed: '',
        dimensions: '',
        coating: ''
      },
      details: ''
    });
  };

  const handleEdit = (project) => {
    setEditingProject(JSON.parse(JSON.stringify(project)));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this documented project?')) return;
    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setPortfolio((prev) => prev.filter((p) => p.id !== id));
        refreshContent();
        setToastMessage('Project deleted.');
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingProject.title.trim()) {
      alert('Project title is required.');
      return;
    }

    setIsSaving(true);
    const isNew = !portfolio.some((p) => p.id === editingProject.id);
    const url = isNew ? '/api/admin/portfolio' : `/api/admin/portfolio/${editingProject.id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingProject)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (isNew) {
          setPortfolio([data.project, ...portfolio]);
        } else {
          setPortfolio(portfolio.map((p) => (p.id === data.project.id ? data.project : p)));
        }
        setEditingProject(null);
        refreshContent();
        setToastMessage('Project published live to portfolio.');
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (err) {
      console.error('Save project error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredPortfolio = portfolio.filter((p) =>
    selectedCategory === 'All' ? true : p.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Portfolio &amp; Gallery Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Add or update engineering case studies, CAD tolerances, and fabrication specs.
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="btn-accent text-xs py-2 px-4 shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
              selectedCategory === cat
                ? 'bg-brand-blue text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPortfolio.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 flex flex-col justify-between hover:border-brand-blue/50 transition-all space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-orange text-white px-2 py-0.5 rounded">
                  {project.category}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-1.5 text-slate-600 hover:text-brand-blue hover:bg-slate-100 rounded"
                    title="Edit Project"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {project.title}
                </h3>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1 font-mono">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-brand-orange" />
                    {project.location?.split(',')[0]}
                  </span>
                  <span>&bull;</span>
                  <span>{project.clientType}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2">
                {project.summary}
              </p>

              <div className="p-3 bg-slate-50 rounded border border-slate-100 text-[11px] space-y-1 font-mono">
                <div className="text-slate-700 truncate">
                  <span className="text-slate-400">Gauge:</span> {project.specs?.materialGauge || 'N/A'}
                </div>
                <div className="text-slate-700 truncate">
                  <span className="text-slate-400">Process:</span> {project.specs?.processUsed || 'N/A'}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleEdit(project)}
                className="btn-outline text-xs py-1.5 px-3 w-full"
              >
                Edit Specs &amp; Drawings
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto flex flex-col">
            
            <div className="bg-brand-slate text-white p-5 flex items-center justify-between border-b border-slate-700 sticky top-0 z-10">
              <h2 className="text-base font-bold text-white">
                {portfolio.some((p) => p.id === editingProject.id) ? 'Edit Project Specs' : 'Add New Portfolio Project'}
              </h2>
              <button onClick={() => setEditingProject(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    placeholder="e.g. 500 kW Elevated Solar Canopy"
                    className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Category Division *
                  </label>
                  <select
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-brand-blue"
                  >
                    <option value="Solar Structures">Solar Structures</option>
                    <option value="Industrial Machinery/Panels">Industrial Machinery/Panels</option>
                    <option value="Cast Aluminum">Cast Aluminum</option>
                    <option value="Custom Parts">Custom Parts</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Client / Facility Type
                  </label>
                  <input
                    type="text"
                    value={editingProject.clientType || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, clientType: e.target.value })}
                    placeholder="e.g. Textile Mill / Corporate HQ"
                    className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Location in Punjab
                  </label>
                  <input
                    type="text"
                    value={editingProject.location || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                    placeholder="e.g. Lahore / Faisalabad"
                    className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Year Completed
                  </label>
                  <input
                    type="text"
                    value={editingProject.year || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                    placeholder="2024"
                    className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Brief Summary / Technical Headline
                </label>
                <textarea
                  rows={2}
                  value={editingProject.summary || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                  placeholder="Overview of engineering requirements and capacity..."
                  className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-slate-50"
                />
              </div>

              {/* Engineering Specs Block */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5 text-brand-blue" />
                  <span>Precise Engineering Specifications:</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Material Gauge &amp; Grade
                    </label>
                    <input
                      type="text"
                      value={editingProject.specs?.materialGauge || ''}
                      onChange={(e) => setEditingProject({
                        ...editingProject,
                        specs: { ...(editingProject.specs || {}), materialGauge: e.target.value }
                      })}
                      placeholder="e.g. 3.0mm Cold-formed C-Channel (Q235B)"
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Manufacturing Process
                    </label>
                    <input
                      type="text"
                      value={editingProject.specs?.processUsed || ''}
                      onChange={(e) => setEditingProject({
                        ...editingProject,
                        specs: { ...(editingProject.specs || {}), processUsed: e.target.value }
                      })}
                      placeholder="e.g. CNC Punching, MIG Welding, Hot-Dip Galvanizing"
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Surface Finish / Coating
                    </label>
                    <input
                      type="text"
                      value={editingProject.specs?.coating || ''}
                      onChange={(e) => setEditingProject({
                        ...editingProject,
                        specs: { ...(editingProject.specs || {}), coating: e.target.value }
                      })}
                      placeholder="e.g. HDG 85µm to ASTM A123 / 2K Epoxy"
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Tolerance / Rating
                    </label>
                    <input
                      type="text"
                      value={editingProject.specs?.tolerance || editingProject.specs?.windRating || ''}
                      onChange={(e) => setEditingProject({
                        ...editingProject,
                        specs: { ...(editingProject.specs || {}), tolerance: e.target.value }
                      })}
                      placeholder="e.g. ±0.01mm / 145 km/h wind resilience"
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Engineering Scope &amp; Assembly Notes
                </label>
                <textarea
                  rows={4}
                  value={editingProject.details || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, details: e.target.value })}
                  placeholder="In-depth explanation of site conditions, anchoring methodology, and erection..."
                  className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-slate-50"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="btn-outline text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-accent text-xs py-2 px-6 shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Publishing...' : 'Save & Publish Project'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
