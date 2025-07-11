const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const CartItem = require('../models/cartitem.model');
const Product = require('../models/product.model');

// O01 - Get my orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      order: [['order_date', 'DESC']]
    });

    const formatted = orders.map(o => o.toSafeObject());
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// O02 - Get order details
exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: {
        model: Cart,
        include: {
          model: CartItem,
          include: Product
        }
      }
    });

    if (!order) return res.status(404).json({ message: 'Order not found' });

    const orderData = order.toSafeObject();
    orderData.cart = order.Cart?.toSafeObject?.() || null;

    if (order.Cart?.CartItems) {
      orderData.cart.cartItems = order.Cart.CartItems.map(item => {
        const itemData = item.toSafeObject();
        itemData.product = item.Product?.toSafeObject?.() || null;
        return itemData;
      });
    }

    res.json(orderData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// O03 - Create order from cart
exports.createOrder = async (req, res) => {
  try {
    const { paymentMethod, billingAddress } = req.body;

    const cart = await Cart.findOne({ where: { user_id: req.user.id, status: 'active' } });
    if (!cart) return res.status(404).json({ message: 'No active cart found' });

    const order = await Order.create({
      cart_id: cart.cart_id,
      user_id: req.user.id,
      payment_method: paymentMethod,
      billing_address: billingAddress,
      order_status: 'processing'
    });

    cart.status = 'completed';
    await cart.save();

    res.status(201).json(order.toSafeObject());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
