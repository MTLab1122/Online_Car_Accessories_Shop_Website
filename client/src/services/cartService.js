import api from './api';
import { showcaseProducts } from '../data/showcaseData';

// Local storage helper for static showcase mode
const getLocalCart = () => {
  try {
    const raw = localStorage.getItem('autox_showcase_cart');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Local cart read error', e);
  }
  return {
    items: [],
    itemCount: 0,
    subtotal: 0,
    shippingFee: 0,
    discount: 0,
    total: 0,
    coupon: null
  };
};

const saveLocalCart = (cart) => {
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = cart.coupon ? (subtotal * 0.1) : 0;
  const shippingFee = subtotal > 10000 || subtotal === 0 ? 0 : 500;
  const total = Math.max(0, subtotal - discount + shippingFee);

  const updated = {
    ...cart,
    itemCount,
    subtotal,
    discount,
    shippingFee,
    total
  };
  localStorage.setItem('autox_showcase_cart', JSON.stringify(updated));
  return updated;
};

export const cartService = {
  getCart: async () => {
    try {
      const res = await api.get('/cart');
      if (res && res.success) return res;
      throw new Error('Fallback to local cart');
    } catch {
      return { success: true, data: getLocalCart() };
    }
  },

  addItem: async (productId, quantity = 1) => {
    try {
      const res = await api.post('/cart/items', { productId, quantity });
      if (res && res.success) return res;
      throw new Error('Fallback to local cart');
    } catch {
      const cart = getLocalCart();
      const product = showcaseProducts.find(p => p._id === productId || p.slug === productId);
      const existing = cart.items.find(i => (i.product?._id || i.product) === productId);
      if (existing) {
        existing.quantity += quantity;
      } else if (product) {
        cart.items.push({
          product,
          quantity,
          price: product.discountPrice || product.price
        });
      }
      return { success: true, data: saveLocalCart(cart) };
    }
  },

  updateQuantity: async (productId, quantity) => {
    try {
      const res = await api.patch(`/cart/items/${productId}`, { quantity });
      if (res && res.success) return res;
      throw new Error('Fallback to local cart');
    } catch {
      const cart = getLocalCart();
      const item = cart.items.find(i => (i.product?._id || i.product) === productId);
      if (item) {
        if (quantity <= 0) {
          cart.items = cart.items.filter(i => i !== item);
        } else {
          item.quantity = quantity;
        }
      }
      return { success: true, data: saveLocalCart(cart) };
    }
  },

  removeItem: async (productId) => {
    try {
      const res = await api.delete(`/cart/items/${productId}`);
      if (res && res.success) return res;
      throw new Error('Fallback to local cart');
    } catch {
      const cart = getLocalCart();
      cart.items = cart.items.filter(i => (i.product?._id || i.product) !== productId);
      return { success: true, data: saveLocalCart(cart) };
    }
  },

  applyCoupon: async (code) => {
    try {
      const res = await api.post('/cart/coupon', { code });
      if (res && res.success) return res;
      throw new Error('Fallback to local cart');
    } catch {
      if (code && code.trim().toUpperCase() === 'WELCOME10') {
        const cart = getLocalCart();
        cart.coupon = { code: 'WELCOME10', discountType: 'percentage', discountValue: 10 };
        return { success: true, message: 'Coupon applied successfully!', data: saveLocalCart(cart) };
      }
      throw { message: 'Invalid promotional coupon code', status: 400 };
    }
  },

  removeCoupon: async () => {
    try {
      const res = await api.delete('/cart/coupon');
      if (res && res.success) return res;
      throw new Error('Fallback to local cart');
    } catch {
      const cart = getLocalCart();
      cart.coupon = null;
      return { success: true, data: saveLocalCart(cart) };
    }
  },

  clearCart: async () => {
    try {
      const res = await api.delete('/cart');
      if (res && res.success) return res;
      throw new Error('Fallback to local cart');
    } catch {
      localStorage.removeItem('autox_showcase_cart');
      return { success: true, data: getLocalCart() };
    }
  },

  syncCart: (sessionId) => api.post('/cart/sync', { sessionId }).catch(() => ({ success: true }))
};
