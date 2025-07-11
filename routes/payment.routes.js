const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth.middleware');
const paymentController = require('../controllers/payment.controller');

/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: Payment operations
 */

/**
 * @swagger
 * /api/payments/checkout:
 *   post:
 *     summary: Create a new PayPal order
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *             properties:
 *               orderId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: PayPal order created successfully
 *       400:
 *         description: Invalid order
 *       500:
 *         description: Internal server error
 */
router.post('/checkout', authenticateToken, paymentController.checkout);

/**
 * @swagger
 * /api/payments/confirm:
 *   post:
 *     summary: Capture a PayPal payment and confirm it
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paypalOrderId
 *               - orderId
 *             properties:
 *               paypalOrderId:
 *                 type: string
 *                 example: 5O190127TN364715T
 *               orderId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Payment captured and saved successfully
 *       400:
 *         description: Capture failed
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.post('/confirm', authenticateToken, paymentController.confirmPayment);

module.exports = router;
