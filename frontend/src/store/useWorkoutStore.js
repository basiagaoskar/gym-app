import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useWorkoutStore = create((set) => ({
    workout: [],

    getWorkout: async (workoutId) => {
        try {
            const res = await axiosInstance.get(`/workout/${workoutId}`);
            set({ workout: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

}));