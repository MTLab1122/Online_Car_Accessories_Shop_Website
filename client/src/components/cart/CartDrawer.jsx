import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Minus, Plus, ArrowRight, Tag, Truck, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Drawer from '../ui/Drawer';
import { PrimaryButton, SecondaryButton } from '../ui/Buttons';

export const CartDrawer = () => {
  const {
    cart,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon
  } = useCart();

  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const freeShippingThreshold = 5000;
  const progressToFreeShipping = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    try {
      setCouponLoading(true);
      await applyCoupon(couponInput.trim());
      setCouponInput('');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleCheckout = () => {
    closeDrawer();
    navigate('/checkout');
  };

  return (
    <Drawer
      isOpen={isDrawerOpen}
      onClose={closeDrawer}
      title="Consignment Manifest"
      subtitle={`${cart.itemCount || items.length} active accessory unit(s)`}
      width="max-w-lg"
    >
      {items.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
          <div className="w-16 h-16 rounded-2xl bg-autox-card border border-autox-border flex items-center justify-center text-autox-orange mb-4 shadow-glow-sm">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h4 className="font-display font-bold text-xl text-white uppercase tracking-wider mb-2">
            Your Cart is Empty
          </h4>
          <p className="text-xs text-autox-muted leading-relaxed max-w-xs mb-8">
            Explore authentic aero kits, forged wheels, and track telemetry tailored for Pakistani roads.
          </p>
          <PrimaryButton
            onClick={() => {
              closeDrawer();
              navigate('/shop');
            }}
            icon={ArrowRight}
          >
            Explore Catalog
          </PrimaryButton>
        </div>
      ) : (
        <div className="flex flex-col h-full justify-between">
          <div>
            {/* Free Shipping Progress Indicator */}
            <div className="p-3.5 rounded-xl bg-autox-card border border-autox-border mb-6">
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="flex items-center gap-1.5 text-white">
                  <Truck className="w-3.5 h-3.5 text-autox-orange" />
                  {progressToFreeShipping >= 100 ? (
                    <span className="text-emerald-400 font-bold">Complimentary Shipping Unlocked!</span>
                  ) : (
                    <span>Add ₨{remainingForFreeShipping.toLocaleString()} for Free Shipping</span>
                  )}
                </span>
                <span className="text-autox-muted">{Math.round(progressToFreeShipping)}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-autox-dark overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-autox-orange to-emerald-400 transition-all duration-500 rounded-full"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-4 mb-6">
              {items.map((item) => {
                const product = item.product || {};
                const image = product.images?.[0]
                  ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url)
                  : 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=400&q=80';

                return (
                  <div
                    key={product._id || item._id}
                    className="p-3.5 rounded-xl bg-autox-card border border-autox-border hover:border-autox-borderLight transition-colors flex gap-3.5"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-autox-dark flex-shrink-0 border border-autox-border">
                      <img
                        src={image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="font-display font-bold text-xs text-white uppercase tracking-wide truncate">
                            {product.name}
                          </h5>
                          <button
                            onClick={() => removeItem(product._id)}
                            className="text-autox-muted hover:text-red-400 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] font-mono text-autox-orange font-semibold">
                          ₨ {item.price.toLocaleString()} PKR
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between pt-2 border-t border-autox-border/60">
                        <div className="flex items-center border border-autox-border rounded-lg bg-autox-dark">
                          <button
                            onClick={() => updateQuantity(product._id, item.quantity - 1)}
                            className="p-1 text-autox-muted hover:text-white transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-mono font-bold text-white min-w-[24px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product._id, item.quantity + 1)}
                            className="p-1 text-autox-muted hover:text-white transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-mono font-bold text-white">
                          ₨ {item.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Coupon Application */}
            <div className="p-3.5 rounded-xl bg-autox-card border border-autox-border mb-6">
              {cart?.coupon ? (
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Coupon '{cart.coupon.code}' applied</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs font-mono text-red-400 hover:text-red-300 underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="w-full bg-autox-dark border border-autox-border rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-autox-muted uppercase focus:outline-none focus:border-autox-orange"
                    />
                    <Tag className="w-3.5 h-3.5 text-autox-muted absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                  <SecondaryButton
                    type="submit"
                    disabled={couponLoading || !couponInput.trim()}
                    size="sm"
                  >
                    Apply
                  </SecondaryButton>
                </form>
              )}
            </div>
          </div>

          {/* Drawer Footer & Checkout CTA */}
          <div className="pt-4 border-t border-autox-border space-y-3">
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-autox-muted">
                <span>Subtotal</span>
                <span className="text-white">₨ {(cart?.subtotal || 0).toLocaleString()} PKR</span>
              </div>
              {(cart?.discount || 0) > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span>-₨ {cart.discount.toLocaleString()} PKR</span>
                </div>
              )}
              <div className="flex justify-between text-autox-muted">
                <span>Nationwide Shipping</span>
                <span className="text-white">
                  {(cart?.shippingFee || 0) === 0 ? (
                    <span className="text-emerald-400 font-bold uppercase">Free</span>
                  ) : (
                    `₨ ${cart?.shippingFee} PKR`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-display font-bold text-white pt-2 border-t border-autox-border">
                <span>Total Amount</span>
                <span className="text-autox-orange">
                  ₨ {(cart?.total || 0).toLocaleString()} PKR
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 pt-2">
              <PrimaryButton onClick={handleCheckout} icon={ArrowRight} size="lg" className="w-full">
                Proceed to Checkout
              </PrimaryButton>

              <Link
                to="/cart"
                onClick={closeDrawer}
                className="w-full text-center py-2.5 rounded-lg border border-autox-border text-xs font-mono uppercase tracking-wider text-autox-silver hover:text-white hover:bg-autox-card transition-colors block"
              >
                View Full Cart
              </Link>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default CartDrawer;
