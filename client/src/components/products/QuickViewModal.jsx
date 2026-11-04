import React from 'react';
import { X, ShoppingBag, Heart, Star, CheckCircle, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const QuickViewModal = ({ product, onClose }) => {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) return null;

  const isFavorited = isInWishlist(product._id);
  const discountedPrice = product.discountPercentage > 0
    ? Math.round(product.price * (1 - product.discountPercentage / 100))
    : product.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl glass-card rounded-2xl overflow-hidden shadow-2xl border border-autox-border">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-autox-dark/80 text-autox-silver hover:text-white hover:bg-autox-dark transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Media */}
          <div className="relative aspect-square md:aspect-auto bg-autox-dark p-6 flex items-center justify-center">
            <img
              src={product.images && product.images[0] ? product.images[0] : ''}
              alt={product.name}
              className="max-h-72 object-contain"
            />
            {product.discountPercentage > 0 && (
              <span className="absolute top-4 left-4 px-2.5 py-1 rounded-md text-xs font-bold uppercase bg-autox-orange text-white shadow-glow">
                -{product.discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Right Details */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-autox-muted mb-2">
                <span className="text-autox-orange font-bold uppercase">{product.brand}</span>
                <span>SKU: {product.SKU}</span>
              </div>

              <h2 className="text-xl font-bold font-display text-white mb-2">{product.name}</h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span className="text-sm font-semibold text-white">{product.ratingAverage}</span>
                <span className="text-xs text-autox-muted">({product.ratingCount} reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="text-2xl font-bold font-display text-white">
                  PKR {discountedPrice.toLocaleString()}
                </div>
                {product.discountPercentage > 0 && (
                  <span className="text-sm text-autox-muted line-through">
                    PKR {product.price.toLocaleString()}
                  </span>
                )}
              </div>

              <p className="text-xs text-autox-muted leading-relaxed line-clamp-3 mb-4">
                {product.shortDescription || product.description}
              </p>

              {/* Stock info */}
              <div className="flex items-center gap-2 text-xs font-mono text-autox-silver mb-6">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>{product.stock > 0 ? `${product.stock} units ready to dispatch` : 'Out of stock'}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    addItem(product._id, 1);
                    onClose();
                  }}
                  disabled={product.stock <= 0}
                  className="w-full py-3 rounded-xl bg-autox-orange hover:bg-autox-orangeHover text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product._id)}
                  className={`w-full py-3 rounded-xl border text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    isFavorited
                      ? 'border-autox-orange bg-autox-orange/20 text-autox-orange'
                      : 'border-autox-border hover:border-white text-white bg-autox-card'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                  <span>{isFavorited ? 'Saved' : 'Wishlist'}</span>
                </button>
              </div>

              <Link
                to={`/product/${product.slug}`}
                onClick={onClose}
                className="w-full text-center text-xs font-mono uppercase tracking-wider text-autox-muted hover:text-autox-orange py-1 transition-colors"
              >
                View Full Specifications & 3D Model →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;

