const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const authenticateToken = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart and CartItem operations
 */

/**
 * @swagger
 * /api/carts/items:
 *   post:
 *     summary: Add an item to the current user's cart
 *     tags: [Cart]
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
 *               - quantity
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Item added to cart
 *       404:
 *         description: Product not found
 */
router.post('/items', authenticateToken, cartController.addItemToCart);

/**
 * @swagger
 * /api/carts:
 *   get:
 *     summary: Get the current active cart of the authenticated user
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current cart with items and total price
 *       404:
 *         description: Cart not found
 */
router.get('/', authenticateToken, cartController.getCurrentCart);

/**
 * @swagger
 * /api/carts/items/{id}:
 *   put:
 *     summary: Update quantity of a cart item
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: CartItem ID
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cart item updated
 *       404:
 *         description: Item not found
 */
router.put('/items/:id', authenticateToken, cartController.updateCartItemQuantity);

/**
 * @swagger
 * /api/carts/items/{id}:
 *   delete:
 *     summary: Remove a specific item from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: CartItem ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item removed
 *       404:
 *         description: Item not found
 */
router.delete('/items/:id', authenticateToken, cartController.removeItemFromCart);

/**
 * @swagger
 * /api/carts:
 *   delete:
 *     summary: Clear all items from the current user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 *       404:
 *         description: Cart not found
 */
router.delete('/', authenticateToken, cartController.clearCart);

module.exports = router;
