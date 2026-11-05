import api from './api';
import { showcaseCategories } from '../data/showcaseData';

export const categoryService = {
  getCategories: async () => {
    try {
      const res = await api.get('/categories');
      if (res && res.data && res.data.length > 0) return res;
      throw new Error('No categories returned from backend, invoking showcase fallback');
    } catch {
      return {
        success: true,
        count: showcaseCategories.length,
        data: showcaseCategories
      };
    }
  },

  getCategoryBySlug: async (slug) => {
    try {
      const res = await api.get(`/categories/${slug}`);
      if (res && res.data) return res;
      throw new Error('Category not found in backend, invoking showcase lookup');
    } catch (err) {
      const item = showcaseCategories.find(c => c.slug === slug);
      if (item) return { success: true, data: item };
      throw err;
    }
  }
};
