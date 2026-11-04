import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  Tag,
  CheckCircle,
  Truck,
  ShieldCheck,
  PackageOpen,
  X
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import SEO from '../../components/common/SEO';
import { analytics } from '../../utils/analytics';

const CartPage = () => {
  const { cart, loading, updateQuantity, removeItem, applyCoupon, removeCoupon, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [couponSubmitting, setCouponSubmitting] = useState(false);

  useEffect(() => {
    if (cart?.items && cart.items.length > 0) {
      analytics.viewCart(cart.items, cart.totalPrice);
    }
  }, [cart?.items?.length, cart?.totalPrice]);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    try {
      setCouponSubmitting(true);
      await applyCoupon(couponInput.trim());
      setCouponInput('');
    } finally {
      setCouponSubmitting(false);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-autox-bg">
        <SEO title="Shopping Cart | AUTOX" noindex={true} />
        <div className="w-20 h-20 rounded-full bg-autox-card flex items-center justify-center border border-autox-border mb-6">
          <ShoppingBag className="w-8 h-8 text-autox-orange" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white mb-2">
          Your Cart is Empty
        </h2>
        <p className="text-xs sm:text-sm text-autox-muted max-w-sm mx-auto mb-8 leading-relaxed">
          Looks like you haven't added any performance accessories yet. Explore our aerodynamic kits, forged wheels, and lighting modules.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-autox-orange hover:bg-autox-orangeHover text-white text-xs font-semibold uppercase tracking-wider shadow-glow transition-all"
        >
          <span>Explore Equipment Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-autox-bg py-12">
      <SEO title="Shopping Cart | AUTOX" noindex={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-autox-border">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-autox-orange font-bold">
              Consignment Manifest
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-1">
              Shopping Cart ({cart.itemCount || cart.items.length} items)
            </h1>
          </div>

          <button
            onClick={clearCart}
            className="text-xs font-mono text-red-400 hover:text-red-300 flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Entire Cart</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
          {/* Left Column: Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => {
              const product = item.product || {};
              const displayImg = product.images && product.images.length > 0 ? product.images[0] : '';

              return (
                <div
                  key={item._id || product._id}
                  className="glass-card p-5 sm:p-6 rounded-2xl border border-autox-border flex flex-col sm:flex-row items-center justify-between gap-6"
                >
                  {/* Thumbnail & Title */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-20 h-20 rounded-xl bg-autox-dark border border-autox-border flex-shrink-0 overflow-hidden flex items-center justify-center p-2">
                      <img
                        src={displayImg}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-mono text-autox-orange uppercase font-bold tracking-wider">
                        {product.brand}
                      </span>
                      <Link
                        to={`/product/${product.slug}`}
                        className="font-display font-bold text-base text-white hover:text-autox-orange transition-colors block truncate"
                      >
                        {product.name}
                      </Link>
                      <div className="text-xs font-mono text-autox-muted mt-0.5">
                        PKR {item.price.toLocaleString()} each
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-autox-border/60">
                    <div className="flex items-center border border-autox-border rounded-xl bg-autox-dark overflow-hidden">
                      <button
                        onClick={() => updateQuantity(product._id, item.quantity - 1)}
                        className="px-3 py-1.5 text-autox-silver hover:text-white transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 py-1 text-xs font-mono font-bold text-white min-w-[32px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product._id, item.quantity + 1)}
                        className="px-3 py-1.5 text-autox-silver hover:text-white transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[100px]">
                      <span className="text-base font-bold font-display text-white block">
                        PKR {item.total.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        analytics.removeFromCart(product, item.quantity);
                        removeItem(product._id);
                      }}
                      className="p-2 text-autox-muted hover:text-red-400 transition-colors rounded-lg hover:bg-autox-dark"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="pt-4 flex items-center justify-between">
              <Link
                to="/shop"
                className="text-xs font-mono uppercase tracking-wider text-autox-silver hover:text-autox-orange transition-colors flex items-center gap-1.5"
              >
                <span>← Continue Shopping</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary & Coupon Card */}
          <div className="space-y-6">
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-autox-border space-y-6">
              <h3 className="text-lg font-bold font-display text-white uppercase tracking-wider pb-4 border-b border-autox-border">
                Order Summary
              </h3>

              {/* Coupon Form */}
              <div>
                <label className="text-[11px] font-mono uppercase tracking-widest text-autox-muted block mb-2">
                  Promotional Coupon
                </label>
                {cart.coupon ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-autox-orange/15 border border-autox-orange/40">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-autox-orange" />
                      <span className="font-mono text-xs font-bold text-white uppercase">
                        {cart.coupon.code}
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-autox-muted hover:text-white"
                      title="Remove Coupon"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="e.g. AUTOX10"
                      className="flex-1 bg-autox-dark border border-autox-border rounded-xl px-3 py-2 text-xs text-white placeholder-autox-muted uppercase font-mono focus:outline-none focus:border-autox-orange"
                    />
                    <button
                      type="submit"
                      disabled={couponSubmitting || !couponInput.trim()}
                      className="px-4 py-2 rounded-xl bg-autox-card hover:bg-autox-cardHover border border-autox-border text-xs font-semibold uppercase text-white hover:border-autox-orange disabled:opacity-50 transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>

              {/* Authoritative Price Breakdown */}
              <div className="space-y-3 pt-4 border-t border-autox-border text-xs font-mono">
                <div className="flex items-center justify-between text-autox-silver">
                  <span>Subtotal</span>
                  <span>PKR {cart.subtotal.toLocaleString()}</span>
                </div>

                {cart.discount > 0 && (
                  <div className="flex items-center justify-between text-emerald-400">
                    <span>Coupon Discount</span>
                    <span>- PKR {cart.discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-autox-silver">
                  <span>Shipping Fee</span>
                  <span>
                    {cart.shippingFee === 0 ? (
                      <span className="text-emerald-400 uppercase font-bold">Free Over 5000</span>
                    ) : (
                      `PKR ${cart.shippingFee.toLocaleString()}`
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-autox-border flex items-baseline justify-between text-white">
                  <span className="font-bold text-sm uppercase">Total (PKR)</span>
                  <span className="text-2xl font-bold font-display text-autox-orange">
                    PKR {cart.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full py-4 rounded-xl bg-autox-orange hover:bg-autox-orangeHover text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow hover:shadow-glow-lg transition-all"
              >
                <span>Proceed to Validated Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-autox-muted pt-2 text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Encrypted checkout • Cash on Delivery & Demo Card</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

