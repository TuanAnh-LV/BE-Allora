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
 * /api/payment/paypal/create-order:
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
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 format: decimal
 *     responses:
 *       200:
 *         description: PayPal order created successfully
 *       400:
 *         description: Missing amount
 *       500:
 *         description: Internal server error
 */
router.post('/paypal/create-order', authenticateToken, paymentController.createPaypalOrder);

/**
 * @swagger
 * /api/payment/paypal/capture:
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
 *       200:
 *         description: Payment captured and saved successfully
 *       400:
 *         description: Missing data
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.post('/paypal/capture', authenticateToken, paymentController.capturePaypalPayment);

/**
 * @swagger
 * /api/payment/confirm:
 *   post:
 *     summary: Confirm payment and update order status
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
 *               - amount
 *               - paymentStatus
 *             properties:
 *               orderId:
 *                 type: integer
 *               amount:
 *                 type: number
 *                 format: decimal
 *               paymentStatus:
 *                 type: string
 *                 enum: [paid, failed, pending]
 *     responses:
 *       201:
 *         description: Payment confirmed and saved
 *       404:
 *         description: Order not found
 */
router.post('/confirm', authenticateToken, paymentController.confirmPayment);

module.exports = router;
