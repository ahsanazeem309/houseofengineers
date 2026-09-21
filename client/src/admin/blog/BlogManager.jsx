import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Plus,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Eye,
  Tag,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SafeImage from '../../components/SafeImage';

export default function BlogManager() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toastMsg, setToastMsg] = useState(null);

  const getAuthToken = () => token || localStorage.getItem('hoe_admin_token') || localStorage.getItem('token') || '';

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const authToken = getAuthToken();
      const params = new URLSearchParams({
        search: search.trim(),
        category: categoryFilter,
        status: statusFilter,
        limit: '50'
      });
      const res = await fetch(`/api/admin/posts?${params.toString()}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      showToast('Failed to load articles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [categoryFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleTogglePublish = async (post) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    try {
      const authToken = getAuthToken();
      const res = await fetch(`/api/admin/posts/${post.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Article marked as ${newStatus}.`);
        fetchPosts();
      } else {
        showToast(data.message || 'Failed to update article status.');
      }
    } catch (err) {
      showToast('Error updating status.');
    }
  };

  const handleDeletePost = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

    try {
      const authToken = getAuthToken();
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Article deleted successfully.');
        setPosts(prev => prev.filter(p => p.id !== id));
      } else {
        showToast(data.message || 'Failed to delete article.');
      }
    } catch (err) {
      showToast('Error deleting article.');
    }
  };

  const isSuperAdmin = user?.role === 'superadmin';

  return (
    <div className="space-y-6">
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
            <FileText className="w-5 h-5 text-brand-orange" />
            <h1 className="text-xl font-bold text-slate-900">Blog & Technical Articles</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Publish engineering whitepapers, solar case studies, and machining guides for client education and SEO rankings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            <span>View Public Blog</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <Link
            to="/admin/blog/new"
            className="btn-accent text-xs py-2 px-4 font-bold inline-flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Article</span>
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title or excerpt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-brand-blue"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-700 focus:outline-none focus:border-brand-blue"
          >
            <option value="all">All Categories</option>
            <option value="Solar Engineering">Solar Engineering</option>
            <option value="Machining & Tooling">Machining & Tooling</option>
            <option value="Quality & Metallurgy">Quality & Metallurgy</option>
            <option value="Industry News">Industry News</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-700 focus:outline-none focus:border-brand-blue"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <span className="text-xs">Loading articles...</span>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-600">No articles found.</p>
            <p className="text-xs text-slate-400">Create your first technical article to start publishing.</p>
            <Link to="/admin/blog/new" className="btn-accent text-xs py-2 px-4 font-bold inline-block mt-2">
              Create Article
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Article</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Author</th>
                  <th className="py-3.5 px-4">Published</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          {post.coverImage ? (
                            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <FileText className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 max-w-sm">
                          <Link
                            to={`/admin/blog/edit/${post.id}`}
                            className="font-bold text-slate-900 hover:text-brand-blue truncate block"
                          >
                            {post.title}
                          </Link>
                          <span className="text-[11px] text-slate-400 font-mono">/blog/{post.slug}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="bg-blue-50 text-brand-blue border border-blue-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                        {post.category || 'General'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{post.author || 'House of Engineers'}</div>
                      <div className="text-[10px] text-slate-400">{post.readingTime}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      {post.publishedAt ? (
                        <span className="font-mono text-[11px] text-slate-500">
                          {new Date(post.publishedAt).toLocaleDateString('en-PK', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Not published</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(post)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                          post.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                        }`}
                        title="Click to toggle status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${post.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span>{post.status === 'published' ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {post.status === 'published' && (
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                            title="View Live Post"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                        )}

                        <Link
                          to={`/admin/blog/edit/${post.id}`}
                          className="p-1.5 text-brand-blue hover:text-blue-700 hover:bg-blue-50 rounded"
                          title="Edit Post"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        {isSuperAdmin && (
                          <button
                            type="button"
                            onClick={() => handleDeletePost(post.id, post.title)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                            title="Delete Post"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
