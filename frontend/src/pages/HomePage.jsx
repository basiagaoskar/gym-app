import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import LoggedInNavbar from '../components/LoggedInNavbar';
import WorkoutPost from '../components/WorkoutPost';
import { useWorkoutStore } from '../store/useWorkoutStore';

const HomePage = () => {
    const { feedWorkouts, isLoadingFeed, fetchFeed } = useWorkoutStore();
    const [activeCommentsPostId, setActiveCommentsPostId] = useState(null);

    useEffect(() => {
        fetchFeed()
    }, []);

    return (
        <div className="min-h-screen bg-base-200 text-base-content pt-20">
            <LoggedInNavbar />

            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <h1 className="text-3xl font-bold mb-6">Activity Feed</h1>

                {isLoadingFeed ? (
                    <div className="flex justify-center items-center min-h-[50vh]">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : feedWorkouts.length > 0 ? (
                    <div className="space-y-4">
                        {feedWorkouts.map(post => (
                            <WorkoutPost
                                key={post._id}
                                post={post}
                                activeCommentsPostId={activeCommentsPostId}
                                setActiveCommentsPostId={setActiveCommentsPostId}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-lg text-base-content/70">
                            No activity to show yet.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default HomePage;