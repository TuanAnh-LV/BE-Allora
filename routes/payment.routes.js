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
 *               - OrderID
 *               - Amount
 *               - PaymentStatus
 *             properties:
 *               OrderID:
 *                 type: integer
 *               Amount:
 *                 type: number
 *                 format: decimal
 *               PaymentStatus:
 *                 type: string
 *                 enum: [paid, failed, pending]
 *     responses:
 *       201:
 *         description: Payment confirmed and saved
 *       404:
 *         description: Order not found
 */

router.post('/confirm', authenticateToken, paymentController.confirmPayment); // PM02

module.exports = router;
