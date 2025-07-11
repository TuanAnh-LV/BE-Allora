const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Category = sequelize.define('Category', {
  category_id: { field: 'CategoryID', type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  category_name: { field: 'CategoryName', type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'Categories',
  timestamps: false
});
module.exports = Category;
Category.prototype.toSafeObject = function () {
  return {
    categoryId: this.category_id,
    categoryName: this.category_name
  };
};