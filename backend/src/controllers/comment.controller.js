import { createComment, getCommentsForWorkout } from "../services/comment.service.js";

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