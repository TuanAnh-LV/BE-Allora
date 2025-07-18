const express = require('express');
const router = express.Router();
const spinController = require('../controllers/spin.controller');
const authenticateToken = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/spin:
 *   post:
 *     tags: [Spin]
 *     summary: Spin the wheel to win a voucher
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Spin result
 */
router.post('/', authenticateToken, spinController.spinWheel);

module.exports = router;
