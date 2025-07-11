const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const { isAdmin, isSelfOrAdmin } = require('../middlewares/role.middleware');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management API
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', authenticateToken, isAdmin, userController.getAllUsers);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user's information
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user information
 */
router.get('/me', authenticateToken, userController.getMe);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user details (Admin/self only)
 *     tags: [User]
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
 *         description: User details
 */
router.get('/:id', authenticateToken, isSelfOrAdmin, userController.getUserById);

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Update current user's information
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: User information updated successfully
 */
router.put('/me', authenticateToken, (req, res) => {
  req.params.id = req.user.id;
  userController.updateUserById(req, res);
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user (Admin/self only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               address:
 *                 type: string
 *               role:
 *                 type: string
 *                 description: Only Admin can change user role
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put('/:id', authenticateToken, isSelfOrAdmin, userController.updateUserById);

/**
 * @swagger
 * /api/users/change-password:
 *   put:
 *     summary: Change current user's password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
router.put('/change-password', authenticateToken, userController.changePassword);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user (Admin/self only)
 *     tags: [User]
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
 *         description: User deleted successfully
 */
router.delete('/:id', authenticateToken, isSelfOrAdmin, userController.deleteUserById);

module.exports = router;
