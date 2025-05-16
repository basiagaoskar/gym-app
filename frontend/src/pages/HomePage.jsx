import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

import LoggedInNavbar from '../components/LoggedInNavbar';
import WorkoutPost from '../components/WorkoutPost';
import { useWorkoutStore } from '../store/useWorkoutStore';

const HomePage = () => {
    const { feedWorkouts, isLoadingFeed, fetchFeed, currentPage, hasMoreFeed, isFetchingMoreFeed } = useWorkoutStore();
    const [activeCommentsPostId, setActiveCommentsPostId] = useState(null);

    const observer = useRef();
    const lastPostElementRef = useCallback(node => {
        if (isLoadingFeed || isFetchingMoreFeed) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMoreFeed) {
                fetchFeed(currentPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoadingFeed, isFetchingMoreFeed, hasMoreFeed, currentPage, fetchFeed]);

    useEffect(() => {
        fetchFeed(1);
    }, [fetchFeed]); 

    return (
        <div className="min-h-screen bg-base-200 text-base-content pt-20">
            <LoggedInNavbar />

            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <h1 className="text-3xl font-bold mb-6">Activity Feed</h1>

                {isLoadingFeed && feedWorkouts.length === 0 ? (
                    <div className="flex justify-center items-center min-h-[50vh]">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : feedWorkouts.length > 0 ? (
                    <div className="space-y-4">
                        {feedWorkouts.map((post, index) => {
                            if (feedWorkouts.length === index + 1) {
                                return (
                                    <div ref={lastPostElementRef} key={post._id}>
                                        <WorkoutPost
                                            post={post}
                                            activeCommentsPostId={activeCommentsPostId}
                                            setActiveCommentsPostId={setActiveCommentsPostId}
                                        />
                                    </div>
                                );
                            } else {
                                return (
                                    <WorkoutPost
                                        key={post._id}
                                        post={post}
                                        activeCommentsPostId={activeCommentsPostId}
                                        setActiveCommentsPostId={setActiveCommentsPostId}
                                    />
                                );
                            }
                        })}
                        {isFetchingMoreFeed && (
                            <div className="flex justify-center py-4">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        )}
                        {!hasMoreFeed && feedWorkouts.length > 0 && (
                            <div className="text-center py-4 text-base-content/70">
                                <p>You've reached the end of the feed.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    !isLoadingFeed && <div className="text-center py-10">
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