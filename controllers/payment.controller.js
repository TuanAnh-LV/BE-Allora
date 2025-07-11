const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
const Payment = require('../models/payment.model');
const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const CartItem = require('../models/cartitem.model');

// PayPal config
const environment = new checkoutNodeJssdk.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
const paypalClient = new checkoutNodeJssdk.core.PayPalHttpClient(environment);

// PM01 - Checkout (tạo PayPal order)
exports.checkout = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const cart = await Cart.findByPk(order.cart_id, {
      include: {
        model: CartItem,
        as: 'CartItems'
      }
    });
    if (!cart || !cart.CartItems || cart.CartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty or not found' });
    }

    const totalAmount = cart.CartItems.reduce((sum, item) => {
      return sum + item.quantity * item.price;
    }, 0).toFixed(2);

    if (totalAmount <= 0) {
      return res.status(400).json({ message: 'Invalid total amount' });
    }

    // Gọi PayPal SDK để tạo đơn
    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: totalAmount
        },
        description: `Payment for order #${orderId}`
      }],
      application_context: {
        return_url: `${process.env.FRONTEND_URL}/paypal/success?orderId=${orderId}`,
        cancel_url: `${process.env.FRONTEND_URL}/paypal/cancel?orderId=${orderId}`
      }
    });

    const paypalOrder = await paypalClient.execute(request);
    const approvalUrl = paypalOrder.result.links.find(link => link.rel === 'approve').href;

    res.status(200).json({ approvalUrl });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create PayPal order', error: error.message });
  }
};


// PM03 - Confirm payment (gọi sau khi user thanh toán thành công qua PayPal)
exports.confirmPayment = async (req, res) => {
  try {
    const { orderId, paypalOrderId } = req.body;

    const order = await Order.findByPk(orderId, {
      include: {
        model: Cart,
        as: 'Cart',
        include: {
          model: CartItem,
          as: 'CartItems'
        }
      }
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.order_status === 'paid') {
      return res.status(400).json({ message: 'Order already paid' });
    }

    // Capture thanh toán từ PayPal
    const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(paypalOrderId);
    request.requestBody({});
    const capture = await paypalClient.execute(request);

    const captureStatus = capture.result.status;
    const captureDetails = capture.result.purchase_units[0].payments.captures[0];
    const paidAmount = captureDetails.amount.value;

    if (captureStatus !== 'COMPLETED') {
      return res.status(400).json({ message: 'Payment not completed', status: captureStatus });
    }

    // Lưu Payment
    const payment = await Payment.create({
      order_id: orderId,
      amount: paidAmount,
      payment_status: 'paid'
    });

    // Cập nhật đơn hàng
    order.order_status = 'paid';
    await order.save();

    res.status(201).json(payment.toSafeObject());
  } catch (error) {
    res.status(500).json({ message: 'Payment confirmation failed', error: error.message });
  }
};
