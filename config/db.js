const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mssql',
    port: 1433,
    logging: false,
    dialectOptions: {
      options: {
        encrypt: true, 
        trustServerCertificate: true 
      }
    }
  }
);


module.exports = sequelize;
