const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserVoucher = sequelize.define('UserVoucher', {
  user_voucher_id: { field: 'UserVoucherID', type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { field: 'UserID', type: DataTypes.INTEGER, allowNull: false },
  voucher_id: { field: 'VoucherID', type: DataTypes.INTEGER, allowNull: false },
  redeemed: { field: 'Redeemed', type: DataTypes.BOOLEAN, defaultValue: false },
  assigned_at: { field: 'AssignedAt', type: DataTypes.DATE, allowNull: true } 
}, {
  tableName: 'UserVouchers',
  timestamps: false
});

UserVoucher.prototype.toSafeObject = function () {
  return {
    userVoucherId: this.user_voucher_id,
    userId: this.user_id,
    voucherId: this.voucher_id,
    redeemed: this.redeemed,
    assignedAt: this.assigned_at,
    voucher: this.Voucher?.toSafeObject?.() || null
  };
};

module.exports = UserVoucher;
