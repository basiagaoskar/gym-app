import { fetchAllDefaultExercises } from "../services/exercise.service.js";

export const getAllExercises = async (req, res, next) => {
    try {
        const exercises = await fetchAllDefaultExercises();
        res.status(200).json(exercises);
    } catch (error) {
        next(error)
    }
};