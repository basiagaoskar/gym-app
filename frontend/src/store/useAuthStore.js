import { create } from "zustand";
import toast from "react-hot-toast"
import { axiosInstance } from "../lib/axios"

export const useAuthStore = create((set) => ({

    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isUpdatingPassword: false,
    
    profile: null,
    isSearchingProfile: true,
    profileWorkouts: [],
    isLoadingProfileWorkouts: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check")
            set({ authUser: res.data })
        } catch (error) {
            console.log("Error in checkAuth: ", error)
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true })
        try {
            const res = await axiosInstance.post("/auth/signup", data)
            set({ authUser: res.data })
            toast.success("Account created successfully")
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isSigningUp: false })
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true })
        try {
            const res = await axiosInstance.post("/auth/login", data)
            set({ authUser: res.data })
            toast.success("Logged in successfully")
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isLoggingIn: false })
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout")
            set({ authUser: null })
            toast.success("Logged out successfully")
        } catch (error) {
            toast.error(error.data.message)
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true })
        try {
            const res = await axiosInstance.put("/auth/update-profile", data)
            set({ authUser: res.data })
            toast.success("Profile updated successfully")
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUpdatingProfile: false })
        }
    },

    updatePassword: async (data) => {
        set({ isUpdatingPassword: true })
        try {
            const res = await axiosInstance.put("/auth/update-password", data)
            set({ authUser: res.data })
            toast.success("Password updated successfully")
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUpdatingPassword: false })
        }
    },

    deleteAccount: async () => {
        try {
            const res = await axiosInstance.delete("/auth/delete-account")
            set({ authUser: null })
            toast.success("Account deleted successfully")
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    findUser: async (username) => {
        try {
            const res = await axiosInstance.get(`/auth/user/${username}`)
            set({ profile: res.data })
        } catch (error) {
            console.log("Error in findUser: ", error)
            set({ profile: null })
        } finally {
            set({ isSearchingProfile: false })
        }
    },
    
    fetchProfileWorkouts: async (userId) => {
        if (!userId) return;
        set({ profileWorkouts: [], isLoadingProfileWorkouts: true })
        try {
            const res = await axiosInstance.get(`/workout/user/${userId}`)
            set({ profileWorkouts: res.data })
        } catch (error) {
            toast.error(error.response.data.message)
            set({ profileWorkouts: [] })
        } finally {
            set({ isLoadingProfileWorkouts: false })
        }

    },
}))