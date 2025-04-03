import React from 'react';
import { MessageSquare, ThumbsUp } from 'lucide-react';

const WorkoutPost = ({ post }) => {
    const exerciseSummary = post.exercises?.slice(0, 3).map(ex => ex.exercise.title).join(', ') + (post.exercises?.length > 3 ? '...' : '');

    return (
        <div className="card bg-base-100 shadow-md mb-4">
            <div className="card-body">
                <div className="flex items-center gap-3">
                    <div className="avatar">
                        <div className="w-10 rounded-full">
                            <img src={post.profilePic || "/images/avatar.png"} alt={`${post.username} avatar`} />
                        </div>
                    </div>
                    <div>
                        <p className="font-semibold">{post.user}</p>
                        <p className="text-xs text-base-content/60">
                            Completed a workout • {post.createdAt}
                        </p>
                    </div>
                </div>

                <div>
                    {post.notes && (
                        <div className="rounded text-xl">
                            <p className="font-medium">{post.notes}</p>
                        </div>
                    )}
                    {exerciseSummary && (
                        <p className="mt-1"><span className="font-medium">Exercises:</span> {exerciseSummary}</p>
                    )}
                    
                </div>

                <div className="card-actions justify-end mt-3">
                    <button className="btn btn-ghost btn-sm">
                        <ThumbsUp size={16} /> Like
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