const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  user_id: { field: 'UserID', type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { field: 'Username', type: DataTypes.STRING, allowNull: false },
  password_hash: { field: 'PasswordHash', type: DataTypes.STRING, allowNull: false },
  email: { field: 'Email', type: DataTypes.STRING, allowNull: false },
  phone_number: { field: 'PhoneNumber', type: DataTypes.STRING },
  address: { field: 'Address', type: DataTypes.STRING },
  role: { field: 'Role', type: DataTypes.STRING, allowNull: false },
  is_verified: { field: 'IsVerified', type: DataTypes.BOOLEAN, defaultValue: false },
  verify_token: { field: 'VerifyToken', type: DataTypes.STRING, allowNull: true }
}, {
  tableName: 'Users',
  timestamps: false
});
User.prototype.toSafeObject = function () {
  return {
    userId: this.user_id,
    username: this.username,
    email: this.email,
    phoneNumber: this.phone_number,
    address: this.address,
    role: this.role,
    isVerified: this.is_verified
  };
};
module.exports = User;
