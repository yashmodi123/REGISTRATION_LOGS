const express = require('express');
const registrationController = require('../controllers/registration.controller');

const authenticateToken = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Registrations
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
 *     summary: Get all registrations with server-side pagination & search (🔒 Admin only)
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Records per page (10, 25, 50)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search across company_name, email, machine_number, country
 *     responses:
 *       200:
 *         description: Paginated list of machine registrations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedRegistrations'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
