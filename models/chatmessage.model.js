const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const ChatMessage = sequelize.define('ChatMessage', {
    ChatMessageID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    UserID: { type: DataTypes.INTEGER },
    Message: { type: DataTypes.TEXT },
    SentAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'ChatMessages',
    timestamps: false
  });
  
  module.exports = ChatMessage;