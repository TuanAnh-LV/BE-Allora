const ChatMessage = require('../models/chatmessage.model');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('ChatSocket: Client connected');

    socket.on('join', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`ChatSocket: User ${userId} joined room user_${userId}`);
    });

    socket.on('send-message', async ({ senderId, receiverId, message }) => {
      try {
        const newMsg = await ChatMessage.create({
          user_id: senderId,
          receiver_id: receiverId,
          message
        });

        const safeMsg = newMsg.toSafeObject();

        io.to(`user_${receiverId}`).emit('receive-message', safeMsg);
        socket.emit('receive-message', safeMsg);
      } catch (error) {
        console.error('ChatSocket error:', error);
        socket.emit('error-message', 'Message delivery failed');
      }
    });

    socket.on('disconnect', () =>  {
      console.log('📨 ChatSocket: Client disconnected');
    });
  });
};
