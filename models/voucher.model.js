const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Voucher = sequelize.define('Voucher', {
  voucher_id: { field: 'VoucherID', type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  code: { field: 'Code', type: DataTypes.STRING, unique: true, allowNull: false },
  discount_percent: { field: 'DiscountPercent', type: DataTypes.INTEGER, allowNull: false },
  expiry_date: { field: 'ExpiryDate', type: DataTypes.DATE, allowNull: false },
  quantity: { field: 'Quantity', type: DataTypes.INTEGER, allowNull: false },
  created_at: { field: 'CreatedAt', type: DataTypes.DATE, allowNull: true }
}, {
  tableName: 'Vouchers',
  timestamps: false
});

Voucher.prototype.toSafeObject = function () {
  return {
    voucherId: this.voucher_id,
    code: this.code,
    discountPercent: this.discount_percent,
    expiryDate: this.expiry_date,
    quantity: this.quantity,
    createdAt: this.created_at
  };
};

module.exports = Voucher;
