import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Inbox, 
  Settings, 
  Wrench, 
  Layers, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  MessageSquare,
  Building,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setStats(data.stats);
          }
        })
        .catch((err) => console.error('Stats fetch error:', err))
        .finally(() => setIsLoading(false));
    }
  }, [token]);

  const metricCards = [
    {
      title: 'Total Inquiries',
      value: stats?.totalInquiries || 0,
      icon: Inbox,
      color: 'text-brand-blue',
      bgColor: 'bg-brand-blue/10',
      link: '/admin/inquiries'
    },
    {
      title: 'New / Unread Leads',
      value: stats?.newInquiries || 0,
      icon: AlertCircle,
      color: 'text-brand-orange',
      bgColor: 'bg-brand-orange/10',
      link: '/admin/inquiries'
    },
    {
      title: 'Active Capabilities',
      value: stats?.totalServices || 3,
      icon: Wrench,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      link: '/admin/services'
    },
    {
      title: 'Portfolio Projects',
      value: stats?.totalProjects || 6,
      icon: Layers,
      color: 'text-purple-700',
      bgColor: 'bg-purple-50',
      link: '/admin/portfolio'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.name || 'Chief Engineer'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your corporate website content, services, documented projects, and B2B RFQs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/inquiries" className="btn-accent text-xs py-2 px-4 shadow-sm flex items-center gap-1.5">
            <Inbox className="w-3.5 h-3.5" />
            <span>Review Leads</span>
          </Link>
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn-outline text-xs py-2 px-4">
            Open Website
          </a>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:border-brand-blue/50 hover:shadow-md transition-all flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  {card.title}
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 block">
                  {isLoading ? '...' : card.value}
                </span>
              </div>
              <div className={`w-12 h-12 rounded-lg ${card.bgColor} ${card.color} flex items-center justify-center shrink-0`}>
                <Icon className="w-6 h-6 stroke-[2]" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions Shortcuts */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
          Storefront &amp; Content Shortcuts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/admin/settings"
            className="p-4 rounded-md border border-slate-200 hover:border-brand-blue/50 hover:bg-slate-50 transition-colors flex items-start gap-3"
          >
            <Settings className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-800">Edit Site Settings &amp; Hero</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Change headlines, phone numbers, WhatsApp, and Punjab coverage.</div>
            </div>
          </Link>

          <Link
            to="/admin/services"
            className="p-4 rounded-md border border-slate-200 hover:border-brand-blue/50 hover:bg-slate-50 transition-colors flex items-start gap-3"
          >
            <Wrench className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-800">Manage Services &amp; Specs</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Update solar frames, lathe turning, and structural metalwork.</div>
            </div>
          </Link>

          <Link
            to="/admin/portfolio"
            className="p-4 rounded-md border border-slate-200 hover:border-brand-blue/50 hover:bg-slate-50 transition-colors flex items-start gap-3"
          >
            <Layers className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-800">Add / Edit Portfolio Projects</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Publish new builds with material gauge, tolerances, and specs.</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Inquiries Section */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Recent Engineering Inquiries / RFQs
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Latest submissions dispatched from the contact portal.</p>
          </div>
          <Link to="/admin/inquiries" className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          {stats?.recentInquiries && stats.recentInquiries.length > 0 ? (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Client / Company</th>
                  <th className="py-3 px-4 font-bold">Service Required</th>
                  <th className="py-3 px-4 font-bold">Date</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-medium text-slate-900">
                      <div>{inq.name}</div>
                      <div className="text-[11px] text-slate-500">{inq.company || 'Direct / Residential'}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{inq.service}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {new Date(inq.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        inq.status === 'new' ? 'bg-amber-100 text-amber-800' :
                        inq.status === 'quoted' ? 'bg-emerald-100 text-emerald-800' :
                        inq.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {inq.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/admin/inquiries?id=${inq.id}`}
                        className="text-brand-blue font-semibold hover:underline"
                      >
                        Inspect RFQ
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              No inquiries received yet. Submit an inquiry on the public contact form to test.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
