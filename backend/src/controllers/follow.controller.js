import { createUserFollow, removeUserFollow, fetchFollowingList, fetchFollowersList } from '../services/follow.service.js';

export const followUser = async (req, res, next) => {
    const userIdToFollow = req.params.userIdToFollow;
    const followerId = req.user._id;

    try {
        await createUserFollow(followerId, userIdToFollow);
        res.status(201).json({ message: "User followed successfully." });
    } catch (error) {
        if (error.message === "You cannot follow yourself." ||
            error.message === "You are already following this user." ||
            error.message === "Follow relationship already exists.") {
            return res.status(400).json({ message: error.message });
        }
        if (error.message === "User to follow not found.") {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
};

export const unfollowUser = async (req, res, next) => {
    const userIdToUnfollow = req.params.userIdToUnfollow;
    const followerId = req.user._id;

    try {
        await removeUserFollow(followerId, userIdToUnfollow);
        res.status(200).json({ message: "User unfollowed successfully." });
    } catch (error) {
        if (error.message === "You are not following this user or user not found.") {
            return res.status(400).json({ message: error.message });
        }
        next(error);
    }
};

export const getFollowingList = async (req, res, next) => {
    const userId = req.params.userId;

    try {
        const followingUsers = await fetchFollowingList(userId);
        res.status(200).json(followingUsers);
    } catch (error) {
        next(error);
    }
};

export const getFollowersList = async (req, res, next) => {
    const userId = req.params.userId;

    try {
        const followers = await fetchFollowersList(userId);
        res.status(200).json(followers);
    } catch (error) {
        next(error);
    }
};