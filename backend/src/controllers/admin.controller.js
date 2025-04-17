import User from "../models/user.model.js";

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

export const updateUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        const { username, role } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID parameter is required' });
        }


        if (username) {
            const existingUser = await User.findOne({
                username: username,
                _id: { $ne: userId }
            });

            if (existingUser) {
                return res.status(409).json({ message: 'Username is already taken by another user' });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                username,
                role
            },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });

    } catch (error) {
        next(error);
    }
}