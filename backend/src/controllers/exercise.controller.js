import Exercise from "../models/exercise.model.js"

export const getAllExercises = async (req, res) => {
    try {
        const exercises = await Exercise.find({ is_custom: false });
        res.status(200).json(exercises);
    } catch (error) {
        next(error)
    }
};