import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useCurrentWorkoutStore = create((set, get) => ({
    currentWorkout:
        JSON.parse(localStorage.getItem("currentWorkout")) || {
            exercises: [],
            startTime: null,
        },
    exercises: [],

    startWorkout: async () => {
        const { currentWorkout } = get();

        if (currentWorkout.startTime) {
            return;
        }

        const newWorkout = {
            exercises: [],
            startTime: new Date(),
        };

        set({ currentWorkout: newWorkout });
        localStorage.setItem("currentWorkout", JSON.stringify(newWorkout));
    },

    getExercises: async () => {
        try {
            const res = await axiosInstance.get("/exercise/all-exercises");
            set({ exercises: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    addExercise: async (exercise) => {
        try {
            set((state) => {
                const updatedWorkout = {
                    ...state.currentWorkout,
                    exercises: [...state.currentWorkout.exercises, { ...exercise, sets: [] }]
                };
                localStorage.setItem("currentWorkout", JSON.stringify(updatedWorkout));

                return { currentWorkout: updatedWorkout };
            });

            toast.success("Exercise added successfully!");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    addSetToExercise: (exerciseId, newSet) => {
        set((state) => {
            const updatedExercises = state.currentWorkout.exercises.map((exercise) => {
                if (exercise._id === exerciseId) {
                    return {
                        ...exercise,
                        sets: [...(exercise.sets || []), newSet],
                    };
                }
                return exercise
            })

            const updatedWorkout = {
                ...state.currentWorkout,
                exercises: updatedExercises,
            }

            localStorage.setItem("currentWorkout", JSON.stringify(updatedWorkout))
            return { currentWorkout: updatedWorkout }
        });
    },

    endWorkout: async () => {
        const { currentWorkout } = get()
        const workoutToSave = {
            ...currentWorkout,
            exercises: currentWorkout.exercises.map((exercise) => ({
                exercise: exercise._id,
                sets: exercise.sets,
            })),
            startTime: currentWorkout.startTime,
            endTime: new Date(),
        }

        try {
            const response = await axiosInstance.post("/workout/save-workout", workoutToSave)
            toast.success("Workout saved successfully!");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            const resetWorkout = {
                exercises: [],
                startTime: null,
            };

            set({ currentWorkout: resetWorkout });
            localStorage.removeItem("currentWorkout")
        }
    },
}));