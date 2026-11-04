import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle,
  Truck,
  CreditCard,
  Banknote,
  AlertTriangle,
  ArrowRight,
  Package,
  ChevronRight
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { cart, clearCart, refreshCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    street: '',
    city: 'Lahore',
    province: 'Punjab',
    postalCode: '',
    deliveryInstructions: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod'); // cod | simulated_card
  const [simulatedCardDetails, setSimulatedCardDetails] = useState({
    cardNumber: '4242 •••• •••• 4242',
    cardHolder: '',
    expiry: '12/28',
    isDemoConfirmed: false
  });

  // Pre-fill user data if authenticated
  useEffect(() => {
    if (user) {
      const defaultAddr = user.addresses?.find(a => a.isDefault) || user.addresses?.[0] || {};
      setFormData({
        fullName: defaultAddr.fullName || user.name || '',
        phone: defaultAddr.phone || user.phone || '',
        email: user.email || '',
        street: defaultAddr.street || '',
        city: defaultAddr.city || 'Lahore',
        province: defaultAddr.province || 'Punjab',
        postalCode: defaultAddr.postalCode || '54000',
        deliveryInstructions: ''
      });
      setSimulatedCardDetails(prev => ({ ...prev, cardHolder: user.name || 'AUTOX PILOT' }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please sign in or register to place your order.');
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    if (!cart.items || cart.items.length === 0) {
      toast.error('Your cart is empty.');
      navigate('/cart');
      return;
    }

    // Required fields validation
    if (!formData.fullName || !formData.phone || !formData.street || !formData.city || !formData.province || !formData.postalCode) {
      toast.error('Please complete all mandatory delivery fields.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode,
          deliveryInstructions: formData.deliveryInstructions
        },
        paymentMethod,
        couponCode: cart.coupon?.code,
        simulatedPaymentDetails: paymentMethod === 'simulated_card' ? simulatedCardDetails : undefined
      };

      const res = await orderService.createOrder(payload);
      if (res.success && res.data) {
        setOrderConfirmed(res.data);
        await refreshCart();
        toast.success(`Order ${res.data.orderNumber} placed successfully!`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  // Order Confirmation Success View
  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-autox-bg py-16 flex items-center justify-center p-4">
        <div className="max-w-xl w-full glass-card p-8 sm:p-10 rounded-3xl border border-autox-orange/40 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-glow">
            <CheckCircle className="w-8 h-8" />
          </div>

          <span className="text-xs font-mono font-bold uppercase tracking-widest text-autox-orange">
            Consignment Confirmed
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1 mb-2">
            Order #{orderConfirmed.orderNumber}
          </h2>

          <p className="text-xs sm:text-sm text-autox-silver leading-relaxed mb-6">
            Thank you, <strong className="text-white">{orderConfirmed.shippingAddress.fullName}</strong>. Your performance order has been received by our logistics fulfillment depot in Pakistan.
          </p>

          <div className="bg-autox-dark p-4 rounded-xl border border-autox-border text-left font-mono text-xs space-y-2 mb-8">
            <div className="flex justify-between text-autox-muted">
              <span>Payment Protocol:</span>
              <span className="text-white uppercase font-bold">
                {orderConfirmed.paymentMethod === 'cod' ? 'Cash On Delivery' : 'Simulated Card (Demo)'}
              </span>
            </div>
            <div className="flex justify-between text-autox-muted">
              <span>Destination City:</span>
              <span className="text-white font-bold">{orderConfirmed.shippingAddress.city}</span>
            </div>
            <div className="flex justify-between text-autox-muted">
              <span>Total Amount:</span>
              <span className="text-autox-orange font-bold text-sm">
                PKR {orderConfirmed.total.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Link
              to={`/account?tab=orders`}
              className="py-3.5 rounded-xl bg-autox-orange hover:bg-autox-orangeHover text-white text-xs font-semibold uppercase tracking-wider shadow-glow transition-all"
            >
              Track Order Status
            </Link>
            <Link
              to="/shop"
              className="py-3.5 rounded-xl bg-autox-card hover:bg-autox-cardHover border border-autox-border text-white text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-autox-bg py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-8 border-b border-autox-border">
          <span className="text-xs font-mono uppercase tracking-widest text-autox-orange font-bold">
            Secure Logistics Gateway
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-1">
            Checkout & Dispatch Verification
          </h1>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
          {/* Left Form: Shipping Address & Payment Selection */}
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Details */}
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-autox-border space-y-6">
              <div className="flex items-center gap-2 text-white font-display font-bold text-lg uppercase tracking-wide pb-4 border-b border-autox-border">
                <Truck className="w-5 h-5 text-autox-orange" />
                <span>Shipping Address (Pakistan Delivery)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-autox-muted block mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Recipient Name"
                    className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-autox-orange"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-autox-muted block mb-1.5">
                    Phone Number (SMS Notifications) *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+92 300 0000000"
                    className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-autox-orange"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-mono uppercase text-autox-muted block mb-1.5">
                    Street Address & House / Plot # *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    required
                    placeholder="Street 14, Sector F-8/2 or House 45 Block B"
                    className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-autox-orange"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-autox-muted block mb-1.5">
                    City *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-autox-orange"
                  >
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Multan">Multan</option>
                    <option value="Peshawar">Peshawar</option>
                    <option value="Quetta">Quetta</option>
                    <option value="Sialkot">Sialkot</option>
                    <option value="Gujranwala">Gujranwala</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-autox-muted block mb-1.5">
                    Province *
                  </label>
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    required
                    className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-autox-orange"
                  >
                    <option value="Punjab">Punjab</option>
                    <option value="Sindh">Sindh</option>
                    <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                    <option value="Balochistan">Balochistan</option>
                    <option value="Federal Capital">Federal Capital</option>
                    <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                    <option value="Azad Kashmir">Azad Kashmir</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-autox-muted block mb-1.5">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 54000"
                    className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-autox-orange"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-autox-muted block mb-1.5">
                    Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    name="deliveryInstructions"
                    value={formData.deliveryInstructions}
                    onChange={handleChange}
                    placeholder="e.g. Leave with security guard"
                    className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-autox-orange"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-autox-border space-y-6">
              <div className="flex items-center gap-2 text-white font-display font-bold text-lg uppercase tracking-wide pb-4 border-b border-autox-border">
                <CreditCard className="w-5 h-5 text-autox-orange" />
                <span>Payment Method</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Cash On Delivery Option */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-autox-orange bg-autox-orange/10 shadow-glow'
                      : 'border-autox-border bg-autox-dark hover:border-autox-silver/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Banknote className="w-6 h-6 text-emerald-400" />
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-autox-orange"
                    />
                  </div>
                  <h4 className="font-bold text-white text-sm uppercase font-display">
                    Cash On Delivery (COD)
                  </h4>
                  <p className="text-xs text-autox-muted mt-1 leading-relaxed">
                    Pay with cash in Pakistani Rupees (PKR) directly to the courier upon physical receipt and inspection.
                  </p>
                </div>

                {/* Simulated Online Card Option */}
                <div
                  onClick={() => setPaymentMethod('simulated_card')}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'simulated_card'
                      ? 'border-autox-orange bg-autox-orange/10 shadow-glow'
                      : 'border-autox-border bg-autox-dark hover:border-autox-silver/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <CreditCard className="w-6 h-6 text-autox-orange" />
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'simulated_card'}
                      onChange={() => setPaymentMethod('simulated_card')}
                      className="text-autox-orange"
                    />
                  </div>
                  <h4 className="font-bold text-white text-sm uppercase font-display">
                    Simulated Card (Demo)
                  </h4>
                  <p className="text-xs text-autox-muted mt-1 leading-relaxed">
                    Demonstration-only card simulator for final year project presentation. No real bank transaction occurs.
                  </p>
                </div>
              </div>

              {/* Simulated Card Demo Details Banner */}
              {paymentMethod === 'simulated_card' && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold uppercase font-mono">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>Academic Demonstration Notice</span>
                  </div>
                  <p className="leading-relaxed text-[11px]">
                    This checkout is running in Academic Demonstration Mode. When selecting Simulated Card, your order will complete instantly without charging any physical credit or debit instrument.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Summary Column */}
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-2xl border border-autox-border space-y-6 sticky top-28">
              <h3 className="text-lg font-bold font-display text-white uppercase tracking-wider pb-4 border-b border-autox-border">
                Order Review
              </h3>

              {/* Items List Mini */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {cart.items?.map((item) => (
                  <div key={item._id} className="flex items-center justify-between text-xs font-mono">
                    <div className="truncate max-w-[180px] text-autox-silver">
                      <span className="text-autox-orange font-bold mr-1">{item.quantity}x</span>
                      {item.product?.name}
                    </div>
                    <span className="text-white font-semibold">
                      PKR {item.total.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Breakdown */}
              <div className="pt-4 border-t border-autox-border space-y-2.5 text-xs font-mono">
                <div className="flex justify-between text-autox-silver">
                  <span>Subtotal:</span>
                  <span>PKR {cart.subtotal.toLocaleString()}</span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Coupon ({cart.coupon?.code}):</span>
                    <span>- PKR {cart.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-autox-silver">
                  <span>Shipping Fee:</span>
                  <span>
                    {cart.shippingFee === 0 ? 'FREE' : `PKR ${cart.shippingFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="pt-3 border-t border-autox-border flex justify-between items-baseline text-white">
                  <span className="font-bold text-sm uppercase">Authoritative Total:</span>
                  <span className="text-2xl font-bold font-display text-autox-orange">
                    PKR {cart.total.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-autox-orange hover:bg-autox-orangeHover text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-50"
              >
                <span>{loading ? 'Validating Order...' : 'Confirm & Place Order'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-autox-muted text-center pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero fraud guarantee • 256-bit SSL secured</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
