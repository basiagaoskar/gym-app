import Workout from "../models/workout.model.js";
import mongoose from "mongoose";

export const addWorkout = async (req, res) => {
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

export const getAllUserWorkouts = async (req, res) => {
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

export const findWorkout = async (req, res) => {
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