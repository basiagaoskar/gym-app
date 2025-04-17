import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/admin.middleware.js';
import { getAllUsers, updateUser, deleteUser } from '../controllers/admin.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only operations
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Get all users (admin only)
 *     description: Returns a list of all users in the system. Requires admin privileges.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – not an admin
 */
router.get('/users', protectRoute, isAdmin, getAllUsers);

/**
 * @swagger
 * /admin/users/{userId}:
 *   put:
 *     tags: [Admin]
 *     summary: Update a user's information
 *     description: Admins can update any user's profile data.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/UpdateUserInput'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – not an admin
 *       404:
 *         description: User not found
 */
router.put('/users/:userId', protectRoute, isAdmin, updateUser);

/**
 * @swagger
 * /admin/users/{userId}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete a user
 *     description: Admins can delete any user account.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – not an admin
 *       404:
 *         description: User not found
 */
router.delete('/users/:userId', protectRoute, isAdmin, deleteUser);

export default router;