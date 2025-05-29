const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  UserID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Username: { type: DataTypes.STRING, allowNull: false },
  PasswordHash: { type: DataTypes.STRING, allowNull: false },
  Email: { type: DataTypes.STRING, allowNull: false },
  PhoneNumber: { type: DataTypes.STRING },
  Address: { type: DataTypes.STRING },
  Role: { type: DataTypes.STRING, allowNull: false },
  IsVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  VerifyToken: {
    type: DataTypes.STRING,
    allowNull: true
  }
  
}, {
  tableName: 'Users',
  timestamps: false
});

module.exports = User;