const Product = require('../models/product.model');
const Category = require('../models/category.model');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

Product.belongsTo(Category, { foreignKey: 'category_id' });

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: {
        model: Category,
        attributes: ['category_id', 'category_name']
      }
    });

    res.json(products.map(p => p.toSafeObject()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product.toSafeObject());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.findAll({ where: { category_id: req.params.id } });
    res.json(products.map(p => p.toSafeObject()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    let imageUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'Allora'
      });
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const {
      productName,
      briefDescription,
      fullDescription,
      technicalSpecifications,
      price,
      categoryId
    } = req.body;

    const product = await Product.create({
      product_name: productName,
      brief_description: briefDescription,
      full_description: fullDescription,
      technical_specifications: technicalSpecifications,
      price,
      image_url: imageUrl,
      category_id: categoryId
    });

    res.status(201).json(product.toSafeObject());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let imageUrl = product.image_url;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'Allora'
      });
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const {
      productName,
      briefDescription,
      fullDescription,
      technicalSpecifications,
      price,
      categoryId
    } = req.body;

    await Product.update(
      {
        product_name: productName,
        brief_description: briefDescription,
        full_description: fullDescription,
        technical_specifications: technicalSpecifications,
        price,
        image_url: imageUrl,
        category_id: categoryId
      },
      {
        where: { product_id: req.params.id }
      }
    );

    const updatedProduct = await Product.findByPk(req.params.id);
    res.json(updatedProduct.toSafeObject());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.destroy({ where: { product_id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
