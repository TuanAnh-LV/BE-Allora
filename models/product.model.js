const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Product = sequelize.define('Product', {
    ProductID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ProductName: { type: DataTypes.STRING, allowNull: false },
    BriefDescription: { type: DataTypes.STRING },
    FullDescription: { type: DataTypes.TEXT },
    TechnicalSpecifications: { type: DataTypes.TEXT },
    Price: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
    ImageURL: { type: DataTypes.STRING },
    CategoryID: { type: DataTypes.INTEGER, references: { model: 'Categories', key: 'CategoryID' } }
  }, {
    tableName: 'Products',
    timestamps: false
  });
  
  module.exports = Product;