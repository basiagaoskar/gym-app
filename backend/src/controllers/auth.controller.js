import bcrypt from "bcryptjs"
import User from "../models/user.model.js"
import { generateToken } from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"

export const checkAuth = (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({ message: "Unauthorized - No Token Provided" })
        }
        res.status(200).json(req.user)
    } catch (error) {
        console.error("Error in checkAuth:", error.message)
        res.status(500).json({ message: "Failed to check authentication", error: error.message })
    }
}

export const signup = async (req, res) => {
    const { username, email, password } = req.body
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" })
        }

        let user = await User.findOne({ email })
        if (user) return res.status(400).json({ message: "Email already in use" })

        user = await User.findOne({ username })
        if (user) return res.status(400).json({ message: "Username already in use" })

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        if (newUser) {
            await newUser.save()

            generateToken(newUser._id, res)

            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                profilePic: newUser.profilePic,
                bio: newUser.bio
            })
        } else {
            res.status(400).json({ message: "Invalid user data" })
        }

    } catch (error) {
        console.log("Error in the signup controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }

        generateToken(user._id, res)

        return res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePic: user.profilePic,
            bio: user.bio
        })

    } catch (error) {
        console.log("Error in the login controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        console.log("Error in the logout controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { username, profilePic, bio } = req.body
        const userId = req.user._id

        const existingUser = await User.findById(userId)
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" })
        }

        let newUsername = existingUser.username
        if (username) {
            if (!/^[a-zA-Z0-9-]{3,30}$/.test(username)) {
                return res.status(400).json({ message: "Username must be 3 to 30 characters containing only letters, numbers, or dashes" })
            }

            const usernameExists = await User.findOne({ username })
            if (usernameExists && usernameExists._id.toString() !== userId.toString()) {
                return res.status(400).json({ message: "Username is already taken" })
            }
            newUsername = username
        }

        let newBio = bio ? bio.trim() : ""
        if (newBio.length > 200) {
            return res.status(400).json({ message: "Bio must be 200 characters or less" })
        }

        let newProfilePic = profilePic || existingUser.profilePic

        if (profilePic) {
            const uploadResponse = await cloudinary.uploader.upload(profilePic);
            newProfilePic = uploadResponse.secure_url;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username: newUsername, profilePic: newProfilePic, bio: newBio },
            { new: true }
        );

        res.status(200).json(updatedUser)
    } catch (error) {
        console.log("Error in the updateProfile controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body
        const userId = req.user._id

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        const updatedUser = await User.findByIdAndUpdate(userId, { password: hashedPassword })
        res.status(200).json(updatedUser)

    } catch (error) {
        console.log("Error in the updatePassword controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const deleteAccount = async (req, res) => {
    try {
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        await User.findByIdAndDelete(userId)
        res.status(200).json({ message: "Account deleted successfully" })
    } catch (error) {
        console.log("Error in deleteAccount controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const findUser = async (req, res) => {
    try {
        const { username } = req.params
        const foundUser = await User.findOne({ username }).select('-password')
        if (!foundUser) {
            return res.status(200).json({
                username: "-",
                email: "-",
                bio: ""
            })
        }
        res.status(200).json(foundUser)
    } catch (error) {
        console.log("Error in findUser controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}