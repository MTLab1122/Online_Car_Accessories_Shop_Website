import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user']
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Review must belong to a product']
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    maxlength: 120
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'hidden'],
    default: 'approved'
  }
}, {
  timestamps: true
});

// Avoid duplicate reviews per product per user
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method to recalculate product average rating & review count
reviewSchema.statics.calcAverageRatings = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId, status: 'approved' } },
    {
      $group: {
        _id: '$product',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      ratingAverage: Math.round(stats[0].avgRating * 10) / 10,
      ratingCount: stats[0].nRating
    });
  } else {
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      ratingAverage: 0,
      ratingCount: 0
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.product);
});

reviewSchema.post('remove', function () {
  this.constructor.calcAverageRatings(this.product);
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;

