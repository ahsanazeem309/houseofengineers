import React, { useState, useEffect } from 'react';
import {
  Code2,
  Save,
  Copy,
  Check,
  ExternalLink,
  Building,
  MapPin,
  Clock,
  Phone,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import MediaSelectorModal from '../media/MediaSelectorModal';

export default function SchemaEditor() {
  const { token } = useAuth();

  const [schemaData, setSchemaData] = useState({
    organization: {
      enabled: true,
      schemaType: 'LocalBusiness',
      name: 'House of Engineers Pvt. Ltd.',
      legalName: 'House of Engineers (Pvt.) Limited',
      url: 'https://houseofengineers.pk',
      logo: 'https://houseofengineers.pk/logo.png',
      description: 'Industrial engineering, certified solar mounting structures, precision lathe machining, and metal fabrication in Lahore, Punjab.',
      telephone: '+92 321 4991253',
      email: 'info@houseofengineers.pk',
      address: {
        streetAddress: 'Industrial Sector, Lahore',
        addressLocality: 'Lahore',
        addressRegion: 'Punjab',
        postalCode: '54000',
        addressCountry: 'PK'
      },
      geo: {
        latitude: 31.5204,
        longitude: 74.3587
      },
      sameAs: [
        'https://www.linkedin.com/company/house-of-engineers-pk',
        'https://facebook.com/houseofengineers.pk'
      ],
      priceRange: '$$$'
    },
    customJsonLd: ''
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const getAuthToken = () => token || localStorage.getItem('hoe_admin_token') || localStorage.getItem('token') || '';

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        setLoading(true);
        const authToken = getAuthToken();
        const res = await fetch('/api/admin/schema', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        const data = await res.json();
        if (res.ok && data.success && data.schema) {
          setSchemaData(data.schema);
        }
      } catch (err) {
        console.error('Error fetching schema settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchema();
  }, []);

  const handleOrgChange = (field, value) => {
    setSchemaData(prev => ({
      ...prev,
      organization: {
        ...prev.organization,
        [field]: value
      }
    }));
  };

  const handleAddressChange = (field, value) => {
    setSchemaData(prev => ({
      ...prev,
      organization: {
        ...prev.organization,
        address: {
          ...prev.organization.address,
          [field]: value
        }
      }
    }));
  };

  const handleGeoChange = (field, value) => {
    setSchemaData(prev => ({
      ...prev,
      organization: {
        ...prev.organization,
        geo: {
          ...prev.organization.geo,
          [field]: parseFloat(value) || 0
        }
      }
    }));
  };

  // Generate valid Schema.org JSON-LD object for preview
  const generatedJsonLd = {
    '@context': 'https://schema.org',
    '@type': schemaData.organization?.schemaType || 'LocalBusiness',
    '@id': `${schemaData.organization?.url || 'https://houseofengineers.pk'}#organization`,
    'name': schemaData.organization?.name,
    'legalName': schemaData.organization?.legalName,
    'url': schemaData.organization?.url,
    'logo': schemaData.organization?.logo,
    'description': schemaData.organization?.description,
    'telephone': schemaData.organization?.telephone,
    'email': schemaData.organization?.email,
    'priceRange': schemaData.organization?.priceRange,
    'address': {
      '@type': 'PostalAddress',
      ...schemaData.organization?.address
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': schemaData.organization?.geo?.latitude,
      'longitude': schemaData.organization?.geo?.longitude
    },
    'sameAs': schemaData.organization?.sameAs || []
  };

  const jsonLdString = JSON.stringify(generatedJsonLd, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonLdString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMsg('');
    try {
      const authToken = getAuthToken();
      const res = await fetch('/api/admin/schema', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(schemaData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Schema settings updated successfully!');
      } else {
        setErrorMsg(data.message || 'Failed to update schema settings.');
      }
    } catch (err) {
      console.error('Save schema error:', err);
      setErrorMsg('Error saving schema configuration.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <span className="text-xs">Loading Schema Editor...</span>
      </div>
    );
  }

  const org = schemaData.organization || {};

  return (
    <div className="space-y-6 pb-20">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-brand-orange" />
            <h1 className="text-xl font-bold text-slate-900">Schema.org &amp; Structured Data</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure Google Knowledge Graph, LocalBusiness, and Organization JSON-LD markup for top Google rich results.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://validator.schema.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
          >
            <span>Test on Schema.org</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="btn-accent text-xs py-2 px-5 font-bold inline-flex items-center gap-1.5 shadow-sm"
          >
            {isSaving ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Save Schema Configuration</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Grid: Form (Left) & Realtime JSON-LD Code (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left (7 cols): Visual Configuration Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* General Organization Identity */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Building className="w-4 h-4 text-brand-blue" />
                <span>Organization Identity</span>
              </span>

              <label className="flex items-center gap-2 text-slate-600 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(org.enabled)}
                  onChange={(e) => handleOrgChange('enabled', e.target.checked)}
                  className="w-4 h-4 accent-brand-orange"
                />
                <span>Active in Document Head</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Schema.org Entity Type</label>
                <select
                  value={org.schemaType || 'LocalBusiness'}
                  onChange={(e) => handleOrgChange('schemaType', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-brand-blue"
                >
                  <option value="LocalBusiness">LocalBusiness (Recommended for Industrial Shop)</option>
                  <option value="Corporation">Corporation (Pvt. Ltd.)</option>
                  <option value="Organization">Organization (General)</option>
                  <option value="ProfessionalService">ProfessionalService</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Brand Trading Name</label>
                <input
                  type="text"
                  value={org.name || ''}
                  onChange={(e) => handleOrgChange('name', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={org.legalName || ''}
                  onChange={(e) => handleOrgChange('legalName', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Official Website URL</label>
                <input
                  type="text"
                  value={org.url || ''}
                  onChange={(e) => handleOrgChange('url', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-[11px] focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>

            {/* Logo URL */}
            <div>
              <label className="block text-slate-600 font-medium mb-1">Brand Logo Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={org.logo || ''}
                  onChange={(e) => handleOrgChange('logo', e.target.value)}
                  placeholder="https://... or /uploads/logo.webp"
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-300 font-mono text-[11px] focus:outline-none focus:border-brand-blue"
                />
                <button
                  type="button"
                  onClick={() => setIsMediaModalOpen(true)}
                  className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1.5 shrink-0"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-brand-orange" />
                  <span>Choose Media</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Entity Summary Description</label>
              <textarea
                rows={2}
                value={org.description || ''}
                onChange={(e) => handleOrgChange('description', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>

          {/* Contact & Physical Address */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin className="w-4 h-4 text-brand-blue" />
              <span>Physical Facility &amp; Coordinates</span>
            </span>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Telephone / Hotline</label>
                <input
                  type="text"
                  value={org.telephone || ''}
                  onChange={(e) => handleOrgChange('telephone', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Official Procurement Email</label>
                <input
                  type="email"
                  value={org.email || ''}
                  onChange={(e) => handleOrgChange('email', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Street Address</label>
                <input
                  type="text"
                  value={org.address?.streetAddress || ''}
                  onChange={(e) => handleAddressChange('streetAddress', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">City / Locality</label>
                <input
                  type="text"
                  value={org.address?.addressLocality || ''}
                  onChange={(e) => handleAddressChange('addressLocality', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Region / Province</label>
                <input
                  type="text"
                  value={org.address?.addressRegion || ''}
                  onChange={(e) => handleAddressChange('addressRegion', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Postal Code</label>
                <input
                  type="text"
                  value={org.address?.postalCode || ''}
                  onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Country ISO</label>
                <input
                  type="text"
                  value={org.address?.addressCountry || 'PK'}
                  onChange={(e) => handleAddressChange('addressCountry', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-brand-blue uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Latitude (GPS)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={org.geo?.latitude || ''}
                  onChange={(e) => handleGeoChange('latitude', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-[11px] focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Longitude (GPS)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={org.geo?.longitude || ''}
                  onChange={(e) => handleGeoChange('longitude', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-[11px] focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right (5 cols): Live Generated JSON-LD Preview */}
        <div className="lg:col-span-5 space-y-4 sticky top-36">
          <div className="bg-slate-950 text-slate-200 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Live JSON-LD Output
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-200 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Script'}</span>
              </button>
            </div>

            <pre className="p-4 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-[500px] leading-relaxed select-all">
              {`<script type="application/ld+json">\n${jsonLdString}\n</script>`}
            </pre>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Automated Injection</span>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                This schema script is automatically rendered into the <code>&lt;head&gt;</code> of all public pages, establishing your verified Google entity profile.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Media Selector Modal */}
      <MediaSelectorModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={(asset) => handleOrgChange('logo', asset.url)}
        onSelectAsset={(asset) => handleOrgChange('logo', asset.url)}
      />
    </div>
  );
}
