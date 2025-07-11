const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const StoreLocation = sequelize.define('StoreLocation', {
  location_id: { field: 'LocationID', type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  latitude: { field: 'Latitude', type: DataTypes.DECIMAL(9, 6), allowNull: false },
  longitude: { field: 'Longitude', type: DataTypes.DECIMAL(9, 6), allowNull: false },
  address: { field: 'Address', type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'StoreLocations',
  timestamps: false
});
module.exports = StoreLocation;
StoreLocation.prototype.toSafeObject = function () {
  return {
    locationId: this.location_id,
    latitude: this.latitude,
    longitude: this.longitude,
    address: this.address
  };
};