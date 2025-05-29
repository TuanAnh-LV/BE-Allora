// models/index.js
const sequelize = require('../config/db');

const User = require('./user.model');
const Category = require('./category.model');
const Product = require('./product.model');
const Cart = require('./cart.model');
const CartItem = require('./cartitem.model');
const Order = require('./order.model');
const Payment = require('./payment.model');
const Notification = require('./notification.model');
const ChatMessage = require('./chatmessage.model');
const StoreLocation = require('./storelocation.model');

// Define associations
User.hasMany(Cart, { foreignKey: 'UserID' });
Cart.belongsTo(User, { foreignKey: 'UserID' });

Cart.hasMany(CartItem, { foreignKey: 'CartID' });
CartItem.belongsTo(Cart, { foreignKey: 'CartID' });

Product.hasMany(CartItem, { foreignKey: 'ProductID' });
CartItem.belongsTo(Product, { foreignKey: 'ProductID' });

Cart.hasOne(Order, { foreignKey: 'CartID' });
Order.belongsTo(Cart, { foreignKey: 'CartID' });

User.hasMany(Order, { foreignKey: 'UserID' });
Order.belongsTo(User, { foreignKey: 'UserID' });

Order.hasOne(Payment, { foreignKey: 'OrderID' });
Payment.belongsTo(Order, { foreignKey: 'OrderID' });

User.hasMany(Notification, { foreignKey: 'UserID' });
Notification.belongsTo(User, { foreignKey: 'UserID' });

User.hasMany(ChatMessage, { foreignKey: 'UserID' });
ChatMessage.belongsTo(User, { foreignKey: 'UserID' });

Category.hasMany(Product, { foreignKey: 'CategoryID' });
Product.belongsTo(Category, { foreignKey: 'CategoryID' });

// User scopes or static methods (User Functions)
User.prototype.toSafeObject = function () {
  const { UserID, Username, Email, Role,Address,PhoneNumber } = this;
  return { UserID, Username, Email, Role, Address, PhoneNumber  };
};

User.prototype.checkPassword = async function (password, bcrypt) {
  return await bcrypt.compare(password, this.PasswordHash);
};

// Export all models
module.exports = {
  sequelize,
  User,
  Category,
  Product,
  Cart,
  CartItem,
  Order,
  Payment,
  Notification,
  ChatMessage,
  StoreLocation
};
