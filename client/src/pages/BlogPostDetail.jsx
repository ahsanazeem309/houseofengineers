import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  Calendar,
  User,
  ArrowLeft,
  Share2,
  Check,
  Building,
  ArrowRight,
  AlertCircle,
  FileText
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import Breadcrumb from '../components/Breadcrumb';
import SafeImage from '../components/SafeImage';
import SchemaJsonLd from '../components/SchemaJsonLd';

export default function BlogPostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setNotFound(false);
        const res = await fetch(`/api/content/posts/${slug}`);
        const data = await res.json();
        if (isMounted) {
          if (res.ok && data.success && data.post) {
            setPost(data.post);
            // Update document title & SEO
            document.title = data.post.seo?.metaTitle || `${data.post.title} | House of Engineers`;
            
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
              metaDesc = document.createElement('meta');
              metaDesc.name = 'description';
              document.head.appendChild(metaDesc);
            }
            if (data.post.seo?.metaDescription) {
              metaDesc.content = data.post.seo.metaDescription;
            }
          } else {
            setNotFound(true);
          }
        }
      } catch (err) {
        console.error('Fetch post error:', err);
        if (isMounted) setNotFound(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchArticle();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-brand-neutral text-slate-400">
        <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-xs font-mono">Loading Technical Article...</span>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-brand-neutral px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-100 border border-red-200 flex items-center justify-center text-red-600 mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-brand-slate mb-2">Technical Article Not Found</h1>
        <p className="text-xs text-brand-charcoal max-w-md mb-6">
          The requested article may have been archived or moved by our engineering editorial team.
        </p>
        <Link to="/blog" className="btn-accent text-xs py-2.5 px-5 font-bold inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Engineering Journal</span>
        </Link>
      </div>
    );
  }

  // Generate Article Schema.org JSON-LD
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.excerpt,
    'image': post.coverImage,
    'datePublished': post.publishedAt,
    'dateModified': post.updatedAt || post.publishedAt,
    'author': {
      '@type': 'Person',
      'name': post.author,
      'jobTitle': post.authorRole
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'House of Engineers Pvt. Ltd.',
      'url': 'https://houseofengineers.pk',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://houseofengineers.pk/logo.png'
      }
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': window.location.href
    }
  };

  return (
    <PageTransition className="bg-brand-neutral min-h-screen pb-24">
      <SchemaJsonLd schema={articleSchema} id="schema-blog-posting" />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-brand-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Breadcrumb
            items={[
              { label: 'Engineering Journal', to: '/blog' },
              { label: post.category, to: `/blog?category=${encodeURIComponent(post.category)}` },
              { label: post.title }
            ]}
          />
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
        {/* Article Meta Bar */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="bg-blue-50 text-brand-blue border border-blue-200 px-3 py-1 rounded-full font-semibold">
              {post.category}
            </span>
            <div className="flex items-center gap-1.5 text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString('en-PK', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })
                  : ''}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readingTime}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-brand-slate leading-tight tracking-tight">
            {post.title}
          </h1>

          <p className="text-sm sm:text-base text-brand-charcoal leading-relaxed font-normal">
            {post.excerpt}
          </p>

          {/* Author info & share bar */}
          <div className="pt-4 pb-6 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-sm">
                {post.author ? post.author.charAt(0) : 'E'}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">{post.author}</span>
                <span className="text-[11px] text-slate-500 block">{post.authorRole}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${post.title} - Read more: ${window.location.href}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Share on WhatsApp"
              >
                <span>WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleShare}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Copy Article URL"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Featured Cover Image */}
        {post.coverImage && (
          <div className="my-8 rounded-2xl overflow-hidden shadow-technical border border-slate-200 aspect-video bg-slate-100">
            <SafeImage
              src={post.coverImage}
              alt={post.title}
              priority
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Structured Article Body */}
        <div
          className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-6 pt-4 font-sans [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-brand-slate [&>h2]:pt-4 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-brand-slate [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>blockquote]:border-l-4 [&>blockquote]:border-brand-orange [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:bg-slate-50 [&>blockquote]:py-2 [&>blockquote]:rounded-r-lg"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="pt-8 mt-12 border-t border-slate-200 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Keywords:</span>
            {post.tags.map((tag, idx) => (
              <span key={idx} className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* B2B Engineering Consultation Callout Box */}
        <div className="mt-12 bg-brand-slate text-white p-6 sm:p-8 rounded-2xl shadow-technical-lg border border-slate-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-brand-orange text-xs font-bold uppercase tracking-wider">
                Industrial Engineering Consultation
              </span>
              <h3 className="text-xl font-bold text-white">Have a Similar Engineering Requirement?</h3>
              <p className="text-xs text-slate-300 max-w-xl">
                Consult with our engineering desk in Lahore for customized structural calculations, quotation bids, or material mill test verifications.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <Link to="/quote" className="btn-accent text-xs py-3 px-5 font-bold shadow-md">
                Launch Quote Estimator
              </Link>
              <Link to="/contact" className="btn-outline text-xs py-3 px-5 font-bold text-white border-slate-600 hover:bg-slate-800">
                Contact Desk
              </Link>
            </div>
          </div>
        </div>

        {/* Back to Blog */}
        <div className="mt-8 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-blue hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse All Technical Articles</span>
          </Link>
        </div>
      </article>
    </PageTransition>
  );
}
