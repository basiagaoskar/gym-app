import Workout from "../models/workout.model.js";
import Follow from "../models/follow.model.js";
import mongoose from "mongoose";

export const createWorkout = async (userId, workoutData) => {
    const { exercises, startTime, endTime, title } = workoutData;

    const formattedExercises = exercises.map((exercise) => ({
        exercise: new mongoose.Types.ObjectId(exercise.exercise),
        sets: exercise.sets,
    }));

    const durationInMinutes = Math.floor((new Date(endTime) - new Date(startTime)) / (1000 * 60));

    const newWorkout = new Workout({
        user: userId,
        exercises: formattedExercises,
        startTime,
        duration: durationInMinutes,
        title,
    });

    return await newWorkout.save();
};

export const likeWorkout = async (workoutId, userId) => {
    const workout = await Workout.findById(workoutId);
    if (!workout) {
        throw new Error("Workout not found");
    }

    if (workout.likes.includes(userId)) {
        workout.likes = workout.likes.filter(id => id.toString() !== userId.toString());
    } else {
        workout.likes.push(userId);
    }

    await workout.save();
    return workout;
};

export const getFollowingWorkoutFeed = async (userId, page = 1) => {
    const followingRelations = await Follow.find({ follower: userId });
    const followingIds = followingRelations.map(rel => rel.following);
    followingIds.push(userId);

    const limit = 5;
    const skip = (page - 1) * limit;
    const workouts = await Workout.find({ user: { $in: followingIds } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "username profilePic")
        .populate("exercises.exercise", "title");
    
    const totalWorkouts = await Workout.countDocuments({ user: { $in: followingIds } });

    return {
        workouts,
        totalPages: Math.ceil(totalWorkouts / limit),
        currentPage: page,
        hasMore: page * limit < totalWorkouts
    };
};

export const getUserWorkouts = async (userId) => {
    return await Workout.find({ user: userId }).sort({ createdAt: -1 }).populate("exercises.exercise", "title");
};

export const getWorkoutById = async (workoutId) => {
    if (!mongoose.Types.ObjectId.isValid(workoutId)) {
        throw new Error("Invalid workout ID format");
    }
    const workout = await Workout.findById(workoutId).populate("exercises.exercise");
    if (!workout) {
        throw new Error("Workout not found");
    }
    return workout;
};

export const removeWorkout = async (workoutId, userId) => {
    const workout = await Workout.findById(workoutId);
    if (!workout) {
        throw new Error("Workout not found");
    }
    if (workout.user.toString() !== userId.toString()) {
        throw new Error("Forbidden – You are not allowed to delete this workout");
    }
    await Workout.findByIdAndDelete(workoutId);
};