const Payment = require('../models/payment.model');
const Order = require('../models/order.model');

// PM01 - Checkout (nên xử lý qua /api/orders)
exports.checkout = async (req, res) => {
  res.status(501).json({ message: 'Checkout API handled by /api/orders for now' });
};

// PM02 - Confirm payment
exports.confirmPayment = async (req, res) => {
  try {
    const { orderId, amount, paymentStatus } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const payment = await Payment.create({
      order_id: orderId,
      amount,
      payment_status: paymentStatus
    });

    if (paymentStatus === 'paid') {
      order.order_status = 'paid';
      await order.save();
    }

    res.status(201).json(payment.toSafeObject());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
