import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { followUser, unfollowUser, getFollowingList, getFollowersList } from '../controllers/follow.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Follow
 *   description: Follow system - users following each other
 */

/**
 * @swagger
 * /follow/follow/{userIdToFollow}:
 *   post:
 *     tags: [Follow]
 *     summary: Follow a user
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: userIdToFollow
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully followed the user
 *       400:
 *         description: Cannot follow user
 *       401:
 *         description: Unauthorized
 */
router.post('/follow/:userIdToFollow', protectRoute, followUser);

/**
 * @swagger
 * /follow/unfollow/{userIdToUnfollow}:
 *   delete:
 *     tags: [Follow]
 *     summary: Unfollow a user
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: userIdToUnfollow
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully unfollowed the user
 *       400:
 *         description: Cannot unfollow user
 *       401:
 *         description: Unauthorized
 */
router.delete('/unfollow/:userIdToUnfollow', protectRoute, unfollowUser);

/**
 * @swagger
 * /follow/following/{userId}:
 *   get:
 *     tags: [Follow]
 *     summary: Get the list of users a user is following
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of followed users
 *       404:
 *         description: User not found
 */
router.get('/following/:userId', getFollowingList);

/**
 * @swagger
 * /follow/followers/{userId}:
 *   get:
 *     tags: [Follow]
 *     summary: Get the list of followers of a user
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of followers
 *       404:
 *         description: User not found
 */
router.get('/followers/:userId', getFollowersList);

export default router;