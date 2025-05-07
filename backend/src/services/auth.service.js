import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Follow from "../models/follow.model.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const verifyAuth = (user) => {
    if (!user) {
        throw new Error("Unauthorized - No Token Provided");
    }
    return user;
};

export const registerUser = async (userData, res) => {
    const { username, email, password } = userData;

    if (!username || !email || !password) {
        throw new Error("All fields are required");
    }

    if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
    }

    let user = await User.findOne({ email });
    if (user) {
        throw new Error("Email already in use");
    }

    user = await User.findOne({ username });
    if (user) {
        throw new Error("Username already in use");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        username,
        email,
        password: hashedPassword
    });

    if (newUser) {
        await newUser.save();
        generateToken(newUser._id, res);
        return {
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            profilePic: newUser.profilePic,
            bio: newUser.bio
        };
    } else {
        throw new Error("Invalid user data");
    }
};

export const authenticateUser = async (credentials, res) => {
    const { email, password } = credentials;

    if (!email || !password) {
        throw new Error("All fields are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Invalid Credentials");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        throw new Error("Invalid Credentials");
    }

    generateToken(user._id, res);

    return {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        bio: user.bio
    };
};

export const clearAuthCookie = (res) => {
    res.cookie("jwt", "", { maxAge: 0 });
    return { message: "Logged out successfully" };
};

export const updateUserProfileData = async (userId, profileData) => {
    const { username, profilePic, bio } = profileData;

    const existingUser = await User.findById(userId);
    if (!existingUser) {
        throw new Error("User not found");
    }

    let newUsername = existingUser.username;
    if (username) {
        if (!/^[a-zA-Z0-9-]{3,30}$/.test(username)) {
            throw new Error("Username must be 3 to 30 characters containing only letters, numbers, or dashes");
        }

        const usernameExists = await User.findOne({ username });
        if (usernameExists && usernameExists._id.toString() !== userId.toString()) {
            throw new Error("Username is already taken");
        }
        newUsername = username;
    }

    let newBio = bio ? bio.trim() : "";
    if (newBio.length > 200) {
        throw new Error("Bio must be 200 characters or less");
    }

    let newProfilePic = profilePic || existingUser.profilePic;

    if (profilePic) {
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        newProfilePic = uploadResponse.secure_url;
    }

    return await User.findByIdAndUpdate(
        userId,
        { username: newUsername, profilePic: newProfilePic, bio: newBio },
        { new: true }
    );
};

export const updateUserPasswordData = async (userId, passwordData) => {
    const { currentPassword, newPassword } = passwordData;

    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
        throw new Error("Invalid Credentials");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    return await User.findByIdAndUpdate(userId, { password: hashedPassword });
};

export const removeUserAccount = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    await User.findByIdAndDelete(userId);
};

export const fetchUserByUsername = async (username, loggedInUserId) => {
    const foundUser = await User.findOne({ username }).select('-password');
    if (!foundUser) {
        throw new Error("User not found");
    }

    const followersCount = await Follow.countDocuments({ following: foundUser._id });
    const followingCount = await Follow.countDocuments({ follower: foundUser._id });

    let isFollowing = false;
    if (loggedInUserId && !foundUser._id.equals(loggedInUserId)) {
        const isFollowingCheck = await Follow.exists({ follower: loggedInUserId, following: foundUser._id });
        isFollowing = isFollowingCheck ? true : false;
    }
    const userProfile = foundUser.toObject();
    userProfile.followersCount = followersCount;
    userProfile.followingCount = followingCount;
    userProfile.isFollowing = isFollowing;

    return userProfile;
};

export const searchUsersByUsername = async (query) => {
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
        return [];
    }
    const trimmedQuery = query.trim();
    return await User.find({
        username: { $regex: trimmedQuery, $options: 'i' }
    })
        .select("username profilePic _id")
        .limit(5);
};