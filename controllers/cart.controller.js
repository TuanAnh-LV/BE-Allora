const Cart = require('../models/cart.model');
const CartItem = require('../models/cartitem.model');
const Product = require('../models/product.model');
const Voucher = require('../models/voucher.model');
const UserVoucher = require('../models/userVoucher.model');
const { Op } = require('sequelize');

// CA01 - Add item to cart
exports.addItemToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ where: { user_id: req.user.userId, status: 'active' } });
    if (!cart) {
      cart = await Cart.create({ user_id: req.user.userId, total_price: 0, status: 'active' });
    }

    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const price = product.price;
    const item = await CartItem.create({
      cart_id: cart.cart_id,
      product_id: productId,
      quantity,
      price
    });

    cart.total_price += price * quantity;
    cart.final_price = cart.total_price - (cart.discount_amount || 0); // sync lại final
    await cart.save();

    res.status(201).json(item.toSafeObject());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CA02 - Get current cart
exports.getCurrentCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: { user_id: req.user.userId, status: 'active' },
      include: [
        {
          model: CartItem,
          as: 'CartItems',
          include: {
            model: Product,
            as: 'Product'
          }
        },
        {
          model: Voucher,
          as: 'Voucher',
          attributes: ['voucher_id', 'code', 'discount_percent', 'expiry_date']
        }
      ]
    });

    if (!cart) return res.status(200).json({ cartItems: [], totalPrice: 0 });

    const discountPercent = cart.Voucher?.discount_percent || 0;

    const cartData = cart.toSafeObject();
    cartData.cartItems = cart.CartItems.map(item => {
      const itemData = item.toSafeObject();
      itemData.product = item.Product?.toSafeObject?.() || null;

      const originalPrice = parseFloat(item.price);
      itemData.originalPrice = originalPrice.toFixed(2);
      itemData.discountedPrice = (originalPrice * (1 - discountPercent / 100)).toFixed(2);

      return itemData;
    });

    res.json(cartData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CA03 - Update item quantity
exports.updateCartItemQuantity = async (req, res) => {
  try {
    const item = await CartItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const cart = await Cart.findByPk(item.cart_id);
    cart.total_price -= item.price * item.quantity;

    item.quantity = req.body.quantity;
    await item.save();

    cart.total_price += item.price * item.quantity;
    cart.final_price = cart.total_price - (cart.discount_amount || 0);
    await cart.save();

    res.json(item.toSafeObject());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CA04 - Remove item from cart
exports.removeItemFromCart = async (req, res) => {
  try {
    const item = await CartItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const cart = await Cart.findByPk(item.cart_id);
    cart.total_price -= item.price * item.quantity;
    cart.final_price = cart.total_price - (cart.discount_amount || 0);
    await cart.save();

    await item.destroy();
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CA05 - Clear cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { user_id: req.user.userId, status: 'active' } });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    await CartItem.destroy({ where: { cart_id: cart.cart_id } });

    cart.total_price = 0;
    cart.discount_amount = 0;
    cart.final_price = 0;
    cart.voucher_id = null;
    await cart.save();

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CA06 - Apply UserVoucher to cart
exports.applyUserVoucherToCart = async (req, res) => {
  try {
    const { userVoucherId } = req.body;
    const userId = req.user.userId;

    const userVoucher = await UserVoucher.findOne({
      where: { user_voucher_id: userVoucherId, user_id: userId, redeemed: false }
    });

    if (!userVoucher) return res.status(404).json({ message: 'User voucher not found or already redeemed' });

    const voucher = await Voucher.findByPk(userVoucher.voucher_id);
    if (!voucher) return res.status(404).json({ message: 'Voucher not found' });

    const now = new Date();
    if (voucher.expiry_date < now) return res.status(400).json({ message: 'Voucher expired' });

    const cart = await Cart.findOne({
      where: { user_id: userId, status: 'active' },
      include: {
        model: Voucher,
        as: 'Voucher',
        attributes: ['voucher_id', 'code', 'discount_percent', 'expiry_date']
      }
    });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const cartItems = await CartItem.findAll({ where: { cart_id: cart.cart_id } });
    const subtotal = cartItems.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    );

    const discount = subtotal * (voucher.discount_percent / 100);
    const final = subtotal - discount;

    cart.voucher_id = voucher.voucher_id;
    cart.discount_amount = discount.toFixed(2);
    cart.final_price = final.toFixed(2);
    cart.total_price = subtotal.toFixed(2);
    await cart.save();

    userVoucher.redeemed = true;
    await userVoucher.save();

    res.json({ message: 'User voucher applied', cart: cart.toSafeObject() });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CA07 - Remove voucher from cart
exports.removeVoucherFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { user_id: req.user.userId, status: 'active' } });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.voucher_id = null;
    cart.discount_amount = 0;
    cart.final_price = cart.total_price;
    await cart.save();

    res.json({ message: 'Voucher removed from cart' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
