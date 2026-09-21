import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSiteContent } from '../context/SiteContentContext';
import Breadcrumb from '../components/Breadcrumb';
import PageTransition from '../components/PageTransition';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ExternalLink, 
  ShieldCheck, 
  Building, 
  MessageSquare 
} from 'lucide-react';

export default function Contact() {
  const location = useLocation();
  const { settings } = useSiteContent();

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    drawingNote: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // { success: boolean, message: string, referenceId?: string }

  // Detect query params (e.g. from service card or portfolio modal)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const serviceParam = params.get('service');
    const projectRef = params.get('projectRef');

    if (serviceParam) {
      // Map to valid dropdown options
      if (serviceParam.toLowerCase().includes('solar')) {
        setFormData((prev) => ({ ...prev, service: 'Solar Mounting Structures' }));
      } else if (serviceParam.toLowerCase().includes('machin') || serviceParam.toLowerCase().includes('parts')) {
        setFormData((prev) => ({ ...prev, service: 'Precision Machining & Dedicated Parts' }));
      } else if (serviceParam.toLowerCase().includes('struct') || serviceParam.toLowerCase().includes('fabricat')) {
        setFormData((prev) => ({ ...prev, service: 'Structural Fabrication & Architectural Metalwork' }));
      } else {
        setFormData((prev) => ({ ...prev, service: serviceParam }));
      }
    }

    if (projectRef) {
      setFormData((prev) => ({
        ...prev,
        drawingNote: `Reference Project: ${projectRef}. Inquiring regarding comparable manufacturing specifications.`
      }));
    }
  }, [location.search]);

  // Form Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Full name is required (minimum 2 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'A valid email address is required (e.g., procurement@company.com).';
    }

    const phoneDigits = formData.phone.replace(/[^0-9]/g, '');
    if (!formData.phone.trim() || phoneDigits.length < 7 || phoneDigits.length > 15) {
      newErrors.phone = 'Valid phone or WhatsApp number is required (7-15 digits).';
    }

    if (!formData.service) {
      newErrors.service = 'Please select a required engineering service category.';
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Please provide details on project scope or requirements (min 10 characters).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus({
          success: true,
          message: data.message || 'Inquiry submitted successfully.',
          referenceId: data.referenceId
        });
        // Reset form on success
        setFormData({
          name: '',
          company: '',
          email: '',
          phone: '',
          service: '',
          message: '',
          drawingNote: ''
        });
        setErrors({});
      } else {
        setSubmitStatus({
          success: false,
          message: data.message || 'Submission failed. Please check form details.',
          errors: data.errors
        });
      }
    } catch (err) {
      console.error('Contact submit error:', err);
      setSubmitStatus({
        success: false,
        message: 'Could not connect to the engineering server. Please contact us directly via WhatsApp or phone.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition className="space-y-12 sm:space-y-16 pb-16">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Contact & Procurement Desk' }]} />
        </div>
      </div>
      
      {/* 1. HERO HEADER */}
      <section className="bg-brand-slate text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden -mt-12 sm:-mt-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/20 px-3 py-1 rounded border border-brand-orange/30 inline-block">
              Engineering RFQ &amp; Procurement Desk
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Contact &amp; Quotation Request
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Connect directly with our engineering and estimating team in Lahore. Submit technical specifications, CAD blueprints, or schedule an on-site structural assessment across Punjab.
            </p>
          </div>
        </div>
      </section>

      {/* 2. MAIN SECTION: RFQ FORM & DIRECT COMMUNICATION BLOCKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* RFQ LEAD GENERATION FORM (7 Columns) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-xl border border-brand-border shadow-technical">
            <div className="border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-xl font-bold text-brand-slate tracking-tight">
                Request an Itemized Engineering Quotation
              </h2>
              <p className="text-xs sm:text-sm text-brand-charcoal mt-1">
                Fill out the required project parameters. Estimating engineers respond within 24 business hours.
              </p>
            </div>

            {/* Submission Status Alerts */}
            {submitStatus && submitStatus.success && (
              <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-start gap-3 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="font-bold text-emerald-800">Inquiry Received Successfully!</div>
                  <p>{submitStatus.message}</p>
                  {submitStatus.referenceId && (
                    <div className="font-mono text-xs text-emerald-700 font-semibold mt-1">
                      Tracking Reference ID: {submitStatus.referenceId}
                    </div>
                  )}
                </div>
              </div>
            )}

            {submitStatus && !submitStatus.success && (
              <div className="mb-6 p-4 rounded-lg bg-rose-50 border border-rose-300 text-rose-900 flex items-start gap-3 animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="font-bold text-rose-800">Submission Notice</div>
                  <p>{submitStatus.message}</p>
                  {submitStatus.errors && (
                    <ul className="list-disc list-inside text-xs mt-1 text-rose-700">
                      {submitStatus.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              
              {/* Name & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Full Name <span className="text-brand-orange">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Engr. Tariq Mahmood"
                    className={`w-full px-3.5 py-2.5 text-sm rounded-md border bg-slate-50 focus:bg-white focus:outline-none transition-colors ${
                      errors.name ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 focus:border-brand-blue'
                    }`}
                  />
                  {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="company" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Company / Organization <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g., Crescent Mills / Private Villa"
                    className="w-full px-3.5 py-2.5 text-sm rounded-md border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Email Address <span className="text-brand-orange">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="procurement@domain.com"
                    className={`w-full px-3.5 py-2.5 text-sm rounded-md border bg-slate-50 focus:bg-white focus:outline-none transition-colors ${
                      errors.email ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 focus:border-brand-blue'
                    }`}
                  />
                  {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Phone / WhatsApp Number <span className="text-brand-orange">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+92 300 1234567"
                    className={`w-full px-3.5 py-2.5 text-sm rounded-md border bg-slate-50 focus:bg-white focus:outline-none transition-colors ${
                      errors.phone ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 focus:border-brand-blue'
                    }`}
                  />
                  {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Service Dropdown */}
              <div>
                <label htmlFor="service" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Required Engineering Service <span className="text-brand-orange">*</span>
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 text-sm rounded-md border bg-slate-50 focus:bg-white focus:outline-none transition-colors ${
                    errors.service ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 focus:border-brand-blue'
                  }`}
                >
                  <option value="">-- Select Required Capability --</option>
                  <option value="Solar Mounting Structures">Solar Mounting Structures (Elevated / Rooftop / Ground)</option>
                  <option value="Precision Machining & Dedicated Parts">Precision Machining &amp; Dedicated Parts (Lathe / Dies / Stamping)</option>
                  <option value="Structural Fabrication & Architectural Metalwork">Structural Fabrication &amp; Architectural Metalwork (Sheds / Gates / Grills)</option>
                  <option value="Cast Aluminum & Ornamental Grills">Cast Aluminum Foundry &amp; Ornate Balcony Panels</option>
                  <option value="Custom Die Tooling & Prototyping">Custom Die Tooling &amp; Prototyping</option>
                  <option value="Other Engineering Consultation">Other Industrial Engineering Consultation</option>
                </select>
                {errors.service && <p className="text-xs text-rose-600 mt-1">{errors.service}</p>}
              </div>

              {/* Scope Message */}
              <div>
                <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Estimated Project Scope &amp; Technical Requirements <span className="text-brand-orange">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Detail your requirements: e.g., structural steel dimensions, material gauge, required quantity, plant site location in Punjab, delivery schedule..."
                  className={`w-full px-3.5 py-2.5 text-sm rounded-md border bg-slate-50 focus:bg-white focus:outline-none transition-colors ${
                    errors.message ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 focus:border-brand-blue'
                  }`}
                />
                {errors.message && <p className="text-xs text-rose-600 mt-1">{errors.message}</p>}
              </div>

              {/* Drawing / File Spec Note */}
              <div>
                <label htmlFor="drawingNote" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center justify-between">
                  <span>CAD Drawing / Drawing Spec Note <span className="text-slate-400 font-normal">(Optional)</span></span>
                  <span className="text-[11px] text-brand-blue font-mono font-normal">DWG, DXF, PDF, STEP</span>
                </label>
                <input
                  type="text"
                  id="drawingNote"
                  name="drawingNote"
                  value={formData.drawingNote}
                  onChange={handleChange}
                  placeholder="e.g. Drawings available on request, or cloud share link (Google Drive / OneDrive)"
                  className="w-full px-3.5 py-2.5 text-sm rounded-md border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-brand-blue"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  You can also email large CAD packages directly to <span className="font-mono text-brand-blue">procurement@houseofengineers.pk</span> referencing your inquiry name.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-accent py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Validating &amp; Transmitting Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Transmit Quotation Request</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* DIRECT COMMUNICATION & OPERATIONAL BASE (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Channel Cards */}
            <div className="bg-brand-slate text-white p-6 sm:p-8 rounded-xl border border-slate-700 shadow-technical space-y-6">
              <h3 className="text-lg font-bold text-white tracking-tight border-b border-slate-700 pb-3">
                Direct Engineering Desk
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-200">Operational Base &amp; Works:</div>
                    <div className="text-slate-300 text-xs sm:text-sm mt-0.5">
                      {settings?.workshopAddress || 'Industrial Sector, Lahore, Punjab, Pakistan'}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-200">Telephone &amp; Procurement:</div>
                    <a href={`tel:${(settings?.primaryPhone || '+923001234567').replace(/[^0-9+]/g, '')}`} className="text-slate-300 hover:text-white text-xs sm:text-sm block">
                      {settings?.primaryPhone || '+92 300 123 4567'} (Direct Estimating Desk)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-200">Official RFQ Emails:</div>
                    <a href={`mailto:${settings?.procurementEmail || 'info@houseofengineers.pk'}`} className="text-slate-300 hover:text-white text-xs sm:text-sm block">
                      {settings?.procurementEmail || 'info@houseofengineers.pk'}
                    </a>
                    {settings?.secondaryEmail && (
                      <a href={`mailto:${settings.secondaryEmail}`} className="text-slate-300 hover:text-white text-xs sm:text-sm block">
                        {settings.secondaryEmail}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-200">Shop Floor Working Hours:</div>
                    <div className="text-slate-300 text-xs sm:text-sm">
                      {settings?.workingHours || 'Monday to Saturday: 08:00 – 18:00 PKT'}
                    </div>
                    <div className="text-slate-400 text-xs">Sunday: Maintenance &amp; Pre-Scheduled Overhauls</div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Quick Link */}
              <div className="pt-2 border-t border-slate-700">
                <a
                  href={`https://wa.me/${(settings?.whatsappNumber || '923001234567')}?text=${encodeURIComponent('Inquiry regarding engineering services from House of Engineers contact desk')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-md bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Chat on WhatsApp (+{settings?.whatsappNumber || '923001234567'})</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Structured Map / Operational Base Indicator */}
            <div className="bg-white p-6 rounded-xl border border-brand-border shadow-technical space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-blue" />
                  <span>Lahore Operations &amp; Dispatch Base</span>
                </h4>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  31.5204° N, 74.3587° E
                </span>
              </div>

              {/* Embedded Interactive Map Container */}
              <div className="rounded-lg overflow-hidden border border-slate-200 h-52 relative bg-slate-100">
                <iframe
                  title="House of Engineers Location Map"
                  src="https://maps.google.com/maps?q=Lahore,%20Punjab,%20Pakistan&t=&z=12&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="text-[11px] text-slate-500 leading-normal flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-orange shrink-0" />
                <span>Strategically situated with immediate freight access to G.T. Road, Multan Road, and Ring Road arterial bypasses for Punjab transit.</span>
              </div>
            </div>

          </div>

        </div>
      </section>
    </PageTransition>
  );
}
