const Category = require('../models/category.model');
const { Op } = require('sequelize');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories.map(c => c.toSafeObject()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create category
exports.createCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    const category = await Category.create({ category_name: categoryName });
    res.status(201).json(category.toSafeObject());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    const [updated] = await Category.update(
      { category_name: categoryName },
      { where: { category_id: req.params.id } }
    );
    if (!updated) return res.status(404).json({ message: 'Category not found' });

    const updatedCategory = await Category.findByPk(req.params.id);
    res.json(updatedCategory.toSafeObject());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.destroy({ where: { category_id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search categories
exports.searchCategories = async (req, res) => {
  const { name } = req.body;
  try {
    const categories = await Category.findAll({
      where: {
        category_name: { [Op.like]: `%${name}%` }
      }
    });
    res.json(categories.map(c => c.toSafeObject()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
