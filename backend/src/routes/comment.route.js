import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { addComment } from '../controllers/comment.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment operations on workouts
 */

/**
 * @swagger
 * /comments/{workoutId}:
 *   post:
 *     tags: [Comments]
 *     summary: Add a comment to a workout
 *     description: Adds a comment to the specified workout.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: workoutId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the workout to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *     responses:
 *       201:
 *         description: Comment successfully added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Comment'
 *       400:
 *         description: Invalid request data (e.g. empty content or malformed workoutId)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workout not found
 */
router.post('/:workoutId', protectRoute, addComment);

export default router;