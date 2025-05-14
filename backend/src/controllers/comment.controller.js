import { createComment, getCommentsForWorkout, deleteComment } from "../services/comment.service.js";

export const addComment = async (req, res, next) => {
    const { workoutId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!content) {
        return res.status(400).json({ message: "Comment content is required" });
    }

    try {
        const savedComment = await createComment(userId, workoutId, content);
        res.status(201).json(savedComment);
    } catch (error) {
        if (error.message === "Workout not found") {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === "Invalid workout ID format" || error.message === "Comment content cannot be empty") {
            return res.status(400).json({ message: error.message });
        }
        next(error);
    }
};

export const getWorkoutComments = async (req, res, next) => {
    const { workoutId } = req.params;
    try {
        const comments = await getCommentsForWorkout(workoutId);
        res.status(200).json(comments);
    } catch (error) {
        if (error.message === "Invalid workout ID format") {
            return res.status(400).json({ message: error.message });
        }
        next(error);
    }
};

export const removeComment = async (req, res, next) => {
    const { commentId } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    try {
        await deleteComment(commentId, userId, userRole);
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        if (error.message === "Comment not found") {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === "Forbidden - You are not allowed to delete this comment") {
            return res.status(403).json({ message: error.message });
        }
        if (error.message === "Invalid comment ID format") {
            return res.status(400).json({ message: error.message });
        }
        next(error);
    }
};