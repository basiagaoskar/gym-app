import Workout from "../models/workout.model.js";
import Follow from "../models/follow.model.js";
import mongoose from "mongoose";

export const addWorkout = async (req, res, next) => {
    const { exercises, startTime, endTime, title } = req.body;
    if (!req.user || !exercises || !startTime || !endTime || !title) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const formattedExercises = exercises.map((exercise) => {
            return {
                exercise: new mongoose.Types.ObjectId(exercise.exercise),
                sets: exercise.sets,
            };
        });

        const durationInMinutes = Math.floor((new Date(endTime) - new Date(startTime)) / (1000 * 60))

        const newWorkout = new Workout({
            user: req.user._id,
            exercises: formattedExercises,
            startTime,
            duration: durationInMinutes,
            title,
        });

        const savedWorkout = await newWorkout.save();
        res.status(201).json(savedWorkout);
    } catch (error) {
        next(error);
    }
};

export const getFeed = async (req, res, next) => {
    const userId = req.user._id;

    try {
        const followingRelations = await Follow.find({ follower: userId });
        const followingIds = followingRelations.map(rel => rel.following);

        followingIds.push(userId);

        const feedWorkouts = await Workout.find({ user: { $in: followingIds } })
            .sort({ createdAt: -1 })
            .limit(50)
            .populate("user", "username profilePic")
            .populate("exercises.exercise", "title");

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
        const workouts = await Workout.find({ user: userId }).sort({ createdAt: -1 }).populate("exercises.exercise", "title");
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

    if (!mongoose.Types.ObjectId.isValid(workoutId)) {
        return res.status(400).json({ message: "Invalid workout ID format" });
    }

    try {
        const workout = await Workout.findById(workoutId).populate("exercises.exercise");

        if (!workout) {
            return res.status(404).json({ message: "Workout not found" });
        }

        res.status(200).json(workout);
    } catch (error) {
        next(error);
    }
};

export const deleteWorkout = async (req, res, next) => {
    const { workoutId } = req.params;

    if (!workoutId) {
        return res.status(400).json({ message: "Workout ID is required" });
    }

    try {
        const workout = await Workout.findById(workoutId);

        if (!workout) {
            return res.status(404).json({ message: "Workout not found" });
        }

        if (workout.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Forbidden – You are not allowed to delete this workout" });
        }

        await Workout.findByIdAndDelete(workoutId);

        res.status(200).json({ message: "Workout deleted successfully" });
    } catch (error) {
        next(error);
    }
};