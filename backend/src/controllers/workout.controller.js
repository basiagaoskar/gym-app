import Workout from "../models/workout.model.js";
import mongoose from "mongoose";

export const addWorkout = async (req, res) => {
    const { exercises, startTime, endTime, notes } = req.body;

    if (!req.user || !exercises || !startTime || !endTime) {
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
            notes,
        });

        const savedWorkout = await newWorkout.save();
        res.status(201).json(savedWorkout);
    } catch (error) {
        console.error("Error adding workout:", error.message);
        res.status(500).json({ message: "Failed to add workout", error: error.message });
    }
};