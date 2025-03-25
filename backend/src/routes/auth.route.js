import express from 'express'
import { checkAuth, login, logout, findUser, signup, updateProfile, updatePassword, deleteAccount } from '../controllers/auth.controller.js'
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)

router.put("/update-profile", protectRoute, updateProfile)
router.put("/update-password", protectRoute, updatePassword)

router.get("/check", protectRoute, checkAuth)
router.get("/user/:username", findUser)

router.delete("/delete-account", protectRoute, deleteAccount)
export default router