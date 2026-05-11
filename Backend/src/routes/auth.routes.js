const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication API
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - machine_number
 *               - company_name
 *               - email
 *               - is_using_sinar_mcal
 *             properties:
 *               machine_number:
 *                 type: string
 *                 description: Machine Number
 *               company_name:
 *                 type: string
 *                 description: Company Name / Individual
 *               date_of_purchase:
 *                 type: string
 *                 format: date
 *                 description: Date of Purchase (Optional)
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email Id
 *               is_using_sinar_mcal:
 *                 type: boolean
 *                 description: Are you currently using SINAR-MCAL for your calibrations? (Yes/No)
 *               device_type:
 *                 type: string
 *                 enum: [Android, iOS]
 *                 description: Device Type (Android / iOS)
 *               latitude:
 *                 type: number
 *                 description: Latitude (Optional, for app's location access)
 *               longitude:
 *                 type: number
 *                 description: Longitude (Optional, for app's location access)
 *               country:
 *                 type: string
 *                 description: Country (Optional, can be manual or auto-detected)
 *               ip_address:
 *                 type: string
 *                 description: IP Address (Optional, can be manual or auto-detected)
 *             example:
 *               machine_number: "M12345"
 *               company_name: "ABC Pvt Ltd"
 *               date_of_purchase: "2024-01-01"
 *               email: "test@example.com"
 *               is_using_sinar_mcal: true
 *               device_type: "Android"
 *               latitude: 23.0225
 *               longitude: 72.5714
 *               country: "India"
 *               ip_address: "1.1.1.1"
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
 *                   email: "test@example.com"
 *                 token: "eyJhbG..."
 *       400:
 *         description: Validation error or Email already in use
 */
router.post(
  '/register',
  [
    body('machine_number').notEmpty().withMessage('Machine number is required'),
    body('company_name').notEmpty().withMessage('Company name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('is_using_sinar_mcal').isBoolean().withMessage('is_using_sinar_mcal must be a boolean'),
    body('device_type').optional().isIn(['Android', 'iOS']).withMessage('Device type must be Android or iOS')
  ],
  authController.register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             example:
 *               email: "test@example.com"
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
 *                   email: "test@example.com"
 *                 token: "eyJhbG..."
 *       401:
 *         description: Invalid credentials
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required')
  ],
  authController.login
);

module.exports = router;
