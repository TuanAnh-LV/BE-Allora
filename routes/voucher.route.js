const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/voucher.controller');
const { isAdmin } = require('../middlewares/role.middleware');
const authenticateToken = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   - name: Vouchers
 *     description: Manage vouchers
 */

/**
 * @swagger
 * /api/vouchers:
 *   get:
 *     tags: [Vouchers]
 *     summary: Get all vouchers
 *     responses:
 *       200:
 *         description: List of vouchers
 */
router.get('/', authenticateToken, voucherController.getAllVouchers);

/**
 * @swagger
 * /api/vouchers/my:
 *   get:
 *     tags: [Vouchers]
 *     summary: Get current user's vouchers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of vouchers assigned to current user
 */
router.get('/my', authenticateToken, voucherController.getCurrentUserVouchers);

/**
 * @swagger
 * /api/vouchers/{id}:
 *   get:
 *     tags: [Vouchers]
 *     summary: Get voucher by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Voucher detail
 */
router.get('/:id', authenticateToken, voucherController.getVoucherById);

/**
 * @swagger
 * /api/vouchers:
 *   post:
 *     tags: [Vouchers]
 *     summary: Create a new voucher
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: "SUMMER2025"
 *               discountPercent:
 *                 type: integer
 *                 example: 15
 *               expiryDate:
 *                 type: string
 *                 example: "2025-12-31"
 *                 description: Expiry date in format YYYY-MM-DD
 *               quantity:
 *                 type: integer
 *                 example: 50
 *     responses:
 *       201:
 *         description: Voucher created
 */
router.post('/', authenticateToken, isAdmin, voucherController.createVoucher);

/**
 * @swagger
 * /api/vouchers/{id}:
 *   put:
 *     tags: [Vouchers]
 *     summary: Update a voucher
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: "SUMMER2025"
 *               discountPercent:
 *                 type: integer
 *                 example: 20
 *               expiryDate:
 *                 type: string
 *                 example: "2025-12-31"
 *                 description: Expiry date in format YYYY-MM-DD
 *               quantity:
 *                 type: integer
 *                 example: 75
 *     responses:
 *       200:
 *         description: Voucher updated
 */
router.put('/:id', authenticateToken, isAdmin, voucherController.updateVoucher);

/**
 * @swagger
 * /api/vouchers/{id}:
 *   delete:
 *     tags: [Vouchers]
 *     summary: Delete a voucher
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Voucher deleted
 */
router.delete('/:id', authenticateToken, isAdmin, voucherController.deleteVoucher);

module.exports = router;
