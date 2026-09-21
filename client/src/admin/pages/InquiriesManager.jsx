import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Inbox, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MessageSquare, 
  ExternalLink, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  X,
  FileText,
  Clock
} from 'lucide-react';

export default function InquiriesManager() {
  const { token } = useAuth();
  const location = useLocation();

  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchInquiries = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/inquiries', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setInquiries(data.inquiries);
      }
    } catch (err) {
      console.error('Fetch inquiries error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [token]);

  // Check URL query param for specific ID
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id && inquiries.length > 0) {
      const target = inquiries.find((i) => i.id === id);
      if (target) setSelectedInquiry(target);
    }
  }, [location.search, inquiries]);

  const handleStatusChange = async (id, newStatus, notes) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus, notes })
      });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) => prev.map((i) => (i.id === id ? data.inquiry : i)));
        if (selectedInquiry?.id === id) setSelectedInquiry(data.inquiry);
        setActionSuccess('Status updated successfully.');
        setTimeout(() => setActionSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry record?')) return;
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) => prev.filter((i) => i.id !== id));
        if (selectedInquiry?.id === id) setSelectedInquiry(null);
        setActionSuccess('Inquiry deleted.');
        setTimeout(() => setActionSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesStatus = filterStatus === 'all' || inq.status === filterStatus;
    const matchesSearch =
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inq.company && inq.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.phone.includes(searchQuery) ||
      inq.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Inquiries &amp; Quotation Leads
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage incoming procurement requests, client drawings, and reply directly via WhatsApp or email.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-white px-3 py-1.5 rounded border border-slate-200 text-slate-600">
            Total Leads: <strong>{inquiries.length}</strong>
          </span>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'new', 'contacted', 'quoted', 'closed'].map((status) => {
            const count = status === 'all'
              ? inquiries.length
              : inquiries.filter((i) => i.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
                  filterStatus === status
                    ? 'bg-brand-blue text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{status}</span>
                <span className="ml-1.5 font-mono text-[10px] opacity-80">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads, names, specs..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-brand-blue"
          />
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {filteredInquiries.length > 0 ? (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 font-bold">Ref ID</th>
                  <th className="py-3 px-4 font-bold">Client / Company</th>
                  <th className="py-3 px-4 font-bold">Service Required</th>
                  <th className="py-3 px-4 font-bold">Contact Channels</th>
                  <th className="py-3 px-4 font-bold">Date</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInquiries.map((inq) => (
                  <tr 
                    key={inq.id} 
                    className="hover:bg-slate-50/70 cursor-pointer transition-colors"
                    onClick={() => setSelectedInquiry(inq)}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-brand-blue">
                      {inq.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{inq.name}</div>
                      <div className="text-[11px] text-slate-500">{inq.company || 'Direct / Residential'}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-[180px] truncate">
                      {inq.service}
                    </td>
                    <td className="py-3 px-4 space-y-0.5">
                      <div className="text-slate-600 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{inq.email}</span>
                      </div>
                      <div className="text-slate-600 flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>{inq.phone}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {new Date(inq.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase font-mono ${
                        inq.status === 'new' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                        inq.status === 'quoted' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        inq.status === 'contacted' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                        'bg-slate-100 text-slate-700 border border-slate-300'
                      }`}>
                        {inq.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${inq.name}, this is House of Engineers regarding your inquiry for ${inq.service} (${inq.id}).`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded"
                          title="Chat on WhatsApp"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => setSelectedInquiry(inq)}
                          className="p-1.5 text-brand-blue hover:bg-brand-blue/10 rounded font-semibold text-xs"
                        >
                          Inspect
                        </button>
                        <button
                          onClick={() => handleDelete(inq.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-xs text-slate-500">
              No inquiries found matching your filters.
            </div>
          )}
        </div>
      </div>

      {/* Inquiry Detail Lightbox / Drawer Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div 
            className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-brand-slate text-white p-5 flex items-center justify-between border-b border-slate-700">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-brand-orange font-bold">
                    {selectedInquiry.id}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Received: {new Date(selectedInquiry.submittedAt).toLocaleString()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {selectedInquiry.name} {selectedInquiry.company ? `(${selectedInquiry.company})` : ''}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              
              {/* Quick Communication Bar */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs text-slate-500 font-medium">Direct Contact Channels:</div>
                  <div className="text-xs font-bold text-slate-800">
                    {selectedInquiry.email} &bull; {selectedInquiry.phone}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${selectedInquiry.name}, this is House of Engineers regarding your inquiry (${selectedInquiry.id}) for: ${selectedInquiry.service}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-current" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`mailto:${selectedInquiry.email}?subject=RE: Inquiry ${selectedInquiry.id} - ${selectedInquiry.service}`}
                    className="px-3 py-1.5 bg-brand-blue hover:bg-brand-blue-dark text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Client</span>
                  </a>
                </div>
              </div>

              {/* Status & Service Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Requested Engineering Capability
                  </label>
                  <div className="p-2.5 bg-slate-100 rounded text-xs font-semibold text-slate-800">
                    {selectedInquiry.service}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Lead Status
                  </label>
                  <select
                    value={selectedInquiry.status}
                    onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value, selectedInquiry.notes)}
                    className="w-full p-2.5 text-xs rounded border border-slate-300 bg-white font-semibold focus:outline-none focus:border-brand-blue"
                  >
                    <option value="new">New (Pending Review)</option>
                    <option value="contacted">Contacted (In Discussion)</option>
                    <option value="quoted">Quoted (BOM / Price Dispatched)</option>
                    <option value="closed">Closed (Completed / Inactive)</option>
                  </select>
                </div>
              </div>

              {/* Message / Scope */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Client Technical Scope &amp; Specifications:
                </label>
                <div className="p-4 rounded bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-mono">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Drawing Note */}
              {selectedInquiry.drawingNote && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    CAD Drawing / Cloud Note:
                  </label>
                  <div className="p-3 rounded bg-amber-50 border border-amber-200 text-xs text-amber-900 font-mono">
                    {selectedInquiry.drawingNote}
                  </div>
                </div>
              )}

              {/* Internal Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Internal Estimating Notes (Only visible to Admin):
                </label>
                <textarea
                  rows={3}
                  value={selectedInquiry.notes || ''}
                  onChange={(e) => setSelectedInquiry({ ...selectedInquiry, notes: e.target.value })}
                  onBlur={() => handleStatusChange(selectedInquiry.id, selectedInquiry.status, selectedInquiry.notes)}
                  placeholder="Add internal estimator notes, quoted pricing, site survey dates..."
                  className="w-full p-3 text-xs rounded border border-slate-300 bg-white focus:outline-none focus:border-brand-blue"
                />
                <span className="text-[11px] text-slate-400">Notes automatically save on click outside.</span>
              </div>

            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => handleDelete(selectedInquiry.id)}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Lead</span>
              </button>

              <button
                onClick={() => setSelectedInquiry(null)}
                className="btn-primary text-xs py-2 px-5"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
