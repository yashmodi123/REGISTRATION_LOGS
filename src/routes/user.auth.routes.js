const express = require('express');
const { body } = require('express-validator');
const userAuthController = require('../controllers/user.auth.controller');
const authenticateToken = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User Auth
 *   description: Admin / User account management with JWT
 */

// ── Register ────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /user-auth/register:
 *   post:
 *     summary: Register a new user account
 *     tags: [User Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: secret123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 user:
 *                   id: 1
 *                   username: admin
 *                   email: admin@example.com
 *                 token: "eyJhbG..."
 *       409:
 *         description: Email already in use
 */
router.post(
  '/register',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  userAuthController.register
);

// ── Login ────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /user-auth/login:
 *   post:
 *     summary: Login and get JWT token
 *     tags: [User Auth]
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
 *                 format: email
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 user:
 *                   id: 1
 *                   username: admin
 *                   email: admin@example.com
 *                 token: "eyJhbG..."
 *       401:
 *         description: Invalid credentials
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  userAuthController.login
);

// ── Me (protected) ───────────────────────────────────────────────────────────

/**
 * @swagger
 * /user-auth/me:
 *   get:
 *     summary: Get current authenticated user info
 *     tags: [User Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user info
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 username: admin
 *                 email: admin@example.com
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authenticateToken, userAuthController.getMe);

module.exports = router;
