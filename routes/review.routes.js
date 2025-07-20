const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const authenticateToken = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Feedback and rating for products
 */

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Submit a product review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - rating
 *             properties:
 *               productId:
 *                 type: integer
 *               rating:
 *                 type: integer
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review submitted successfully
 *       400:
 *         description: Invalid input or duplicate
 *       404:
 *         description: Product not found
 */
router.post('/', authenticateToken, reviewController.createReview);

/**
 * @swagger
 * /api/reviews/product/{productId}:
 *   get:
 *     summary: Get all reviews for a product
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: List of reviews
 */
router.get('/product/:productId', reviewController.getReviewsForProduct);

/**
 * @swagger
 * /api/reviews/product/{productId}/average:
 *   get:
 *     summary: Get average rating for a product
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Average rating and total reviews
 */
router.get('/product/:productId/average', reviewController.getAverageRating);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review by ID (if you are the author)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted
 *       403:
 *         description: Not allowed
 *       404:
 *         description: Review not found
 */
router.delete('/:id', authenticateToken, reviewController.deleteReview);

module.exports = router;
