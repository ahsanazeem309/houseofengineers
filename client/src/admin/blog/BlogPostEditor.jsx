import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  UploadCloud,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  Link2,
  Lock,
  Unlock,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  Quote
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import MediaSelectorModal from '../media/MediaSelectorModal';

export default function BlogPostEditor() {
  const { id } = useParams(); // If present, edit mode; else create mode
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { token, user } = useAuth();

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugLocked, setSlugLocked] = useState(!isEditMode);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Solar Engineering');
  const [tags, setTags] = useState('');
  const [author, setAuthor] = useState('Engr. Ahsan Azeem');
  const [authorRole, setAuthorRole] = useState('Chief Structural Engineer');
  const [readingTime, setReadingTime] = useState('5 min read');
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState('draft');
  const [featured, setFeatured] = useState(false);

  // SEO State
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');

  // UI State
  const [loading, setLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState('cover'); // 'cover' or 'content'

  const getAuthToken = () => token || localStorage.getItem('hoe_admin_token') || localStorage.getItem('token') || '';

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Auto calculate reading time when content changes
  useEffect(() => {
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    setReadingTime(`${minutes} min read`);
  }, [content]);

  // Auto-slugify title if slug is locked
  const handleTitleChange = (val) => {
    setTitle(val);
    if (slugLocked) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generated);
    }
  };

  // Fetch post if in edit mode
  useEffect(() => {
    if (!isEditMode) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        const authToken = getAuthToken();
        const res = await fetch(`/api/admin/posts/${id}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        const data = await res.json();
        if (res.ok && data.success && data.post) {
          const p = data.post;
          setTitle(p.title || '');
          setSlug(p.slug || '');
          setSlugLocked(false);
          setExcerpt(p.excerpt || '');
          setContent(p.content || '');
          setCategory(p.category || 'Solar Engineering');
          setTags(Array.isArray(p.tags) ? p.tags.join(', ') : '');
          setAuthor(p.author || 'House of Engineers');
          setAuthorRole(p.authorRole || '');
          setReadingTime(p.readingTime || '5 min read');
          setCoverImage(p.coverImage || '');
          setStatus(p.status || 'draft');
          setFeatured(Boolean(p.featured));
          setMetaTitle(p.seo?.metaTitle || '');
          setMetaDescription(p.seo?.metaDescription || '');
          setKeywords(Array.isArray(p.seo?.keywords) ? p.seo.keywords.join(', ') : '');
        } else {
          setErrorMsg(data.message || 'Article not found');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setErrorMsg('Network error loading article details.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, isEditMode]);

  // Handle Quick Formatting in Content Textarea
  const insertFormatting = (tagStart, tagEnd) => {
    const textarea = document.getElementById('blog-content-area');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end) || 'Sample text';
    const replacement = `${tagStart}${selected}${tagEnd}`;
    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setContent(newContent);
  };

  // Media selector callback
  const handleMediaSelect = (asset) => {
    if (mediaTarget === 'cover') {
      setCoverImage(asset.url);
    } else if (mediaTarget === 'content') {
      const imgHtml = `\n<figure><img src="${asset.url}" alt="${asset.altText || 'Technical illustration'}" class="w-full rounded-xl my-4 shadow-md" /><figcaption class="text-xs text-slate-500 text-center italic mt-1">${asset.altText || ''}</figcaption></figure>\n`;
      setContent(prev => prev + imgHtml);
    }
    setIsMediaModalOpen(false);
  };

  // Save / Publish
  const handleSave = async (targetStatus = status) => {
    setErrorMsg('');
    if (!title.trim()) {
      setErrorMsg('Please enter an article title.');
      return;
    }
    if (!slug.trim()) {
      setErrorMsg('Please specify a URL slug.');
      return;
    }

    setIsSaving(true);
    try {
      const authToken = getAuthToken();
      const payload = {
        title: title.trim(),
        slug: slug.trim().toLowerCase(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        category,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        author: author.trim(),
        authorRole: authorRole.trim(),
        readingTime,
        status: targetStatus,
        featured,
        coverImage,
        seo: {
          metaTitle: metaTitle.trim() || title.trim(),
          metaDescription: metaDescription.trim() || excerpt.trim(),
          keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
          ogImage: coverImage
        }
      };

      const url = isEditMode ? `/api/admin/posts/${id}` : '/api/admin/posts';
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast(targetStatus === 'published' ? 'Article published successfully!' : 'Draft saved successfully!');
        if (!isEditMode && data.post) {
          navigate(`/admin/blog/edit/${data.post.id}`, { replace: true });
        }
      } else {
        setErrorMsg(data.message || 'Failed to save article.');
      }
    } catch (err) {
      console.error('Error saving post:', err);
      setErrorMsg('Server connection error. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <span className="text-xs">Loading article editor...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm sticky top-16 z-20">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/blog"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Back to Blog Manager"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div>
            <h1 className="text-lg font-bold text-slate-900">
              {isEditMode ? 'Edit Technical Article' : 'Write New Article'}
            </h1>
            <span className="text-xs text-slate-400 font-mono">
              Status: <strong className={status === 'published' ? 'text-emerald-600' : 'text-amber-600'}>{status.toUpperCase()}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {status === 'published' && slug && (
            <a
              href={`/blog/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Live</span>
            </a>
          )}

          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSave('draft')}
            className="btn-outline text-xs py-2 px-4 font-semibold inline-flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSave('published')}
            className="btn-accent text-xs py-2 px-5 font-bold inline-flex items-center gap-1.5 shadow-sm"
          >
            {isSaving ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <UploadCloud className="w-3.5 h-3.5" />
            )}
            <span>Publish Article</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Grid: Left Editor & Right Metadata Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 cols): Content & Writing */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title & Slug */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Article Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Turnkey Solar Mounting Structures: 145 km/h Wind Engineering"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm font-semibold focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  URL Route Slug *
                </label>
                <button
                  type="button"
                  onClick={() => setSlugLocked(!slugLocked)}
                  className="text-[11px] text-brand-blue hover:underline flex items-center gap-1"
                >
                  {slugLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  <span>{slugLocked ? 'Unlock Custom Slug' : 'Lock Auto-Slug'}</span>
                </button>
              </div>
              <div className="flex items-center rounded-lg border border-slate-300 bg-slate-50 overflow-hidden text-xs">
                <span className="px-3 text-slate-400 font-mono bg-slate-100 py-2 border-r border-slate-300">
                  /blog/
                </span>
                <input
                  type="text"
                  value={slug}
                  disabled={slugLocked}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                  placeholder="commercial-solar-mounting-guide"
                  className="flex-1 px-3 py-2 bg-transparent text-slate-800 font-mono focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Short Excerpt / Lead Summary
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A concise summary displayed on the blog archive and search snippet..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 text-xs focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>

          {/* Rich Content Area */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Article Body (HTML / Markdown)
              </span>

              {/* Formatting Toolbar */}
              <div className="flex items-center gap-1 text-slate-600">
                <button
                  type="button"
                  onClick={() => insertFormatting('<h2>', '</h2>')}
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-700"
                  title="Heading 2"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('<h3>', '</h3>')}
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-700"
                  title="Heading 3"
                >
                  <Heading3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('<strong>', '</strong>')}
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-700"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('<em>', '</em>')}
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-700"
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('<ul>\n  <li>', '</li>\n</ul>')}
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-700"
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('<blockquote>', '</blockquote>')}
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-700"
                  title="Blockquote Callout"
                >
                  <Quote className="w-4 h-4" />
                </button>

                <div className="h-4 w-px bg-slate-300 mx-1" />

                <button
                  type="button"
                  onClick={() => {
                    setMediaTarget('content');
                    setIsMediaModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-brand-orange" />
                  <span>Insert Media Image</span>
                </button>
              </div>
            </div>

            <textarea
              id="blog-content-area"
              rows={18}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article in structured HTML or markdown paragraphs..."
              className="w-full p-4 font-mono text-xs text-slate-800 rounded-lg border border-slate-300 focus:outline-none focus:border-brand-blue leading-relaxed"
            />
          </div>

          {/* SEO & Meta Tags */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Search Engine Optimization (SEO)
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">SEO Title Tag</label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder={title || 'Custom search engine title...'}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">SEO Meta Description</label>
              <textarea
                rows={2}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder={excerpt || 'Concise 155-character description for Google search snippets...'}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Keywords (Comma separated)</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="solar structures lahore, astm a123 galvanizing, precision machining"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Meta Settings Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Featured Cover Image */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Featured Cover Image
            </label>

            {coverImage ? (
              <div className="relative rounded-lg overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setCoverImage('')}
                  className="absolute top-2 right-2 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md shadow-md"
                  title="Remove cover image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border border-dashed border-slate-300 rounded-lg p-6 text-center text-slate-400 text-xs">
                No cover image selected
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setMediaTarget('cover');
                setIsMediaModalOpen(true);
              }}
              className="w-full py-2.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <ImageIcon className="w-4 h-4 text-brand-orange" />
              <span>Choose Cover from Media Library</span>
            </button>
          </div>

          {/* Publishing & Category Details */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Taxonomy &amp; Attribution
            </label>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-brand-blue"
              >
                <option value="Solar Engineering">Solar Engineering</option>
                <option value="Machining & Tooling">Machining & Tooling</option>
                <option value="Quality & Metallurgy">Quality & Metallurgy</option>
                <option value="Industry News">Industry News</option>
                <option value="Fabrication Guides">Fabrication Guides</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Tags (Comma-separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Solar, Wind Load, Steel"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Author Name</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Author Technical Role</label>
              <input
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                placeholder="e.g. Chief Structural Engineer"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Reading Time</label>
              <input
                type="text"
                value={readingTime}
                onChange={(e) => setReadingTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-[11px]"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="font-semibold text-slate-700">Feature on Homepage</span>
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 accent-brand-orange"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Media Selector Modal */}
      <MediaSelectorModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={handleMediaSelect}
        onSelectAsset={handleMediaSelect}
      />
    </div>
  );
}
