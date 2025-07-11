const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authenticateToken = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and login
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               address:
 *                 type: string
*     responses:
*       201:
*         description: Registration successful
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                 user:
*                   type: object
*                   properties:
*                     userId:
*                       type: integer
*                     username:
*                       type: string
*                     email:
*                       type: string
*                     phoneNumber:
*                       type: string
*                     address:
*                       type: string
*                     role:
*                       type: string
*                     isVerified:
*                       type: boolean
*       400:
*         description: Email already exists

 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login and get a token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful and JWT returned
 *       401:
 *         description: Incorrect password
 *       404:
 *         description: Account not found
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Login with Google (Firebase)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: Firebase ID Token from client
 *     responses:
 *       200:
 *         description: Login successful and JWT returned
 *       401:
 *         description: Invalid token
 */
router.post('/google', authController.googleLogin);

/**
 * @swagger
 * /api/auth/verify-email:
 *   get:
 *     summary: Verify email via token
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Verification token sent via email
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */
router.get('/verify-email', authController.verifyEmail);

/**
 * @swagger
 * /api/auth:
 *   get:
 *     summary: Get current logged-in user info
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user information
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticateToken, authController.getCurrentUser);

/**
 * @swagger
 * /api/auth/log-out:
 *   get:
 *     summary: Log out user (client deletes token)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.get('/log-out', authController.logout);

module.exports = router;
