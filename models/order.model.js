const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Order = sequelize.define('Order', {
    OrderID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    CartID: { type: DataTypes.INTEGER },
    UserID: { type: DataTypes.INTEGER },
    PaymentMethod: { type: DataTypes.STRING, allowNull: false },
    BillingAddress: { type: DataTypes.STRING, allowNull: false },
    OrderStatus: { type: DataTypes.STRING, allowNull: false },
    OrderDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'Orders',
    timestamps: false
  });
  
  module.exports = Order;