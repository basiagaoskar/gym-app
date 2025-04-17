import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from "react-hot-toast";

export const useAdminStore = create((set) => ({
    users: [],
    isLoadingUsers: false,

    getUsers: async () => {
        set({ isLoadingUsers: true });
        try {
            const res = await axiosInstance.get('/admin/users');
            set({ users: res.data });
        } catch (error) {
            console.error('Error in getUsers: ', error);
        } finally {
            set({ isLoadingUsers: false });
        }
    },

    updateUser: async (userId, updatedData) => {
        try {
            const res = await axiosInstance.put(`/admin/users/${userId}`, updatedData);
            set((state) => ({
                users: state.users.map(user => user._id === userId ? res.data : user),
            }));
            toast.success('User updated successfully');
        } catch (error) {
            console.error('Error in updateUser: ', error);
        }
    },

    deleteUser: async (userId) => {
        try {
            await axiosInstance.delete(`/admin/users/${userId}`);
            set((state => ({
                users: state.users.filter(user => user._id !== userId),
            })));
            toast.success('User deleted successfully');
        } catch (error) {
            console.error('Error in deleteUser: ', error);
        }
    },
}));