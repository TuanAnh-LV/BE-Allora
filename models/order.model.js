const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Order = sequelize.define('Order', {
  order_id: { field: 'OrderID', type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cart_id: { field: 'CartID', type: DataTypes.INTEGER },
  user_id: { field: 'UserID', type: DataTypes.INTEGER },
  payment_method: { field: 'PaymentMethod', type: DataTypes.STRING, allowNull: false },
  billing_address: { field: 'BillingAddress', type: DataTypes.STRING, allowNull: false },
  order_status: { field: 'OrderStatus', type: DataTypes.STRING, allowNull: false },
  order_date: { field: 'OrderDate', type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'Orders',
  timestamps: false
});
module.exports = Order;
Order.prototype.toSafeObject = function () {
  return {
    orderId: this.order_id,
    cartId: this.cart_id,
    userId: this.user_id,
    paymentMethod: this.payment_method,
    billingAddress: this.billing_address,
    orderStatus: this.order_status,
    orderDate: this.order_date
  };
};
