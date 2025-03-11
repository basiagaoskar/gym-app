import React from 'react'
import LoggedInNavbar from '../components/LoggedInNavbar'
import { THEMES } from '../constants'
import { useThemeStore } from '../store/useThemeStore'

function SettingsPage() {
    const { theme, setTheme } = useThemeStore();

    return (
        <div className="min-h-screen bg-base-200 text-base-content">
            <LoggedInNavbar />
            <div className="p-5 md:p-20">
                <h1 className="text-4xl font-bold">Settings</h1>
                <div className="mt-5">
                    <label className="label">
                        <span className="label-text font-semibold">Set Theme</span>
                    </label>

                    {/* bigger menu */}
                    <div className="hidden md:grid grid-cols-4 sm:grid-cols-6 md:grid-cols-6 gap-2 mt-3">
                        {THEMES.map((t) => (
                            <button
                                key={t}
                                className={`group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors ${theme === t ? "bg-primary" : "hover:bg-base-200"} cursor-pointer`}
                                onClick={() => setTheme(t)}
                            >
                                <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                                    <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                                        <div className="rounded bg-primary"></div>
                                        <div className="rounded bg-secondary"></div>
                                        <div className="rounded bg-accent"></div>
                                        <div className="rounded bg-neutral"></div>
                                    </div>
                                </div>
                                <span
                                    className={`text-[11px] font-medium truncate w-full text-center ${theme === t ? "text-primary-content" : "text-base-content"}`}>
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* smaller menu */}
                    <div className="md:hidden">
                        <select className="select w-full" value={theme} onChange={(e) => setTheme(e.target.value)}>
                            {THEMES.map((t) => (
                                <option key={t} value={t}>
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsPage