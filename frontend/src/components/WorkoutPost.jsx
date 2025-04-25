import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ThumbsUp } from 'lucide-react';

import { useWorkoutStore } from '../store/useWorkoutStore';
import { useAuthStore } from '../store/useAuthStore';

const WorkoutPost = ({ post }) => {
    const { toggleLike } = useWorkoutStore();
    const { authUser } = useAuthStore();

    const loggedInUserId = authUser?._id;

    const username = post.user.username || 'Unknown User';
    const profilePic = post.user.profilePic || "/images/avatar.png";

    const exerciseSummary = post.exercises?.slice(0, 3).map(ex => ex.exercise?.title || 'Exercise').join(', ') + (post.exercises?.length > 3 ? '...' : '');

    const postDate = post.createdAt ? new Date(post.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'some time ago';

    const workoutDetailsLink = `/workout/${post._id}`;

    const [likes, setLikes] = useState(post.likes || []);

    const isLikedByCurrentUser = loggedInUserId && likes.includes(loggedInUserId);
    const likesCount = likes.length;

    const handleLikeToggle = async (e) => {
        e.preventDefault();

        setLikes(prevLikes => {
            if (loggedInUserId && prevLikes.includes(loggedInUserId)) {
                return prevLikes.filter(id => id !== loggedInUserId);
            } else if (loggedInUserId) {
                return [...prevLikes, loggedInUserId];
            }
            return prevLikes;
        });

        await toggleLike(post._id);
    };

    return (
        <div className="card bg-base-100 shadow-md mb-4">
            <div className="card-body">
                <div className="flex items-center gap-3 mb-3">
                    <Link to={`/user/${username}`} className="avatar">
                        <div className="w-10 rounded-full">
                            <img src={profilePic} alt={`${username}'s avatar`} />
                        </div>
                    </Link>
                    <div>
                        <Link to={`/user/${username}`} className="font-semibold">{username}</Link>
                        <p className="text-xs text-base-content/60">
                            Completed a workout • {postDate}
                        </p>
                    </div>
                </div>

                <div>
                    <Link to={workoutDetailsLink} className="link link-hover">
                        <h2 className="card-title mb-1 text-lg">{post.title || "Workout"}</h2>
                    </Link>
                    {post.notes && (
                        <div className="rounded text-xl">
                            <p>{post.notes}</p>
                        </div>
                    )}
                    {exerciseSummary && (
                        <p className="mt-1"><span className="font-medium">Exercises:</span> {exerciseSummary}</p>
                    )}
                </div>

                <div className="card-actions justify-end border-t border-base-content/10 pt-3 mt-3">
                    <button
                        className={`btn btn-ghost btn-sm ${isLikedByCurrentUser ? 'text-primary' : 'text-base-content'}`}
                        onClick={handleLikeToggle}
                    >
                        <ThumbsUp size={16} className={isLikedByCurrentUser ? 'fill-current' : ''} />
                        <span className="text-sm font-medium"> {likesCount}</span>
                    </button>
                    <button className="btn btn-ghost btn-sm">
                        <MessageSquare size={16} /> Comment
                    </button>
                </div>
            </div>
        </div>
    )
}

export default WorkoutPost