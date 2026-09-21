import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSiteContent } from '../../context/SiteContentContext';
import { 
  Wrench, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Sliders,
  Check
} from 'lucide-react';

export default function ServicesManager() {
  const { token } = useAuth();
  const { services: currentServices, refreshContent } = useSiteContent();

  const [services, setServices] = useState(currentServices || []);
  const [editingService, setEditingService] = useState(null); // null = not editing, {} = new, object = edit
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (currentServices) setServices(currentServices);
  }, [currentServices]);

  const handleEdit = (service) => {
    // Deep clone service for editing
    setEditingService(JSON.parse(JSON.stringify(service)));
  };

  const handleAddNew = () => {
    setEditingService({
      id: `service-${Date.now().toString(36)}`,
      title: '',
      shortTitle: '',
      tagline: '',
      description: '',
      icon: 'Cog',
      accentColor: '#23588f',
      features: [''],
      specifications: [{ label: '', value: '' }],
      applications: ['']
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this engineering capability division?')) return;
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== id));
        refreshContent();
        setToastMessage('Capability deleted successfully.');
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingService.title.trim()) {
      alert('Service title is required.');
      return;
    }

    setIsSaving(true);
    const isNew = !services.some((s) => s.id === editingService.id);
    const url = isNew ? '/api/admin/services' : `/api/admin/services/${editingService.id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingService)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (isNew) {
          setServices([...services, data.service]);
        } else {
          setServices(services.map((s) => (s.id === data.service.id ? data.service : s)));
        }
        setEditingService(null);
        refreshContent();
        setToastMessage('Service capability saved and published live.');
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (err) {
      console.error('Save service error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Capabilities &amp; Services Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Add, update, or edit engineering categories, technical specs matrices, and capabilities.
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="btn-accent text-xs py-2 px-4 shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Division</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 flex flex-col justify-between hover:border-brand-blue/50 transition-all space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-brand-neutral text-brand-blue border border-brand-blue/20">
                  ID: {service.id}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(service)}
                    className="p-1.5 text-slate-600 hover:text-brand-blue hover:bg-slate-100 rounded"
                    title="Edit Service"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                    title="Delete Service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {service.title}
                </h3>
                <p className="text-xs text-brand-orange font-semibold mt-0.5">
                  {service.tagline}
                </p>
              </div>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {service.description}
              </p>

              <div className="text-[11px] text-slate-500 font-medium">
                <strong>Features:</strong> {service.features?.length || 0} items &bull;{' '}
                <strong>Specs:</strong> {service.specifications?.length || 0} benchmarks
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => handleEdit(service)}
                className="btn-outline text-xs py-1.5 px-3 w-full"
              >
                Edit Specifications &amp; Features
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto flex flex-col">
            
            <div className="bg-brand-slate text-white p-5 flex items-center justify-between border-b border-slate-700 sticky top-0 z-10">
              <h2 className="text-base font-bold text-white">
                {services.some((s) => s.id === editingService.id) ? 'Edit Service Division' : 'Add New Service Division'}
              </h2>
              <button onClick={() => setEditingService(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Division Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingService.title}
                    onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                    placeholder="e.g., Solar Mounting Structures"
                    className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Short Title (For Badges)
                  </label>
                  <input
                    type="text"
                    value={editingService.shortTitle || ''}
                    onChange={(e) => setEditingService({ ...editingService, shortTitle: e.target.value })}
                    placeholder="e.g., Solar Structural Engineering"
                    className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Tagline / Subheading
                </label>
                <input
                  type="text"
                  value={editingService.tagline || ''}
                  onChange={(e) => setEditingService({ ...editingService, tagline: e.target.value })}
                  placeholder="e.g., Certified wind-load resilience & corrosion-protected frameworks"
                  className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Comprehensive Description
                </label>
                <textarea
                  rows={3}
                  value={editingService.description || ''}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-brand-blue"
                />
              </div>

              {/* Features List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Capabilities &amp; Features Bullet Points:
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditingService({
                      ...editingService,
                      features: [...(editingService.features || []), '']
                    })}
                    className="text-xs text-brand-blue font-bold hover:underline"
                  >
                    + Add Bullet
                  </button>
                </div>
                {(editingService.features || []).map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={feat}
                      onChange={(e) => {
                        const updated = [...editingService.features];
                        updated[fIdx] = e.target.value;
                        setEditingService({ ...editingService, features: updated });
                      }}
                      placeholder={`Feature ${fIdx + 1}`}
                      className="flex-1 px-3 py-1.5 text-xs rounded border border-slate-300 bg-slate-50 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = editingService.features.filter((_, i) => i !== fIdx);
                        setEditingService({ ...editingService, features: updated });
                      }}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Specifications Matrix */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Specifications Matrix (Parameter vs Standard):
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditingService({
                      ...editingService,
                      specifications: [...(editingService.specifications || []), { label: '', value: '' }]
                    })}
                    className="text-xs text-brand-blue font-bold hover:underline"
                  >
                    + Add Parameter Row
                  </button>
                </div>
                {(editingService.specifications || []).map((spec, sIdx) => (
                  <div key={sIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={spec.label}
                      onChange={(e) => {
                        const updated = [...editingService.specifications];
                        updated[sIdx].label = e.target.value;
                        setEditingService({ ...editingService, specifications: updated });
                      }}
                      placeholder="Parameter (e.g. Steel Grade)"
                      className="w-2/5 px-3 py-1.5 text-xs rounded border border-slate-300 bg-slate-50 font-semibold"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => {
                        const updated = [...editingService.specifications];
                        updated[sIdx].value = e.target.value;
                        setEditingService({ ...editingService, specifications: updated });
                      }}
                      placeholder="Engineered Standard (e.g. ASTM A36 HDG)"
                      className="flex-1 px-3 py-1.5 text-xs rounded border border-slate-300 bg-slate-50 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = editingService.specifications.filter((_, i) => i !== sIdx);
                        setEditingService({ ...editingService, specifications: updated });
                      }}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
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
                  <span>{isSaving ? 'Saving...' : 'Save & Publish Division'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
