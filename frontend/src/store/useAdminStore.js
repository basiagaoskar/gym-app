import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

export const useAdminStore = create((set) => ({
    users: [],
    isLoadingUsers: true,

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
    }
}));