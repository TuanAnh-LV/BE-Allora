const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const ChatMessage = sequelize.define('ChatMessage', {
  chat_message_id: { field: 'ChatMessageID', type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { field: 'UserID', type: DataTypes.INTEGER },
  message: { field: 'Message', type: DataTypes.TEXT },
  sent_at: { field: 'SentAt', type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'ChatMessages',
  timestamps: false
});
module.exports = ChatMessage;
ChatMessage.prototype.toSafeObject = function () {
  return {
    chatMessageId: this.chat_message_id,
    userId: this.user_id,
    message: this.message,
    sentAt: this.sent_at
  };
};