import { fetchAllUsers, modifyUser, removeUser } from "../services/admin.service.js";

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await fetchAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

export const updateUser = async (req, res, next) => {
    const { userId } = req.params;
    const { username, role } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'User ID parameter is required' });
    }

    try {
        const updatedUser = await modifyUser(userId, { username, role });
        res.status(200).json(updatedUser);
    } catch (error) {
        if (error.message === 'User not found') {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === 'Username is already taken by another user') {
            return res.status(409).json({ message: error.message });
        }
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        await removeUser(userId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        if (error.message === 'User not found') {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
}