import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  MapPin,
  Lock,
  LogOut,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  Eye,
  Plus,
  Trash2,
  Edit,
  Shield,
  ShoppingBag,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { orderService } from '../../services/orderService';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';
import SEO from '../../components/common/SEO';

const AccountPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);

  const { user, logout, updateProfile } = useAuth();
  const { addItem } = useCart();
  const { wishlist, removeFromWishlist } = useWishlist();

  // Tab State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingModalOrder, setTrackingModalOrder] = useState(null);

  // Profile Form State
  const [nameInput, setNameInput] = useState(user?.name || '');
  const [phoneInput, setPhoneInput] = useState(user?.phone || '');
  const [profileSaving, setProfileSaving] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Address State
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: 'Lahore',
    province: 'Punjab',
    postalCode: '',
    isDefault: false
  });

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const switchTab = (tabName) => {
    setActiveTab(tabName);
    setSearchParams({ tab: tabName });
  };

  // Load orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        const res = await orderService.getMyOrders();
        if (res.success && res.data) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error('Failed to load user orders', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    if (activeTab === 'orders' || activeTab === 'overview') {
      fetchOrders();
    }
  }, [activeTab]);

  // Profile Update Handler
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setProfileSaving(true);
      await updateProfile({ name: nameInput, phone: phoneInput });
    } finally {
      setProfileSaving(false);
    }
  };

  // Password Update Handler
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      setPasswordSaving(true);
      await authService.updatePassword({ currentPassword, newPassword });
      toast.success('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error(err.message || 'Failed to update password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  // Add Address Handler
  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.addAddress(addressForm);
      if (res.success) {
        setAddresses(res.data);
        setShowAddressForm(false);
        setAddressForm({
          fullName: '',
          phone: '',
          street: '',
          city: 'Lahore',
          province: 'Punjab',
          postalCode: '',
          isDefault: false
        });
        toast.success('Address added successfully.');
      }
    } catch (err) {
      toast.error(err.message || 'Could not save address.');
    }
  };

  // Delete Address Handler
  const handleDeleteAddress = async (id) => {
    try {
      const res = await authService.deleteAddress(id);
      if (res.success) {
        setAddresses(res.data);
        toast.success('Address removed.');
      }
    } catch (err) {
      toast.error(err.message || 'Could not remove address.');
    }
  };

  // Cancel Order Handler
  const handleCancelOrder = async (orderId) => {
    const reason = window.prompt('Please provide a reason for order cancellation:');
    if (!reason) return;

    try {
      const res = await orderService.cancelOrder(orderId, reason);
      if (res.success) {
        toast.success('Order cancelled successfully.');
        setOrders(orders.map(o => (o._id === orderId ? res.data : o)));
        if (selectedOrder?._id === orderId) setSelectedOrder(res.data);
      }
    } catch (err) {
      toast.error(err.message || 'Cannot cancel order.');
    }
  };

  const totalSpent = orders.reduce((sum, o) => sum + (o.orderStatus !== 'cancelled' ? o.total : 0), 0);

  return (
    <div className="min-h-screen bg-autox-bg py-12">
      <SEO title="Pilot Account & Telemetry | AUTOX" noindex={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Hero Banner */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-autox-border mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-autox-orange to-[#a03008] border border-autox-orange/40 flex items-center justify-center font-display font-bold text-2xl text-white shadow-glow">
              {user?.name?.charAt(0) || 'P'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-display text-white">{user?.name}</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-autox-orange/20 text-autox-orange border border-autox-orange/40 uppercase">
                  {user?.role === 'admin' ? 'Administrator' : 'Pilot Customer'}
                </span>
              </div>
              <p className="text-xs text-autox-muted font-mono">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Tab Navigation & Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Navigation Sidebar */}
          <aside className="space-y-2">
            <button
              onClick={() => switchTab('overview')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-colors ${
                activeTab === 'overview'
                  ? 'bg-autox-orange text-white shadow-glow'
                  : 'text-autox-silver hover:bg-autox-card'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Cockpit Overview</span>
            </button>

            <button
              onClick={() => switchTab('orders')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-between transition-colors ${
                activeTab === 'orders'
                  ? 'bg-autox-orange text-white shadow-glow'
                  : 'text-autox-silver hover:bg-autox-card'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>Order History</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-autox-dark">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => switchTab('wishlist')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-between transition-colors ${
                activeTab === 'wishlist'
                  ? 'bg-autox-orange text-white shadow-glow'
                  : 'text-autox-silver hover:bg-autox-card'
              }`}
            >
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4" />
                <span>Saved Equipment</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-autox-dark">
                {wishlist.length}
              </span>
            </button>

            <button
              onClick={() => switchTab('addresses')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-colors ${
                activeTab === 'addresses'
                  ? 'bg-autox-orange text-white shadow-glow'
                  : 'text-autox-silver hover:bg-autox-card'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Saved Addresses</span>
            </button>

            <button
              onClick={() => switchTab('security')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-colors ${
                activeTab === 'security'
                  ? 'bg-autox-orange text-white shadow-glow'
                  : 'text-autox-silver hover:bg-autox-card'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Security & Password</span>
            </button>
          </aside>

          {/* Right Content Panels */}
          <main className="lg:col-span-3">
            {/* 1. Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="glass-card p-6 rounded-2xl border border-autox-border">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-autox-muted">
                      Total Orders
                    </span>
                    <div className="text-3xl font-extrabold font-display text-white mt-1">
                      {orders.length}
                    </div>
                  </div>

                  <div className="glass-card p-6 rounded-2xl border border-autox-border">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-autox-muted">
                      Saved In Wishlist
                    </span>
                    <div className="text-3xl font-extrabold font-display text-autox-orange mt-1">
                      {wishlist.length}
                    </div>
                  </div>

                  <div className="glass-card p-6 rounded-2xl border border-autox-border">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-autox-muted">
                      Total Investment (PKR)
                    </span>
                    <div className="text-2xl font-extrabold font-display text-white mt-1">
                      PKR {totalSpent.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Profile Quick Form */}
                <div className="glass-card p-6 sm:p-8 rounded-2xl border border-autox-border">
                  <h3 className="text-lg font-bold font-display text-white uppercase tracking-wider mb-6 pb-4 border-b border-autox-border">
                    Personal Information
                  </h3>
                  <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono uppercase text-autox-muted block mb-1.5">
                        Name
                      </label>
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-autox-orange"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono uppercase text-autox-muted block mb-1.5">
                        Phone
                      </label>
                      <input
                        type="text"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-autox-orange"
                      />
                    </div>
                    <div className="sm:col-span-2 pt-2">
                      <button
                        type="submit"
                        disabled={profileSaving}
                        className="px-6 py-2.5 rounded-xl bg-autox-orange hover:bg-autox-orangeHover text-white text-xs font-bold uppercase tracking-wider shadow-glow transition-all"
                      >
                        {profileSaving ? 'Saving Changes...' : 'Save Profile Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* 2. Order History Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="glass-card p-6 sm:p-8 rounded-2xl border border-autox-border">
                  <h3 className="text-lg font-bold font-display text-white uppercase tracking-wider mb-6 pb-4 border-b border-autox-border">
                    Consignment History ({orders.length})
                  </h3>

                  {loadingOrders ? (
                    <div className="text-center py-12 text-xs font-mono text-autox-muted">
                      Retrieving telemetry orders...
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order._id}
                          className="bg-autox-dark p-5 rounded-2xl border border-autox-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                        >
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-sm text-white">
                                {order.orderNumber}
                              </span>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                                  order.orderStatus === 'delivered'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                    : order.orderStatus === 'cancelled'
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                }`}
                              >
                                {order.orderStatus}
                              </span>
                            </div>
                            <span className="text-[11px] font-mono text-autox-muted mt-1 block">
                              Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} item(s)
                            </span>
                          </div>

                          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                            <span className="text-base font-bold font-display text-white">
                              PKR {order.total.toLocaleString()}
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="px-3 py-1.5 rounded-lg bg-autox-card hover:bg-autox-cardHover border border-autox-border text-xs font-mono text-white transition-colors"
                              >
                                Details
                              </button>
                              <button
                                onClick={() => setTrackingModalOrder(order)}
                                className="px-3 py-1.5 rounded-lg bg-autox-orange/20 hover:bg-autox-orange/30 border border-autox-orange/40 text-xs font-mono text-autox-orange transition-colors flex items-center gap-1"
                              >
                                <Truck className="w-3.5 h-3.5" />
                                <span>Track</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-autox-muted text-xs">
                      No order records found in database.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="glass-card p-6 sm:p-8 rounded-2xl border border-autox-border">
                <h3 className="text-lg font-bold font-display text-white uppercase tracking-wider mb-6 pb-4 border-b border-autox-border">
                  Saved Accessories ({wishlist.length})
                </h3>

                {wishlist.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlist.map((item) => (
                      <div
                        key={item._id}
                        className="bg-autox-dark p-4 rounded-xl border border-autox-border flex items-center gap-4"
                      >
                        <img
                          src={item.images?.[0] || ''}
                          alt={item.name}
                          className="w-16 h-16 object-contain rounded-lg bg-autox-card p-1"
                        />
                        <div className="min-w-0 flex-1">
                          <Link
                            to={`/product/${item.slug}`}
                            className="font-display font-bold text-sm text-white hover:text-autox-orange truncate block"
                          >
                            {item.name}
                          </Link>
                          <div className="text-xs font-mono text-autox-orange font-bold mt-0.5">
                            PKR {item.price.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => addItem(item._id, 1)}
                              className="px-2.5 py-1 rounded bg-autox-orange text-white text-[11px] font-semibold uppercase flex items-center gap-1"
                            >
                              <ShoppingBag className="w-3 h-3" />
                              <span>Add</span>
                            </button>
                            <button
                              onClick={() => removeFromWishlist(item._id)}
                              className="text-xs text-autox-muted hover:text-red-400"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-autox-muted text-xs">
                    No items saved in wishlist yet.
                  </div>
                )}
              </div>
            )}

            {/* 4. Saved Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="glass-card p-6 sm:p-8 rounded-2xl border border-autox-border">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-autox-border">
                  <h3 className="text-lg font-bold font-display text-white uppercase tracking-wider">
                    Dispatch Addresses
                  </h3>
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="px-3.5 py-1.5 rounded-lg bg-autox-orange text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-glow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New</span>
                  </button>
                </div>

                {showAddressForm && (
                  <form onSubmit={handleAddAddress} className="p-6 bg-autox-dark rounded-2xl border border-autox-border mb-6 space-y-4">
                    <h4 className="text-xs font-display font-bold uppercase text-white">Add Delivery Address</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Recipient Name *"
                        required
                        value={addressForm.fullName}
                        onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                        className="bg-autox-card border border-autox-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-autox-orange"
                      />
                      <input
                        type="text"
                        placeholder="Phone Number *"
                        required
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        className="bg-autox-card border border-autox-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-autox-orange"
                      />
                      <input
                        type="text"
                        placeholder="Street Address *"
                        required
                        value={addressForm.street}
                        onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                        className="sm:col-span-2 bg-autox-card border border-autox-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-autox-orange"
                      />
                      <input
                        type="text"
                        placeholder="City *"
                        required
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="bg-autox-card border border-autox-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-autox-orange"
                      />
                      <input
                        type="text"
                        placeholder="Postal Code *"
                        required
                        value={addressForm.postalCode}
                        onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                        className="bg-autox-card border border-autox-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-autox-orange"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="px-4 py-2 rounded-lg text-xs font-mono uppercase text-autox-muted hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-lg bg-autox-orange text-white text-xs font-semibold uppercase tracking-wider"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr._id} className="p-5 rounded-2xl bg-autox-dark border border-autox-border flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-white text-sm">{addr.fullName}</span>
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-autox-muted leading-relaxed">
                          {addr.street}, {addr.city}, {addr.province} {addr.postalCode}
                        </p>
                        <p className="text-xs font-mono text-autox-silver mt-2">Tel: {addr.phone}</p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-autox-border/60 flex justify-end">
                        <button
                          onClick={() => handleDeleteAddress(addr._id)}
                          className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Security & Password Tab */}
            {activeTab === 'security' && (
              <div className="glass-card p-6 sm:p-8 rounded-2xl border border-autox-border">
                <h3 className="text-lg font-bold font-display text-white uppercase tracking-wider mb-6 pb-4 border-b border-autox-border">
                  Password & Security Credentials
                </h3>
                <form onSubmit={handlePasswordUpdate} className="max-w-md space-y-4">
                  <div>
                    <label className="text-xs font-mono uppercase text-autox-muted block mb-1.5">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-autox-orange"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase text-autox-muted block mb-1.5">
                      New Password (Min 6 Characters)
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-autox-orange"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={passwordSaving}
                    className="py-3 px-6 rounded-xl bg-autox-orange hover:bg-autox-orangeHover text-white text-xs font-bold uppercase tracking-wider shadow-glow transition-all"
                  >
                    {passwordSaving ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-autox-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-autox-border mb-6">
              <div>
                <span className="text-[10px] font-mono uppercase text-autox-orange">Consignment Detail</span>
                <h3 className="text-xl font-bold font-display text-white">Order #{selectedOrder.orderNumber}</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-autox-muted hover:text-white">✕</button>
            </div>

            <div className="space-y-4">
              <div className="bg-autox-dark p-4 rounded-xl space-y-2 text-xs font-mono">
                <div className="flex justify-between text-autox-muted">
                  <span>Shipping Address:</span>
                  <span className="text-white text-right">
                    {selectedOrder.shippingAddress.fullName}, {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}
                  </span>
                </div>
                <div className="flex justify-between text-autox-muted">
                  <span>Payment Protocol:</span>
                  <span className="text-white uppercase font-bold">{selectedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-autox-muted">
                  <span>Payment Status:</span>
                  <span className="text-emerald-400 uppercase font-bold">{selectedOrder.paymentStatus}</span>
                </div>
              </div>

              {/* Items Snapshots */}
              <div className="divide-y divide-autox-border/60">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">{item.name}</span>
                      <span className="font-mono text-autox-muted">SKU: {item.SKU} • Qty: {item.quantity}</span>
                    </div>
                    <span className="font-display font-bold text-white text-sm">
                      PKR {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-autox-border flex justify-between items-baseline text-white">
                <span className="text-xs uppercase font-mono">Total (PKR)</span>
                <span className="text-2xl font-bold font-display text-autox-orange">
                  PKR {selectedOrder.total.toLocaleString()}
                </span>
              </div>

              {/* Cancellation button if eligible */}
              {['placed', 'confirmed'].includes(selectedOrder.orderStatus) && (
                <div className="pt-4 border-t border-autox-border flex justify-end">
                  <button
                    onClick={() => handleCancelOrder(selectedOrder._id)}
                    className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    Cancel Consignment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-autox-border max-w-lg w-full">
            <div className="flex items-center justify-between pb-4 border-b border-autox-border mb-6">
              <div>
                <span className="text-[10px] font-mono uppercase text-autox-orange">Live Logistics Telemetry</span>
                <h3 className="text-xl font-bold font-display text-white">Tracking #{trackingModalOrder.orderNumber}</h3>
              </div>
              <button onClick={() => setTrackingModalOrder(null)} className="text-autox-muted hover:text-white">✕</button>
            </div>

            <div className="space-y-6 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-autox-border">
              {trackingModalOrder.deliveryTracking?.map((track, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-autox-orange border-2 border-autox-bg" />
                  <span className="text-[10px] font-mono uppercase text-autox-orange font-bold block">
                    {track.status} • {track.location}
                  </span>
                  <p className="text-xs text-white font-medium mt-0.5">{track.message}</p>
                  <span className="text-[10px] font-mono text-autox-muted block mt-1">
                    {new Date(track.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;

