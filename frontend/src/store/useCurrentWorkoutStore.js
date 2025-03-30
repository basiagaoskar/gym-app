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
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    
    removeExercise: (exerciseId) => {
        set((state) => {
            const updatedWorkout = {
                ...state.currentWorkout,
                exercises: state.currentWorkout.exercises.filter(
                    (exercise) => exercise._id !== exerciseId
                ),
            };
            localStorage.setItem("currentWorkout", JSON.stringify(updatedWorkout));
    
            return { currentWorkout: updatedWorkout };
        });
    },

    addSetToExercise: (exerciseId, setIndex, field, value) => {
        set((state) => {
            const updatedExercises = state.currentWorkout.exercises.map((exercise) => {
                if (exercise._id === exerciseId) {
                    const updatedSets = setIndex !== null
                        ? exercise.sets.map((set, index) =>
                            index === setIndex ? { ...set, [field]: value } : set
                        )
                        : [...exercise.sets, { weight: "", reps: "" }];
                    return { ...exercise, sets: updatedSets }
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
            return response.data
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