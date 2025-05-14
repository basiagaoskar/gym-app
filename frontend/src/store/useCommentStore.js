import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useCommentStore = create((set, get) => ({
    comments: [],
    isLoadingComments: false,
    isAddingComment: false,
    isDeletingComment: false,

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

    addComment: async (workoutId, content) => {
        if (!workoutId || !content.trim()) {
            toast.error("Comment cannot be empty.");
            return null;
        }
        set({ isAddingComment: true });
        try {
            const res = await axiosInstance.post(`/comment/${workoutId}`, { content });
            set((state) => ({
                comments: [...state.comments, res.data],
            }));
            toast.success("Comment added!");
            return res.data;
        } catch (error) {
            console.error("Error adding comment:", error);
            toast.error(error.response?.data?.message || "Failed to add comment");
            return null;
        } finally {
            set({ isAddingComment: false });
        }
    },

    deleteComment: async (commentId) => {
        if (!commentId) return;
        set({ isDeletingComment: true });
        try {
            await axiosInstance.delete(`/comment/${commentId}`);
            set((state) => ({
                comments: state.comments.filter(comment => comment._id !== commentId),
            }));
            toast.success("Comment deleted!");
        } catch (error) {
            console.error("Error deleting comment:", error);
            toast.error(error.response?.data?.message || "Failed to delete comment");
        } finally {
            set({ isDeletingComment: false });
        }
    },

    clearComments: () => {
        set({ comments: [], isLoadingComments: false });
    }
}));