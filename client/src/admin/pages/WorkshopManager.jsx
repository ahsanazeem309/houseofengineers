import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSiteContent } from '../../context/SiteContentContext';
import { 
  Factory, 
  Plus, 
  Trash2, 
  Save, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  X,
  Cog,
  Hammer
} from 'lucide-react';

export default function WorkshopManager() {
  const { token } = useAuth();
  const { workshop: currentWorkshop, refreshContent } = useSiteContent();

  const [inventory, setInventory] = useState(currentWorkshop?.inventory || []);
  const [districts, setDistricts] = useState(currentWorkshop?.districts || []);
  const [newDistrict, setNewDistrict] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (currentWorkshop) {
      if (currentWorkshop.inventory) setInventory(currentWorkshop.inventory);
      if (currentWorkshop.districts) setDistricts(currentWorkshop.districts);
    }
  }, [currentWorkshop]);

  const handleInventoryChange = (index, field, value) => {
    const updated = [...inventory];
    updated[index] = { ...updated[index], [field]: value };
    setInventory(updated);
  };

  const handleAddEquipment = () => {
    setInventory([
      ...inventory,
      {
        id: `equip-${Date.now().toString(36)}`,
        name: '',
        category: '',
        specs: '',
        description: '',
        applications: '',
        icon: 'Factory'
      }
    ]);
  };

  const handleDeleteEquipment = (index) => {
    setInventory(inventory.filter((_, i) => i !== index));
  };

  const handleAddDistrict = (e) => {
    e.preventDefault();
    if (!newDistrict.trim()) return;
    if (!districts.includes(newDistrict.trim())) {
      setDistricts([...districts, newDistrict.trim()]);
    }
    setNewDistrict('');
  };

  const handleRemoveDistrict = (districtToRemove) => {
    setDistricts(districts.filter((d) => d !== districtToRemove));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/workshop', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ inventory, districts })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        refreshContent();
        setToastMessage('Workshop inventory and districts published live.');
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (err) {
      console.error('Save workshop error:', err);
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
            Workshop Machinery &amp; Coverage
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure mechanical inventory displayed on the About Us page and managed Punjab districts.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-accent text-xs py-2 px-5 shadow-sm flex items-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Publishing...' : 'Save & Publish Changes'}</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Mechanical Equipment Inventory */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Factory className="w-4 h-4 text-brand-blue" />
            <span>Mechanical Power Equipment &amp; Tooling Fleet</span>
          </h2>

          <button
            type="button"
            onClick={handleAddEquipment}
            className="text-xs text-brand-blue font-bold hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Machinery Unit</span>
          </button>
        </div>

        <div className="space-y-4">
          {inventory.map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-brand-blue uppercase">
                  Machine #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteEquipment(idx)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                  title="Remove machine"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Equipment / Machine Name
                  </label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleInventoryChange(idx, 'name', e.target.value)}
                    placeholder="e.g. Mechanical Power Presses (20T - 150T)"
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Process Category
                  </label>
                  <input
                    type="text"
                    value={item.category}
                    onChange={(e) => handleInventoryChange(idx, 'category', e.target.value)}
                    placeholder="e.g. Stamping & Batch Punching"
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Machining Specifications &amp; Capacity
                </label>
                <input
                  type="text"
                  value={item.specs}
                  onChange={(e) => handleInventoryChange(idx, 'specs', e.target.value)}
                  placeholder="e.g. Stroke length: 60mm - 180mm | Die bolster area: 1000x750mm"
                  className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Technical Description
                </label>
                <textarea
                  rows={2}
                  value={item.description}
                  onChange={(e) => handleInventoryChange(idx, 'description', e.target.value)}
                  placeholder="Description of capabilities..."
                  className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Punjab Districts Deployment List */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-brand-orange" />
          <span>Active Transit &amp; On-Site Erection Districts (Punjab)</span>
        </h2>

        <form onSubmit={handleAddDistrict} className="flex gap-2 max-w-md">
          <input
            type="text"
            value={newDistrict}
            onChange={(e) => setNewDistrict(e.target.value)}
            placeholder="Add district (e.g., Gujrat, Jhang, Bahawalpur)..."
            className="flex-1 px-3 py-1.5 text-xs rounded border border-slate-300 bg-slate-50 focus:bg-white"
          />
          <button type="submit" className="btn-primary text-xs py-1.5 px-3">
            Add District
          </button>
        </form>

        <div className="flex flex-wrap gap-2 pt-2">
          {districts.map((district, dIdx) => (
            <span
              key={dIdx}
              className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded border border-slate-200 font-mono"
            >
              <span>{district}</span>
              <button
                type="button"
                onClick={() => handleRemoveDistrict(district)}
                className="text-slate-400 hover:text-rose-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
