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
  Quote,
  HelpCircle,
  CheckCircle2,
  Compass,
  Layers,
  Zap,
  Box
} from 'lucide-react';
import { motion } from 'framer-motion';
import InteractiveHeroCar from '../../three/InteractiveHeroCar';
import ProductCard from '../../components/products/ProductCard';
import QuickViewModal from '../../components/products/QuickViewModal';
import CategoryCard from '../../components/ui/CategoryCard';
import { ProductCardSkeleton } from '../../components/common/LoadingSkeleton';
import { PrimaryButton, SecondaryButton } from '../../components/ui/Buttons';
import { SectionHeading, EyebrowLabel } from '../../components/ui/Typography';
import RevealOnScroll from '../../components/ui/RevealOnScroll';
import AnimatedCounter from '../../components/ui/AnimatedCounter';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import SEO from '../../components/common/SEO';
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateFAQSchema
} from '../../utils/schemaGenerator';

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

  const homeFaqs = [
    {
      question: 'What automotive accessories does AUTOX offer in Pakistan?',
      answer: 'AUTOX offers verified high-performance automotive accessories including aerodynamic carbon fiber body kits, laser-fit 3D floor mats, 4K dual dashcams, LED Matrix projector headlights, forged alloy wheels, and detailing care across Pakistan.'
    },
    {
      question: 'Does AUTOX support Cash on Delivery (COD)?',
      answer: 'Yes, AUTOX supports nationwide Cash on Delivery (COD) across Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, and major cities across Pakistan.'
    },
    {
      question: 'How fast is delivery for car accessories in Pakistan?',
      answer: 'Orders for metropolitan hubs (Islamabad, Rawalpindi, Lahore, Karachi) are dispatched via express courier within 24 to 48 hours. Regional deliveries typically arrive within 2 to 4 business days.'
    },
    {
      question: 'Can I preview accessories in 3D before purchasing?',
      answer: 'Yes, AUTOX features a real-time Three.js 3D Virtual Showroom where drivers can inspect aerodynamic components, rims, and body accents from 360-degree interactive camera angles.'
    }
  ];

  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();
  const faqSchema = generateFAQSchema(homeFaqs);

  return (
    <div className="flex flex-col min-h-screen bg-autox-bg text-autox-text selection:bg-autox-orange selection:text-white">
      <SEO
        title="AUTOX | Premium Car Accessories & High-Performance Upgrades Pakistan"
        description="Pakistan's premier high-performance car accessories store. Interactive 3D showroom, laser-fit floor mats, carbon aero kits, LED headlights, dashcams, and fast nationwide delivery."
        canonical="https://autox.pk/"
        keywords="car accessories pakistan, online car parts lahore karachi islamabad, auto accessories online pkr, 3d car showroom, led projector headlights pakistan, forged wheels"
        schema={[organizationSchema, websiteSchema, faqSchema]}
      />

      {/* ========================================================
          SECTION 1 — CINEMATIC HERO (Interactive 3D / Fallback)
          ======================================================== */}
      <InteractiveHeroCar />

      {/* ========================================================
          SECTION 2 — BRAND EDITORIAL STATEMENT
          ======================================================== */}
      <section className="py-20 sm:py-28 bg-autox-surface border-y border-autox-border relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <RevealOnScroll>
            <EyebrowLabel icon={Sparkles} className="mb-4">
              The Performance Philosophy
            </EyebrowLabel>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold uppercase tracking-tight text-white leading-tight">
              ENGINEERED FOR <span className="text-autox-orange">YOUR DRIVE.</span>
            </h2>
            <p className="mt-6 text-base sm:text-xl text-autox-silver font-sans leading-relaxed max-w-3xl mx-auto">
              Every detail matters. We bridge aerospace autoclave carbon fiber, real-time 3D WebGL telemetry, and verified Pakistani performance logistics. Designed for enthusiasts who refuse ordinary.
            </p>

            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-autox-border/60">
              <div>
                <span className="text-3xl sm:text-4xl font-extrabold font-display text-white">
                  <AnimatedCounter to={10} suffix="+" />
                </span>
                <p className="text-xs font-mono uppercase tracking-wider text-autox-muted mt-1">
                  Equipment Divisions
                </p>
              </div>
              <div>
                <span className="text-3xl sm:text-4xl font-extrabold font-display text-autox-orange">
                  <AnimatedCounter to={30} suffix="+" />
                </span>
                <p className="text-xs font-mono uppercase tracking-wider text-autox-muted mt-1">
                  Verified Upgrades
                </p>
              </div>
              <div>
                <span className="text-3xl sm:text-4xl font-extrabold font-display text-white">
                  100%
                </span>
                <p className="text-xs font-mono uppercase tracking-wider text-autox-muted mt-1">
                  PKR Local Currency
                </p>
              </div>
              <div>
                <span className="text-3xl sm:text-4xl font-extrabold font-display text-autox-orange">
                  <AnimatedCounter to={48} suffix="h" />
                </span>
                <p className="text-xs font-mono uppercase tracking-wider text-autox-muted mt-1">
                  Express Hub Dispatch
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ========================================================
          SECTION 3 — FEATURED CATEGORIES
          ======================================================== */}
      <section className="py-24 bg-autox-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <EyebrowLabel icon={Layers} className="mb-2">
                Catalog Architecture
              </EyebrowLabel>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold uppercase text-white tracking-tight mt-1">
                Equipment <span className="text-autox-orange">Divisions</span>
              </h2>
              <p className="text-xs sm:text-sm text-autox-muted mt-2 font-sans">
                Aerodynamics, cockpit telemetry, forged alloys, and high-lumen optical systems.
              </p>
            </div>

            <Link to="/categories" className="mt-4 md:mt-0">
              <SecondaryButton icon={ArrowRight} size="sm">
                Explore All 10 Divisions
              </SecondaryButton>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <RevealOnScroll key={cat._id} delay={0.1}>
                <CategoryCard category={cat} />
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 4 — FEATURED PRODUCTS (Actual PKR Catalog)
          ======================================================== */}
      <section className="py-24 bg-autox-surface border-y border-autox-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <div>
              <EyebrowLabel icon={Zap} className="mb-2">
                Curated Components
              </EyebrowLabel>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold uppercase text-white tracking-tight mt-1">
                Precision <span className="text-autox-orange">Hardware</span>
              </h2>
              <p className="text-xs sm:text-sm text-autox-muted mt-2 font-sans">
                Track-tested components with verified dimensional tolerances in Pakistani Rupees (₨).
              </p>
            </div>

            {/* Toggle Tabs */}
            <div className="inline-flex p-1 rounded-xl bg-autox-dark border border-autox-border">
              <button
                onClick={() => setActiveTab('featured')}
                className={`px-5 py-2 rounded-lg text-xs font-display font-bold uppercase tracking-wider transition-all ${
                  activeTab === 'featured'
                    ? 'bg-autox-orange text-white shadow-glow'
                    : 'text-autox-muted hover:text-white'
                }`}
              >
                Featured Upgrades
              </button>
              <button
                onClick={() => setActiveTab('bestsellers')}
                className={`px-5 py-2 rounded-lg text-xs font-display font-bold uppercase tracking-wider transition-all ${
                  activeTab === 'bestsellers'
                    ? 'bg-autox-orange text-white shadow-glow'
                    : 'text-autox-muted hover:text-white'
                }`}
              >
                Track Bestsellers
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
              <p>No accessories currently available in this filter.</p>
            </div>
          )}

          <div className="mt-14 text-center">
            <Link to="/shop">
              <PrimaryButton icon={ArrowRight} size="lg">
                Explore Full Equipment Catalog
              </PrimaryButton>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 5 — IMMERSIVE 3D SHOWROOM SPOTLIGHT
          ======================================================== */}
      <section className="py-24 bg-autox-bg relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-autox-surface via-[#141820] to-[#0d1015] border border-autox-border p-8 sm:p-14 relative overflow-hidden shadow-2xl">
            {/* Background Graphic Accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-autox-orange/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <EyebrowLabel icon={Compass} className="mb-4">
                  Real-Time WebGL Telemetry
                </EyebrowLabel>

                <h2 className="text-3xl sm:text-5xl font-display font-extrabold uppercase text-white tracking-tight leading-tight">
                  3D VIRTUAL <br />
                  <span className="text-autox-orange">SHOWROOM LAB</span>
                </h2>

                <p className="mt-4 text-sm sm:text-base text-autox-silver leading-relaxed font-sans max-w-lg">
                  Inspect racing aerodynamics, titanium valvetronic exhausts, and forged monoblock wheels in real-time browser 3D. Rotate 360 degrees and test studio lighting presets before ordering.
                </p>

                {/* Lighting Presets Preview */}
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <span className="text-xs font-mono uppercase text-autox-muted mr-1">
                    Environment Presets:
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-autox-card border border-autox-border text-xs font-mono text-white">
                    MIDNIGHT
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-autox-card border border-autox-border text-xs font-mono text-autox-orange border-autox-orange/40">
                    SUNSET
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-autox-card border border-autox-border text-xs font-mono text-cyan-400">
                    CYBER NOIR
                  </span>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <Link to="/showroom">
                    <PrimaryButton icon={Compass} size="lg">
                      Launch 3D Configurator
                    </PrimaryButton>
                  </Link>
                  <Link to="/shop">
                    <SecondaryButton icon={ArrowRight} size="lg">
                      View Hardware Specs
                    </SecondaryButton>
                  </Link>
                </div>
              </div>

              {/* Showroom Visual Spotlight */}
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-autox-border shadow-2xl group bg-autox-dark">
                <img
                  src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80"
                  alt="AUTOX 3D Showroom Simulation"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter contrast-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-white bg-black/60 backdrop-blur-md p-3 rounded-xl border border-autox-border">
                  <span className="flex items-center gap-2">
                    <Box className="w-4 h-4 text-autox-orange" />
                    360° Interactive Free Camera
                  </span>
                  <span className="text-autox-orange font-bold uppercase">Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 6 — EDITORIAL MAGAZINE PRODUCT FEATURE
          ======================================================== */}
      <section className="py-24 bg-autox-surface border-y border-autox-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Visual Photography */}
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-autox-border shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80"
                alt="Aerodynamics Dry Carbon Wing"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded bg-black/80 backdrop-blur-md text-[11px] font-mono uppercase tracking-wider text-autox-orange border border-autox-orange/30">
                  Track Engineering Series
                </span>
              </div>
            </div>

            {/* Editorial Copy */}
            <div>
              <EyebrowLabel icon={Sparkles} className="mb-4">
                Materials Science
              </EyebrowLabel>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold uppercase text-white tracking-tight leading-tight">
                AERODYNAMICS <br />
                <span className="text-autox-orange">AUTOCLAVE CURED.</span>
              </h2>

              <p className="mt-4 text-sm sm:text-base text-autox-silver font-sans leading-relaxed">
                Vacuum-bagged 3K Toray dry carbon fiber engineered for minimal turbulence and verified high-speed downforce on Pakistani motorways. Zero synthetic filler, zero resin yellowing.
              </p>

              <div className="mt-6 space-y-3 font-mono text-xs text-autox-silver">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-autox-orange" />
                  <span>3K Pre-Preg Autoclave Dry Carbon Construction</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-autox-orange" />
                  <span>Sub-3.2kg total structural wing weight</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-autox-orange" />
                  <span>Chassis-specific CNC billet mounting brackets</span>
                </div>
              </div>

              <div className="mt-8">
                <Link to="/categories/exterior-accessories">
                  <PrimaryButton icon={ArrowRight} size="md">
                    Inspect Aero Program
                  </PrimaryButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 7 — BRAND CAPABILITIES (Verified Policies)
          ======================================================== */}
      <section className="py-24 bg-autox-bg border-b border-autox-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Commercial Assurance"
            title="The AUTOX"
            highlight="Standard"
            subtitle="Authoritative Pakistani Rupees pricing, rapid express logistics, and dedicated mechanical compatibility verification."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-autox-orange/15 border border-autox-orange/30 flex items-center justify-center text-autox-orange mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2 uppercase">Verified Specs</h3>
                <p className="text-xs text-autox-muted leading-relaxed font-sans">
                  Every product is cataloged with exact millimeter dimensions, bolt patterns, and protocol compatibility.
                </p>
              </div>
              <span className="text-[10px] font-mono text-autox-orange mt-6 uppercase tracking-wider">
                100% Genuine
              </span>
            </div>

            <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-autox-orange/15 border border-autox-orange/30 flex items-center justify-center text-autox-orange mb-4">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2 uppercase">Express Logistics</h3>
                <p className="text-xs text-autox-muted leading-relaxed font-sans">
                  24–48h courier dispatch to Islamabad, Rawalpindi, Lahore, and Karachi in reinforced protective packaging.
                </p>
              </div>
              <span className="text-[10px] font-mono text-autox-orange mt-6 uppercase tracking-wider">
                Nationwide Tracking
              </span>
            </div>

            <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-autox-orange/15 border border-autox-orange/30 flex items-center justify-center text-autox-orange mb-4">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2 uppercase">Cash on Delivery</h3>
                <p className="text-xs text-autox-muted leading-relaxed font-sans">
                  Inspect your parcel upon courier arrival before paying in Pakistani Rupees (₨) across all major cities.
                </p>
              </div>
              <span className="text-[10px] font-mono text-autox-orange mt-6 uppercase tracking-wider">
                COD Supported
              </span>
            </div>

            <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-autox-orange/15 border border-autox-orange/30 flex items-center justify-center text-autox-orange mb-4">
                  <Wrench className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2 uppercase">Mechanic Support</h3>
                <p className="text-xs text-autox-muted leading-relaxed font-sans">
                  Technical guidance from experienced track mechanics regarding offset, bolt pattern, and wiring specs.
                </p>
              </div>
              <span className="text-[10px] font-mono text-autox-orange mt-6 uppercase tracking-wider">
                Mon - Sat 9am-9pm
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 8 — CUSTOMER REVIEWS (Verified Pakistani Drivers)
          ======================================================== */}
      <section className="py-24 bg-autox-surface border-b border-autox-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Driver Feedback"
            title="Verified"
            highlight="Testimonials"
            subtitle="Real experiences from Pakistani sports sedan owners and track enthusiasts."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-2xl relative flex flex-col justify-between">
              <div>
                <Quote className="w-8 h-8 text-autox-orange/30 mb-4" />
                <div className="flex text-amber-400 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-autox-silver italic leading-relaxed mb-6 font-sans">
                  "The 3K dry carbon GT wing fit like an OEM factory option on my track car. Zero flutter at 190 km/h, and delivery to Lahore was under 48 hours."
                </p>
              </div>
              <div className="pt-4 border-t border-autox-border">
                <p className="text-sm font-bold font-display text-white">Hamza Tariq</p>
                <p className="text-xs text-autox-muted font-mono">Civic X Turbo Track Build • Lahore</p>
              </div>
            </div>

            <div className="glass-card p-8 rounded-2xl relative flex flex-col justify-between">
              <div>
                <Quote className="w-8 h-8 text-autox-orange/30 mb-4" />
                <div className="flex text-amber-400 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-autox-silver italic leading-relaxed mb-6 font-sans">
                  "I was skeptical about ordering forged wheels online, but AUTOX's 3D showroom gave me confidence in the concavity. The finish is flawless."
                </p>
              </div>
              <div className="pt-4 border-t border-autox-border">
                <p className="text-sm font-bold font-display text-white">Zainab Bilal</p>
                <p className="text-xs text-autox-muted font-mono">Golf GTI Enthusiast • Islamabad</p>
              </div>
            </div>

            <div className="glass-card p-8 rounded-2xl relative flex flex-col justify-between">
              <div>
                <Quote className="w-8 h-8 text-autox-orange/30 mb-4" />
                <div className="flex text-amber-400 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-autox-silver italic leading-relaxed mb-6 font-sans">
                  "Customer service verified my OBD2 protocol compatibility before sending the wireless HUD unit. Outstanding attention to detail."
                </p>
              </div>
              <div className="pt-4 border-t border-autox-border">
                <p className="text-sm font-bold font-display text-white">Saad Qureshi</p>
                <p className="text-xs text-autox-muted font-mono">Islamabad Car Club • Rawalpindi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          AEO KNOWLEDGE & FAQ SECTION (Answer Engine Optimization)
          ======================================================== */}
      <section className="py-24 bg-autox-bg border-b border-autox-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Knowledge & FAQs"
            eyebrowIcon={HelpCircle}
            title="Driver"
            highlight="Intelligence"
            subtitle="Authoritative answers on Pakistani fitment, order dispatch, and 3D previewing."
          />

          <div className="space-y-4">
            {homeFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-autox-surface border border-autox-border hover:border-autox-orange/40 transition-colors"
              >
                <h3 className="text-base font-display font-bold text-white mb-2 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-autox-orange flex-shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-xs sm:text-sm text-autox-silver leading-relaxed pl-6.5 font-sans">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 9 — FINAL CALL TO ACTION
          ======================================================== */}
      <section className="py-28 bg-gradient-to-b from-autox-surface via-[#141820] to-autox-bg relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-autox-orange/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <EyebrowLabel icon={Sparkles} className="mb-4">
            Take Command
          </EyebrowLabel>

          <h2 className="text-4xl sm:text-6xl font-display font-extrabold uppercase text-white tracking-tight leading-tight">
            YOUR DRIVE. YOUR STYLE. <br />
            <span className="text-autox-orange">YOUR AUTOX.</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-autox-silver max-w-xl mx-auto font-sans leading-relaxed">
            Upgrade your vehicle with authentic high-performance accessories. 3D interactive previewing, nationwide express delivery, and cash on delivery in PKR.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/shop">
              <PrimaryButton icon={ArrowRight} size="lg">
                Explore The Collection
              </PrimaryButton>
            </Link>
            <Link to="/showroom">
              <SecondaryButton icon={Compass} size="lg">
                Launch 3D Showroom
              </SecondaryButton>
            </Link>
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
