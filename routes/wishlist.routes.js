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
 *   get:
 *     summary: Lấy chi tiết sản phẩm trong wishlist của user hiện tại
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của sản phẩm
 *     responses:
 *       200:
 *         description: Thông tin sản phẩm trong wishlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     wishlistId:
 *                       type: integer
 *                     productId:
 *                       type: integer
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     product:
 *                       type: object
 *                       properties:
 *                         productId:
 *                           type: integer
 *                         productName:
 *                           type: string
 *                         briefDescription:
 *                           type: string
 *                         imageUrl:
 *                           type: string
 *                         price:
 *                           type: number
 *       404:
 *         description: Không tìm thấy trong wishlist
 *       500:
 *         description: Lỗi server
 */
router.get('/:productId', authenticateToken, wishlistController.getWishlistItemDetail);


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
