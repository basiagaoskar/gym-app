import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        profilePic: {
            type: String,
            default: ""
        },
        bio: {
            type: String,
            default: "I love Ziutki Gym"
        },
        role: {
            type: String,
            default: "user"
        },
    }, { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;