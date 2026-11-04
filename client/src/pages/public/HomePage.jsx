import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Wrench,
  Cpu,
  Sparkles,
  ChevronRight,
  Star,
  Quote
} from 'lucide-react';
import InteractiveHeroCar from '../../three/InteractiveHeroCar';
import ProductCard from '../../components/products/ProductCard';
import QuickViewModal from '../../components/products/QuickViewModal';
import { ProductCardSkeleton } from '../../components/common/LoadingSkeleton';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [activeTab, setActiveTab] = useState('featured');
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catsRes, featRes] = await Promise.all([
          categoryService.getCategories(),
          productService.getFeatured()
        ]);

        if (catsRes.success && catsRes.data) {
          setCategories(catsRes.data.slice(0, 8));
        }

        if (featRes.success && featRes.data) {
          setFeaturedProducts(featRes.data.featured || []);
          setBestSellers(featRes.data.bestSellers || []);
        }
      } catch (err) {
        console.error('[HomePage] fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const displayedProducts = activeTab === 'featured' ? featuredProducts : bestSellers;

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Immersive 3D Hero */}
      <InteractiveHeroCar />

      {/* 2. Featured Categories Section */}
      <section className="py-20 bg-autox-bg border-b border-autox-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-autox-orange font-bold">
                Tailored Performance Tiers
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-1">
                Explore Categories
              </h2>
            </div>
            <Link
              to="/categories"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-autox-silver hover:text-autox-orange transition-colors"
            >
              <span>View All 10 Divisions</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/categories/${cat.slug}`}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-autox-border hover:border-autox-orange/60 transition-all duration-300 shadow-card"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-autox-orange font-bold">
                    {cat.productCount ? `${cat.productCount} Items` : 'Division'}
                  </span>
                  <h3 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-autox-orange transition-colors">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Trending & Best-Selling Catalog Section */}
      <section className="py-20 bg-gradient-to-b from-autox-bg via-autox-dark/50 to-autox-bg border-b border-autox-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-autox-orange font-bold">
                Engineered In Excellence
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-1">
                Precision Hardware
              </h2>
            </div>

            {/* Toggle Tabs */}
            <div className="inline-flex p-1 rounded-xl bg-autox-card border border-autox-border">
              <button
                onClick={() => setActiveTab('featured')}
                className={`px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeTab === 'featured'
                    ? 'bg-autox-orange text-white shadow-glow'
                    : 'text-autox-muted hover:text-white'
                }`}
              >
                Featured Releases
              </button>
              <button
                onClick={() => setActiveTab('bestsellers')}
                className={`px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeTab === 'bestsellers'
                    ? 'bg-autox-orange text-white shadow-glow'
                    : 'text-autox-muted hover:text-white'
                }`}
              >
                Best Sellers
              </button>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : displayedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-autox-muted">
              <p>No products currently available in this collection.</p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-autox-border hover:border-autox-orange text-white text-xs font-semibold uppercase tracking-wider bg-autox-card/60 hover:bg-autox-card transition-all"
            >
              <span>Explore Complete Catalog</span>
              <ArrowRight className="w-4 h-4 text-autox-orange" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Promotional Banner */}
      <section className="relative py-16 bg-gradient-to-r from-[#170a05] via-[#241108] to-[#0d1016] border-y border-autox-border overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1558441719-7f363dd780db?auto=format&fit=crop&w=1000&q=80"
            alt="Forged Performance Wheels"
            className="w-full h-full object-cover object-center filter grayscale"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-autox-orange/20 text-autox-orange border border-autox-orange/40">
              Limited Time Season Pass
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white mt-3 uppercase">
              Claim 10% Off Your First Build
            </h2>
            <p className="text-sm text-autox-silver mt-2 max-w-xl">
              Use promo code <strong className="text-autox-orange font-mono">AUTOX10</strong> at checkout on all aerodynamic spoilers, LED projector lighting, and racing instrumentation.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/shop"
              className="px-7 py-3.5 rounded-xl bg-autox-orange hover:bg-autox-orangeHover text-white text-xs font-semibold uppercase tracking-wider shadow-glow transition-all"
            >
              Apply Discount Now
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Why Choose AUTOX Engineering Pillars */}
      <section className="py-20 bg-autox-bg border-b border-autox-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-autox-orange font-bold">
              Automotive Integrity
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-1">
              Why Enthusiasts Trust AUTOX
            </h2>
            <p className="text-sm text-autox-muted mt-2">
              We engineer our catalogue with aerospace dry carbon fiber, high-precision telemetry, and transparent logistics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="glass-card p-6 rounded-2xl border border-autox-border flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-autox-orange/20 border border-autox-orange/30 flex items-center justify-center text-autox-orange mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">100% Verified Quality</h3>
              <p className="text-xs text-autox-muted leading-relaxed">
                Every aero wing and telemetry computer passes dimensional QA inspection before nationwide dispatch.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-autox-border flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-autox-orange/20 border border-autox-orange/30 flex items-center justify-center text-autox-orange mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">3D Virtual Fitting</h3>
              <p className="text-xs text-autox-muted leading-relaxed">
                Real-time WebGL shaders simulate exact finish, reflection, and fitment before placing an order.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-autox-border flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-autox-orange/20 border border-autox-orange/30 flex items-center justify-center text-autox-orange mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">Insured Delivery</h3>
              <p className="text-xs text-autox-muted leading-relaxed">
                Tracked consignments dispatched across Karachi, Lahore, Islamabad, and nationwide in reinforced packaging.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-autox-border flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-autox-orange/20 border border-autox-orange/30 flex items-center justify-center text-autox-orange mb-4">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">Enthusiast Support</h3>
              <p className="text-xs text-autox-muted leading-relaxed">
                Technical guidance from experienced track mechanics regarding offset, bolt pattern, and wiring specs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Customer Testimonials */}
      <section className="py-20 bg-autox-dark/40 border-b border-autox-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-autox-orange font-bold">
              Driver Feedback
            </span>
            <h2 className="text-3xl font-extrabold font-display text-white mt-1">
              Verified Testimonials
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-2xl border border-autox-border relative">
              <Quote className="w-8 h-8 text-autox-orange/30 mb-4" />
              <div className="flex text-amber-400 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-autox-silver italic leading-relaxed mb-6">
                "The 3K dry carbon GT wing fit like an OEM factory option on my track car. Zero flutter at 190 km/h, and delivery to Lahore was under 48 hours."
              </p>
              <div>
                <p className="text-sm font-bold text-white">Hamza Tariq</p>
                <p className="text-xs text-autox-muted font-mono">Civic X Turbo Track Build</p>
              </div>
            </div>

            <div className="glass-card p-8 rounded-2xl border border-autox-border relative">
              <Quote className="w-8 h-8 text-autox-orange/30 mb-4" />
              <div className="flex text-amber-400 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-autox-silver italic leading-relaxed mb-6">
                "I was skeptical about ordering forged wheels online, but AUTOX's 3D showroom gave me confidence in the concavity. The craftsmanship is flawless."
              </p>
              <div>
                <p className="text-sm font-bold text-white">Zainab Bilal</p>
                <p className="text-xs text-autox-muted font-mono">Golf GTI Enthusiast</p>
              </div>
            </div>

            <div className="glass-card p-8 rounded-2xl border border-autox-border relative">
              <Quote className="w-8 h-8 text-autox-orange/30 mb-4" />
              <div className="flex text-amber-400 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-autox-silver italic leading-relaxed mb-6">
                "Customer service verified my OBD2 protocol compatibility before sending the wireless HUD unit. Outstanding attention to detail."
              </p>
              <div>
                <p className="text-sm font-bold text-white">Saad Qureshi</p>
                <p className="text-xs text-autox-muted font-mono">Islamabad Car Club</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};

export default HomePage;

