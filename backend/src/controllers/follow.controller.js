import Follow from '../models/follow.model.js';
import User from '../models/user.model.js';

export const followUser = async (req, res, next) => {
    const userIdToFollow = req.params.userIdToFollow;
    const followerId = req.user._id;

    if (followerId.equals(userIdToFollow)) {
        return res.status(400).json({ message: "You cannot follow yourself." });
    }

    try {
        const userToFollowExists = await User.findById(userIdToFollow);
        if (!userToFollowExists) {
            return res.status(404).json({ message: "User to follow not found." });
        }

        const existingFollow = await Follow.findOne({ follower: followerId, following: userIdToFollow });
        if (existingFollow) {
            return res.status(400).json({ message: "You are already following this user." });
        }

        const newFollow = new Follow({
            follower: followerId,
            following: userIdToFollow
        });

        await newFollow.save();
        res.status(201).json({ message: "User followed successfully." });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Follow relationship already exists." });
        }
        next(error);
    }
};

export const unfollowUser = async (req, res, next) => {
    const userIdToUnfollow = req.params.userIdToUnfollow;
    const followerId = req.user._id;

    try {
        const result = await Follow.deleteOne({ follower: followerId, following: userIdToUnfollow });

        if (result.deletedCount === 0) {
            return res.status(400).json({ message: "You are not following this user or user not found." });
        }

        res.status(200).json({ message: "User unfollowed successfully." });

    } catch (error) {
        next(error);
    }
};

export const getFollowingList = async (req, res, next) => {
    const userId = req.params.userId;

    try {
        const followingRelations = await Follow.find({ follower: userId }).populate('following', 'username profilePic');

        const followingUsers = followingRelations.map(rel => rel.following);
        res.status(200).json(followingUsers);

    } catch (error) {
        next(error);
    }
};

export const getFollowersList = async (req, res, next) => {
    const userId = req.params.userId;

    try {
        const followerRelations = await Follow.find({ following: userId }).populate('follower', 'username profilePic');

        const followers = followerRelations.map(rel => rel.follower);
        res.status(200).json(followers);

    } catch (error) {
        next(error);
    }
};