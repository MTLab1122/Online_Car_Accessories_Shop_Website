import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Calendar, User, ArrowLeft, ArrowRight, Tag, Share2, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import SEO from '../../components/common/SEO';
import { generateBreadcrumbSchema, generateArticleSchema } from '../../utils/schemaGenerator';
import toast from 'react-hot-toast';

const GuideDetailPage = () => {
  const { slug } = useParams();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/guides/${slug}`);
        if (res.success && res.data) {
          setGuide(res.data);
        } else {
          setError('Guide not found');
        }
      } catch (err) {
        console.error('Failed to load guide details:', err);
        setError('Editorial guide not found or could not be loaded.');
      } finally {
        setLoading(false);
      }
    };
    fetchGuide();
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: guide?.title,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-autox-bg flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 border-2 border-autox-orange border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-xs font-mono uppercase tracking-widest text-autox-muted">
          Accessing Engineering Archives...
        </span>
      </div>
    );
  }

  if (error || !guide) {
    return (
      <div className="min-h-screen bg-autox-bg text-autox-text py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center bg-autox-surface border border-autox-border rounded-xl p-8">
          <h1 className="text-xl font-display font-bold text-white mb-3">Guide Not Found</h1>
          <p className="text-xs text-autox-muted mb-6">
            The requested automotive article does not exist or has been relocated in our knowledge repository.
          </p>
          <Link
            to="/guides"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-autox-orange text-white text-xs font-mono font-bold uppercase hover:bg-orange-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Guides
          </Link>
        </div>
      </div>
    );
  }

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Guides', url: '/guides' },
    { name: guide.title, url: `/guides/${guide.slug}` }
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const articleSchema = generateArticleSchema({
    title: guide.title,
    description: guide.metaDescription,
    url: `https://autox.pk/guides/${guide.slug}`,
    image: guide.heroImage,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt || guide.publishedAt,
    author: guide.author,
    category: guide.category
  });

  return (
    <article className="min-h-screen bg-autox-bg text-autox-text py-10 px-4 sm:px-6 lg:px-8">
      <SEO
        title={guide.metaTitle || `${guide.title} | AUTOX Performance Lab`}
        description={guide.metaDescription}
        canonical={`https://autox.pk/guides/${guide.slug}`}
        ogImage={guide.heroImage}
        type="article"
        schema={[breadcrumbSchema, articleSchema]}
      />

      <div className="max-w-4xl mx-auto">
        {/* Navigation Breadcrumb Bar */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-xs font-mono text-autox-muted flex-wrap">
            <li>
              <Link to="/" className="hover:text-autox-orange transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/guides" className="hover:text-autox-orange transition-colors">
                Guides
              </Link>
            </li>
            <li>/</li>
            <li className="text-white truncate max-w-[280px] sm:max-w-md">
              {guide.title}
            </li>
          </ol>
        </nav>

        {/* Header Metadata */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded bg-autox-orange/10 border border-autox-orange/20 text-autox-orange text-xs font-mono font-bold uppercase tracking-wider">
              {guide.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-mono text-autox-muted">
              <Clock className="w-3.5 h-3.5 text-autox-orange" />
              {guide.readTime}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight leading-tight mb-4">
            {guide.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-autox-border text-xs font-mono text-autox-silver">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-autox-orange" />
                {guide.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-autox-muted" />
                {new Date(guide.publishedAt).toLocaleDateString('en-PK', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs text-autox-muted hover:text-white transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-autox-orange" />
              Share Guide
            </button>
          </div>
        </header>

        {/* Hero Visual Image */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-autox-border mb-12 bg-autox-surface shadow-2xl">
          <img
            src={guide.heroImage}
            alt={guide.title}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>

        {/* Quick Summary / Answer Engine Snapshot */}
        <div className="p-6 rounded-xl bg-autox-surface/90 border-l-4 border-l-autox-orange border-r border-t border-b border-autox-border mb-12">
          <h2 className="text-xs font-mono uppercase tracking-widest text-autox-orange mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Key Takeaway & Overview
          </h2>
          <p className="text-white text-sm sm:text-base leading-relaxed font-sans">
            {guide.excerpt}
          </p>
        </div>

        {/* Article Body Sections */}
        <div className="space-y-10 text-autox-silver leading-relaxed font-sans text-sm sm:text-base">
          {guide.sections && guide.sections.map((section, idx) => (
            <section key={idx} className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-wide border-b border-autox-border/60 pb-3">
                {section.heading}
              </h2>
              <p className="text-autox-silver leading-relaxed">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        {/* Related Product Categories */}
        {guide.relatedCategories && guide.relatedCategories.length > 0 && (
          <div className="mt-16 pt-8 border-t border-autox-border">
            <h3 className="text-xs font-mono uppercase tracking-widest text-autox-muted mb-4 flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-autox-orange" />
              Related Accessory Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {guide.relatedCategories.map((catSlug) => (
                <Link
                  key={catSlug}
                  to={`/categories/${catSlug}`}
                  className="px-4 py-2 rounded-lg bg-autox-surface border border-autox-border text-xs font-mono text-white hover:border-autox-orange hover:text-autox-orange transition-all"
                >
                  Explore #{catSlug.replace('-', ' ')}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action Bar */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-autox-surface via-[#181d24] to-autox-surface border border-autox-border flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-display font-bold text-white mb-1">
              Ready to Upgrade Your Vehicle?
            </h3>
            <p className="text-xs text-autox-muted">
              Explore authentic high-performance accessories with verified fitment and fast shipping across Pakistan.
            </p>
          </div>
          <Link
            to="/shop"
            className="flex-shrink-0 px-6 py-3 rounded-lg bg-autox-orange hover:bg-orange-600 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
          >
            Visit Shop <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-8 flex items-center justify-between text-xs font-mono text-autox-muted">
          <Link
            to="/guides"
            className="inline-flex items-center gap-1.5 hover:text-autox-orange transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Editorial Guides
          </Link>
          <Link
            to="/showroom"
            className="inline-flex items-center gap-1.5 hover:text-autox-orange transition-colors"
          >
            Launch 3D Showroom <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default GuideDetailPage;

