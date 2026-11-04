import api from './api';

export const reviewService = {
  getProductReviews: (productId) => api.get(`/reviews/product/${productId}`),
  createReview: (reviewData) => api.post('/reviews', reviewData),
  updateReview: (id, reviewData) => api.patch(`/reviews/${id}`, reviewData),
  deleteReview: (id) => api.delete(`/reviews/${id}`)
};
