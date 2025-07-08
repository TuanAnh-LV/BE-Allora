const axios = require('axios');
const Payment = require('../models/payment.model');
const Order = require('../models/order.model');

const PAYPAL_API = process.env.PAYPAL_API;
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

// Get access token
async function getAccessToken() {
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const res = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, 'grant_type=client_credentials', {
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return res.data.access_token;
}

// Create PayPal order
async function createPaypalOrder(amount, currency = 'USD') {
  const token = await getAccessToken();
  const res = await axios.post(`${PAYPAL_API}/v2/checkout/orders`, {
    intent: 'CAPTURE',
    purchase_units: [{
      amount: { currency_code: currency, value: amount.toString() }
    }],
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
}

// Capture PayPal order
async function capturePaypalOrder(orderId) {
  const token = await getAccessToken();
  const res = await axios.post(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
}

// PM01 - Create PayPal Order
exports.createPaypalOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ message: 'Missing amount' });

    const order = await createPaypalOrder(amount);
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PM02 - Capture payment from PayPal
exports.capturePaypalPayment = async (req, res) => {
  try {
    const { paypalOrderId, orderId } = req.body;
    const userId = req.user.id;

    if (!paypalOrderId || !orderId) {
      return res.status(400).json({ message: 'Missing paypalOrderId or orderId' });
    }

    // 1. Find order & verify ownership
    const order = await Order.findOne({ where: { OrderID: orderId, UserID: userId } });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.OrderStatus === 'paid') {
      return res.status(400).json({ message: 'Order already paid' });
    }

    // 2. Capture PayPal payment
    const capture = await capturePaypalOrder(paypalOrderId);
    const captureDetails = capture.purchase_units[0].payments.captures[0];

    const amount = parseFloat(captureDetails.amount.value);

    // 3. Match amount with expected order amount
    if (amount !== order.TotalAmount) {
      return res.status(400).json({ message: 'Payment amount mismatch' });
    }

    // 4. Save payment details
    const payment = await Payment.create({
      OrderID: orderId,
      Amount: amount,
      PaymentStatus: 'paid',
      PaymentDate: new Date(),
      TransactionID: captureDetails.id, // Transaction ID from PayPal
      PayerEmail: captureDetails.payer.email_address, // Payer email from PayPal
    });

    // 5. Update order status
    order.OrderStatus = 'paid';
    await order.save();

    res.status(200).json({ message: 'Payment successful', payment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PM03 - Manual confirm payment
exports.confirmPayment = async (req, res) => {
  try {
    const { OrderID, Amount, PaymentStatus } = req.body;
    const userId = req.user.id;

    // 1. Find order & verify ownership
    const order = await Order.findOne({ where: { OrderID, UserID: userId } });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // 2. Check if order is already paid
    if (order.OrderStatus === 'paid') {
      return res.status(400).json({ message: 'Order already paid' });
    }

    // 3. Save payment
    const payment = await Payment.create({
      OrderID,
      Amount,
      PaymentStatus,
    });

    // 4. Update order status if payment is confirmed
    if (PaymentStatus === 'paid') {
      order.OrderStatus = 'paid';
      await order.save();
    }

    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
