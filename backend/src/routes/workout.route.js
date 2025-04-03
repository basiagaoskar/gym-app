import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'
import { addWorkout, getAllUserWorkouts, findWorkout } from '../controllers/workout.controller.js'

const router = express.Router()

router.get("/:workoutId", findWorkout)
router.get('/user/:userId', protectRoute, getAllUserWorkouts)

router.post("/save-workout", protectRoute, addWorkout)

export default router