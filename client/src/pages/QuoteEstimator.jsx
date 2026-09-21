import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  Sun, 
  Cog, 
  Hammer, 
  Layers, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  UploadCloud, 
  Send, 
  FileText, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import Breadcrumb from '../components/Breadcrumb';
import PageTransition from '../components/PageTransition';

export default function QuoteEstimator() {
  const { districts, settings } = useSiteContent();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    discipline: 'Solar Mounting Structures',
    estimatedScope: '50 kW Commercial Rooftop',
    location: 'Lahore (HQ & Works)',
    timeline: 'Standard (3-4 Weeks)',
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const disciplines = [
    { id: 'solar', name: 'Solar Mounting Structures', icon: Sun, desc: 'Elevated canopies, rooftop ballasted, ground mounts (HDG ASTM A123)' },
    { id: 'machining', name: 'Precision Machining & Tooling', icon: Cog, desc: 'Lathe turned shafts, stamping dies, mechanical replacement parts' },
    { id: 'structural', name: 'Structural Steel & Sheds', icon: Hammer, desc: 'Cantilever car parking sheds, factory gates, warehouse trusses' },
    { id: 'foundry', name: 'Cast Aluminum & Architectural', icon: Layers, desc: 'Ornamental panels, foundry castings, facade screens' }
  ];

  const timelines = [
    'Urgent Fast-Track (1-2 Weeks)',
    'Standard Turnkey (3-4 Weeks)',
    'Engineering Planning (1-2 Months)',
    'Budgetary Inquiry Only'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        company: formData.companyName,
        serviceInterest: formData.discipline,
        projectDetails: `[RFQ ESTIMATOR SUBMISSION]\nDiscipline: ${formData.discipline}\nScope: ${formData.estimatedScope}\nProject Location: ${formData.location}\nRequired Timeline: ${formData.timeline}\nClient Notes: ${formData.notes || 'None specified'}`
      };

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(data.message || 'Failed to submit quote request. Please call our desk directly.');
      }
    } catch (err) {
      setErrorMessage('Network error connecting to estimating server. Please contact us via phone or WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition className="bg-brand-neutral min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Request an Engineering Quotation' }]} />
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-brand-slate text-white py-14 relative overflow-hidden border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand-orange/20 border border-brand-orange/30 text-brand-orange text-xs font-bold uppercase tracking-wider mb-4">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive RFQ & Estimating Desk</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Request an Itemized Engineering Proposal
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mt-2">
            Complete the 4-step scope questionnaire below to receive itemized BOM pricing and engineering lead time within 24 business hours.
          </p>

          {/* Stepper Progress Indicator */}
          {!submitted && (
            <div className="max-w-xl mx-auto mt-8 flex items-center justify-between relative px-2">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-700 -z-0" />
              {[1, 2, 3, 4].map((s) => {
                const isCompleted = step > s;
                const isCurrent = step === s;
                return (
                  <div key={s} className="relative z-10 flex flex-col items-center">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                        isCurrent 
                          ? 'bg-brand-orange text-white ring-4 ring-brand-orange/30'
                          : isCompleted 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : s}
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 mt-1 hidden sm:block">
                      {s === 1 && 'Discipline'}
                      {s === 2 && 'Scope'}
                      {s === 3 && 'Location'}
                      {s === 4 && 'Contact'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Form Container */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10">
        <div className="bg-white rounded-xl border border-brand-border p-6 sm:p-10 shadow-sm">
          
          {submitted ? (
            <div className="text-center py-10 space-y-5">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-brand-slate">
                Quotation Request Received!
              </h2>
              <p className="text-sm text-brand-charcoal max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.fullName}</strong>. Our senior estimating engineer is reviewing your requirements for <strong>{formData.discipline}</strong> and will reach out with a preliminary bill of materials.
              </p>
              
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-left max-w-md mx-auto space-y-1.5 font-mono">
                <div><span className="text-slate-500">Service:</span> {formData.discipline}</div>
                <div><span className="text-slate-500">Scope:</span> {formData.estimatedScope}</div>
                <div><span className="text-slate-500">Destination:</span> {formData.location}</div>
                <div><span className="text-slate-500">Target Timeline:</span> {formData.timeline}</div>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <Link to="/" className="btn-outline text-xs py-2.5 px-5">
                  Return to Home
                </Link>
                <a 
                  href={`https://wa.me/${settings?.whatsappNumber || '923001234567'}?text=${encodeURIComponent(`Hi, I just submitted an RFQ for ${formData.discipline} (${formData.estimatedScope}). My name is ${formData.fullName}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-accent text-xs py-2.5 px-5"
                >
                  Expedite on WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <div>
              {/* Step 1: Select Discipline */}
              {step === 1 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-bold text-brand-slate">Step 1: Select Engineering Discipline</h3>
                    <p className="text-xs text-brand-charcoal">Choose the primary fabrication division for your project.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {disciplines.map((disc) => {
                      const Icon = disc.icon;
                      const isSelected = formData.discipline === disc.name;
                      return (
                        <button
                          type="button"
                          key={disc.id}
                          onClick={() => setFormData({ ...formData, discipline: disc.name })}
                          className={`p-4 rounded-lg border text-left transition-all flex flex-col justify-between ${
                            isSelected 
                              ? 'border-brand-blue bg-blue-50/50 ring-2 ring-brand-blue/20' 
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div>
                            <div className={`p-2 rounded-md inline-block mb-2 ${isSelected ? 'bg-brand-blue text-white' : 'bg-slate-100 text-brand-slate'}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <h4 className="text-sm font-bold text-brand-slate">{disc.name}</h4>
                            <p className="text-[11px] text-brand-charcoal mt-1 leading-relaxed">{disc.desc}</p>
                          </div>
                          {isSelected && (
                            <div className="mt-3 text-[11px] font-bold text-brand-blue flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button 
                      type="button" 
                      onClick={() => setStep(2)}
                      className="btn-primary text-xs py-2.5 px-6 font-bold flex items-center gap-2"
                    >
                      <span>Proceed to Scope Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Scope & Sizing */}
              {step === 2 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-bold text-brand-slate">Step 2: Technical Scope & Capacity</h3>
                    <p className="text-xs text-brand-charcoal">Provide approximate dimensions, capacity, or quantity.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-brand-slate uppercase tracking-wider mb-2">
                        Estimated Scope / Dimensions / Capacity
                      </label>
                      <input 
                        type="text" 
                        value={formData.estimatedScope}
                        onChange={(e) => setFormData({ ...formData, estimatedScope: e.target.value })}
                        placeholder="e.g. 100 kW Rooftop, 500 units Ø50mm shafts, or 30-vehicle parking shed"
                        className="w-full text-xs p-3 border border-slate-300 rounded-md focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none"
                        required
                      />
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        If unsure, state your approximate requirements (e.g. "Commercial roof ~4,000 sq ft").
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brand-slate uppercase tracking-wider mb-2">
                        Target Completion Timeline
                      </label>
                      <select 
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        className="w-full text-xs p-3 border border-slate-300 rounded-md focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none bg-white"
                      >
                        {timelines.map((t, idx) => (
                          <option key={idx} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button 
                      type="button" 
                      onClick={() => setStep(1)}
                      className="btn-outline text-xs py-2.5 px-4 font-semibold flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setStep(3)}
                      className="btn-primary text-xs py-2.5 px-6 font-bold flex items-center gap-2"
                    >
                      <span>Proceed to Location</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Location in Punjab */}
              {step === 3 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-bold text-brand-slate">Step 3: Job Site Location & Logistics</h3>
                    <p className="text-xs text-brand-charcoal">Select where the installation or delivery will take place.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-brand-slate uppercase tracking-wider mb-2">
                        Punjab District / Industrial Zone
                      </label>
                      <select 
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full text-xs p-3 border border-slate-300 rounded-md focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none bg-white"
                      >
                        {districts.map((d, idx) => (
                          <option key={idx} value={d}>{d}</option>
                        ))}
                        <option value="Outside Punjab / Special Project">Outside Punjab / Special Project</option>
                      </select>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-3 text-xs text-brand-charcoal">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Turnkey Logistics Note:</strong> We manage direct flatbed hauling, crane rental, and certified on-site rigging teams from our Lahore works.
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button 
                      type="button" 
                      onClick={() => setStep(2)}
                      className="btn-outline text-xs py-2.5 px-4 font-semibold flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setStep(4)}
                      className="btn-primary text-xs py-2.5 px-6 font-bold flex items-center gap-2"
                    >
                      <span>Final Step: Contact Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Contact & Submit */}
              {step === 4 && (
                <motion.form 
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-bold text-brand-slate">Step 4: Contact Details & Estimate Delivery</h3>
                    <p className="text-xs text-brand-charcoal">Where should our estimating engineering desk send the itemized proposal?</p>
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-brand-slate uppercase tracking-wider mb-1">
                        Full Name *
                      </label>
                      <input 
                        type="text" 
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Engr. Muhammad Tariq"
                        className="w-full text-xs p-2.5 border border-slate-300 rounded focus:border-brand-blue outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-brand-slate uppercase tracking-wider mb-1">
                        Company / Organization
                      </label>
                      <input 
                        type="text" 
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="e.g. Sapphire Textiles / Al-Rehman Motors"
                        className="w-full text-xs p-2.5 border border-slate-300 rounded focus:border-brand-blue outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-brand-slate uppercase tracking-wider mb-1">
                        Work / Official Email *
                      </label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="procurement@company.com"
                        className="w-full text-xs p-2.5 border border-slate-300 rounded focus:border-brand-blue outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-brand-slate uppercase tracking-wider mb-1">
                        Direct Phone / WhatsApp *
                      </label>
                      <input 
                        type="tel" 
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+92 300 1234567"
                        className="w-full text-xs p-2.5 border border-slate-300 rounded focus:border-brand-blue outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-slate uppercase tracking-wider mb-1">
                      Project Notes / Drawing References
                    </label>
                    <textarea 
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Mention any specific steel grades, HDG microns, or that CAD blueprints will be emailed..."
                      className="w-full text-xs p-2.5 border border-slate-300 rounded focus:border-brand-blue outline-none"
                    />
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <button 
                      type="button" 
                      onClick={() => setStep(3)}
                      className="btn-outline text-xs py-2.5 px-4 font-semibold flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="btn-accent text-xs py-3 px-8 font-bold flex items-center gap-2 shadow-md disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Transmitting to Estimators...</span>
                      ) : (
                        <>
                          <span>Submit Quotation Request</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </div>
          )}

        </div>
      </div>
    </PageTransition>
  );
}
