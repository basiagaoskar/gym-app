import Follow from '../models/follow.model.js';
import User from '../models/user.model.js';

export const createUserFollow = async (followerId, followingId) => {
    if (followerId.equals(followingId)) {
        throw new Error("You cannot follow yourself.");
    }

    const userToFollowExists = await User.findById(followingId);
    if (!userToFollowExists) {
        throw new Error("User to follow not found.");
    }

    const existingFollow = await Follow.findOne({ follower: followerId, following: followingId });
    if (existingFollow) {
        throw new Error("You are already following this user.");
    }

    const newFollow = new Follow({
        follower: followerId,
        following: followingId
    });

    try {
        await newFollow.save();
    } catch (error) {
        if (error.code === 11000) {
            throw new Error("Follow relationship already exists.");
        }
        throw error;
    }
};

export const removeUserFollow = async (followerId, followingId) => {
    const result = await Follow.deleteOne({ follower: followerId, following: followingId });
    if (result.deletedCount === 0) {
        throw new Error("You are not following this user or user not found.");
    }
};

export const fetchFollowingList = async (userId) => {
    const followingRelations = await Follow.find({ follower: userId }).populate('following', 'username profilePic');
    return followingRelations.map(rel => rel.following);
};

export const fetchFollowersList = async (userId) => {
    const followerRelations = await Follow.find({ following: userId }).populate('follower', 'username profilePic');
    return followerRelations.map(rel => rel.follower);
};