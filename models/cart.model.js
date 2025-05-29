const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Cart = sequelize.define('Cart', {
    CartID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    UserID: { type: DataTypes.INTEGER },
    TotalPrice: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
    Status: { type: DataTypes.STRING, allowNull: false }
  }, {
    tableName: 'Carts',
    timestamps: false
  });
  
  module.exports = Cart;