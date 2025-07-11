const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Notification = sequelize.define('Notification', {
  notification_id: { field: 'NotificationID', type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { field: 'UserID', type: DataTypes.INTEGER },
  message: { field: 'Message', type: DataTypes.STRING },
  is_read: { field: 'IsRead', type: DataTypes.BOOLEAN, defaultValue: false },
  created_at: { field: 'CreatedAt', type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'Notifications',
  timestamps: false
});
module.exports = Notification;
Notification.prototype.toSafeObject = function () {
  return {
    notificationId: this.notification_id,
    userId: this.user_id,
    message: this.message,
    isRead: this.is_read,
    createdAt: this.created_at
  };
};
