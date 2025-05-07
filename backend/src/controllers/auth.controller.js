import { verifyAuth, registerUser, authenticateUser, clearAuthCookie, updateUserProfileData, updateUserPasswordData, removeUserAccount, fetchUserByUsername, searchUsersByUsername } from "../services/auth.service.js";

export const checkAuth = (req, res, next) => {
    try {
        const user = verifyAuth(req.user);
        res.status(200).json(user);
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
}

export const signup = async (req, res, next) => {
    try {
        const newUserInfo = await registerUser(req.body, res);
        res.status(201).json(newUserInfo);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const login = async (req, res, next) => {
    try {
        const loggedInUser = await authenticateUser(req.body, res);
        res.status(200).json(loggedInUser);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const logout = async (req, res, next) => {
    try {
        const message = clearAuthCookie(res);
        res.status(200).json(message);
    } catch (error) {
        next(error);
    }
}

export const updateProfile = async (req, res, next) => {
    try {
        const updatedUser = await updateUserProfileData(req.user._id, req.body);
        res.status(200).json(updatedUser);
    } catch (error) {
        if (error.message === "User not found") {
            return res.status(404).json({ message: error.message });
        }
        return res.status(400).json({ message: error.message });
    }
}

export const updatePassword = async (req, res, next) => {
    try {
        const updatedUser = await updateUserPasswordData(req.user._id, req.body);
        res.status(200).json(updatedUser);
    } catch (error) {
        if (error.message === "User not found") {
            return res.status(404).json({ message: error.message });
        }
        return res.status(400).json({ message: error.message });
    }
}

export const deleteAccount = async (req, res, next) => {
    try {
        await removeUserAccount(req.user._id);
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        if (error.message === "User not found") {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
}

export const findUser = async (req, res, next) => {
    try {
        const userProfile = await fetchUserByUsername(req.params.username, req.user?._id);
        res.status(200).json(userProfile);
    } catch (error) {
        if (error.message === "User not found") {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
}

export const searchUser = async (req, res, next) => {
    try {
        const users = await searchUsersByUsername(req.params.username);
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}