import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'
import { addWorkout, getFeed, getAllUserWorkouts, findWorkout, deleteWorkout } from '../controllers/workout.controller.js'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Workouts
 *   description: User workout management
 */

/**
 * @swagger
 * /workouts/feed:
 *   get:
 *     tags: [Workouts]
 *     summary: Get workout feed from followed users
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of workouts from followed users
 *       401:
 *         description: Unauthorized
 */
router.get('/feed', protectRoute, getFeed);

/**
 * @swagger
 * /workouts/{workoutId}:
 *   get:
 *     tags: [Workouts]
 *     summary: Get a specific workout by ID
 *     parameters:
 *       - name: workoutId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workout details
 *       404:
 *         description: Workout not found
 */
router.get("/:workoutId", findWorkout)

/**
 * @swagger
 * /workouts/user/{userId}:
 *   get:
 *     tags: [Workouts]
 *     summary: Get all workouts for a specific user
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of user's workouts
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/user/:userId', protectRoute, getAllUserWorkouts)

/**
 * @swagger
 * /workouts/save-workout:
 *   post:
 *     tags: [Workouts]
 *     summary: Save a new workout for the user
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/WorkoutInput'
 *     responses:
 *       201:
 *         description: Workout saved successfully
 *       400:
 *         description: Invalid workout data
 *       401:
 *         description: Unauthorized
 */
router.post("/save-workout", protectRoute, addWorkout)

/**
 * @swagger
 * /workouts/{workoutId}:
 *   delete:
 *     tags: [Workouts]
 *     summary: Delete a specific workout by ID
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: workoutId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the workout to delete
 *     responses:
 *       200:
 *         description: Workout successfully deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – not owner of the workout
 *       404:
 *         description: Workout not found
 */
router.delete("/:workoutId", protectRoute, deleteWorkout);

export default router