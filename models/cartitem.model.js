const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const CartItem = sequelize.define('CartItem', {
  cart_item_id: { field: 'CartItemID', type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cart_id: { field: 'CartID', type: DataTypes.INTEGER },
  product_id: { field: 'ProductID', type: DataTypes.INTEGER },
  quantity: { field: 'Quantity', type: DataTypes.INTEGER, allowNull: false },
  price: { field: 'Price', type: DataTypes.DECIMAL(18, 2), allowNull: false }
}, {
  tableName: 'CartItems',
  timestamps: false
});
module.exports = CartItem;
CartItem.prototype.toSafeObject = function () {
  return {
    cartItemId: this.cart_item_id,
    cartId: this.cart_id,
    productId: this.product_id,
    quantity: this.quantity,
    price: this.price
  };
};