const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const StoreLocation = sequelize.define('StoreLocation', {
    LocationID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Latitude: { type: DataTypes.DECIMAL(9, 6), allowNull: false },
    Longitude: { type: DataTypes.DECIMAL(9, 6), allowNull: false },
    Address: { type: DataTypes.STRING, allowNull: false }
  }, {
    tableName: 'StoreLocations',
    timestamps: false
  });
  
  module.exports = StoreLocation;