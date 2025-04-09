import express from 'express'
import { checkAuth, login, logout, findUser, signup, updateProfile, updatePassword, deleteAccount } from '../controllers/auth.controller.js'
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user management
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/SignupInput'
 *     responses:
 *       201:
 *         description: User successfully created
 *       400:
 *         description: Invalid input data
 */
router.post('/signup', signup)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Log in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/LoginInput'
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', login)

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Log out the current user
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post('/logout', logout)

/**
 * @swagger
 * /auth/update-profile:
 *   put:
 *     tags: [Auth]
 *     summary: Update user profile
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/UpdateProfileInput'
 *     responses:
 *       200:
 *         description: Profile updated
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 */
router.put("/update-profile", protectRoute, updateProfile)

/**
 * @swagger
 * /auth/update-password:
 *   put:
 *     tags: [Auth]
 *     summary: Change user password
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/UpdatePasswordInput'
 *     responses:
 *       200:
 *         description: Password updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.put("/update-password", protectRoute, updatePassword)

/**
 * @swagger
 * /auth/check:
 *   get:
 *     tags: [Auth]
 *     summary: Check authentication status
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User is authenticated
 *       401:
 *         description: Unauthorized
 */
router.get("/check", protectRoute, checkAuth)

/**
 * @swagger
 * /auth/user/{username}:
 *   get:
 *     tags: [Auth]
 *     summary: Get user by username
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User data
 */
router.get("/user/:username", findUser)

/**
 * @swagger
 * /auth/delete-account:
 *   delete:
 *     tags: [Auth]
 *     summary: Delete user account
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Account successfully deleted
 *       401:
 *         description: Unauthorized
 */
router.delete("/delete-account", protectRoute, deleteAccount)
export default router