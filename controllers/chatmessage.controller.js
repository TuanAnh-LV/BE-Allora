const { Op } = require('sequelize');
const ChatMessage = require('../models/chatmessage.model');

/**
 * GET /api/chat/messages
 * Lấy tin nhắn giữa user đang đăng nhập và người còn lại (otherUserId)
 */
const getChatMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.query;

    if (!otherUserId) {
      return res.status(400).json({ message: 'Missing otherUserId in query' });
    }

    const messages = await ChatMessage.findAll({
      where: {
        [Op.or]: [
          { user_id: userId, receiver_id: otherUserId },
          { user_id: otherUserId, receiver_id: userId }
        ]
      },
      order: [['sent_at', 'ASC']]
    });

    const result = messages.map(msg => msg.toSafeObject());

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * POST /api/chat/messages
 * Gửi tin nhắn từ user đang đăng nhập đến receiverId
 * Body: { receiverId, message }
 */
const sendChatMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, message } = req.body;

    if (!receiverId || !message?.trim()) {
      return res.status(400).json({ message: 'Missing receiverId or message' });
    }

    const newMsg = await ChatMessage.create({
      user_id: senderId,
      receiver_id: receiverId,
      message
    });

    return res.status(201).json(newMsg.toSafeObject());
  } catch (error) {
    console.error('Error sending chat message:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getChatMessages,
  sendChatMessage
};
