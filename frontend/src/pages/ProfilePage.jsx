import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';
import LoggedInNavbar from '../components/LoggedInNavbar.jsx';

const ProfilePage = () => {
    const { authUser, findUser, isSearchingProfile, profile } = useAuthStore();
    const { username } = useParams();

    useEffect(() => {
        if (username && (!profile || profile.username !== username)) {
            findUser(username);
        }
    }, [username]);

    if (!profile && isSearchingProfile) {
        return (
            <>
                <div className="skeleton max-h-60 w-full"></div>
            </>
        )
    }

    const isOwnProfile = profile?._id === authUser?._id;

    return (
        <>
            <LoggedInNavbar />
            <div className="min-h-screen bg-primary text-base-content flex items-center justify-center">
                <div className="m-3 p-5 md:p-10 bg-base-300 rounded-lg shadow-lg flex gap-6 w-full max-w-7xl my-auto h-190 md:h-210 3xl:bg-amber-800">
                    <div className="w-full h-80 sm:h-52 bg-base-100 shadow-lg rounded-lg p-6 sm:p-8 relative">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">

                            <img src={profile?.profilePic || "/images/avatar.png"} alt="Profile" className="w-24 h-24 sm:w-28 sm:h-28  rounded-full border-4 border-primary-content shadow-md mb-2 " />

                            <div className="text-center sm:text-left flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5">
                                    <h1 className="text-2xl font-semibold">{profile?.username}</h1>

                                    {isOwnProfile ? (
                                        <Link to="/settings?tab=profile">
                                            <button className="btn btn-outline px-4 py-2 rounded-lg shadow text-sm sm:text-base">
                                                Edit Profile
                                            </button>
                                        </Link>
                                    ) : (
                                        <button className="btn btn-primary px-4 py-2 rounded-lg shadow text-sm sm:text-base">
                                            Follow
                                        </button>
                                    )}
                                </div>

                                <p className="mt-2 text-base-content/50 text-sm sm:text-base">{profile?.bio || "No bio available"}</p>

                                <div className="mt-4 flex justify-center sm:justify-start space-x-6 text-sm sm:text-base">
                                    <p><strong>2115</strong> Workouts</p>
                                    <p><strong>23</strong> Followers</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default ProfilePage