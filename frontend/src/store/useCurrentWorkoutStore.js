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
                    exercises: [...state.currentWorkout.exercises, exercise],
                };
                localStorage.setItem("currentWorkout", JSON.stringify(updatedWorkout));

                return { currentWorkout: updatedWorkout };
            });

            toast.success("Exercise added successfully!");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    endWorkout: async () => {

        console.log("Workout after reset:", get().currentWorkout);

        const { currentWorkout } = get();
        console.log("Current workout before saving:", currentWorkout)
        try {
            //await axiosInstance.post("/workouts", currentWorkout);
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