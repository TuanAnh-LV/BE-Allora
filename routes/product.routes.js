const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');
const upload = require('../middlewares/upload.middleware');
/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management API
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products with basic information
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/', productController.getAllProducts);

/**
 * @swagger
 * /api/products/top-selling:
 *   get:
 *     summary: Lấy danh sách sản phẩm bán chạy nhất
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Danh sách top sản phẩm bán chạy
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   product_id:
 *                     type: string
 *                   product_name:
 *                     type: string
 *                   price:
 *                     type: number
 *                   image_url:
 *                     type: string
 *                   totalSold:
 *                     type: integer
 */
router.get('/top-selling', productController.getTopSellingProducts);


/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product details by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
router.get('/:id', productController.getProductById);

/**
 * @swagger
 * /api/products/category/{id}:
 *   get:
 *     summary: Get products by category ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Products in the category
 */
router.get('/category/:id', productController.getProductsByCategory);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product with image upload
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - productName
 *               - price
 *               - categoryId
 *               - image
 *             properties:
 *               productName:
 *                 type: string
 *               briefDescription:
 *                 type: string
 *               fullDescription:
 *                 type: string
 *               technicalSpecifications:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created
 */
router.post('/', authenticateToken, isAdmin, upload.single('image'), productController.createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product by ID with optional image upload
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the product to update
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *               briefDescription:
 *                 type: string
 *               fullDescription:
 *                 type: string
 *               technicalSpecifications:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product not found
 */
router.put(
    '/:id',
    authenticateToken,
    isAdmin,
    upload.single('image'), 
    productController.updateProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by ID (Admin only)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
router.delete('/:id', authenticateToken, isAdmin, productController.deleteProduct);

module.exports = router;
