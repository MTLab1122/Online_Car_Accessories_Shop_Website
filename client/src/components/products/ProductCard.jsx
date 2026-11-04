import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star, Eye, Check, AlertTriangle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product, onQuickView }) => {
  const { addItem } = useCart();
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
    } finally {
      setAdding(false);
    }
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product._id);
  };

  const discountedPrice = product.discountPercentage > 0
    ? Math.round(product.price * (1 - product.discountPercentage / 100))
    : product.price;

  const displayImage = product.images && product.images.length > 0
    ? product.images[0]
    : 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="group relative bg-autox-card rounded-2xl border border-autox-border hover:border-autox-orange/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-card hover:shadow-glow">
      {/* Top Media Container */}
      <div className="relative aspect-[4/3] bg-autox-dark overflow-hidden">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={displayImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.discountPercentage > 0 && (
            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-autox-orange text-white shadow-glow">
              -{product.discountPercentage}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-black/75 text-autox-silver border border-autox-border backdrop-blur-md">
              Featured
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-amber-500/90 text-black font-bold backdrop-blur-md">
              Top Rated
            </span>
          )}
        </div>

        {/* Action Button Overlays */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button
            onClick={handleToggleWishlist}
            className={`p-2 rounded-xl backdrop-blur-md transition-all ${
              isFavorited
                ? 'bg-autox-orange text-white shadow-glow'
                : 'bg-black/60 text-autox-silver hover:text-white hover:bg-black/80'
            }`}
            title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>

          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="p-2 rounded-xl bg-black/60 text-autox-silver hover:text-white hover:bg-black/80 backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Out of Stock Ribbon */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="px-4 py-1.5 rounded-lg bg-red-600/90 text-white text-xs font-bold uppercase tracking-widest border border-red-500">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category line */}
          <div className="flex items-center justify-between text-xs text-autox-muted mb-1.5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-autox-orange font-semibold">
              {product.brand}
            </span>
            <span className="truncate max-w-[120px]">
              {product.category?.name || 'Accessories'}
            </span>
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.slug}`}>
            <h3 className="font-display font-bold text-base text-white tracking-wide hover:text-autox-orange transition-colors line-clamp-1 mb-2">
              {product.name}
            </h3>
          </Link>

          {/* Ratings */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-semibold text-white">
              {product.ratingAverage || '5.0'}
            </span>
            <span className="text-[11px] text-autox-muted">
              ({product.ratingCount || 0})
            </span>
            <span className="text-autox-border mx-1">•</span>
            <span className="text-[11px] font-mono text-autox-muted">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        </div>

        {/* Bottom Price & Add to Cart Action */}
        <div className="pt-3 border-t border-autox-border/60 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold font-display text-white">
                PKR {discountedPrice.toLocaleString()}
              </span>
            </div>
            {product.discountPercentage > 0 && (
              <span className="text-xs text-autox-muted line-through">
                PKR {product.price.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || adding}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-200 ${
              product.stock <= 0
                ? 'bg-autox-dark text-autox-muted cursor-not-allowed border border-autox-border'
                : 'bg-autox-orange hover:bg-autox-orangeHover text-white shadow-glow hover:shadow-glow-lg active:scale-95'
            }`}
            title="Add to Shopping Cart"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline-block">
              {adding ? 'Adding...' : 'Add'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

