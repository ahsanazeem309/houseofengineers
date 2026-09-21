import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Search,
  ArrowRight,
  Clock,
  Calendar,
  User,
  Tag,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import Breadcrumb from '../components/Breadcrumb';
import SafeImage from '../components/SafeImage';
import SchemaJsonLd from '../components/SchemaJsonLd';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Articles' },
    { id: 'Solar Engineering', label: 'Solar Engineering' },
    { id: 'Machining & Tooling', label: 'Machining & Tooling' },
    { id: 'Quality & Metallurgy', label: 'Quality & Metallurgy' },
    { id: 'Industry News', label: 'Industry News' }
  ];

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search: search.trim(),
        category: selectedCategory !== 'all' ? selectedCategory : '',
        limit: '24'
      });
      const res = await fetch(`/api/content/posts?${params.toString()}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error('Error fetching blog articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPosts();
  };

  const featuredPost = posts.find(p => p.featured) || posts[0];
  const remainingPosts = posts.filter(p => p.id !== featuredPost?.id);

  // Blog Hub Schema.org JSON-LD
  const blogHubSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    'name': 'House of Engineers Technical Journal',
    'description': 'Engineering whitepapers, solar mounting specifications, and precision metal fabrication insights from Lahore, Punjab.',
    'publisher': {
      '@type': 'Organization',
      'name': 'House of Engineers Pvt. Ltd.',
      'url': 'https://houseofengineers.pk'
    }
  };

  return (
    <PageTransition className="bg-brand-neutral min-h-screen pb-20">
      <SchemaJsonLd schema={blogHubSchema} id="schema-blog-hub" />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Engineering Journal & Insights' }]} />
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-brand-slate text-white py-16 relative overflow-hidden border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand-orange/20 border border-brand-orange/30 text-brand-orange text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Technical Journal &bull; Industrial Insights</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Engineering Whitepapers &amp; Fabrication Insights
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Technical guides on high-wind solar mount engineering, micron-tolerance lathe machining, and ASTM A123 galvanizing standards across Pakistan.
            </p>

            {/* Search & Categories Bar */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search articles by technical keywords..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-blue"
                />
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter Pills */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Articles Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <span className="text-xs font-mono">Loading Technical Articles...</span>
          </div>
        ) : posts.length === 0 ? (
          <div className="py-16 text-center text-slate-400 bg-white rounded-xl border border-slate-200 p-8">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No articles matching your criteria</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting search filters or selecting another category.</p>
          </div>
        ) : (
          <>
            {/* Featured Post Card */}
            {featuredPost && (
              <div className="bg-white rounded-2xl border border-brand-border overflow-hidden shadow-sm hover:border-brand-blue/30 transition-all">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  <div className="lg:col-span-7 h-64 sm:h-80 lg:h-auto relative overflow-hidden bg-slate-100">
                    <SafeImage
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 bg-brand-orange text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      Featured Whitepaper
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="bg-blue-50 text-brand-blue border border-blue-200 px-2.5 py-0.5 rounded font-semibold text-[11px]">
                          {featuredPost.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{featuredPost.readingTime}</span>
                        </div>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-bold text-brand-slate leading-snug">
                        <Link to={`/blog/${featuredPost.slug}`} className="hover:text-brand-blue transition-colors">
                          {featuredPost.title}
                        </Link>
                      </h2>

                      <p className="text-xs sm:text-sm text-brand-charcoal leading-relaxed line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-xs">
                          {featuredPost.author ? featuredPost.author.charAt(0) : 'E'}
                        </div>
                        <div className="text-left">
                          <span className="text-xs font-semibold text-slate-800 block">{featuredPost.author}</span>
                          <span className="text-[10px] text-slate-400 block">{featuredPost.authorRole}</span>
                        </div>
                      </div>

                      <Link
                        to={`/blog/${featuredPost.slug}`}
                        className="btn-accent text-xs py-2 px-4 font-bold inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <span>Read Technical Article</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Articles Grid */}
            {remainingPosts.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-brand-slate tracking-tight mb-6">
                  Recent Technical Articles
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {remainingPosts.map((post) => (
                    <article
                      key={post.id}
                      className="bg-white rounded-xl border border-brand-border overflow-hidden shadow-sm hover:border-brand-blue/40 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="h-48 overflow-hidden bg-slate-100 relative">
                          <SafeImage
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2.5 py-0.5 rounded">
                            {post.category}
                          </div>
                        </div>

                        <div className="p-5 space-y-2.5">
                          <div className="flex items-center gap-2 text-[11px] text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span>{post.readingTime}</span>
                            <span>&bull;</span>
                            <span>
                              {post.publishedAt
                                ? new Date(post.publishedAt).toLocaleDateString('en-PK', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })
                                : ''}
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-brand-slate leading-snug">
                            <Link to={`/blog/${post.slug}`} className="hover:text-brand-blue transition-colors">
                              {post.title}
                            </Link>
                          </h4>

                          <p className="text-xs text-brand-charcoal line-clamp-2 leading-relaxed">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>

                      <div className="p-5 pt-0">
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700 truncate max-w-[150px]">{post.author}</span>
                          <Link
                            to={`/blog/${post.slug}`}
                            className="text-brand-blue hover:text-blue-700 font-bold flex items-center gap-1"
                          >
                            <span>Read</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </PageTransition>
  );
}
