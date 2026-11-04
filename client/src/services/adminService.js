import api from './api';

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getOrders: (params) => api.get('/admin/orders', { params }),
  updateOrderStatus: (id, data) => api.patch(`/admin/orders/${id}/status`, data),
  getCustomers: (params) => api.get('/admin/customers', { params }),
  updateCustomerStatus: (id, isActive) => api.patch(`/admin/customers/${id}/status`, { isActive }),
  getReviews: (params) => api.get('/admin/reviews', { params }),
  updateReviewStatus: (id, status) => api.patch(`/admin/reviews/${id}/status`, { status }),
  getCoupons: () => api.get('/admin/coupons'),
  createCoupon: (data) => api.post('/admin/coupons', data),
  updateCoupon: (id, data) => api.patch(`/admin/coupons/${id}`, data),
  deleteCoupon: (id) => api.delete(`/admin/coupons/${id}`),
  // Admin product & category mutation methods
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.patch(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.patch(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
  uploadImage: (formData) => api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

