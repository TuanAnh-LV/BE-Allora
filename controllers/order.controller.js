const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const CartItem = require('../models/cartitem.model');
const Product = require('../models/product.model');

// O01 - Get my orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.userId },
      order: [['order_date', 'DESC']],
      include: {
        model: Cart,
        as: 'Cart',
        include: {
          model: CartItem,
          as: 'CartItems'
        }
      }
    });

    const formatted = orders.map(order => {
      const o = order.toSafeObject();
      const cart = order.Cart;

      return {
        orderId: o.orderId,
        orderStatus: o.orderStatus,
        paymentMethod: o.paymentMethod,
        orderDate: o.orderDate,
        totalPrice: cart?.final_price || 0,
        itemCount: cart?.CartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0
      };
    });

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
        as: 'Cart',
        include: {
          model: CartItem,
          as: 'CartItems',
          include: {
            model: Product,
            as: 'Product'
          }
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

    const cart = await Cart.findOne({
      where: { user_id: req.user.userId, status: 'active' },
      include: { model: CartItem, as: 'CartItems' }
    });

    if (!cart) return res.status(404).json({ message: 'No active cart found' });
    if (!cart.CartItems.length) return res.status(400).json({ message: 'Cart is empty' });

    const order = await Order.create({
      cart_id: cart.cart_id,
      user_id: req.user.userId,
      payment_method: paymentMethod,
      billing_address: billingAddress,
      order_status: 'processing'
    });

    cart.status = 'completed';
    await cart.save();

    res.status(201).json({
      message: 'Order created successfully',
      orderId: order.order_id
    });
  } catch (error) {
    console.error('Error in createOrder:', error); 
    res.status(400).json({ message: error.message });
  }
};
