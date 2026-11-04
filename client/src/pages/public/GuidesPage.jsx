import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Calendar, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import api from '../../services/api';
import SEO from '../../components/common/SEO';
import { generateBreadcrumbSchema, generateCollectionSchema } from '../../utils/schemaGenerator';

const GuidesPage = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setLoading(true);
        const res = await api.get('/guides');
        if (res.success && res.data) {
          setGuides(res.data);
        }
      } catch (err) {
        console.error('Failed to load guides:', err);
        setError('Unable to load editorial guides at this moment.');
      } finally {
        setLoading(false);
      }
    };
    fetchGuides();
  }, []);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Guides', url: '/guides' }
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const collectionSchema = generateCollectionSchema({
    title: 'Automotive Performance & Care Guides | AUTOX Pakistan',
    description: 'Expert guides, installation walkthroughs, and automotive care tips tailored for Pakistani road conditions and extreme climate.',
    url: 'https://autox.pk/guides',
    items: guides.map(g => ({
      name: g.title,
      url: `https://autox.pk/guides/${g.slug}`,
      image: g.heroImage
    }))
  });

  return (
    <div className="min-h-screen bg-autox-bg text-autox-text py-12 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Automotive Performance & Care Guides | AUTOX Pakistan"
        description="Expert automotive guides for Pakistani drivers. In-depth advice on extreme summer heat defense, Matrix LED lighting compliance, and vehicle accessories."
        canonical="https://autox.pk/guides"
        keywords="car accessories guides pakistan, automotive heat protection, led headlights legal pakistan, car maintenance karachi lahore islamabad"
        schema={[breadcrumbSchema, collectionSchema]}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-autox-orange/10 border border-autox-orange/20 text-autox-orange text-xs font-mono uppercase tracking-widest mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            Topical Authority & Knowledge Lab
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight mb-4">
            ENGINEERED <span className="text-autox-orange">KNOWLEDGE.</span>
          </h1>
          <p className="text-autox-silver text-base sm:text-lg leading-relaxed">
            In-depth engineering insights, climate countermeasures, and accessory buying strategies designed specifically for Pakistani drivers and road conditions.
          </p>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-autox-orange border-t-transparent rounded-full animate-spin mb-4" />
            <span className="text-xs font-mono text-autox-muted uppercase tracking-widest">
              Fetching Editorial Clusters...
            </span>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-autox-surface border border-autox-border rounded-xl p-8 max-w-lg mx-auto">
            <p className="text-red-400 text-sm mb-4">{error}</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-autox-orange text-white text-xs font-mono font-bold uppercase hover:bg-orange-600 transition-colors"
            >
              Explore Accessories Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides.map((guide) => (
              <article
                key={guide.slug}
                className="group flex flex-col bg-autox-surface border border-autox-border rounded-xl overflow-hidden hover:border-autox-orange/40 transition-all duration-300 hover:shadow-glow flex-1"
              >
                {/* Hero Thumbnail */}
                <div className="relative aspect-[16/9] overflow-hidden bg-autox-bg">
                  <img
                    src={guide.heroImage}
                    alt={guide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono uppercase tracking-wider text-autox-orange border border-autox-orange/30">
                      {guide.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-xs font-mono text-autox-muted mb-3">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-autox-orange" />
                      {guide.readTime}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-autox-muted" />
                      {new Date(guide.publishedAt).toLocaleDateString('en-PK', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <h2 className="text-lg font-display font-bold text-white group-hover:text-autox-orange transition-colors mb-3 line-clamp-2">
                    <Link to={`/guides/${guide.slug}`}>
                      {guide.title}
                    </Link>
                  </h2>

                  <p className="text-autox-silver text-xs leading-relaxed mb-6 line-clamp-3 flex-1">
                    {guide.excerpt}
                  </p>

                  <div className="pt-4 border-t border-autox-border flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-autox-muted">
                      {guide.author}
                    </span>
                    <Link
                      to={`/guides/${guide.slug}`}
                      className="inline-flex items-center gap-1.5 text-autox-orange font-mono font-bold hover:gap-2 transition-all"
                    >
                      Read Guide <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Verification & Trust Callout */}
        <div className="mt-20 p-8 rounded-2xl bg-gradient-to-r from-autox-surface via-[#181d24] to-autox-surface border border-autox-border flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-autox-orange/10 border border-autox-orange/20 flex items-center justify-center flex-shrink-0 text-autox-orange">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-display font-bold text-white mb-1">
                Field-Tested Automotive Advice
              </h3>
              <p className="text-xs text-autox-muted leading-relaxed">
                All articles are researched and verified by AUTOX technical staff against automotive standards and local highway regulations.
              </p>
            </div>
          </div>
          <Link
            to="/shop"
            className="flex-shrink-0 px-6 py-3 rounded-lg bg-autox-orange hover:bg-orange-600 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Browse Verified Catalog
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GuidesPage;

