import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';
import { categoryService } from '../../services/categoryService';
import SEO from '../../components/common/SEO';
import { generateBreadcrumbSchema, generateCollectionSchema } from '../../utils/schemaGenerator';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        setLoading(true);
        const res = await categoryService.getCategories();
        if (res.success && res.data) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Categories', url: '/categories' }
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const collectionSchema = generateCollectionSchema({
    title: 'Car Accessories Categories & Divisions | AUTOX Pakistan',
    description: 'Explore 10 curated automotive accessory categories: Aerodynamics, Interior Luxury, LED Lighting, Exhausts, Performance Brakes, Wheels, and Electronics in Pakistan.',
    url: 'https://autox.pk/categories',
    items: categories.map(c => ({
      name: c.name,
      url: `https://autox.pk/categories/${c.slug}`,
      image: c.image
    }))
  });

  return (
    <div className="min-h-screen bg-autox-bg py-12">
      <SEO
        title="Car Accessories Categories & Equipment Divisions | AUTOX Pakistan"
        description="Explore 10 automotive accessory categories in Pakistan. Aerodynamics, interior styling, LED headlights, audio, wheels, and car detailing with express nationwide shipping."
        canonical="https://autox.pk/categories"
        keywords="car accessories categories pakistan, auto parts divisions, car lighting interior aero wheels pkr"
        schema={[breadcrumbSchema, collectionSchema]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-autox-orange font-bold">
            Hardware Catalog Architecture
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white mt-1">
            Accessory Divisions
          </h1>
          <p className="text-sm text-autox-muted mt-2 leading-relaxed">
            Browse ten dedicated performance divisions containing race-grade aerodynamics, forged monoblock alloys, laser projector lighting, and cockpit telemetry.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[16/10] bg-autox-card rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/categories/${cat.slug}`}
                className="group relative rounded-2xl overflow-hidden border border-autox-border hover:border-autox-orange transition-all duration-300 shadow-card hover:shadow-glow flex flex-col justify-end aspect-[16/11]"
              >
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80'}
                  alt={cat.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                <div className="relative p-6 z-10 flex flex-col justify-end">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-autox-orange">
                      {cat.productCount !== undefined ? `${cat.productCount} Equipment Units` : 'Division'}
                    </span>
                    <span className="p-1.5 rounded-lg bg-black/60 text-autox-orange group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xl sm:text-2xl text-white group-hover:text-autox-orange transition-colors">
                    {cat.name}
                  </h3>

                  <p className="text-xs text-autox-silver line-clamp-2 mt-1 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;

