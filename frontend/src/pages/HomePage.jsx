import React from 'react';
import LoggedInNavbar from '../components/LoggedInNavbar';
import WorkoutPost from '../components/WorkoutPost';

const staticWorkout = [
    {
        _id: "test",
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        user: "test",
        exercises: [
            { exercise: { _id: 'ex1', title: 'Bench Press' }, sets: [{ reps: 5, weight: 100, _id:"set1" }], _id: "ex_detail_1" },
        ],
        notes: "Ciężkie cioranie mięśni naramiennych i klatki piersiowej",
    },
];

const HomePage = () => {
    return (
        <div className="min-h-screen bg-base-200 text-base-content pt-20">
            <LoggedInNavbar />

            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <h1 className="text-3xl font-bold mb-6">Activity Feed</h1>

                {staticWorkout.length > 0 ? (
                    <div className="space-y-4">
                        {staticWorkout.map(post => (
                            <WorkoutPost key={post._id} post={post} />
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