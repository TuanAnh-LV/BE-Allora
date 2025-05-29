const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const CartItem = require('../models/cartitem.model');
const Product = require('../models/product.model');

// O01 - Get my orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { UserID: req.user.id },
      order: [['OrderDate', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// O02 - Get order details
exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: { model: Cart, include: { model: CartItem, include: Product } }
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// O03 - Create order from cart
exports.createOrder = async (req, res) => {
  try {
    const { PaymentMethod, BillingAddress } = req.body;
    const cart = await Cart.findOne({ where: { UserID: req.user.id, Status: 'active' } });
    if (!cart) return res.status(404).json({ message: 'No active cart found' });

    const order = await Order.create({
      CartID: cart.CartID,
      UserID: req.user.id,
      PaymentMethod,
      BillingAddress,
      OrderStatus: 'processing'
    });

    cart.Status = 'completed';
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
