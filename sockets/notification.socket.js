const Notification = require('../models/notification.model');

module.exports = (io) => {
  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      socket.join(`user:${userId}`);
      console.log(`🔔 NotificationSocket: User ${userId} joined room user:${userId}`);
    }

    socket.on('join', (userRoomId) => {
      if (userRoomId) socket.join(`user:${userRoomId}`);
    });

    socket.on('sendNotification', async ({ userId, message }) => {
      const noti = await Notification.create({
        user_id: userId,
        message,
        is_read: false,
        created_at: new Date()
      });
      io.to(`user:${userId}`).emit('notification:new', noti.toSafeObject());
    });
  });
};
