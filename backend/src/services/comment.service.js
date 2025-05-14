import Comment from "../models/comment.model.js";
import Workout from "../models/workout.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const createComment = async (userId, workoutId, content) => {
    if (!mongoose.Types.ObjectId.isValid(workoutId)) {
        throw new Error("Invalid workout ID format");
    }
    if (!content || content.trim() === "") {
        throw new Error("Comment content cannot be empty");
    }

    const workoutExists = await Workout.findById(workoutId);
    if (!workoutExists) {
        throw new Error("Workout not found");
    }

    const newComment = new Comment({
        user: userId,
        workout: workoutId,
        content: content.trim(),
    });

    await newComment.save();

    return await Comment.findById(newComment._id).populate("user", "username profilePic");
};

export const getCommentsForWorkout = async (workoutId) => {
    if (!mongoose.Types.ObjectId.isValid(workoutId)) {
        throw new Error("Invalid workout ID format");
    }

    const comments = await Comment.find({ workout: workoutId })
        .populate("user", "username profilePic")
        .sort({ createdAt: -1 });

    return comments;
};