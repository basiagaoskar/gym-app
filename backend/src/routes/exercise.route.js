import express from 'express'
import { getAllExercises } from '../controllers/exercise.controller.js'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Exercises
 */

/**
 * @swagger
 * /exercise/all-exercises:
 *   get:
 *     tags: [Exercises]
 *     summary: Get all the basic exercises
 *     responses:
 *       200:
 *         description: List of the basic exercises
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Exercise'
 */
router.get("/all-exercises", getAllExercises)

export default router