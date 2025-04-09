import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decoded.userId).select("-password")
        if (!user) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" })
        }

        req.user = user

        next()

    } catch (error) {
        console.error("Error in protectRoute middleware: ", error.message)
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Unauthorized - Invalid Token", error: error.message })
        }
        res.status(500).json({ message: "Internal Server Error in Auth Middleware", error: error.message })
    }
}