const Cart = require('../models/cart.model');
const CartItem = require('../models/cartitem.model');
const Product = require('../models/product.model');
const { Op } = require('sequelize');

// CA01 - Add item to cart
exports.addItemToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ where: { user_id: req.user.id, status: 'active' } });
    if (!cart) {
      cart = await Cart.create({ user_id: req.user.id, total_price: 0, status: 'active' });
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
      where: { user_id: req.user.id, status: 'active' },
      include: {
        model: CartItem,
        as: 'CartItems',
        include: {
          model: Product,
          as: 'Product'
        }
      }
    });

    if (!cart) return res.status(200).json({ cartItems: [], totalPrice: 0 });

    const cartData = cart.toSafeObject();
    cartData.cartItems = cart.CartItems.map(item => {
      const itemData = item.toSafeObject();
      itemData.product = item.Product?.toSafeObject?.() || null;
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
    const cart = await Cart.findOne({ where: { user_id: req.user.id, status: 'active' } });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    await CartItem.destroy({ where: { cart_id: cart.cart_id } });
    cart.total_price = 0;
    await cart.save();

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
