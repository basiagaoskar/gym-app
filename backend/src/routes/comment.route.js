import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { addComment, getWorkoutComments, removeComment } from '../controllers/comment.controller.js';

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

/**
 * @swagger
 * /comments/{workoutId}:
 *   get:
 *     tags: [Comments]
 *     summary: Get comments for a specific workout
 *     description: Returns a list of comments associated with the specified workout. Requires authentication.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: workoutId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the workout
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Comment'
 *       400:
 *         description: Invalid workout ID format
 *       401:
 *         description: Unauthorized
 */
router.get('/:workoutId', protectRoute, getWorkoutComments);

/**
 * @swagger
 * /comments/{commentId}:
 *   delete:
 *     tags: [Comments]
 *     summary: Delete a comment
 *     description: Deletes a comment by ID. Only the comment author or an admin can delete it.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: commentId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       400:
 *         description: Invalid comment ID format
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – not allowed to delete this comment
 *       404:
 *         description: Comment not found
 */
router.delete('/:commentId', protectRoute, removeComment);

export default router;