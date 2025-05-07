import Exercise from "../models/exercise.model.js";

export const fetchAllDefaultExercises = async () => {
    return await Exercise.find({ is_custom: false });
};