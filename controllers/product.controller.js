const Product = require('../models/product.model');
const Category = require('../models/category.model');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

Product.belongsTo(Category, { foreignKey: 'CategoryID' });

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: {
        model: Category,
        attributes: ['CategoryID', 'CategoryName']
      }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.findAll({ where: { CategoryID: req.params.id } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
  
      const product = await Product.create({
        ProductName: req.body.ProductName,
        BriefDescription: req.body.BriefDescription,
        FullDescription: req.body.FullDescription,
        TechnicalSpecifications: req.body.TechnicalSpecifications,
        Price: req.body.Price,
        ImageURL: imageUrl,
        CategoryID: req.body.CategoryID
      });
  
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  
  exports.updateProduct = async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
  
      let imageUrl = product.ImageURL;
  
  
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'Allora'
        });
        imageUrl = result.secure_url;
        fs.unlinkSync(req.file.path);
      }
  

      await Product.update(
        {
          ProductName: req.body.ProductName,
          BriefDescription: req.body.BriefDescription,
          FullDescription: req.body.FullDescription,
          TechnicalSpecifications: req.body.TechnicalSpecifications,
          Price: req.body.Price,
          ImageURL: imageUrl,
          CategoryID: req.body.CategoryID
        },
        {
          where: { ProductID: req.params.id }
        }
      );
  
      const updatedProduct = await Product.findByPk(req.params.id);
      res.json(updatedProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.destroy({ where: { ProductID: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
