const Notification = require('../models/notification.model');

let ioInstance = null;

// Hàm được gọi trong server.js sau khi io được khởi tạo
function setSocketIO(instance) {
  ioInstance = instance;
}

// Hàm để sử dụng ở nơi khác nếu cần
function getSocketIO() {
  if (!ioInstance) throw new Error('Socket.IO not initialized');
  return ioInstance;
}

// Gửi notification realtime + lưu vào DB
async function sendNotification(userId, message) {
  const notification = await Notification.create({ user_id: userId, message });
  await notification.reload();

  if (!ioInstance) {
    console.warn('⚠️ Socket.IO not initialized — cannot emit notification');
    return notification;
  }

  ioInstance.to(`user:${userId}`).emit('notification:new', notification.toSafeObject());
  return notification;
}

module.exports = {
  setSocketIO,
  getSocketIO,
  sendNotification
};
