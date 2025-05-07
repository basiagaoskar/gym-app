import User from "../models/user.model.js";

export const fetchAllUsers = async () => {
    return await User.find().select('-password');
};

export const modifyUser = async (userId, updateData) => {
    const { username, role } = updateData;

    if (username) {
        const existingUser = await User.findOne({
            username: username,
            _id: { $ne: userId }
        });
        if (existingUser) {
            throw new Error('Username is already taken by another user');
        }
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { username, role },
        { new: true }
    ).select('-password');

    if (!updatedUser) {
        throw new Error('User not found');
    }

    return updatedUser;
};

export const removeUser = async (userId) => {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
        throw new Error('User not found');
    }
};