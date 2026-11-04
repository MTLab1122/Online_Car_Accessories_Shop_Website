import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import PriceDisplay from '../ui/PriceDisplay';
import StockIndicator from '../ui/StockIndicator';

export const ProductCard = ({ product, onQuickView }) => {
  const { addItem, openDrawer } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [adding, setAdding] = useState(false);

  const isFavorited = isInWishlist(product._id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;

    try {
      setAdding(true);
      await addItem(product._id, 1);
      if (openDrawer) openDrawer();
    } finally {
      setAdding(false);
    }
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product._id);
  };

  const displayImage = product.images && product.images.length > 0
    ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url)
    : 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative bg-autox-card rounded-2xl border border-autox-border hover:border-autox-orange/50 transition-colors flex flex-col justify-between overflow-hidden shadow-card hover:shadow-glow"
    >
      {/* Top Media Container */}
      <div className="relative aspect-[4/3] bg-autox-surface overflow-hidden">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={displayImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Status Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.discountPercentage > 0 && (
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider bg-autox-orange text-white shadow-glow">
              -{product.discountPercentage}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider bg-black/80 text-autox-silver border border-autox-border backdrop-blur-md">
              Featured Spec
            </span>
          )}
        </div>

        {/* Action Button Overlays */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleToggleWishlist}
            aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`p-2.5 rounded-xl backdrop-blur-md transition-all ${
              isFavorited
                ? 'bg-autox-orange text-white shadow-glow'
                : 'bg-black/60 text-autox-silver hover:text-white hover:bg-black/90'
            }`}
            title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </motion.button>

          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              aria-label="Quick view product"
              className="p-2.5 rounded-xl bg-black/60 text-autox-silver hover:text-white hover:bg-black/90 backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] flex items-center justify-center z-10 pointer-events-none">
            <span className="px-4 py-1.5 rounded-lg bg-red-950/80 text-red-300 text-xs font-mono font-bold uppercase tracking-widest border border-red-800">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Stock Header */}
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-autox-orange font-semibold">
              {product.brand}
            </span>
            <StockIndicator stock={product.stock} />
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.slug}`} className="block group-hover:text-autox-orange transition-colors">
            <h3 className="font-display font-bold text-base text-white tracking-wide line-clamp-1 mb-2">
              {product.name}
            </h3>
          </Link>

          {/* Rating Snapshot */}
          <div className="flex items-center gap-1.5 mb-3 text-xs">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-semibold text-white">
              {product.ratingAverage || product.rating || '5.0'}
            </span>
            <span className="text-[11px] font-mono text-autox-muted">
              ({product.ratingCount || product.ratingsCount || 0})
            </span>
          </div>
        </div>

        {/* Bottom Price & Add to Cart Action */}
        <div className="pt-3 border-t border-autox-border flex items-end justify-between gap-3">
          <PriceDisplay
            price={product.price}
            discountPercentage={product.discountPercentage}
            size="md"
          />

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || adding}
            className={`px-4 py-2.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              product.stock <= 0
                ? 'bg-autox-surface text-autox-muted cursor-not-allowed border border-autox-border'
                : 'bg-autox-orange hover:bg-autox-orangeHover text-white shadow-glow hover:shadow-glow-lg'
            }`}
            title="Add to Shopping Cart"
          >
            <ShoppingBag className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">
              {adding ? 'Adding...' : 'Add'}
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
