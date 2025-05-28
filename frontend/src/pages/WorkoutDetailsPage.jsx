import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2 } from 'lucide-react';
import { useWorkoutStore } from "../store/useWorkoutStore";
import LoggedInNavbar from "../components/LoggedInNavbar";
import { useAuthStore } from "../store/useAuthStore";

const WorkoutDetailsPage = () => {
    const { workoutId } = useParams();
    const { workout, getWorkout, deleteWorkout } = useWorkoutStore();
    const { authUser } = useAuthStore();
    const isOwnWorkout = workout?.user === authUser?._id;
    const navigate = useNavigate();

    useEffect(() => {
        if (workoutId) {
            getWorkout(workoutId)
        }
    }, [workoutId])

    const handleDeleteWorkout = async () => {
        try {
            await deleteWorkout(workoutId);
            navigate(-1);
        } catch (error) {
            console.error("Error deleting workout:", error);
        }
    }

    return (
        <div className="min-h-screen bg-base-200 text-base-content pt-20 pb-10">
            <LoggedInNavbar />
            <div className="container mx-auto max-w-5xl bg-base-300 text-base-content p-6 md:p-8 rounded-lg shadow-lg">

                {workout && workout._id === workoutId && workout.exercises ? (
                    <>
                        <div className="flex justify-between items-center">

                            <h1 className="text-3xl md:text-4xl font-bold mb-2">{workout.title || "Workout Details"}</h1>
                            {isOwnWorkout && (
                                <div className="btn btn-outline btn-error w-auto p-2" onClick={handleDeleteWorkout}>
                                    <Trash2 />
                                </div>
                            )}
                        </div>
                        <p className="text-sm mb-6 text-base-content/70">
                            {new Date(workout.startTime).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>

                        <h2 className="text-2xl font-semibold mb-4 border-b border-base-content/10 pb-2">Exercises</h2>
                        {workout.exercises.length > 0 && (
                            <ul className="space-y-6">
                                {workout.exercises.map((exerciseData) => (
                                    <li key={exerciseData._id || exerciseData.exercise._id} className="p-4 rounded-lg shadow-md bg-base-100">
                                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                                            <div className="avatar flex-shrink-0  hidden sm:block">
                                                <div className="w-24 h-24 rounded-lg bg-base-200 flex items-center justify-center">
                                                    <img src={exerciseData.exercise.video_url} alt={exerciseData.exercise.title} className="object-cover w-full h-full" />
                                                </div>
                                            </div>
                                            <div className="flex-grow">
                                                <h3 className="text-xl md:text-2xl font-bold">{exerciseData.exercise.title}</h3>
                                                <p className="text-sm text-base-content/70 mt-1 capitalize">
                                                    Primary Muscle: {exerciseData.exercise.muscle_groups.primary}
                                                    {Array.isArray(exerciseData.exercise.muscle_groups.secondary) && exerciseData.exercise.muscle_groups.secondary.length > 0 && (
                                                        <p>
                                                            Secondary: {exerciseData.exercise.muscle_groups.secondary.join(', ')}
                                                        </p>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4 pl-0 sm:pl-[calc(6rem+1.5rem)]">
                                            <h4 className="font-semibold mb-2 text-base">Sets:</h4>
                                            <ul className="space-y-1 text-sm">
                                                {exerciseData.sets.map((set, setIndex) => (
                                                    <li key={set._id} className="flex justify-between items-center p-1.5 rounded bg-base-200">
                                                        <span className="font-mono text-base-content/80">Set {setIndex + 1}:</span>
                                                        <span className="font-medium">{set.weight}kg x {set.reps} reps</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                ) : (
                    <p className="text-base-content text-center py-15">
                        Workout details not found or failed to load.
                    </p>
                )}
            </div>
        </div>
    );
};

export default WorkoutDetailsPage;