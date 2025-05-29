const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Payment = sequelize.define('Payment', {
    PaymentID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    OrderID: { type: DataTypes.INTEGER },
    Amount: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
    PaymentDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    PaymentStatus: { type: DataTypes.STRING, allowNull: false }
  }, {
    tableName: 'Payments',
    timestamps: false
  });
  
  module.exports = Payment;