const Payment = require('../models/payment.model');
const Order = require('../models/order.model');

// PM01 - Checkout (giống O03 nếu muốn tách route khác)
exports.checkout = async (req, res) => {
  // có thể gọi lại createOrder từ orderController nếu muốn reuse
  res.status(501).json({ message: 'Checkout API handled by /api/orders for now' });
};

// PM02 - Confirm payment
exports.confirmPayment = async (req, res) => {
  try {
    const { OrderID, Amount, PaymentStatus } = req.body;
    const order = await Order.findByPk(OrderID);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const payment = await Payment.create({
      OrderID,
      Amount,
      PaymentStatus
    });

    order.OrderStatus = PaymentStatus === 'paid' ? 'paid' : order.OrderStatus;
    await order.save();

    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
