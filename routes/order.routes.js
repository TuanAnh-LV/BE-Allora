const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth.middleware');
const orderController = require('../controllers/order.controller');

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: Order operations
 */
/**
 * @swagger
 * /api/orders/me:
 *   get:
 *     summary: Get all orders of the authenticated user
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user orders
 */
router.get('/me', authenticateToken, orderController.getMyOrders);    // O01
/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order details by order ID
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Order ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order details including cart items
 *       404:
 *         description: Order not found
 */
router.get('/:id', authenticateToken, orderController.getOrderDetails); // O02
/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create an order from the user's active cart
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - PaymentMethod
 *               - BillingAddress
 *             properties:
 *               PaymentMethod:
 *                 type: string
 *                 example: VNPay
 *               BillingAddress:
 *                 type: string
 *                 example: "123 Street, District 1, HCMC"
 *     responses:
 *       201:
 *         description: Order created successfully
 *       404:
 *         description: Active cart not found
 */
router.post('/', authenticateToken, orderController.createOrder);     // O03

module.exports = router;
