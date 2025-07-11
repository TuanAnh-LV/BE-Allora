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

// User - Cart
User.hasMany(Cart, { foreignKey: 'UserID', as: 'Carts' });
Cart.belongsTo(User, { foreignKey: 'UserID', as: 'User' });

// Cart - CartItem
Cart.hasMany(CartItem, { foreignKey: 'CartID', as: 'CartItems' });
CartItem.belongsTo(Cart, { foreignKey: 'CartID', as: 'Cart' });

// Product - CartItem
Product.hasMany(CartItem, { foreignKey: 'ProductID', as: 'CartItems' });
CartItem.belongsTo(Product, { foreignKey: 'ProductID', as: 'Product' });

// Cart - Order
Cart.hasOne(Order, { foreignKey: 'CartID', as: 'Order' });
Order.belongsTo(Cart, { foreignKey: 'CartID', as: 'Cart' });

// User - Order
User.hasMany(Order, { foreignKey: 'UserID', as: 'Orders' });
Order.belongsTo(User, { foreignKey: 'UserID', as: 'User' });

// Order - Payment
Order.hasOne(Payment, { foreignKey: 'OrderID', as: 'Payment' });
Payment.belongsTo(Order, { foreignKey: 'OrderID', as: 'Order' });

// User - Notification
User.hasMany(Notification, { foreignKey: 'UserID', as: 'Notifications' });
Notification.belongsTo(User, { foreignKey: 'UserID', as: 'User' });

// User - ChatMessage
User.hasMany(ChatMessage, { foreignKey: 'UserID', as: 'ChatMessages' });
ChatMessage.belongsTo(User, { foreignKey: 'UserID', as: 'User' });

// Category - Product
Category.hasMany(Product, { foreignKey: 'CategoryID', as: 'Products' });
Product.belongsTo(Category, { foreignKey: 'CategoryID', as: 'Category' });

// User instance methods
User.prototype.toSafeObject = function () {
  const { UserID, Username, Email, Role, Address, PhoneNumber } = this;
  return { UserID, Username, Email, Role, Address, PhoneNumber };
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
