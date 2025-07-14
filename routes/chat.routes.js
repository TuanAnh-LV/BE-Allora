const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth.middleware');
const chatController = require('../controllers/chatmessage.controller');

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Real-Time Chat between Customer and Store Rep
 */

/**
 * @swagger
 * /api/chat/messages:
 *   get:
 *     summary: Get all chat messages between authenticated user and another user
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: otherUserId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The other user's ID in the conversation
 *     responses:
 *       200:
 *         description: List of chat messages
 *       400:
 *         description: Missing or invalid parameters
 */
router.get('/messages', authenticateToken, chatController.getChatMessages); // CH01

/**
 * @swagger
 * /api/chat/messages:
 *   post:
 *     summary: Send a new chat message
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiverId
 *               - message
 *             properties:
 *               receiverId:
 *                 type: integer
 *                 example: 2
 *               message:
 *                 type: string
 *                 example: "Xin chào, tôi cần hỗ trợ"
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       400:
 *         description: Missing required fields
 */
router.post('/messages', authenticateToken, chatController.sendChatMessage); // CH02

module.exports = router;
