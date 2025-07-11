const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Cart = sequelize.define('Cart', {
  cart_id: { field: 'CartID', type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { field: 'UserID', type: DataTypes.INTEGER },
  total_price: { field: 'TotalPrice', type: DataTypes.DECIMAL(18, 2), allowNull: false },
  status: { field: 'Status', type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'Carts',
  timestamps: false
});
module.exports = Cart;
Cart.prototype.toSafeObject = function () {
  return {
    cartId: this.cart_id,
    userId: this.user_id,
    totalPrice: this.total_price,
    status: this.status
  };
};