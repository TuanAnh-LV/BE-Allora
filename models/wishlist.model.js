const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Wishlist = sequelize.define('Wishlist', {
  wishlist_id: { field: 'WishlistID', type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { field: 'UserID', type: DataTypes.INTEGER, allowNull: false },
  product_id: { field: 'ProductID', type: DataTypes.INTEGER, allowNull: false },
  created_at: { field: 'CreatedAt',
  type: DataTypes.DATE,
  allowNull: true}
}, {
  tableName: 'Wishlists',
  timestamps: false,
  indexes: [{ unique: true, fields: ['UserID', 'ProductID'] }]
});
Wishlist.prototype.toSafeObject = function () {
  return {
    wishlistId: this.wishlist_id,
    userId: this.user_id,
    productId: this.product_id,
    createdAt: this.created_at
  };
};

module.exports = Wishlist;
