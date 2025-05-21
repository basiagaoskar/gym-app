import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useWorkoutStore = create((set) => ({
    workout: null,

    feedWorkouts: [],
    currentPage: 1,
    totalPages: 1,
    hasMoreFeed: true,
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

    fetchFeed: async (page) => {
        if (page === 1) {
            set({ isLoadingFeed: true, feedWorkouts: [], currentPage: 1, hasMoreFeed: true });
        } else {
            set({ isFetchingMoreFeed: true });
        }

        try {
            const res = await axiosInstance.get(`/workout/feed?page=${page}`);
            const { workouts, totalPages, currentPage: newCurrentPage, hasMore } = res.data;

            set((state) => ({
                feedWorkouts: page === 1 ? workouts : [...state.feedWorkouts, ...workouts],
                currentPage: newCurrentPage,
                totalPages,
                hasMoreFeed: hasMore,
            }));
        } catch (error) {
            if (page === 1) {
                set({ feedWorkouts: [], hasMoreFeed: false });
            }
        } finally {
            if (page === 1) {
                set({ isLoadingFeed: false });
            } else {
                set({ isFetchingMoreFeed: false });
            }
        }
    },

    fetchProfileWorkouts: async (userId) => {
        if (!userId) return;
        set({ profileWorkouts: [], isLoadingProfileWorkouts: true })
        try {
            const res = await axiosInstance.get(`/workout/user/${userId}`)
            set({ profileWorkouts: res.data })
        } catch (error) {
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