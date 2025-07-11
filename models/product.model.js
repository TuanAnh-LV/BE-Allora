const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Product = sequelize.define('Product', {
  product_id: { field: 'ProductID', type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  product_name: { field: 'ProductName', type: DataTypes.STRING, allowNull: false },
  brief_description: { field: 'BriefDescription', type: DataTypes.STRING },
  full_description: { field: 'FullDescription', type: DataTypes.TEXT },
  technical_specifications: { field: 'TechnicalSpecifications', type: DataTypes.TEXT },
  price: { field: 'Price', type: DataTypes.DECIMAL(18, 2), allowNull: false },
  image_url: { field: 'ImageURL', type: DataTypes.STRING },
  category_id: { field: 'CategoryID', type: DataTypes.INTEGER, references: { model: 'Categories', key: 'CategoryID' } }
}, {
  tableName: 'Products',
  timestamps: false
});
Product.prototype.toSafeObject = function () {
  return {
    productId: this.product_id,
    productName: this.product_name,
    briefDescription: this.brief_description,
    fullDescription: this.full_description,
    technicalSpecifications: this.technical_specifications,
    price: this.price,
    imageUrl: this.image_url,
    categoryId: this.category_id
  };
};
module.exports = Product;