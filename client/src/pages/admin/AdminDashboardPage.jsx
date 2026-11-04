import React, { useState, useEffect } from 'react';
import {
  Shield,
  DollarSign,
  Package,
  Users,
  AlertTriangle,
  CheckCircle,
  Truck,
  Plus,
  Trash2,
  Edit,
  Eye,
  Tag,
  MessageSquare,
  Search,
  Filter,
  BarChart3,
  Layers,
  X,
  Upload
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { categoryService } from '../../services/categoryService';
import { productService } from '../../services/productService';
import toast from 'react-hot-toast';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('analytics'); // analytics | orders | products | categories | customers | reviews | coupons

  // Dashboard Stats
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Orders Tab State
  const [orders, setOrders] = useState([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState('confirmed');
  const [statusNote, setStatusNote] = useState('');

  // Products Tab State
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [productForm, setProductForm] = useState({
    name: '',
    SKU: '',
    description: '',
    category: '',
    brand: '',
    price: '',
    discountPercentage: 0,
    stock: 10,
    images: ['https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80'],
    model3D: '',
    isFeatured: false,
    isBestSeller: false
  });

  // Categories Tab State
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', image: '' });
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Customers Tab State
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  // Reviews Tab State
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Coupons Tab State
  const [coupons, setCoupons] = useState([]);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    minimumOrderAmount: 5000,
    maximumDiscount: 15000,
    expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usageLimit: 200,
    isActive: true
  });

  // Load Dashboard Stats
  const fetchDashboardStats = async () => {
    try {
      setLoadingStats(true);
      const res = await adminService.getDashboard();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    categoryService.getCategories().then((res) => {
      if (res.success) setCategories(res.data);
    });
  }, []);

  // Tab Loaders
  useEffect(() => {
    if (activeTab === 'orders') {
      setLoadingOrders(true);
      adminService.getOrders({ search: orderSearch, status: orderStatusFilter }).then((res) => {
        if (res.success) setOrders(res.data);
        setLoadingOrders(false);
      });
    } else if (activeTab === 'products') {
      setLoadingProducts(true);
      productService.getProducts({ search: productSearch, limit: 50 }).then((res) => {
        if (res.success) setProducts(res.data);
        setLoadingProducts(false);
      });
    } else if (activeTab === 'customers') {
      setLoadingCustomers(true);
      adminService.getCustomers().then((res) => {
        if (res.success) setCustomers(res.data);
        setLoadingCustomers(false);
      });
    } else if (activeTab === 'reviews') {
      setLoadingReviews(true);
      adminService.getReviews().then((res) => {
        if (res.success) setReviews(res.data);
        setLoadingReviews(false);
      });
    } else if (activeTab === 'coupons') {
      adminService.getCoupons().then((res) => {
        if (res.success) setCoupons(res.data);
      });
    }
  }, [activeTab, orderSearch, orderStatusFilter, productSearch]);

  // Order Status Update
  const handleUpdateOrderStatus = async (orderId) => {
    try {
      const res = await adminService.updateOrderStatus(orderId, {
        orderStatus: newStatus,
        note: statusNote || `Status updated by Admin to ${newStatus}`,
        location: 'AUTOX National Operations Hub'
      });
      if (res.success) {
        toast.success(`Order status updated to ${newStatus}`);
        setOrders(orders.map((o) => (o._id === orderId ? res.data : o)));
        setUpdatingOrderId(null);
        setStatusNote('');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update order status');
    }
  };

  // Product Save (Create or Update)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (!productForm.category) {
        toast.error('Please assign a category');
        return;
      }

      if (editingProductId) {
        const res = await adminService.updateProduct(editingProductId, productForm);
        if (res.success) {
          toast.success('Product updated successfully');
          setProducts(products.map((p) => (p._id === editingProductId ? res.data : p)));
        }
      } else {
        const res = await adminService.createProduct(productForm);
        if (res.success) {
          toast.success('Product created successfully');
          setProducts([res.data, ...products]);
        }
      }
      setShowProductModal(false);
      setEditingProductId(null);
    } catch (err) {
      toast.error(err.message || 'Product operation failed');
    }
  };

  // Product Delete
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await adminService.deleteProduct(id);
      if (res.success) {
        toast.success('Product deleted');
        setProducts(products.filter((p) => p._id !== id));
      }
    } catch (err) {
      toast.error(err.message || 'Cannot delete product');
    }
  };

  // Category Save
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await adminService.createCategory(categoryForm);
      if (res.success) {
        toast.success('Category created');
        setCategories([...categories, res.data]);
        setShowCategoryModal(false);
        setCategoryForm({ name: '', description: '', image: '' });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create category');
    }
  };

  // Customer Toggle Status
  const handleToggleCustomer = async (id, currentStatus) => {
    try {
      const res = await adminService.updateCustomerStatus(id, !currentStatus);
      if (res.success) {
        toast.success(`Customer ${!currentStatus ? 'activated' : 'suspended'}`);
        setCustomers(customers.map((c) => (c._id === id ? res.data : c)));
      }
    } catch (err) {
      toast.error(err.message || 'Cannot modify customer status');
    }
  };

  // Review Status Update
  const handleReviewAction = async (id, status) => {
    try {
      const res = await adminService.updateReviewStatus(id, status);
      if (res.success) {
        toast.success(`Review ${status}`);
        setReviews(reviews.map((r) => (r._id === id ? res.data : r)));
      }
    } catch (err) {
      toast.error(err.message || 'Cannot update review status');
    }
  };

  // Coupon Create
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const res = await adminService.createCoupon(couponForm);
      if (res.success) {
        toast.success('Coupon created');
        setCoupons([res.data, ...coupons]);
        setShowCouponModal(false);
      }
    } catch (err) {
      toast.error(err.message || 'Cannot create coupon');
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const res = await adminService.deleteCoupon(id);
      if (res.success) {
        toast.success('Coupon removed');
        setCoupons(coupons.filter((c) => c._id !== id));
      }
    } catch (err) {
      toast.error(err.message || 'Cannot remove coupon');
    }
  };

  return (
    <div className="min-h-screen bg-autox-bg py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-autox-border mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-autox-orange/20 border border-autox-orange/40 text-autox-orange flex items-center justify-center shadow-glow">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-display text-white uppercase tracking-wider">
                  AUTOX Mission Control
                </h1>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-autox-orange text-white uppercase">
                  Root Admin
                </span>
              </div>
              <p className="text-xs font-mono text-autox-muted">
                Centralized telemetry, catalog management, customer accounts & financials
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setEditingProductId(null);
                setProductForm({
                  name: '',
                  SKU: `AOX-${Math.floor(1000 + Math.random() * 9000)}`,
                  description: '',
                  category: categories[0]?._id || '',
                  brand: 'AeroCraft Pro',
                  price: '',
                  discountPercentage: 0,
                  stock: 10,
                  images: ['https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80'],
                  model3D: '',
                  isFeatured: true,
                  isBestSeller: false
                });
                setShowProductModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-autox-orange hover:bg-autox-orangeHover text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-glow transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Accessory</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-autox-border pb-4 mb-8 overflow-x-auto text-xs font-semibold uppercase tracking-wider">
          {[
            { id: 'analytics', label: 'Dashboard Metrics', icon: BarChart3 },
            { id: 'orders', label: 'Order Fulfillment', icon: Truck },
            { id: 'products', label: 'Hardware Catalog', icon: Package },
            { id: 'categories', label: 'Divisions', icon: Layers },
            { id: 'customers', label: 'Pilot Customers', icon: Users },
            { id: 'reviews', label: 'Customer Reviews', icon: MessageSquare },
            { id: 'coupons', label: 'Promotional Coupons', icon: Tag }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-autox-orange text-white shadow-glow'
                    : 'text-autox-silver hover:bg-autox-card'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: ANALYTICS DASHBOARD */}
        {activeTab === 'analytics' && stats && (
          <div className="space-y-8">
            {/* Top Revenue & Volume KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-card p-6 rounded-2xl border border-autox-border">
                <div className="flex items-center justify-between text-autox-muted mb-2 text-xs font-mono uppercase">
                  <span>Gross Order Volume</span>
                  <DollarSign className="w-4 h-4 text-autox-orange" />
                </div>
                <div className="text-2xl font-bold font-display text-white">
                  PKR {stats.metrics.totalRevenue.toLocaleString()}
                </div>
                <span className="text-[10px] text-autox-muted font-mono block mt-1">
                  Completed: PKR {stats.metrics.completedRevenue.toLocaleString()}
                </span>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-autox-border">
                <div className="flex items-center justify-between text-autox-muted mb-2 text-xs font-mono uppercase">
                  <span>Total Orders</span>
                  <Package className="w-4 h-4 text-autox-orange" />
                </div>
                <div className="text-3xl font-bold font-display text-white">
                  {stats.metrics.totalOrders}
                </div>
                <span className="text-[10px] text-amber-400 font-mono block mt-1">
                  Pending Dispatch: {stats.metrics.pendingOrders}
                </span>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-autox-border">
                <div className="flex items-center justify-between text-autox-muted mb-2 text-xs font-mono uppercase">
                  <span>Registered Pilots</span>
                  <Users className="w-4 h-4 text-autox-orange" />
                </div>
                <div className="text-3xl font-bold font-display text-white">
                  {stats.metrics.totalCustomers}
                </div>
                <span className="text-[10px] text-emerald-400 font-mono block mt-1">
                  Verified Accounts Active
                </span>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-autox-border">
                <div className="flex items-center justify-between text-autox-muted mb-2 text-xs font-mono uppercase">
                  <span>Active Catalog</span>
                  <Layers className="w-4 h-4 text-autox-orange" />
                </div>
                <div className="text-3xl font-bold font-display text-white">
                  {stats.metrics.totalProducts}
                </div>
                <span className="text-[10px] text-red-400 font-mono block mt-1">
                  Low Stock Alert: {stats.metrics.lowStockCount} units
                </span>
              </div>
            </div>

            {/* Recent Orders & Low Stock Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Orders Table */}
              <div className="glass-card p-6 rounded-2xl border border-autox-border">
                <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider mb-4 pb-3 border-b border-autox-border flex items-center justify-between">
                  <span>Recent Consignments</span>
                  <button onClick={() => setActiveTab('orders')} className="text-xs font-mono text-autox-orange hover:underline">
                    View All →
                  </button>
                </h3>
                <div className="space-y-3">
                  {stats.recentOrders?.map((ord) => (
                    <div key={ord._id} className="p-3 bg-autox-dark rounded-xl flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="font-bold text-white block">{ord.orderNumber}</span>
                        <span className="text-autox-muted">{ord.user?.name} • {ord.paymentMethod.toUpperCase()}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-autox-orange block">PKR {ord.total.toLocaleString()}</span>
                        <span className="text-[10px] uppercase text-emerald-400">{ord.orderStatus}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Stock Alerts */}
              <div className="glass-card p-6 rounded-2xl border border-autox-border">
                <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider mb-4 pb-3 border-b border-autox-border flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <span>Depot Low Stock Telemetry</span>
                </h3>
                <div className="space-y-3">
                  {stats.lowStockProducts?.map((p) => (
                    <div key={p._id} className="p-3 bg-autox-dark rounded-xl flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="font-bold text-white block truncate max-w-xs">{p.name}</span>
                        <span className="text-autox-muted">SKU: {p.SKU}</span>
                      </div>
                      <div className="text-right">
                        <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/40">
                          {p.stock} Units Left
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDER MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-autox-border space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h3 className="text-xl font-bold font-display text-white uppercase">Consignment Management</h3>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search order #, customer..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="bg-autox-dark border border-autox-border rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-autox-orange w-full sm:w-64"
                />
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-autox-dark border border-autox-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-autox-orange"
                >
                  <option value="">All Statuses</option>
                  <option value="placed">Placed</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {loadingOrders ? (
              <div className="py-12 text-center text-xs font-mono text-autox-muted">Loading orders...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-autox-dark text-autox-muted uppercase tracking-wider border-b border-autox-border">
                    <tr>
                      <th className="p-3">Order Number</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Items</th>
                      <th className="p-3">Total (PKR)</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-autox-border/60">
                    {orders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-autox-dark/50">
                        <td className="p-3 font-bold text-white">{ord.orderNumber}</td>
                        <td className="p-3">
                          <span className="text-white block">{ord.shippingAddress?.fullName}</span>
                          <span className="text-[10px] text-autox-muted">{ord.shippingAddress?.city}</span>
                        </td>
                        <td className="p-3">{ord.items?.length} items</td>
                        <td className="p-3 font-bold text-autox-orange">PKR {ord.total.toLocaleString()}</td>
                        <td className="p-3 uppercase">
                          <span className={ord.paymentStatus === 'completed' ? 'text-emerald-400' : 'text-amber-400'}>
                            {ord.paymentMethod} ({ord.paymentStatus})
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-autox-card border border-autox-border text-white">
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setUpdatingOrderId(ord._id);
                              setNewStatus(ord.orderStatus);
                            }}
                            className="px-3 py-1 rounded bg-autox-orange text-white text-[11px] font-semibold uppercase hover:bg-autox-orangeHover"
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Order Status Modal */}
        {updatingOrderId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="glass-card p-6 rounded-2xl border border-autox-border max-w-md w-full space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-autox-border">
                <h4 className="font-display font-bold text-white uppercase">Transition Consignment Status</h4>
                <button onClick={() => setUpdatingOrderId(null)} className="text-autox-muted hover:text-white">✕</button>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-autox-muted block mb-1.5">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-autox-orange"
                >
                  <option value="placed">Placed</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-autox-muted block mb-1.5">Tracking Note</label>
                <input
                  type="text"
                  placeholder="e.g. Dispatched via TCS Courier Tracking # 9812401"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-autox-orange"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setUpdatingOrderId(null)}
                  className="px-4 py-2 text-xs font-mono uppercase text-autox-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateOrderStatus(updatingOrderId)}
                  className="px-5 py-2 rounded-xl bg-autox-orange text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Save Status Transition
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-autox-border space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h3 className="text-xl font-bold font-display text-white uppercase">Equipment Catalog ({products.length})</h3>
              <input
                type="text"
                placeholder="Search by name, SKU, brand..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="bg-autox-dark border border-autox-border rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-autox-orange w-full sm:w-64"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-autox-dark text-autox-muted uppercase tracking-wider border-b border-autox-border">
                  <tr>
                    <th className="p-3">Product Name</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price (PKR)</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-autox-border/60">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-autox-dark/50">
                      <td className="p-3 font-bold text-white max-w-xs truncate">{p.name}</td>
                      <td className="p-3 text-autox-orange">{p.SKU}</td>
                      <td className="p-3 text-autox-silver">{p.category?.name || 'Aero'}</td>
                      <td className="p-3 font-bold text-white">PKR {p.price.toLocaleString()}</td>
                      <td className="p-3">
                        <span className={p.stock <= 5 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingProductId(p._id);
                            setProductForm({
                              name: p.name,
                              SKU: p.SKU,
                              description: p.description,
                              category: p.category?._id || categories[0]?._id,
                              brand: p.brand,
                              price: p.price,
                              discountPercentage: p.discountPercentage || 0,
                              stock: p.stock,
                              images: p.images || [],
                              model3D: p.model3D || '',
                              isFeatured: !!p.isFeatured,
                              isBestSeller: !!p.isBestSeller
                            });
                            setShowProductModal(true);
                          }}
                          className="px-2.5 py-1 rounded bg-autox-card hover:bg-autox-cardHover border border-autox-border text-white text-[11px]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p._id)}
                          className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 text-[11px]"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Product Modal */}
        {showProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-autox-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center pb-4 border-b border-autox-border mb-6">
                <h3 className="font-display font-bold text-xl text-white uppercase">
                  {editingProductId ? 'Edit Product Item' : 'New Equipment Specification'}
                </h3>
                <button onClick={() => setShowProductModal(false)} className="text-autox-muted hover:text-white">✕</button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-autox-muted block mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-autox-muted block mb-1">SKU *</label>
                    <input
                      type="text"
                      required
                      value={productForm.SKU}
                      onChange={(e) => setProductForm({ ...productForm, SKU: e.target.value })}
                      className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-2.5 text-white uppercase"
                    />
                  </div>

                  <div>
                    <label className="text-autox-muted block mb-1">Brand *</label>
                    <input
                      type="text"
                      required
                      value={productForm.brand}
                      onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                      className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-autox-muted block mb-1">Category Division *</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-2.5 text-white"
                    >
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-autox-muted block mb-1">Price (PKR) *</label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-autox-muted block mb-1">Discount (%)</label>
                    <input
                      type="number"
                      value={productForm.discountPercentage}
                      onChange={(e) => setProductForm({ ...productForm, discountPercentage: e.target.value })}
                      className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-autox-muted block mb-1">Available Stock Units *</label>
                    <input
                      type="number"
                      required
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-2.5 text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-autox-muted block mb-1">Product Description *</label>
                    <textarea
                      rows={3}
                      required
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-2.5 text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-autox-muted block mb-1">Primary Image URL</label>
                    <input
                      type="text"
                      value={productForm.images[0] || ''}
                      onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                      className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-2.5 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-autox-border">
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="px-4 py-2 text-autox-muted hover:text-white uppercase font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-autox-orange text-white font-bold uppercase shadow-glow"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-autox-border space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold font-display text-white uppercase">Product Divisions</h3>
              <button
                onClick={() => setShowCategoryModal(true)}
                className="px-4 py-2 rounded-xl bg-autox-orange text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-glow"
              >
                <Plus className="w-4 h-4" />
                <span>New Division</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div key={cat._id} className="p-4 bg-autox-dark rounded-xl border border-autox-border flex items-center gap-4">
                  <img src={cat.image} alt="" className="w-14 h-14 object-cover rounded-lg" />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-white text-sm truncate">{cat.name}</h4>
                    <p className="text-[11px] text-autox-muted font-mono">{cat.slug}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PILOT CUSTOMERS */}
        {activeTab === 'customers' && (
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-autox-border space-y-6">
            <h3 className="text-xl font-bold font-display text-white uppercase">Pilot Customer Directory</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-autox-dark text-autox-muted uppercase border-b border-autox-border">
                  <tr>
                    <th className="p-3">Customer Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-autox-border/60">
                  {customers.map((c) => (
                    <tr key={c._id} className="hover:bg-autox-dark/50">
                      <td className="p-3 font-bold text-white">{c.name}</td>
                      <td className="p-3 text-autox-silver">{c.email}</td>
                      <td className="p-3 text-autox-muted">{c.phone || 'N/A'}</td>
                      <td className="p-3">
                        <span className={c.isActive ? 'text-emerald-400' : 'text-red-400'}>
                          {c.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleToggleCustomer(c._id, c.isActive)}
                          className={`px-3 py-1 rounded text-[11px] font-bold uppercase ${
                            c.isActive ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          {c.isActive ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-autox-border space-y-6">
            <h3 className="text-xl font-bold font-display text-white uppercase">Customer Reviews Moderation</h3>
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev._id} className="p-4 bg-autox-dark rounded-xl border border-autox-border flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{rev.title}</span>
                      <span className="text-amber-400 font-bold">★ {rev.rating}</span>
                    </div>
                    <p className="text-xs text-autox-silver mt-1">{rev.comment}</p>
                    <span className="text-[10px] font-mono text-autox-muted mt-1 block">
                      By {rev.user?.name} on {rev.product?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {rev.status !== 'approved' && (
                      <button
                        onClick={() => handleReviewAction(rev._id, 'approved')}
                        className="px-3 py-1.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase"
                      >
                        Approve
                      </button>
                    )}
                    {rev.status !== 'hidden' && (
                      <button
                        onClick={() => handleReviewAction(rev._id, 'hidden')}
                        className="px-3 py-1.5 rounded bg-red-500/20 text-red-400 text-xs font-bold uppercase"
                      >
                        Hide
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: COUPONS */}
        {activeTab === 'coupons' && (
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-autox-border space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold font-display text-white uppercase">Promotional Coupons</h3>
              <button
                onClick={() => setShowCouponModal(true)}
                className="px-4 py-2 rounded-xl bg-autox-orange text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-glow"
              >
                <Plus className="w-4 h-4" />
                <span>Create Coupon</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {coupons.map((c) => (
                <div key={c._id} className="p-5 bg-autox-dark rounded-2xl border border-autox-border flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-extrabold text-lg text-autox-orange">{c.code}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                        {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `PKR ${c.discountValue} OFF`}
                      </span>
                    </div>
                    <p className="text-xs text-autox-muted font-mono">
                      Min Order: PKR {c.minimumOrderAmount.toLocaleString()}
                    </p>
                    <p className="text-xs text-autox-muted font-mono">
                      Used: {c.usageCount} / {c.usageLimit} times
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-autox-border flex justify-end">
                    <button
                      onClick={() => handleDeleteCoupon(c._id)}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-mono"
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

        {/* Coupon Modal */}
        {showCouponModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-autox-border max-w-md w-full space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-autox-border">
                <h4 className="font-display font-bold text-white uppercase">Issue Promotional Coupon</h4>
                <button onClick={() => setShowCouponModal(false)} className="text-autox-muted hover:text-white">✕</button>
              </div>

              <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs font-mono">
                <div>
                  <label className="text-autox-muted block mb-1">Coupon Code (Uppercase)</label>
                  <input
                    type="text"
                    required
                    value={couponForm.code}
                    onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. VIP25"
                    className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-2.5 text-white uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-autox-muted block mb-1">Discount Type</label>
                    <select
                      value={couponForm.discountType}
                      onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
                      className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-2.5 text-white"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed (PKR)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-autox-muted block mb-1">Discount Value</label>
                    <input
                      type="number"
                      required
                      value={couponForm.discountValue}
                      onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })}
                      className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-2.5 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-autox-muted block mb-1">Minimum Order Subtotal (PKR)</label>
                  <input
                    type="number"
                    value={couponForm.minimumOrderAmount}
                    onChange={(e) => setCouponForm({ ...couponForm, minimumOrderAmount: e.target.value })}
                    className="w-full bg-autox-dark border border-autox-border rounded-xl px-4 py-2.5 text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-autox-border">
                  <button
                    type="button"
                    onClick={() => setShowCouponModal(false)}
                    className="px-4 py-2 text-autox-muted hover:text-white uppercase font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-autox-orange text-white font-bold uppercase shadow-glow"
                  >
                    Issue Coupon
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;

