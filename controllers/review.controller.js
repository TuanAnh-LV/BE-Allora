const Review = require('../models/review.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const { Op } = require('sequelize');

// R01 - Gửi đánh giá sản phẩm
exports.createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.userId;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const existing = await Review.findOne({
      where: { user_id: userId, product_id: productId }
    });

    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      user_id: userId,
      product_id: productId,
      rating,
      comment
    });

    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// R02 - Lấy danh sách đánh giá cho sản phẩm
exports.getReviewsForProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    const reviews = await Review.findAll({
      where: { product_id: productId },
      include: {
        model: User,
        as: 'User',
        attributes: ['user_id', 'name']
      },
      order: [['created_at', 'DESC']]
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// R03 - Tính trung bình rating sản phẩm
exports.getAverageRating = async (req, res) => {
  try {
    const productId = req.params.productId;

    const result = await Review.findAll({
      where: { product_id: productId },
      attributes: [
        [Review.sequelize.fn('AVG', Review.sequelize.col('rating')), 'averageRating'],
        [Review.sequelize.fn('COUNT', Review.sequelize.col('review_id')), 'totalReviews']
      ]
    });

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// R04 - (Optional) Xóa đánh giá của chính user
exports.deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.userId;

    const review = await Review.findByPk(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.user_id !== userId) {
      return res.status(403).json({ message: 'You cannot delete this review' });
    }

    await review.destroy();
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
