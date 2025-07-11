const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Payment = sequelize.define('Payment', {
  payment_id: { field: 'PaymentID', type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  order_id: { field: 'OrderID', type: DataTypes.INTEGER },
  amount: { field: 'Amount', type: DataTypes.DECIMAL(18, 2), allowNull: false },
  payment_date: { field: 'PaymentDate', type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  payment_status: { field: 'PaymentStatus', type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'Payments',
  timestamps: false
});
module.exports = Payment;
Payment.prototype.toSafeObject = function () {
  return {
    paymentId: this.payment_id,
    orderId: this.order_id,
    amount: this.amount,
    paymentDate: this.payment_date,
    paymentStatus: this.payment_status
  };
};

