import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSiteContent } from '../../context/SiteContentContext';
import { 
  Save, 
  Settings, 
  CheckCircle2, 
  AlertCircle, 
  Building, 
  Phone, 
  MapPin, 
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';

export default function SiteSettingsEditor() {
  const { token } = useAuth();
  const { settings: currentSettings, refreshContent } = useSiteContent();

  const [formData, setFormData] = useState(currentSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (currentSettings) {
      setFormData(currentSettings);
    }
  }, [currentSettings]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBadgeChange = (index, key, value) => {
    const updated = [...(formData.metricBadges || [])];
    updated[index] = { ...updated[index], [key]: value };
    setFormData((prev) => ({ ...prev, metricBadges: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMessage('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveSuccess(true);
        refreshContent();
        setTimeout(() => setSaveSuccess(false), 3500);
      } else {
        setErrorMessage(data.message || 'Failed to update site settings.');
      }
    } catch (err) {
      setErrorMessage('Network error while saving settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-14 bg-[#f1f2f4] py-3 z-20 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Site Settings &amp; Storefront Copy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Changes saved here are updated dynamically across the entire public web application.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Published Live!</span>
            </span>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="btn-accent text-xs sm:text-sm py-2 px-5 shadow-sm flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Publishing Changes...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 1. Branding & Company Identity */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
          <Building className="w-4 h-4 text-brand-blue" />
          <span>Corporate Identity</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Company Legal Name
            </label>
            <input
              type="text"
              value={formData.companyName || ''}
              onChange={(e) => handleChange('companyName', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Brand Tagline / Descriptor
            </label>
            <input
              type="text"
              value={formData.brandTagline || ''}
              onChange={(e) => handleChange('brandTagline', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-brand-blue"
            />
          </div>
        </div>
      </div>

      {/* 2. Hero Section Copy */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-orange" />
          <span>Homepage Hero Section Headlines</span>
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Main Authoritative Headline
            </label>
            <input
              type="text"
              value={formData.heroHeadline || ''}
              onChange={(e) => handleChange('heroHeadline', e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm font-bold rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Hero Sub-headline
            </label>
            <textarea
              rows={2}
              value={formData.heroSubheadline || ''}
              onChange={(e) => handleChange('heroSubheadline', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-brand-blue"
            />
          </div>

          {/* Metric Badges */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Fast Metric Badges (Displayed below Hero Buttons):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(formData.metricBadges || []).map((badge, bIdx) => (
                <div key={bIdx} className="p-3 bg-slate-50 rounded border border-slate-200 space-y-2">
                  <input
                    type="text"
                    value={badge.title || ''}
                    onChange={(e) => handleBadgeChange(bIdx, 'title', e.target.value)}
                    placeholder="Badge Title"
                    className="w-full px-2 py-1 text-xs font-bold rounded border border-slate-300 bg-white"
                  />
                  <input
                    type="text"
                    value={badge.desc || ''}
                    onChange={(e) => handleBadgeChange(bIdx, 'desc', e.target.value)}
                    placeholder="Short description"
                    className="w-full px-2 py-1 text-[11px] rounded border border-slate-300 bg-white text-slate-600"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Contact & Procurement Information */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
          <Phone className="w-4 h-4 text-emerald-600" />
          <span>Procurement &amp; Direct Communication Channels</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Primary Phone / Procurement Desk
            </label>
            <input
              type="text"
              value={formData.primaryPhone || ''}
              onChange={(e) => handleChange('primaryPhone', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-brand-blue font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              WhatsApp Integration Number (Digits only with country code, e.g. 923001234567)
            </label>
            <input
              type="text"
              value={formData.whatsappNumber || ''}
              onChange={(e) => handleChange('whatsappNumber', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-brand-blue font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Primary RFQ Inquiries Email
            </label>
            <input
              type="email"
              value={formData.procurementEmail || ''}
              onChange={(e) => handleChange('procurementEmail', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-brand-blue font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Secondary Procurement Email
            </label>
            <input
              type="email"
              value={formData.secondaryEmail || ''}
              onChange={(e) => handleChange('secondaryEmail', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-brand-blue font-mono"
            />
          </div>
        </div>
      </div>

      {/* 4. Operational Base & Hours */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-brand-blue" />
          <span>Operational Facility &amp; Working Hours</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Workshop &amp; HQ Physical Address
            </label>
            <input
              type="text"
              value={formData.workshopAddress || ''}
              onChange={(e) => handleChange('workshopAddress', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Operating Hours Text
            </label>
            <input
              type="text"
              value={formData.workingHours || ''}
              onChange={(e) => handleChange('workingHours', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-brand-blue"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2 pb-12">
        <button
          type="submit"
          disabled={isSaving}
          className="btn-accent text-sm py-3 px-8 shadow-sm flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Publishing Changes...' : 'Save & Publish Live Settings'}</span>
        </button>
      </div>

    </form>
  );
}
