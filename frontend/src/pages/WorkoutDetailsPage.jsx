import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useWorkoutStore } from "../store/useWorkoutStore";

const WorkoutDetailsPage = () => {
    const { workoutId } = useParams();
    const { workout, getWorkout } = useWorkoutStore();
    useEffect(() => {
        getWorkout(workoutId)
    }, [workoutId])
    console.log(workout)

    return (
        <div className="min-h-screen bg-primary text-base-content flex items-center justify-center">
            <div className="w-full max-w-7xl min-h-250 bg-base-300 text-base-content p-4 rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold mb-4">Workout Details</h1>
                {workout && workout.exercises ? (
                    <>
                        <p className="text-sm mb-4 text-gray-500">
                            Date: {new Date(workout.startTime).toLocaleString()}
                        </p>
                        <h2 className="text-2xl font-bold mb-4">Exercises</h2>
                        {workout.exercises.length > 0 ? (
                            <ul className="space-y-4 max-h-190 overflow-y-auto">
                                {workout.exercises.map((exercise, index) => (
                                    <li key={index} className="p-4 border rounded-lg shadow-lg bg-base-100">
                                        <div className="flex gap-5">
                                            <div className="avatar">
                                                <div className="w-20 rounded-full">
                                                    <img src={exercise.exercise.video_url} alt={exercise.exercise.title} />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-3xl font-bold">{exercise.exercise.title}</h3>
                                                <p className="text-sm">
                                                    Primary Muscle: {exercise.exercise.muscle_groups.primary}
                                                </p>
                                            </div>
                                        </div>
                                        <h5 className="font-semibold mt-2">Sets:</h5>
                                        <ul>
                                            {exercise.sets.map((set, setIndex) => (
                                                <li key={setIndex} className="">
                                                    <span> {set.weight}kg x {set.reps}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">No exercises found for this workout.</p>
                        )}
                    </>
                ) : (
                    <p className="text-sm text-gray-500">Loading workout details...</p>
                )}
            </div>
        </div>
    );
};

export default WorkoutDetailsPage;