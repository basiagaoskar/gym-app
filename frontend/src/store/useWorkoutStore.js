import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useWorkoutStore = create((set) => ({
    workout: null,

    feedWorkouts: [],
    isLoadingFeed: false,

    profileWorkouts: [],
    isLoadingProfileWorkouts: false,

    getWorkout: async (workoutId) => {
        set({ workout: null });
        try {
            const res = await axiosInstance.get(`/workout/${workoutId}`);
            set({ workout: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    fetchFeed: async () => {
        set({ isLoadingFeed: true });
        try {
            const res = await axiosInstance.get('/workout/feed');
            set({ feedWorkouts: res.data });
        } catch (error) {
            console.error("Error in fetchFeed: ", error);
            toast.error(error.response.data.message);
            set({ feedWorkouts: [] });
        } finally {
            set({ isLoadingFeed: false });
        }
    },

    fetchProfileWorkouts: async (userId) => {
        if (!userId) return;
        set({ profileWorkouts: [], isLoadingProfileWorkouts: true })
        try {
            const res = await axiosInstance.get(`/workout/user/${userId}`)
            set({ profileWorkouts: res.data })
        } catch (error) {
            console.error("Error in fetchProfileWorkouts: ", error)
            toast.error(error.response.data.message)
            set({ profileWorkouts: [] })
        } finally {
            set({ isLoadingProfileWorkouts: false })
        }
    },

    toggleLike: async (workoutId) => {
        const loggedInUserId = useAuthStore.getState().authUser?._id;
        if (!loggedInUserId) return;

        const workout = await axiosInstance.get(`/workout/${workoutId}`);
        if (!workout) {
            console.error("Workout not found for ID:", workoutId);
            return;
        }

        await axiosInstance.post(`/workout/like/${workoutId}`);
    },

    deleteWorkout: async (workoutId) => {
        try {
            await axiosInstance.delete(`/workout/${workoutId}`);
            set({ workout: null });
            toast.success("Workout deleted successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
}));