import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Heart,
  Star,
  CheckCircle,
  Truck,
  Shield,
  RotateCcw,
  Box,
  Share2,
  Minus,
  Plus,
  Send,
  MessageSquare,
  Wrench,
  Sparkles,
  Check,
  Flame,
  Info,
  Clock,
  ArrowRight
} from 'lucide-react';
import { productService } from '../../services/productService';
import { reviewService } from '../../services/reviewService';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import ProductModelViewer from '../../three/ProductModelViewer';
import ProductCard from '../../components/products/ProductCard';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import PriceDisplay from '../../components/ui/PriceDisplay';
import StockIndicator from '../../components/ui/StockIndicator';
import { SectionHeading, EyebrowLabel } from '../../components/ui/Typography';
import { PrimaryButton, SecondaryButton } from '../../components/ui/Buttons';
import { generateBreadcrumbSchema, generateProductSchema } from '../../utils/schemaGenerator';
import { analytics } from '../../utils/analytics';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem, openDrawer } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [show3D, setShow3D] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'fitment' | 'shipping' | 'reviews'
  const [copiedLink, setCopiedLink] = useState(false);

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [ratingInput, setRatingInput] = useState(5);
  const [titleInput, setTitleInput] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Zoom feature state
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await productService.getProductBySlug(slug);
        if (res.success && res.data) {
          setProduct(res.data.product);
          setRelatedProducts(res.data.related || []);
          setSelectedImage(0);
          setQuantity(1);

          // Fetch reviews
          const revRes = await reviewService.getProductReviews(res.data.product._id);
          if (revRes.success && revRes.data) {
            setReviews(revRes.data);
          }

          analytics.viewItem(res.data.product);
        }
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomPos({ x, y });
  };

  const handleAddToCart = async () => {
    if (!product || product.stock < quantity) return;
    try {
      setAddingToCart(true);
      await addItem(product._id, quantity);
      analytics.addToCart(product, quantity);
      openDrawer();
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product || product.stock < quantity) return;
    try {
      setAddingToCart(true);
      await addItem(product._id, quantity);
      analytics.addToCart(product, quantity);
      navigate('/checkout');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on AUTOX Pakistan`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopiedLink(false), 2500);
      }
    } catch {
      // User cancelled share or clipboard denied
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please sign in to submit a verified review.');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await reviewService.createReview({
        productId: product._id,
        rating: ratingInput,
        title: titleInput,
        comment: commentInput
      });

      if (res.success) {
        toast.success('Your verified review has been published!');
        setReviews([res.data, ...reviews]);
        setReviewFormOpen(false);
        setTitleInput('');
        setCommentInput('');
      }
    } catch (err) {
      toast.error(err.message || 'Could not submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-autox-bg py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-square bg-autox-card rounded-2xl border border-autox-border" />
            <div className="space-y-6">
              <div className="h-6 w-32 bg-autox-card rounded" />
              <div className="h-12 w-3/4 bg-autox-card rounded" />
              <div className="h-8 w-48 bg-autox-card rounded" />
              <div className="h-28 bg-autox-card rounded" />
              <div className="h-14 w-full bg-autox-card rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-autox-bg">
        <h2 className="text-3xl font-extrabold font-display text-white mb-2 uppercase">
          Product Not Found
        </h2>
        <p className="text-sm text-autox-muted mb-6 max-w-md">
          The requested performance component is unavailable or may have been decommissioned.
        </p>
        <Link
          to="/shop"
          className="px-6 py-3 rounded-xl bg-autox-orange text-white text-xs font-mono uppercase font-bold tracking-wider hover:bg-autox-orangeHover transition-colors"
        >
          Return to Showroom
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product._id);
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    ...(product.category ? [{ label: product.category.name, href: `/categories/${product.category.slug}` }] : []),
    { label: product.name }
  ];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Shop', url: '/shop' },
    ...(product.category ? [{ name: product.category.name, url: `/categories/${product.category.slug}` }] : []),
    { name: product.name, url: `/product/${product.slug}` }
  ]);
  const productSchema = generateProductSchema(product);
  const currentImages = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80'];
  const activeImageUrl = currentImages[selectedImage] || currentImages[0];

  return (
    <div className="min-h-screen bg-autox-bg py-8">
      <SEO
        title={`${product.name} | AUTOX Pakistan`}
        description={
          product.shortDescription ||
          (product.description ? product.description.slice(0, 160) : `Buy ${product.name} in Pakistan. Authentic ${product.brand} automotive accessories with express shipping and cash on delivery in PKR.`)
        }
        canonical={`https://autox.pk/product/${product.slug}`}
        ogImage={activeImageUrl}
        type="product"
        keywords={`${product.name.toLowerCase()}, ${product.brand?.toLowerCase() || ''} accessories pakistan, ${product.category?.name || 'car accessories'} pkr`}
        schema={[breadcrumbSchema, productSchema]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-8">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Top Product Detail Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-16 border-b border-autox-border">
          {/* Left Media Column (7 Cols on desktop) */}
          <div className="lg:col-span-7 space-y-4">
            {show3D ? (
              <ProductModelViewer
                modelUrl={product.model3D}
                productName={product.name}
                fallbackImages={currentImages}
              />
            ) : (
              <div
                ref={imageRef}
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                onMouseMove={handleMouseMove}
                className="relative aspect-square sm:aspect-[4/3] lg:aspect-square bg-[#0c1017] rounded-2xl overflow-hidden border border-autox-border flex items-center justify-center p-8 group cursor-crosshair select-none"
              >
                {/* Subtle Luxury Studio Backlight */}
                <div className="absolute inset-0 bg-radial-gradient from-autox-orange/5 via-transparent to-transparent pointer-events-none" />

                {/* Primary Image with Interactive Zoom */}
                <img
                  src={activeImageUrl}
                  alt={product.name}
                  style={
                    isZooming
                      ? {
                          transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                          transform: 'scale(1.8)'
                        }
                      : { transform: 'scale(1)' }
                  }
                  className="max-h-[88%] max-w-[88%] object-contain filter contrast-105 transition-transform duration-200 pointer-events-none will-change-transform"
                />

                {/* Badges on Top of Image */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
                  {product.discountPercentage > 0 && (
                    <span className="px-3 py-1 rounded-md text-[11px] font-mono font-bold uppercase bg-autox-orange text-white shadow-glow">
                      -{product.discountPercentage}% OFF
                    </span>
                  )}
                  {product.isFeatured && (
                    <span className="px-3 py-1 rounded-md text-[11px] font-mono font-bold uppercase bg-autox-surface/90 border border-autox-border text-autox-orange flex items-center gap-1.5 backdrop-blur-md">
                      <Flame className="w-3.5 h-3.5" />
                      Track Flagship
                    </span>
                  )}
                </div>

                {/* Stock Indicator Top-Right */}
                <div className="absolute top-4 right-4 z-10">
                  <StockIndicator stock={product.stock} />
                </div>

                {/* Zoom Helper Pill */}
                <div className="absolute bottom-4 left-4 z-10 pointer-events-none bg-autox-bg/85 border border-autox-border/80 px-2.5 py-1 rounded-md text-[11px] font-mono text-autox-muted backdrop-blur-md flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-autox-orange" />
                  Hover to zoom • Studio 4K master
                </div>
              </div>
            )}

            {/* Media Gallery Controls Bar */}
            <div className="flex items-center justify-between gap-4 pt-1">
              {/* Thumbnails Row */}
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
                {currentImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedImage(idx);
                      setShow3D(false);
                    }}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-autox-card ${
                      !show3D && selectedImage === idx
                        ? 'border-autox-orange shadow-glow scale-105'
                        : 'border-autox-border hover:border-autox-muted/50 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* 3D Mode Toggle Switch */}
              <button
                onClick={() => setShow3D(!show3D)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all flex-shrink-0 ${
                  show3D
                    ? 'border-autox-orange bg-autox-orange text-white shadow-glow'
                    : 'border-autox-border bg-autox-card text-autox-silver hover:text-white hover:border-autox-orange/50'
                }`}
              >
                <Box className="w-4 h-4 text-autox-orange" />
                <span>{show3D ? 'View 2D Gallery' : 'Interactive 3D'}</span>
              </button>
            </div>
          </div>

          {/* Right Purchasing & Spec Column (5 Cols on desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              {/* Brand, Category Eyebrow & Actions */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <EyebrowLabel
                  text={`${product.brand || 'AUTOX'} • ${product.category?.name || 'Performance Gear'}`}
                  variant="orange"
                />

                <div className="flex items-center gap-1">
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-lg text-autox-muted hover:text-white hover:bg-autox-card transition-colors"
                    title="Share product"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => toggleWishlist(product._id)}
                    className={`p-2 rounded-lg transition-colors ${
                      isFavorited
                        ? 'text-autox-orange hover:bg-autox-orange/10'
                        : 'text-autox-muted hover:text-white hover:bg-autox-card'
                    }`}
                    title={isFavorited ? 'Saved in Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold font-display text-white uppercase tracking-tight leading-tight mb-3">
                {product.name}
              </h1>

              {/* Ratings & SKU Telemetry */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-autox-muted mb-6 pb-6 border-b border-autox-border">
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.round(product.ratingAverage || 5) ? 'fill-current' : 'opacity-25'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-white">
                  {product.ratingAverage ? Number(product.ratingAverage).toFixed(1) : '5.0'}
                </span>
                <span className="text-autox-muted">
                  ({product.ratingCount || reviews.length} verified ratings)
                </span>
                <span className="text-autox-border">•</span>
                <span className="px-2 py-0.5 rounded bg-autox-card border border-autox-border text-[11px]">
                  SKU: {product.SKU || 'ATX-GEN-01'}
                </span>
              </div>

              {/* Authoritative Price Display Card */}
              <div className="p-5 rounded-2xl bg-autox-card/80 border border-autox-border mb-6">
                <div className="flex items-baseline justify-between mb-2">
                  <PriceDisplay
                    price={product.price}
                    discountPercentage={product.discountPercentage}
                    size="xl"
                  />
                  <span className="text-[11px] font-mono uppercase tracking-wider text-autox-muted">
                    PKR Official Price
                  </span>
                </div>

                <div className="text-[11px] font-mono text-autox-muted flex items-center justify-between pt-3 border-t border-autox-border/60">
                  <span>Taxes Included • Cash on Delivery Eligible</span>
                  <span className="text-emerald-400 font-semibold">TCS / Leopard Tracked</span>
                </div>
              </div>

              {/* Short Engineering Description */}
              <p className="text-sm text-autox-silver leading-relaxed mb-6 font-sans">
                {product.description}
              </p>

              {/* Purchasing Controls */}
              <div className="space-y-3 pt-4 border-t border-autox-border">
                <div className="flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-autox-border rounded-xl bg-autox-card overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || product.stock <= 0}
                      className="px-3.5 py-3 text-autox-silver hover:text-white disabled:opacity-30 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 py-3 font-mono text-sm font-bold text-white min-w-[44px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock || product.stock <= 0}
                      className="px-3.5 py-3 text-autox-silver hover:text-white disabled:opacity-30 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add to Cart (Triggers Cart Drawer) */}
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0 || addingToCart}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-autox-orange hover:bg-autox-orangeHover text-white text-xs font-mono uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-50"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{addingToCart ? 'Securing Item...' : 'Add to Cart'}</span>
                  </button>
                </div>

                {/* Buy Now (Direct Checkout) */}
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0 || addingToCart}
                  className="w-full py-3 px-6 rounded-xl border border-autox-orange text-autox-orange hover:bg-autox-orange/10 text-xs font-mono uppercase font-bold tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span>Buy Now • Express Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Value Guarantees Grid */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-autox-border text-center">
              <div className="p-3 rounded-xl bg-autox-card/50 border border-autox-border">
                <Truck className="w-4 h-4 text-autox-orange mx-auto mb-1.5" />
                <span className="text-[11px] font-bold text-white block font-display">Fast Dispatch</span>
                <span className="text-[10px] text-autox-muted font-mono">24-48h Pakistan</span>
              </div>
              <div className="p-3 rounded-xl bg-autox-card/50 border border-autox-border">
                <Shield className="w-4 h-4 text-autox-orange mx-auto mb-1.5" />
                <span className="text-[11px] font-bold text-white block font-display">Genuine Pass</span>
                <span className="text-[10px] text-autox-muted font-mono">Track Certified</span>
              </div>
              <div className="p-3 rounded-xl bg-autox-card/50 border border-autox-border">
                <RotateCcw className="w-4 h-4 text-autox-orange mx-auto mb-1.5" />
                <span className="text-[11px] font-bold text-white block font-display">7-Day Guarantee</span>
                <span className="text-[10px] text-autox-muted font-mono">Fitment Assured</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Technical & Review Blueprint Section */}
        <div className="py-16 border-b border-autox-border">
          {/* Tab Navigation Pill Bar */}
          <div className="flex items-center gap-2 border-b border-autox-border pb-4 mb-8 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono uppercase font-bold tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'specs'
                  ? 'bg-autox-orange text-white shadow-glow'
                  : 'text-autox-muted hover:text-white bg-autox-card/40'
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab('fitment')}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono uppercase font-bold tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'fitment'
                  ? 'bg-autox-orange text-white shadow-glow'
                  : 'text-autox-muted hover:text-white bg-autox-card/40'
              }`}
            >
              Fitment & Engineering
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono uppercase font-bold tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'shipping'
                  ? 'bg-autox-orange text-white shadow-glow'
                  : 'text-autox-muted hover:text-white bg-autox-card/40'
              }`}
            >
              Logistics & Warranty (PKR)
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono uppercase font-bold tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'reviews'
                  ? 'bg-autox-orange text-white shadow-glow'
                  : 'text-autox-muted hover:text-white bg-autox-card/40'
              }`}
            >
              <span>Driver Reviews</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-autox-bg border border-autox-border">
                {reviews.length}
              </span>
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="min-h-[280px]">
            {/* Specs Tab */}
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold font-display uppercase text-white mb-4">
                    Component Dimensions & Tolerances
                  </h3>
                  <div className="rounded-2xl overflow-hidden border border-autox-border divide-y divide-autox-border bg-autox-card/40">
                    {product.specifications && product.specifications.length > 0 ? (
                      product.specifications.map((spec, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 text-xs font-mono">
                          <span className="text-autox-muted uppercase tracking-wider">{spec.key}</span>
                          <span className="text-white font-semibold">{spec.value}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-xs text-autox-muted font-mono">
                        Manufactured to OEM dimensional tolerances. Certified for track and street use.
                      </div>
                    )}
                    <div className="flex items-center justify-between p-4 text-xs font-mono">
                      <span className="text-autox-muted uppercase tracking-wider">Manufacturer / Brand</span>
                      <span className="text-autox-orange font-semibold">{product.brand}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 text-xs font-mono">
                      <span className="text-autox-muted uppercase tracking-wider">SKU Code</span>
                      <span className="text-white font-semibold">{product.SKU}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-display uppercase text-white mb-4">
                    Material & Finish Standards
                  </h3>
                  <div className="p-6 rounded-2xl border border-autox-border bg-autox-card/40 space-y-4 text-xs text-autox-silver leading-relaxed font-sans">
                    <p>
                      Every piece delivered by AUTOX undergoes stringent metallurgical and tensile testing. Surface coats utilize UV-inhibiting clear resination to resist extreme ultraviolet heat and weathering across Pakistan.
                    </p>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="p-3 rounded-xl bg-autox-bg border border-autox-border">
                        <span className="text-[10px] font-mono uppercase text-autox-muted block">Weather Resistance</span>
                        <span className="text-xs font-bold text-white font-display">IP68 Sealed / UV Stable</span>
                      </div>
                      <div className="p-3 rounded-xl bg-autox-bg border border-autox-border">
                        <span className="text-[10px] font-mono uppercase text-autox-muted block">Quality Pass</span>
                        <span className="text-xs font-bold text-emerald-400 font-display">ISO 9001 Certified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Fitment Tab */}
            {activeTab === 'fitment' && (
              <div className="max-w-3xl space-y-6">
                <div>
                  <h3 className="text-lg font-bold font-display uppercase text-white mb-2">
                    Vehicle Fitment & Installation Guide
                  </h3>
                  <p className="text-xs text-autox-muted leading-relaxed font-mono">
                    Designed for plug-and-play or direct bolt-on installation on supported chassis. Professional installation by a certified automotive technician is recommended.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border border-autox-border bg-autox-card/40 space-y-4">
                  <div className="flex items-start gap-3">
                    <Wrench className="w-5 h-5 text-autox-orange flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-white font-display uppercase">Bolt-On Compatibility</h4>
                      <p className="text-xs text-autox-silver mt-1">
                        Utilizes factory mounting points where applicable. No destructive cutting or welding required unless specifically noted for universal track splitters or custom exhaust manifolds.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pt-3 border-t border-autox-border/60">
                    <Info className="w-5 h-5 text-autox-orange flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-white font-display uppercase">Technical Support</h4>
                      <p className="text-xs text-autox-silver mt-1">
                        Unsure about compatibility with your specific model or facelift version? Contact our Karachi or Lahore support teams with your VIN or vehicle registration details for instant verification.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Shipping Tab */}
            {activeTab === 'shipping' && (
              <div className="max-w-3xl space-y-6">
                <div>
                  <h3 className="text-lg font-bold font-display uppercase text-white mb-2">
                    Nationwide Delivery & Payment Options
                  </h3>
                  <p className="text-xs text-autox-muted leading-relaxed font-mono">
                    All deliveries are handled via premier courier partners (TCS, Leopards, Call Courier) with real-time tracking numbers dispatched to your email and SMS.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl border border-autox-border bg-autox-card/40">
                    <span className="text-xs font-mono uppercase text-autox-orange font-bold">Standard Dispatch</span>
                    <h4 className="text-base font-bold font-display text-white mt-1">24 to 48 Hours</h4>
                    <p className="text-xs text-autox-silver mt-2">
                      Same-day dispatch for orders confirmed before 3:00 PM PKT across Lahore, Karachi, Islamabad, and Rawalpindi.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl border border-autox-border bg-autox-card/40">
                    <span className="text-xs font-mono uppercase text-autox-orange font-bold">Free Shipping</span>
                    <h4 className="text-base font-bold font-display text-white mt-1">Orders Over PKR 5,000</h4>
                    <p className="text-xs text-autox-silver mt-2">
                      All orders exceeding PKR 5,000 qualify automatically for 100% complimentary courier shipping nationwide.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold font-display uppercase text-white">
                      Verified Driver Feedback
                    </h3>
                    <p className="text-xs font-mono text-autox-muted mt-0.5">
                      {reviews.length} authentic reviews from verified AUTOX enthusiasts in Pakistan
                    </p>
                  </div>

                  <button
                    onClick={() => setReviewFormOpen(!reviewFormOpen)}
                    className="px-5 py-2.5 rounded-xl bg-autox-card hover:bg-autox-cardHover border border-autox-border text-white text-xs font-mono uppercase tracking-wider transition-colors self-start sm:self-auto"
                  >
                    {reviewFormOpen ? 'Close Form' : 'Write a Review'}
                  </button>
                </div>

                {/* Review Submission Form */}
                <AnimatePresence>
                  {reviewFormOpen && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleReviewSubmit}
                      className="p-6 rounded-2xl border border-autox-orange/40 bg-autox-card/60 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-display font-bold uppercase text-white">
                          Submit Verified Telemetry Review
                        </span>
                        {/* Rating Star Selector */}
                        <div className="flex items-center gap-1 text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              type="button"
                              key={s}
                              onClick={() => setRatingInput(s)}
                              className="focus:outline-none p-1 hover:scale-110 transition-transform"
                            >
                              <Star
                                className={`w-4 h-4 ${s <= ratingInput ? 'fill-current' : 'opacity-25'}`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <input
                          type="text"
                          value={titleInput}
                          onChange={(e) => setTitleInput(e.target.value)}
                          placeholder="Headline (e.g. Flawless carbon weave & precise fitment)"
                          required
                          className="w-full bg-autox-bg border border-autox-border rounded-xl px-4 py-2.5 text-xs text-white placeholder-autox-muted focus:outline-none focus:border-autox-orange font-mono"
                        />
                      </div>

                      <div>
                        <textarea
                          rows={4}
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          placeholder="Detail your fitting experience, performance gains, and vehicle feel..."
                          required
                          className="w-full bg-autox-bg border border-autox-border rounded-xl px-4 py-2.5 text-xs text-white placeholder-autox-muted focus:outline-none focus:border-autox-orange"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setReviewFormOpen(false)}
                          className="px-4 py-2 text-xs font-mono uppercase text-autox-muted hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submittingReview}
                          className="px-6 py-2.5 rounded-xl bg-autox-orange text-white text-xs font-mono uppercase font-bold tracking-wider shadow-glow hover:bg-autox-orangeHover disabled:opacity-50 flex items-center gap-2"
                        >
                          <span>{submittingReview ? 'Transmitting...' : 'Post Verified Review'}</span>
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Reviews List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reviews.length > 0 ? (
                    reviews.map((rev) => (
                      <div
                        key={rev._id}
                        className="p-5 rounded-2xl border border-autox-border bg-autox-card/40 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-autox-orange/20 border border-autox-orange/40 flex items-center justify-center font-bold text-xs text-autox-orange uppercase font-mono">
                              {rev.user?.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <span className="text-xs font-bold text-white block font-display">
                                {rev.user?.name || 'Verified Driver'}
                              </span>
                              <span className="text-[10px] font-mono text-emerald-400">
                                ✓ Verified Purchase
                              </span>
                            </div>
                          </div>

                          <div className="flex text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < rev.rating ? 'fill-current' : 'opacity-25'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <h4 className="text-sm font-bold text-white font-display uppercase">{rev.title}</h4>
                        <p className="text-xs text-autox-silver leading-relaxed font-sans">{rev.comment}</p>
                        <span className="text-[10px] font-mono text-autox-muted block pt-1">
                          {new Date(rev.createdAt).toLocaleDateString('en-PK', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full p-8 rounded-2xl text-center border border-autox-border bg-autox-card/30 text-autox-muted">
                      <MessageSquare className="w-8 h-8 text-autox-muted mx-auto mb-2 opacity-40" />
                      <p className="text-xs font-mono">
                        No telemetry reviews logged yet for this item. Be the first verified driver to submit track feedback!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Complementary Upgrades / Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-16">
            <SectionHeading
              eyebrow="Telemetry & Pairing"
              title="Complementary Upgrades"
              subtitle="Engineered to complement your setup for optimal track balance and aesthetic synergy."
            />

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8">
              {relatedProducts.slice(0, 4).map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
