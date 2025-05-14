import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useCommentStore = create((set, get) => ({
    comments: [],
    isLoadingComments: false,

    fetchComments: async (workoutId) => {
        if (!workoutId) return;
        set({ isLoadingComments: true, comments: [] });
        try {
            const res = await axiosInstance.get(`/comment/${workoutId}`);
            set({ comments: res.data });
        } catch (error) {
            console.error("Error fetching comments:", error);
            toast.error(error.response?.data?.message || "Failed to load comments");
            set({ comments: [] });
        } finally {
            set({ isLoadingComments: false });
        }
    },

    clearComments: () => {
        set({ comments: [], isLoadingComments: false });
    }
}));