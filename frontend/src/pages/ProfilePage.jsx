import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';
import LoggedInNavbar from '../components/LoggedInNavbar.jsx';
import { Loader2, Calendar, Clock, ListChecks } from 'lucide-react';

const ProfilePage = () => {
    const { authUser, findUser, profile, fetchProfileWorkouts, profileWorkouts, isLoadingProfileWorkouts } = useAuthStore();
    const { username } = useParams();

    useEffect(() => {
        if (username && (!profile || profile.username !== username)) {
            findUser(username);
        }
    }, [username]);

    useEffect(() => {
        if (profile?._id) {
            fetchProfileWorkouts(profile._id);
        }
    }, [profile?._id]);

    const isOwnProfile = profile?._id === authUser?._id;

    return (
        <>
            <LoggedInNavbar />
            <div className="min-h-screen bg-base-200 text-base-content pt-20 pb-10 flex flex-col items-center px-4">
                <div className="bg-base-300 rounded-lg shadow-lg w-full max-w-4xl mt-6">

                    <div className="w-full bg-base-100 shadow rounded-t-lg p-6 md:p-8">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 md:gap-8">
                            <img src={profile?.profilePic || "/images/avatar.png"} alt={`${profile?.username}'s Profile`} className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-base-300 shadow-md" />

                            <div className="text-center sm:text-left flex-grow">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-3 sm:gap-4 mb-2">
                                    <h1 className="text-2xl md:text-3xl font-bold truncate">{profile?.username}</h1>

                                    {isOwnProfile ? (
                                        <Link to="/settings?tab=profile" className="w-full sm:w-auto">
                                            <button className="btn btn-outline btn-sm md:btn-md w-full">
                                                Edit Profile
                                            </button>
                                        </Link>
                                    ) : (
                                        <button className="btn btn-primary btn-sm md:btn-md w-full sm:w-auto">
                                            Follow
                                        </button>
                                    )}
                                </div>

                                <p className="mt-1 text-base-content/70 text-sm md:text-base max-w-prose mx-auto sm:mx-0">
                                    {profile?.bio || "No bio available"}
                                </p>

                                <div className="mt-4 flex justify-center sm:justify-start gap-4 sm:gap-6 text-sm md:text-base">
                                    <p><strong className="font-semibold">{profileWorkouts.length ?? 0}</strong> Workouts</p>
                                    <p><strong className="font-semibold">0</strong> Followers</p>
                                    <p><strong className="font-semibold">0</strong> Following</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 border-t border-base-content/10">
                        <h2 className="text-xl md:text-2xl font-semibold mb-4">Workout History</h2>

                        {isLoadingProfileWorkouts ? (
                            <div className="flex justify-center items-center min-h-[20vh]">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : profileWorkouts.length > 0 ? (
                            <ul className="space-y-3">
                                {profileWorkouts.map((workout) => (
                                    <li key={workout._id} className="bg-base-100 rounded-lg shadow p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:shadow-md transition-shadow duration-150">
                                        <div className="flex-grow min-w-0">
                                            <h3 className="text-base font-semibold mb-1">
                                                {workout.title}
                                            </h3>
                                            <p className="text-sm font-semibold flex items-center gap-1.5 mb-1">
                                                <Calendar size={14} className="text-base-content/60" />
                                                {new Date(workout.startTime).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}

                                            </p>
                                            <p className="text-xs text-base-content/70 flex items-center gap-1.5">
                                                <Clock size={14} /> Duration: {workout.duration} min
                                                <span className="mx-1">|</span>
                                                <ListChecks size={14} /> {workout.exercises.length} exercises
                                            </p>
                                        </div>
                                        <Link to={`/workout/${workout._id}`} className="btn btn-sm btn-outline btn-primary mt-2 sm:mt-0 w-full sm:w-auto">
                                            View Details
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-base-content/70 text-center py-5 italic">
                                No workouts recorded yet.
                            </p>
                        )}
                    </div>
                </div>
            </div >
        </>
    )
}

export default ProfilePage