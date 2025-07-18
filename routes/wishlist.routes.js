const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');
const authenticateToken = require('../middlewares/auth.middleware');
/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: Wishlist management
 */

/**
 * @swagger
 * /api/wishlist:
 *   post:
 *     summary: Add product to wishlist
 *     tags: [Wishlist]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               productId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Added or already in wishlist
 */
router.post('/',authenticateToken, wishlistController.addToWishlist);

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Get all WishList for current
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm yêu thích
 */
router.get('/',authenticateToken, wishlistController.getWishlistByUser);
/**
 * @swagger
 * /api/wishlist/{productId}:
 *   delete:
 *     summary: Remove product from wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của sản phẩm cần xóa khỏi wishlist
 *     responses:
 *       200:
 *         description: Removed or not found
 */
router.delete('/:productId',authenticateToken, wishlistController.removeFromWishlist);

module.exports = router;
