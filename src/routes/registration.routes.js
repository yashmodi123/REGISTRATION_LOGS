const express = require('express');
const registrationController = require('../controllers/registration.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Registration
 *   description: Registration profile management
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get registration profile by email
 *     tags: [Registration]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: User email
 *     responses:
 *       200:
 *         description: User profile
 *       404:
 *         description: User not found
 */
router.get('/profile', registrationController.getProfile);

module.exports = router;
