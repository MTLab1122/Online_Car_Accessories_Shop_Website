import api from './api';

export const cartService = {
  getCart: () => api.get('/cart'),
  addItem: (productId, quantity = 1) => api.post('/cart/items', { productId, quantity }),
  updateQuantity: (productId, quantity) => api.patch(`/cart/items/${productId}`, { quantity }),
  removeItem: (productId) => api.delete(`/cart/items/${productId}`),
  applyCoupon: (code) => api.post('/cart/coupon', { code }),
  removeCoupon: () => api.delete('/cart/coupon'),
  clearCart: () => api.delete('/cart'),
  syncCart: (sessionId) => api.post('/cart/sync', { sessionId })
};

