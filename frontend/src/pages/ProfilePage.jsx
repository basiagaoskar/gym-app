import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';
import LoggedInNavbar from '../components/LoggedInNavbar.jsx';
import { Loader2, Calendar, Clock, ListChecks, X } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore.js';

const ProfilePage = () => {
    const { authUser, findUser, profile, isSearchingProfile, followUser, unfollowUser, isFollowingInProgress, fetchFollowers, fetchFollowing, followersList, followingList, isLoadingFollowers } = useAuthStore();
    const { username } = useParams();
    const { profileWorkouts, isLoadingProfileWorkouts, fetchProfileWorkouts } = useWorkoutStore();

    const [visibleListType, setVisibleListType] = useState(null);
    const currentList = visibleListType === 'followers' ? followersList : followingList;
    const listTitle = visibleListType === 'followers' ? 'Followers' : 'Following';

    useEffect(() => {
        setVisibleListType(null);
        if (username && (!profile || profile.username !== username)) {
            findUser(username);
        }
    }, [username, findUser, profile]);

    useEffect(() => {
        if (profile?._id) {
            fetchProfileWorkouts(profile._id);
        }
    }, [profile?._id, fetchProfileWorkouts]);

    const isOwnProfile = profile?._id === authUser?._id;
    const isFollowing = profile?.isFollowing;

    const handleFollow = async () => {
        if (!profile?._id || isFollowingInProgress) return;
        await followUser(profile._id);
    };

    const handleUnfollow = async () => {
        if (!profile?._id || isFollowingInProgress) return;
        await unfollowUser(profile._id);
    };

    const handleShowList = (listType) => {
        if (!profile?._id) return;

        if (visibleListType === listType) {
            setVisibleListType(null);
            return;
        }

        setVisibleListType(listType);
        if (listType === 'followers') {
            fetchFollowers(profile._id);
        } else {
            fetchFollowing(profile._id);
        }
    };

    const handleCloseList = () => {
        setVisibleListType(null);
    };

    if (isSearchingProfile) {
        return (
            <>
                <LoggedInNavbar />
                <div className="min-h-screen bg-base-200 flex justify-center items-center pt-20">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            </>
        );
    }

    if (!profile && !isSearchingProfile) {
        return (
            <>
                <LoggedInNavbar />
                <div className="min-h-screen bg-base-200 flex flex-col justify-center items-center text-center pt-20 px-4">
                    <h1 className="text-4xl font-bold text-error mb-4">User Not Found</h1>
                    <p className="text-base-content/80">The profile "{username}" does not exist.</p>
                    <Link to="/" className="btn btn-primary mt-6">Go Home</Link>
                </div>
            </>
        );
    }

    return (
        <>
            <LoggedInNavbar />
            <div className="min-h-screen bg-base-200 text-base-content pt-20 pb-10 flex flex-col items-center px-4">


                {visibleListType && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" onClick={handleCloseList}>
                        <div className="bg-base-100 rounded-lg w-full max-w-md p-5 relative max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={handleCloseList}>
                                <X size={20} />
                            </button>
                            <h3 className="font-bold text-lg mb-4">{listTitle}</h3>
                            <div className="overflow-y-auto">
                                {isLoadingFollowers ? (
                                    <div className="flex justify-center items-center py-10">
                                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    </div>
                                ) : currentList.length > 0 ? (
                                    <ul className="space-y-3">
                                        {currentList.map((user) => (
                                            <li key={user._id} className="flex items-center gap-3">
                                                <Link to={`/user/${user.username}`} onClick={handleCloseList}>
                                                    <div className="w-10 h-10 rounded-full overflow-hidden">
                                                        <img
                                                            src={user.profilePic || '/images/avatar.png'}
                                                            alt={`${user.username}'s avatar`}
                                                        />
                                                    </div>
                                                </Link>
                                                <Link to={`/user/${user.username}`} onClick={handleCloseList} className="font-semibold text-base-content hover:underline">
                                                    {user.username}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-center text-base-content py-5 italic">
                                        No users to display.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

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
                                        <button
                                            className={`btn btn-sm md:btn-md w-full sm:w-auto ${isFollowing ? 'btn-outline btn-secondary' : 'btn-primary'}`}
                                            onClick={isFollowing ? handleUnfollow : handleFollow}
                                            disabled={isFollowingInProgress}
                                        >
                                            {isFollowingInProgress ? (
                                                <span className="loading loading-spinner loading-xs"></span>
                                            ) : isFollowing ? (
                                                'Unfollow'
                                            ) : (
                                                'Follow'
                                            )}
                                        </button>
                                    )}
                                </div>

                                <p className="mt-1 text-base-content/70 text-sm md:text-base max-w-prose mx-auto sm:mx-0">
                                    {profile?.bio || "No bio available"}
                                </p>

                                <div className="mt-4 flex justify-center sm:justify-start gap-4 sm:gap-6 text-sm md:text-base">
                                    <p><strong className="font-semibold">{profileWorkouts.length ?? 0}</strong> Workouts</p>
                                    <p>
                                        <strong className="font-semibold">{profile?.followersCount ?? 0}</strong>
                                        <button onClick={() => handleShowList('followers')} className="ml-1 hover:underline cursor-pointer">
                                            Followers
                                        </button>
                                    </p>
                                    <p>
                                        <strong className="font-semibold">{profile?.followingCount ?? 0}</strong>
                                        <button onClick={() => handleShowList('following')} className="ml-1 hover:underline cursor-pointer">
                                            Following
                                        </button>
                                    </p>
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
                                            <Link to={`/workout/${workout._id}`} className="link-hover">
                                                <h3 className="text-base font-semibold mb-1 truncate">
                                                    {workout.title || "Workout"}
                                                </h3>
                                            </Link>
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