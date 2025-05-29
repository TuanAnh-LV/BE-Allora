const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const CartItem = sequelize.define('CartItem', {
    CartItemID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    CartID: { type: DataTypes.INTEGER },
    ProductID: { type: DataTypes.INTEGER },
    Quantity: { type: DataTypes.INTEGER, allowNull: false },
    Price: { type: DataTypes.DECIMAL(18, 2), allowNull: false }
  }, {
    tableName: 'CartItems',
    timestamps: false
  });
  
  module.exports = CartItem;