const express = require('express');
const registrationController = require('../controllers/registration.controller');

const authenticateToken = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Registration
 *   description: Registration management (Admin only for list/update/delete)
 */

/**
 * @swagger
 * /api/registrations/profile:
 *   get:
 *     summary: Get registration profile by email (Public)
 *     tags: [Registration]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Machine email
 *     responses:
 *       200:
 *         description: Registration profile
 *       404:
 *         description: Registration not found
 */
router.get('/profile', registrationController.getProfile);

/**
 * @swagger
 * /api/registrations:
 *   get:
 *     summary: Get all registrations (🔒 Admin only)
 *     tags: [Registration]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all machine registrations
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticateToken, registrationController.getAll);

/**
 * @swagger
 * /api/registrations/{id}:
 *   put:
 *     summary: Update a registration (🔒 Admin only)
 *     tags: [Registration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Registration updated
 *       404:
 *         description: Not found
 */
router.put('/:id', authenticateToken, registrationController.update);

/**
 * @swagger
 * /api/registrations/{id}:
 *   delete:
 *     summary: Delete a registration (🔒 Admin only)
 *     tags: [Registration]
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
 *         description: Registration deleted
 *       404:
 *         description: Not found
 */
router.delete('/:id', authenticateToken, registrationController.remove);

module.exports = router;
