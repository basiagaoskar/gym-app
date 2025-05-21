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
    foundProfiles: [],
    isSearchingProfile: false,
    isSearchingUser: false,

    isFollowingInProgress: false,
    followersList: [],
    followingList: [],
    isLoadingFollowers: false,
    isLoadingFollowing: false,

    checkAuth: async () => {
        set({ isCheckingAuth: true })
        try {
            const res = await axiosInstance.get("/auth/check")
            set({ authUser: res.data })
        } catch (error) {
            if (error.response?.status === 401) {
                toast.error(error.response.data?.message);
            }
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
        set({ isSearchingProfile: true })
        try {
            const res = await axiosInstance.get(`/auth/user/${username}`)
            set({ profile: res.data })
        } catch (error) {
            set({ profile: null })
        } finally {
            set({ isSearchingProfile: false })
        }
    },

    searchProfile: async (username) => {
        set({ isSearchingUser: true })
        try {
            const res = await axiosInstance.get(`/auth/search/${username}`)
            set({ foundProfiles: res.data })
        } catch (error) {
            set({ foundProfiles: [] })
        } finally {
            set({ isSearchingUser: false })
        }
    },

    followUser: async (userIdToFollow) => {
        set({ isFollowingInProgress: true });
        try {
            await axiosInstance.post(`/follow/follow/${userIdToFollow}`);
            set((state) => {
                if (state.profile && state.profile._id === userIdToFollow) {
                    return {
                        profile: {
                            ...state.profile,
                            isFollowing: true,
                            followersCount: state.profile.followersCount + 1,
                        },
                        isFollowingInProgress: false
                    };
                }
                return { isFollowingInProgress: false };
            });
            toast.success("User followed!");
        } catch (error) {
            toast.error(error.response.data.message || "Failed to follow user");
            set({ isFollowingInProgress: false });
        }
    },

    unfollowUser: async (userIdToUnfollow) => {
        set({ isFollowingInProgress: true });
        try {
            await axiosInstance.delete(`/follow/unfollow/${userIdToUnfollow}`);
            set((state) => {
                if (state.profile && state.profile._id === userIdToUnfollow) {
                    return {
                        profile: {
                            ...state.profile,
                            isFollowing: false,
                            followersCount: state.profile.followersCount - 1,
                        },
                        isFollowingInProgress: false
                    };
                }
                return { isFollowingInProgress: false };
            });
            toast.success("User unfollowed!");
        } catch (error) {
            toast.error(error.response.data.message || "Failed to unfollow user");
            set({ isFollowingInProgress: false });
        }
    },

    fetchFollowers: async (userId) => {
        set({ isLoadingFollowers: true });
        try {
            const res = await axiosInstance.get(`/follow/followers/${userId}`);
            set({ followersList: res.data });
        } catch (error) {
            set({ followersList: [] });
        } finally {
            set({ isLoadingFollowers: false });
        }
    },

    fetchFollowing: async (userId) => {
        set({ isLoadingFollowing: true });
        try {
            const res = await axiosInstance.get(`/follow/following/${userId}`);
            set({ followingList: res.data });
        } catch (error) {
            set({ followingList: [] });
        } finally {
            set({ isLoadingFollowing: false });
        }
    },
}))