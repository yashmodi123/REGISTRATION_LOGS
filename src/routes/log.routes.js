const express = require('express');
const { body } = require('express-validator');
const logController = require('../controllers/log.controller');


const router = express.Router();



/**
 * @swagger
 * tags:
 *   name: Logs
 *   description: System and Usage logs
 */

/**
 * @swagger
 * /logs:
 *   get:
 *     summary: Get all logs (with optional filters)
 *     tags: [Logs]

 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter by user email
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [USAGE, ERROR]
 *         description: Filter by log type
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter logs after this date (ISO string, e.g., 2024-01-01T00:00:00.000Z)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter logs before this date (ISO string)
 *     responses:
 *       200:
 *         description: List of logs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *             example:
 *               success: true
 *               data: [
 *                 {
 *                   id: 1,
 *                   email: "test@example.com",
 *                   type: "USAGE",
 *                   message: "User logged in",
 *                   details: "{\"ip\":\"127.0.0.1\"}",
 *                   created_at: "2024-01-01T12:00:00.000Z"
 *                 }
 *               ]
 */
router.get('/', logController.getLogs);

/**
 * @swagger
 * /logs/error:
 *   post:
 *     summary: Post a new error log from frontend
 *     tags: [Logs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - error_string
 *             properties:
 *               user_id:
 *                 type: integer
 *               error_type:
 *                 type: string
 *               error_string:
 *                 type: string
 *             example:
 *               user_id: 1
 *               error_type: "Frontend Crash"
 *               error_string: "Uncaught TypeError: Cannot read property 'map' of undefined"
 *     responses:
 *       201:
 *         description: Error log created successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 */
router.post(
  '/error',
  [
    body('user_id').isInt().withMessage('Valid user_id is required'),
    body('error_type').optional().isString(),
    body('error_string').notEmpty().withMessage('error_string is required')
  ],
  logController.createErrorLog
);

module.exports = router;
