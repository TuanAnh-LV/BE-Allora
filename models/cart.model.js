const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Voucher = require('./voucher.model'); // dùng cho quan hệ belongsTo

const Cart = sequelize.define('Cart', {
  cart_id: {
    field: 'CartID',
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    field: 'UserID',
    type: DataTypes.INTEGER
  },
  total_price: {
    field: 'TotalPrice',
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false
  },
  status: {
    field: 'Status',
    type: DataTypes.STRING,
    allowNull: false
  },
  voucher_id: {
    field: 'VoucherID',
    type: DataTypes.INTEGER,
    allowNull: true
  },
  discount_amount: {
    field: 'DiscountAmount',
    type: DataTypes.DECIMAL(18, 2),
    defaultValue: 0
  },
  final_price: {
    field: 'FinalPrice',
    type: DataTypes.DECIMAL(18, 2),
    defaultValue: 0
  }
}, {
  tableName: 'Carts',
  timestamps: false
});


Cart.prototype.toSafeObject = function () {
  return {
    cartId: this.cart_id,
    userId: this.user_id,
    totalPrice: this.total_price,
    status: this.status,
    voucherId: this.voucher_id,
    discountAmount: this.discount_amount,
    finalPrice: this.final_price,
    voucher: this.Voucher?.toSafeObject?.() || null
  };
};

module.exports = Cart;
