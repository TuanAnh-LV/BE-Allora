const Cart = require('../models/cart.model');
const CartItem = require('../models/cartitem.model');
const Product = require('../models/product.model');
const { Op } = require('sequelize');

// CA01 - Add item to cart
exports.addItemToCart = async (req, res) => {
  try {
    const { ProductID, Quantity } = req.body;

    let cart = await Cart.findOne({ where: { UserID: req.user.id, Status: 'active' } });
    if (!cart) {
      cart = await Cart.create({ UserID: req.user.id, TotalPrice: 0, Status: 'active' });
    }

    const product = await Product.findByPk(ProductID);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const price = product.Price;
    const item = await CartItem.create({
      CartID: cart.CartID,
      ProductID,
      Quantity,
      Price: price
    });

    cart.TotalPrice += price * Quantity;
    await cart.save();

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CA02 - Get current cart
exports.getCurrentCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: { UserID: req.user.id, Status: 'active' },
      include: {
        model: CartItem,
        include: Product
      }
    });

    if (!cart) return res.status(200).json({ CartItems: [], TotalPrice: 0 });

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CA03 - Update item quantity
exports.updateCartItemQuantity = async (req, res) => {
  try {
    const item = await CartItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const cart = await Cart.findByPk(item.CartID);
    cart.TotalPrice -= item.Price * item.Quantity;

    item.Quantity = req.body.Quantity;
    await item.save();

    cart.TotalPrice += item.Price * item.Quantity;
    await cart.save();

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CA04 - Remove item from cart
exports.removeItemFromCart = async (req, res) => {
  try {
    const item = await CartItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const cart = await Cart.findByPk(item.CartID);
    cart.TotalPrice -= item.Price * item.Quantity;
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
    const cart = await Cart.findOne({ where: { UserID: req.user.id, Status: 'active' } });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    await CartItem.destroy({ where: { CartID: cart.CartID } });
    cart.TotalPrice = 0;
    await cart.save();

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
