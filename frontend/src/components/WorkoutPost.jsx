import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ThumbsUp, Send, Loader2, Trash2 } from 'lucide-react';

import { useWorkoutStore } from '../store/useWorkoutStore';
import { useAuthStore } from '../store/useAuthStore';
import { useCommentStore } from '../store/useCommentStore';

const WorkoutPost = ({ post, activeCommentsPostId, setActiveCommentsPostId }) => {
    const { toggleLike } = useWorkoutStore();
    const { authUser } = useAuthStore();
    const { comments, isLoadingComments, isAddingComment, fetchComments, addComment, clearComments } = useCommentStore();

    const [likes, setLikes] = useState(post.likes || []);
    const showComments = activeCommentsPostId === post._id;
    const [newCommentText, setNewCommentText] = useState("");

    const loggedInUserId = authUser?._id;

    const username = post.user.username || 'Unknown User';
    const profilePic = post.user.profilePic || "/images/avatar.png";

    const exerciseSummary = post.exercises?.slice(0, 3).map(ex => ex.exercise?.title || 'Exercise').join(', ') + (post.exercises?.length > 3 ? '...' : '');

    const postDate = post.createdAt ? new Date(post.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'some time ago';

    const workoutDetailsLink = `/workout/${post._id}`;

    const isLikedByCurrentUser = loggedInUserId && likes.includes(loggedInUserId);
    const likesCount = likes.length;

    useEffect(() => {
        if (showComments && post._id) {
            fetchComments(post._id);
        } else {
            clearComments();
        }

        return () => {
            clearComments();
        };
    }, [showComments, post._id]);

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

    const handleToggleComments = () => {
        if (showComments) {
            setActiveCommentsPostId(null);
        } else {
            setActiveCommentsPostId(post._id);
        }
    };

    const handleAddCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newCommentText.trim() || !loggedInUserId || !post._id) return;

        const success = await addComment(post._id, newCommentText);
        if (success) {
            setNewCommentText("");
        }
    };

    const handleDeleteComment = async (commentId) => {

    };

    const postSpecificComments = comments.filter(comment => comment.workout === post._id);

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
                    <button className="btn btn-ghost btn-sm" onClick={handleToggleComments}>
                        <MessageSquare size={16} />
                        <span className="text-sm font-medium ml-1">
                            Comment
                        </span>
                    </button>
                </div>

                {showComments && (
                    <div className=" pt-4 ">
                        {isLoadingComments && !postSpecificComments.length ? (
                            <div className="flex justify-center py-3">
                                <Loader2 className="animate-spin w-6 h-6 text-primary" />
                            </div>
                        ) : postSpecificComments.length > 0 ? (
                            <ul className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                {postSpecificComments.map((comment) => (
                                    <li key={comment._id} className="bg-base-200/50 p-2.5 rounded-lg text-sm">
                                        <div className="flex items-start gap-2.5">
                                            <Link to={`/user/${comment.user?.username}`} className="avatar flex-shrink-0">
                                                <div className="w-7 h-7 rounded-full overflow-hidden">
                                                    <img src={comment.user?.profilePic || "/images/avatar.png"} alt={`${comment.user?.username || 'User'}'s avatar`} className="object-cover w-full h-full" />
                                                </div>
                                            </Link>
                                            <div className="flex-grow min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <Link to={`/user/${comment.user?.username}`} className="font-semibold text-xs hover:underline truncate block max-w-[150px] sm:max-w-[200px]">
                                                            {comment.user?.username || "Unknown User"}
                                                        </Link>
                                                        <p className="text-xs text-base-content/60">
                                                            {new Date(comment.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                                                        </p>
                                                    </div>
                                                    {(loggedInUserId === comment.user?._id || authUser?.role === 'admin') && (
                                                        <button
                                                            className="btn btn-ghost btn-xs btn-circle text-error/70 hover:bg-error/10"
                                                            onClick={() => handleDeleteComment(comment._id)}
                                                            title="Delete comment"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="mt-1 text-sm whitespace-pre-wrap">{comment.content}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            !isLoadingComments && <p className="text-xs text-base-content/70 text-center py-3">No comments yet. Be the first to comment!</p>
                        )}

                        <form onSubmit={handleAddCommentSubmit} className="mt-4">
                            <div className="flex items-start gap-2">
                                <div className="avatar flex-shrink-0 mt-1">
                                    <div className="w-8 h-8 rounded-full overflow-hidden">
                                        <img src={authUser?.profilePic || "/images/avatar.png"} alt="Your avatar" className="object-cover w-full h-full" />
                                    </div>
                                </div>
                                <textarea
                                    className="textarea textarea-bordered text-sm flex-grow-3 sm:!h-10 sm:!min-h-0  "
                                    placeholder="Write a comment..."
                                    value={newCommentText}
                                    onChange={(e) => setNewCommentText(e.target.value)}
                                    disabled={isAddingComment}
                                />

                                <button
                                    type="submit"
                                    className="btn btn-primary flex-grow m-auto !h-20 sm:!h-10 !min-h-0"
                                    disabled={isAddingComment || !newCommentText.trim()}
                                >
                                    {isAddingComment ? <Loader2 className="animate-spin w-4 h-4" /> : <Send size={16} />}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}

export default WorkoutPost