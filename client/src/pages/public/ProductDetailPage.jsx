import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  Star,
  CheckCircle,
  Truck,
  Shield,
  RotateCcw,
  Box,
  ChevronRight,
  Share2,
  Minus,
  Plus,
  Send,
  MessageSquare
} from 'lucide-react';
import { productService } from '../../services/productService';
import { reviewService } from '../../services/reviewService';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import ProductModelViewer from '../../three/ProductModelViewer';
import ProductCard from '../../components/products/ProductCard';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [show3D, setShow3D] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [ratingInput, setRatingInput] = useState(5);
  const [titleInput, setTitleInput] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

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

  const handleAddToCart = async () => {
    if (!product || product.stock < quantity) return;
    try {
      setAddingToCart(true);
      await addItem(product._id, quantity);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product || product.stock < quantity) return;
    try {
      setAddingToCart(true);
      await addItem(product._id, quantity);
      navigate('/checkout');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please sign in to submit a review.');
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-autox-card rounded-2xl" />
          <div className="space-y-4">
            <div className="h-6 w-32 bg-autox-card rounded" />
            <div className="h-10 w-3/4 bg-autox-card rounded" />
            <div className="h-8 w-40 bg-autox-card rounded" />
            <div className="h-32 bg-autox-card rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold font-display text-white mb-2">Product Not Found</h2>
        <p className="text-xs text-autox-muted mb-6">The requested performance accessory could not be found.</p>
        <Link to="/shop" className="px-6 py-2.5 rounded-xl bg-autox-orange text-white text-xs font-semibold uppercase">
          Return to Shop
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product._id);
  const discountedPrice = product.discountPercentage > 0
    ? Math.round(product.price * (1 - product.discountPercentage / 100))
    : product.price;

  return (
    <div className="min-h-screen bg-autox-bg py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-mono text-autox-muted mb-8">
          <Link to="/" className="hover:text-white">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/shop" className="hover:text-white">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          {product.category && (
            <>
              <Link to={`/categories/${product.category.slug}`} className="hover:text-white">
                {product.category.name}
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
            </>
          )}
          <span className="text-autox-silver truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Top Product Detail Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-16 border-b border-autox-border">
          {/* Left Media Column (3D Viewer / Gallery) */}
          <div className="space-y-4">
            {show3D ? (
              <ProductModelViewer
                modelUrl={product.model3D}
                productName={product.name}
                fallbackImages={product.images}
              />
            ) : (
              <div className="relative aspect-square bg-[#0c1017] rounded-3xl overflow-hidden border border-autox-border flex items-center justify-center p-6 group">
                <img
                  src={product.images[selectedImage] || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80'}
                  alt={product.name}
                  className="max-h-[85%] max-w-[85%] object-contain group-hover:scale-105 transition-transform duration-500 filter contrast-110"
                />

                {product.discountPercentage > 0 && (
                  <span className="absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-bold uppercase bg-autox-orange text-white shadow-glow">
                    -{product.discountPercentage}% OFF
                  </span>
                )}
              </div>
            )}

            {/* Toggle 3D vs 2D Gallery Button & Thumbnails */}
            <div className="flex items-center justify-between gap-4">
              {/* Thumbnails */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.images?.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedImage(idx);
                      setShow3D(false);
                    }}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-autox-card ${
                      !show3D && selectedImage === idx
                        ? 'border-autox-orange shadow-glow'
                        : 'border-autox-border hover:border-autox-silver/60'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* 3D Mode Toggle Switch */}
              <button
                onClick={() => setShow3D(!show3D)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all flex-shrink-0 ${
                  show3D
                    ? 'border-autox-orange bg-autox-orange text-white shadow-glow'
                    : 'border-autox-border bg-autox-card text-autox-silver hover:text-white hover:border-autox-orange/60'
                }`}
              >
                <Box className="w-4 h-4" />
                <span>{show3D ? '2D Gallery' : 'Interactive 3D'}</span>
              </button>
            </div>
          </div>

          {/* Right Product Specifications & Purchasing Column */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Brand and SKU header */}
              <div className="flex items-center justify-between text-xs font-mono text-autox-muted mb-2">
                <span className="text-autox-orange font-bold uppercase tracking-wider">
                  {product.brand} Performance
                </span>
                <span className="bg-autox-card px-2.5 py-1 rounded-md border border-autox-border">
                  SKU: {product.SKU}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-wide mb-3 uppercase">
                {product.name}
              </h1>

              {/* Ratings and Reviews count */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(product.ratingAverage || 5) ? 'fill-current' : 'opacity-30'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-white">
                  {product.ratingAverage || '5.0'} / 5.0
                </span>
                <span className="text-xs text-autox-muted">
                  ({product.ratingCount || reviews.length} verified reviews)
                </span>
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-autox-card/60 border border-autox-border mb-6 flex items-center justify-between">
                <div>
                  <div className="text-xs text-autox-muted font-mono uppercase">Authoritative Price (PKR)</div>
                  <div className="text-3xl font-extrabold font-display text-white">
                    PKR {discountedPrice.toLocaleString()}
                  </div>
                  {product.discountPercentage > 0 && (
                    <div className="text-xs text-autox-muted line-through mt-0.5">
                      PKR {product.price.toLocaleString()} (Save {product.discountPercentage}%)
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase ${
                      product.stock > 0
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-red-500/20 text-red-400 border border-red-500/40'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{product.stock > 0 ? `${product.stock} Units In Stock` : 'Sold Out'}</span>
                  </span>
                </div>
              </div>

              {/* Short Description */}
              <p className="text-sm text-autox-silver leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Quantity Selector & Add Actions */}
              <div className="space-y-4 pt-4 border-t border-autox-border">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-autox-border rounded-xl bg-autox-card overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || product.stock <= 0}
                      className="px-3.5 py-2.5 text-autox-silver hover:text-white disabled:opacity-40"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-mono text-sm font-bold text-white min-w-[40px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock || product.stock <= 0}
                      className="px-3.5 py-2.5 text-autox-silver hover:text-white disabled:opacity-40"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0 || addingToCart}
                    className="flex-1 py-3.5 rounded-xl bg-autox-orange hover:bg-autox-orangeHover text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-50"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{addingToCart ? 'Adding to Cart...' : 'Add to Cart'}</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product._id)}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isFavorited
                        ? 'border-autox-orange bg-autox-orange/20 text-autox-orange'
                        : 'border-autox-border bg-autox-card text-autox-silver hover:text-white'
                    }`}
                    title={isFavorited ? 'Saved in Wishlist' : 'Save to Wishlist'}
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Direct Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0 || addingToCart}
                  className="w-full py-3.5 rounded-xl border border-autox-orange hover:bg-autox-orange/10 text-autox-orange text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  Buy Now with Express Checkout
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-autox-border/60 text-center mt-6">
                <div className="p-3 rounded-xl bg-autox-card/40 border border-autox-border/40">
                  <Truck className="w-5 h-5 text-autox-orange mx-auto mb-1.5" />
                  <span className="text-[11px] font-bold text-white block">Tracked Dispatch</span>
                  <span className="text-[10px] text-autox-muted">Nationwide Pakistan</span>
                </div>
                <div className="p-3 rounded-xl bg-autox-card/40 border border-autox-border/40">
                  <Shield className="w-5 h-5 text-autox-orange mx-auto mb-1.5" />
                  <span className="text-[11px] font-bold text-white block">Authenticity Pass</span>
                  <span className="text-[10px] text-autox-muted">100% Genuine Gear</span>
                </div>
                <div className="p-3 rounded-xl bg-autox-card/40 border border-autox-border/40">
                  <RotateCcw className="w-5 h-5 text-autox-orange mx-auto mb-1.5" />
                  <span className="text-[11px] font-bold text-white block">7-Day Return</span>
                  <span className="text-[10px] text-autox-muted">Hassle-Free Policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications & Review Tabs */}
        <div className="py-16 border-b border-autox-border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Technical Specifications Table */}
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-autox-orange font-bold">
                Engineering Blueprint
              </span>
              <h2 className="text-2xl font-bold font-display text-white mt-1 mb-6">
                Technical Specifications
              </h2>

              <div className="glass-card rounded-2xl overflow-hidden border border-autox-border divide-y divide-autox-border">
                {product.specifications && product.specifications.length > 0 ? (
                  product.specifications.map((spec, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 text-xs font-mono">
                      <span className="text-autox-muted uppercase tracking-wider">{spec.key}</span>
                      <span className="text-white font-semibold">{spec.value}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-xs text-autox-muted">
                    Standard engineering tolerances apply. Inquire with technical support for bespoke dimensional cad drawings.
                  </div>
                )}
                <div className="flex items-center justify-between p-4 text-xs font-mono">
                  <span className="text-autox-muted uppercase tracking-wider">Primary Currency</span>
                  <span className="text-white font-semibold">Pakistani Rupees (PKR ₨)</span>
                </div>
                <div className="flex items-center justify-between p-4 text-xs font-mono">
                  <span className="text-autox-muted uppercase tracking-wider">Quality Assurance</span>
                  <span className="text-emerald-400 font-semibold">AUTOX Track Certified</span>
                </div>
              </div>
            </div>

            {/* Verified Buyer Reviews & Review Form */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-autox-orange font-bold">
                    Community Telemetry
                  </span>
                  <h2 className="text-2xl font-bold font-display text-white mt-1">
                    Verified Customer Reviews
                  </h2>
                </div>

                <button
                  onClick={() => setReviewFormOpen(!reviewFormOpen)}
                  className="px-4 py-2 rounded-xl bg-autox-card hover:bg-autox-cardHover border border-autox-border text-white text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Write Review
                </button>
              </div>

              {/* Review Submission Form Drawer */}
              {reviewFormOpen && (
                <form
                  onSubmit={handleReviewSubmit}
                  className="glass-card p-6 rounded-2xl border border-autox-orange/40 mb-6 space-y-4 animate-in fade-in duration-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-display font-bold uppercase text-white">
                      Submit Verified Purchase Review
                    </span>
                    {/* Star selector */}
                    <div className="flex items-center gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => setRatingInput(s)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              s <= ratingInput ? 'fill-current' : 'opacity-30'
                            }`}
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
                      placeholder="Headline (e.g. Exceptional Build Quality)"
                      required
                      className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-2.5 text-xs text-white placeholder-autox-muted focus:outline-none focus:border-autox-orange"
                    />
                  </div>

                  <div>
                    <textarea
                      rows={3}
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Detail your fitting experience, build finish, and performance results..."
                      required
                      className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-2.5 text-xs text-white placeholder-autox-muted focus:outline-none focus:border-autox-orange"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setReviewFormOpen(false)}
                      className="px-4 py-2 rounded-lg text-xs font-mono uppercase text-autox-muted hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="px-5 py-2 rounded-lg bg-autox-orange text-white text-xs font-semibold uppercase tracking-wider shadow-glow hover:bg-autox-orangeHover disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <span>{submittingReview ? 'Submitting...' : 'Post Review'}</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <div key={rev._id} className="glass-card p-5 rounded-2xl border border-autox-border space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-autox-orange/20 border border-autox-orange/40 flex items-center justify-center font-bold text-xs text-autox-orange uppercase">
                            {rev.user?.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">{rev.user?.name || 'Verified Customer'}</span>
                            <span className="text-[10px] font-mono text-emerald-400">✓ Verified Buyer</span>
                          </div>
                        </div>

                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating ? 'fill-current' : 'opacity-30'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-white font-display">{rev.title}</h4>
                      <p className="text-xs text-autox-silver leading-relaxed">{rev.comment}</p>
                      <span className="text-[10px] font-mono text-autox-muted block pt-1">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="glass-card p-8 rounded-2xl text-center border border-autox-border text-autox-muted">
                    <MessageSquare className="w-8 h-8 text-autox-muted mx-auto mb-2 opacity-50" />
                    <p className="text-xs">No reviews have been published for this item yet. Be the first verified buyer to submit feedback!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="pt-16">
            <span className="text-xs font-mono uppercase tracking-widest text-autox-orange font-bold">
              Complementary Equipment
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1 mb-8">
              Related Accessories
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
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

