const { Op } = require('sequelize');
const ChatMessage = require('../models/chatmessage.model');
const { sendNotification } = require('../utils/notify'); 

/**
 * GET /api/chat/messages
 */
const getChatMessages = async (req, res) => {
  try {
    const userId = req.user.userId;
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
 */
const sendChatMessage = async (req, res) => {
  try {
    const senderId = req.user.userId;
    const { receiverId, message } = req.body;

    if (!receiverId || !message?.trim()) {
      return res.status(400).json({ message: 'Missing receiverId or message' });
    }

    const newMsg = await ChatMessage.create({
      user_id: senderId,
      receiver_id: receiverId,
      message,
    });

    await sendNotification(receiverId, `💬 New message: ${message}`);

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
