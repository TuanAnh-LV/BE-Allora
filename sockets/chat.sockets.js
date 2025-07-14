const { Server } = require('socket.io');
const ChatMessage = require('../models/chatmessage.model');

function setupChatSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected');

    // Mỗi client sẽ join room theo userId
    socket.on('join', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined room user_${userId}`);
    });

    // Gửi tin nhắn
    socket.on('send-message', async ({ senderId, receiverId, message }) => {
      try {
        const newMsg = await ChatMessage.create({
          user_id: senderId,
          receiver_id: receiverId,
          message
        });

        const safeMsg = newMsg.toSafeObject();

        // Gửi tin nhắn cho người nhận
        io.to(`user_${receiverId}`).emit('receive-message', safeMsg);

        // Gửi lại cho người gửi nếu cần đồng bộ UI
        socket.emit('receive-message', safeMsg);
      } catch (error) {
        console.error('Failed to send message:', error);
        socket.emit('error-message', 'Message delivery failed');
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
}

module.exports = setupChatSocket;
