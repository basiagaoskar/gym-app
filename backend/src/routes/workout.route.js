import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'
import { addWorkout, findWorkout } from '../controllers/workout.controller.js'

const router = express.Router()

router.get("/:workoutId", findWorkout)

router.post("/save-workout", protectRoute, addWorkout)

export default router