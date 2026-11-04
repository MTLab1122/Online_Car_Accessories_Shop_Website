import React from 'react';
import { ShoppingBag, Heart, Star, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import Modal from '../ui/Modal';
import PriceDisplay from '../ui/PriceDisplay';
import StockIndicator from '../ui/StockIndicator';
import { PrimaryButton, SecondaryButton } from '../ui/Buttons';

export const QuickViewModal = ({ product, onClose }) => {
  const { addItem, openDrawer } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) return null;

  const isFavorited = isInWishlist(product._id);
  const displayImage = product.images && product.images.length > 0
    ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url)
    : 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80';

  const handleAddToCart = async () => {
    if (product.stock <= 0) return;
    await addItem(product._id, 1);
    onClose();
    if (openDrawer) openDrawer();
  };

  return (
    <Modal isOpen={!!product} onClose={onClose} maxWidth="max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left Media */}
        <div className="relative aspect-square md:aspect-auto bg-autox-dark p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-autox-border">
          <img
            src={displayImage}
            alt={product.name}
            className="max-h-72 object-contain filter contrast-110"
          />
          {product.discountPercentage > 0 && (
            <span className="absolute top-4 left-4 px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase bg-autox-orange text-white shadow-glow">
              -{product.discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Right Details */}
        <div className="p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-autox-orange font-bold uppercase tracking-wider">{product.brand}</span>
              <span className="text-autox-muted">SKU: {product.SKU}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold font-display text-white uppercase tracking-tight mb-3">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-amber-400">
                <Star className="w-4 h-4 fill-current" />
              </div>
              <span className="text-xs font-semibold text-white">
                {product.ratingAverage || product.rating || '5.0'}
              </span>
              <span className="text-xs text-autox-muted">
                ({product.ratingCount || product.ratingsCount || 0} reviews)
              </span>
              <span className="text-autox-border mx-1">•</span>
              <StockIndicator stock={product.stock} />
            </div>

            {/* Price */}
            <div className="mb-4">
              <PriceDisplay
                price={product.price}
                discountPercentage={product.discountPercentage}
                size="lg"
              />
            </div>

            <p className="text-xs text-autox-silver leading-relaxed line-clamp-3 mb-6 font-sans">
              {product.shortDescription || product.description}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <PrimaryButton
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                icon={ShoppingBag}
                size="md"
              >
                Add To Cart
              </PrimaryButton>

              <SecondaryButton
                onClick={() => toggleWishlist(product._id)}
                icon={Heart}
                size="md"
              >
                {isFavorited ? 'Saved' : 'Wishlist'}
              </SecondaryButton>
            </div>

            <Link
              to={`/product/${product.slug}`}
              onClick={onClose}
              className="w-full text-center text-xs font-mono uppercase tracking-wider text-autox-muted hover:text-autox-orange py-2 transition-colors border-t border-autox-border/60 mt-1"
            >
              View Full Engineering Specifications →
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default QuickViewModal;
