import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowLeft, Camera, CircleHelp, Lock, Mail, Palette, Pen, ReceiptText, Settings, User, UserPen } from 'lucide-react'

import LoggedInNavbar from '../components/LoggedInNavbar'
import { THEMES } from '../constants'
import { useThemeStore } from '../store/useThemeStore'
import { useAuthStore } from '../store/useAuthStore'

const settingsOptions = [
    { text: "profile", icon: UserPen },
    { text: "theme", icon: Palette },
    { text: "subscription", icon: ReceiptText },
    { text: "security", icon: Lock },
    { text: "support", icon: CircleHelp },
]

function SettingsPage() {
    const { authUser, isUpdatingProfile, updateProfile } = useAuthStore()
    const { theme, setTheme } = useThemeStore()

    const [searchParams, setSearchParams] = useSearchParams()
    const activeTab = searchParams.get("tab") || "profile"; // Domyślnie "profile"
    const [selectedImg, setSelectedImg] = useState(null)
    const [formData, setFormData] = useState({
        username: '',
        profilePic: '',
        bio: '',
    })

    const handleTabChange = (tab) => {
        setSearchParams({ tab });
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.readAsDataURL(file)

        reader.onload = async () => {
            const base64Image = reader.result
            setSelectedImg(base64Image)
            setFormData({ ...formData, profilePic: base64Image })
        }
    }

    function handleSubmit(e) {
        e.preventDefault()
        updateProfile(formData)
    }

    return (
        <>
            <LoggedInNavbar />
            <div className="min-h-screen bg-primary text-base-content flex items-center justify-center">
                <div className="m-3 p-5 md:p-10 bg-base-300 rounded-lg shadow-lg flex flex-col gap-6 w-full max-w-7xl my-auto h-190 md:h-210">
                    <h1 className="text-4xl font-bold">Settings</h1>

                    <div className="flex flex-col md:flex-row gap-16">

                        {/* Mobile sidebar */}
                        {activeTab === 'null' && (
                            <div className="w-full md:hidden flex flex-col gap-3">
                                {settingsOptions.map((option) => (
                                    <button
                                        key={option.text}
                                        className="flex items-center justify-between p-3 text-base font-normal bg-base-100 rounded-lg transition cursor-pointer hover:bg-base-200"
                                        onClick={() => handleTabChange(option.text)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <option.icon className="w-5 h-5" />
                                            <span className="capitalize">{option.text}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Desktop sidebar */}
                        <aside className={`w-full md:w-40 hidden md:block`}>
                            <ul className="space-y-2">
                                {settingsOptions.map((option) => (
                                    <li key={option.text}>
                                        <button
                                            className={`flex items-center w-40 p-3 text-base font-normal rounded-lg transition cursor-pointer ${activeTab === option.text ? "bg-secondary text-neutral-content" : "bg-base-100 hover:bg-base-200"}`}
                                            onClick={() => handleTabChange(option.text)}
                                        >
                                            <option.icon className="w-5 h-5 mr-3" />
                                            <span className="capitalize">{option.text}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </aside>
                        {activeTab === 'null' && (
                            <div className="hidden md:flex flex-col items-center justify-center w-full h-[calc(100vh-50vh)] text-center">
                                <Settings className="w-70 h-70 text-neutral" />
                                <p className="text-2xl text-neutral mt-10">Select an option from the left menu</p>
                            </div>
                        )}

                        {/* Mobile: Widok szczegółowy */}
                        {activeTab !== 'null' && (
                            <div className="w-full md:w-7/10">
                                <button
                                    className="mb-4 flex items-center gap-2 text-lg font-medium md:hidden"
                                    onClick={() => handleTabChange(null)}
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    Back
                                </button>

                                {/* Profile */}
                                {activeTab === "profile" && (
                                    <>
                                        <h2 className="text-xl font-bold">Profile Settings</h2>
                                        <p className="text-sm text-base-content">Manage your profile details here.</p>

                                        <form onSubmit={handleSubmit}>
                                            <div className="flex flex-col items-center gap-4 mt-6">
                                                <div className="relative w-32 h-32">
                                                    <img
                                                        src={selectedImg || authUser.profilePic || "/images/avatar.png"}
                                                        alt="Profile"
                                                        className="w-full h-full rounded-full object-cover border-4"
                                                    />
                                                    <label className="absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200">
                                                        <Camera className="w-5 h-5 text-base-200" />
                                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                                    </label>
                                                </div>
                                                <p className="text-xs text-center text-base-content">
                                                    {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
                                                </p>
                                            </div>
                                            <div className="mt-12">
                                                <label className="text-sm font-bold flex items-center gap-2">
                                                    <User className="w-4 h-4" />
                                                    Username
                                                </label>
                                                <input type="text" defaultValue={authUser.username} className="input mt-1 input-bordered w-full" onChange={(e) => { setFormData({ ...formData, username: e.target.value }) }} />
                                            </div>

                                            <div className="mt-4">
                                                <label className="text-sm font-bold flex items-center gap-2">
                                                    <Mail className="w-4 h-4" />
                                                    Email Address
                                                </label>
                                                <input type="text" value={authUser.email} className="input mt-1 input-bordered w-full cursor-not-allowed" readOnly />
                                            </div>

                                            <div className="mt-4">
                                                <label className="text-sm font-bold flex items-center gap-2">
                                                    <Pen className="w-4 h-4" />
                                                    Bio
                                                </label>
                                                <textarea className="textarea textarea-bordered mt-1 w-full" defaultValue={authUser.bio} onChange={(e) => {
                                                    setFormData({ ...formData, bio: e.target.value })
                                                }}></textarea>
                                            </div>

                                            <button className="btn btn-primary mt-6 w-full">Save Changes</button>
                                        </form>

                                    </>
                                )}

                                {/* Theme */}
                                {activeTab === "theme" && (
                                    <>
                                        <h2 className="text-xl font-bold">Theme Settings</h2>
                                        <p className="text-sm text-base-content">Set your preferred theme.</p>

                                        <div className="hidden md:grid grid-cols-4 gap-2 mt-4">
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
                                                        className={`text-[11px] font-medium truncate w-full capitalize text-center ${theme === t ? "text-primary-content" : "text-base-content"}`}>
                                                        {t}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>

                                        {/* Mobile */}
                                        <div className="md:hidden mt-3">
                                            <select className="select w-30 font-semibold capitalize" value={theme} onChange={(e) => setTheme(e.target.value)}>
                                                {THEMES.map((t) => (
                                                    <option key={t} value={t}>
                                                        {t}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div >
        </>
    )
}

export default SettingsPage