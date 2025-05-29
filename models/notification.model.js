const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Notification = sequelize.define('Notification', {
    NotificationID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    UserID: { type: DataTypes.INTEGER },
    Message: { type: DataTypes.STRING },
    IsRead: { type: DataTypes.BOOLEAN, defaultValue: false },
    CreatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'Notifications',
    timestamps: false
  });
  
  module.exports = Notification;