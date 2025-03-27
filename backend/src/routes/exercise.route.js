import express from 'express'
import { getAllExercises } from '../controllers/exercise.controller.js'

const router = express.Router()

router.get("/all-exercises", getAllExercises)

export default router