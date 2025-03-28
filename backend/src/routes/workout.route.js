import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'
import { addWorkout } from '../controllers/workout.controller.js'

const router = express.Router()

router.post("/save-workout", protectRoute, addWorkout)

export default router