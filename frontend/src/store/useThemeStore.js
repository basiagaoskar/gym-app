import { create } from "zustand";

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("theme") || "dark",
    setTheme: (theme) => {
        localStorage.setItem("theme", theme);
        set({ theme });
    },
}));