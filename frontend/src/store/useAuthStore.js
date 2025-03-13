import { create } from "zustand";
import toast from "react-hot-toast"
import { axiosInstance } from "../lib/axios"

export const useAuthStore = create((set) => ({

    authUser: null,
    isSigningUp: false,

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
    }
}))