import { createWorkout, likeWorkout, getFollowingWorkoutFeed, getUserWorkouts, getWorkoutById, removeWorkout } from "../services/workout.service.js";

export const addWorkout = async (req, res, next) => {
    const { exercises, startTime, endTime, title } = req.body;
    if (!req.user || !exercises || !startTime || !endTime || !title) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const savedWorkout = await createWorkout(req.user._id, req.body);
        res.status(201).json(savedWorkout);
    } catch (error) {
        next(error);
    }
};

export const toggleLikeWorkout = async (req, res, next) => {
    const { workoutId } = req.params;
    const userId = req.user._id;
    try {
        const updatedWorkout = await likeWorkout(workoutId, userId);
        res.status(200).json({ message: "Workout liked/unliked successfully", workout: updatedWorkout });
    } catch (error) {
        if (error.message === "Workout not found") {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
};

export const getFeed = async (req, res, next) => {
    const userId = req.user._id;
    try {
        const feedWorkouts = await getFollowingWorkoutFeed(userId);
        res.status(200).json(feedWorkouts);
    } catch (error) {
        next(error);
    }
};

export const getAllUserWorkouts = async (req, res, next) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }
    try {
        const workouts = await getUserWorkouts(userId);
        res.status(200).json(workouts);
    } catch (error) {
        next(error);
    }
};

export const findWorkout = async (req, res, next) => {
    const { workoutId } = req.params;
    if (!workoutId) {
        return res.status(400).json({ message: "Workout ID is required" });
    }
    try {
        const workout = await getWorkoutById(workoutId);
        res.status(200).json(workout);
    } catch (error) {
        if (error.message === "Invalid workout ID format") {
            return res.status(400).json({ message: error.message });
        }
        if (error.message === "Workout not found") {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
};

export const deleteWorkout = async (req, res, next) => {
    const { workoutId } = req.params;
    if (!workoutId) {
        return res.status(400).json({ message: "Workout ID is required" });
    }
    try {
        await removeWorkout(workoutId, req.user._id);
        res.status(200).json({ message: "Workout deleted successfully" });
    } catch (error) {
        if (error.message === "Workout not found") {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === "Forbidden – You are not allowed to delete this workout") {
            return res.status(403).json({ message: error.message });
        }
        next(error);
    }
};