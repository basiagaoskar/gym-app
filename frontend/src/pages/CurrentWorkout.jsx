import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCurrentWorkoutStore } from "../store/useCurrentWorkoutStore";

const CurrentWorkoutPage = () => {
    const { currentWorkout, exercises, startWorkout, getExercises, addExercise, endWorkout } = useCurrentWorkoutStore()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    useEffect(() => {
        getExercises()
        startWorkout()
    }, []);

    function handleSelectExercise(exercise) {
        addExercise(exercise)
        setIsMenuOpen(false)
    }

    console.log(currentWorkout)
    return (
        <div className="min-h-screen bg-primary text-base-content flex items-center justify-center">

            <div className="w-full max-w-7xl  bg-base-300 text-base-content p-4 rounded-lg shadow-lg">
                <Link to="/" className="btn btn-ghost absolute top-4 left-4">
                    ← Back
                </Link>

                <h1 className="text-4xl font-bold mb-6">Current Workout</h1>
                <p className="text-lg mb-4">Started at: {new Date(currentWorkout.startTime).toLocaleString()} </p>


                <div>
                    <button className="btn btn-primary mb-4" onClick={() => setIsMenuOpen(true)}>
                        Add Exercise
                    </button>
                </div>
                <div>
                    <h2 className="text-2xl font-bold mb-4">Added Exercises</h2>
                    {currentWorkout.exercises.length > 0 ? (
                        <ul className="space-y-4">
                            {currentWorkout.exercises.map((exercise, index) => (
                                <li key={index} className="p-4 border rounded-lg flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-bold">{exercise.title}</h3>
                                        <p className="text-sm">Primary Muscle: {exercise.muscle_groups.primary}</p>
                                        <p className="text-sm">Difficulty: {exercise.difficulty}</p>
                                    </div>
                                    <div className="avatar">
                                        <div className="w-20 rounded-full">
                                            <img src={exercise.video_url} alt={exercise.title} />
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">No exercises added yet.</p>
                    )}
                </div>
                <button className="btn btn-error mt-5" onClick={() => endWorkout()}>Finish Workout</button>

                {isMenuOpen && (
                    <div className="absolute top-0 left-0 w-full h-full bg-opacity-50 flex items-center justify-center">
                        <div className="bg-base-100 p-6 rounded-lg shadow-lg max-w-lg w-full">
                            <h2 className="text-2xl font-bold mb-4">Select an Exercise</h2>

                            <input
                                type="text"
                                placeholder="Search for an exercise..."
                                className="input input-bordered w-full mb-4"
                            />

                            <ul className="space-y-4 text-base-content max-h-128 overflow-y-auto">
                                {exercises.map((exercise) => (
                                    <li key={exercise._id} className="p-4 border rounded-lg cursor-pointer hover:bg-neutral flex justify-between" onClick={() => handleSelectExercise(exercise)}>
                                        <div>

                                            <h3 className="text-lg font-bold">{exercise.title}</h3>
                                            <p className="text-sm ">
                                                Primary Muscle: {exercise.muscle_groups.primary}
                                            </p>
                                            <p className="text-sm ">
                                                Difficulty: {exercise.difficulty}
                                            </p>
                                        </div>
                                        <div className="avatar">
                                            <div className="w-20 rounded-full">
                                                <img src={exercise.video_url} />
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <button className="btn btn-secondary mt-4 w-full" onClick={() => setIsMenuOpen(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default CurrentWorkoutPage