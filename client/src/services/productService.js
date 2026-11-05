import api from './api';
import { showcaseProducts } from '../data/showcaseData';

export const productService = {
  getProducts: async (params = {}) => {
    try {
      const res = await api.get('/products', { params });
      if (res && res.data && res.data.length > 0) return res;
      throw new Error('No backend products returned, invoking showcase dataset');
    } catch {
      // Graceful showcase fallback for static GitHub Pages and offline mode
      let filtered = [...showcaseProducts];
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
        );
      }
      if (params.category) {
        filtered = filtered.filter(p => p.category?.slug === params.category || p.category === params.category);
      }
      if (params.brand) {
        filtered = filtered.filter(p => p.brand.toLowerCase() === params.brand.toLowerCase());
      }
      return {
        success: true,
        count: filtered.length,
        pagination: { page: 1, limit: 12, total: filtered.length, totalPages: 1 },
        data: filtered
      };
    }
  },

  getFeatured: async () => {
    try {
      const res = await api.get('/products/featured');
      if (res && res.data && res.data.length > 0) return res;
      throw new Error('No backend featured products returned, invoking showcase dataset');
    } catch {
      const featured = showcaseProducts.filter(p => p.isFeatured);
      return {
        success: true,
        count: featured.length,
        data: featured
      };
    }
  },

  getProductBySlug: async (slug) => {
    try {
      const res = await api.get(`/products/${slug}`);
      if (res && res.data) return res;
      throw new Error('Product not found in backend, invoking showcase lookup');
    } catch (err) {
      const item = showcaseProducts.find(p => p.slug === slug);
      if (item) return { success: true, data: item };
      throw err;
    }
  }
};
