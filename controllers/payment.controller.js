const axios = require('axios');
const Payment = require('../models/payment.model');
const Order = require('../models/order.model');

// PM01 - Checkout (giống O03 nếu muốn tách route khác)
exports.checkout = async (req, res) => {
  // có thể gọi lại createOrder từ orderController nếu muốn reuse
  res.status(501).json({ message: 'Checkout API handled by /api/orders for now' });
};

// PM03 - Manual confirm payment
exports.confirmPayment = async (req, res) => {
  try {
    const { OrderID, Amount, PaymentStatus } = req.body;
    const order = await Order.findByPk(OrderID);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // 2. Check if order is already paid
    if (order.OrderStatus === 'paid') {
      return res.status(400).json({ message: 'Order already paid' });
    }

    // 3. Save payment
    const payment = await Payment.create({
      OrderID,
      Amount,
      PaymentStatus
    });

    order.OrderStatus = PaymentStatus === 'paid' ? 'paid' : order.OrderStatus;
    await order.save();

    res.status(201).json(payment.toSafeObject());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
