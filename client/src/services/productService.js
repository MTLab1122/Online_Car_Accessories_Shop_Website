import api from './api';

export const productService = {
  getProducts: (params) => api.get('/products', { params }),
  getFeatured: () => api.get('/products/featured'),
  getProductBySlug: (slug) => api.get(`/products/${slug}`)
};

