import mongoose from "mongoose"

const commentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        workout: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workout",
            required: true,
            index: true,
        },
        content: {
            type: String,
            required: true,
            minlength: 1,
        },
    },
    { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema)

export default Comment