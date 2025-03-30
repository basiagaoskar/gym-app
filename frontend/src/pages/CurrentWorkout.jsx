import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X } from 'lucide-react';
import { useCurrentWorkoutStore } from "../store/useCurrentWorkoutStore";

const CurrentWorkoutPage = () => {
    const { currentWorkout, exercises, startWorkout, getExercises, addExercise, removeExercise, addSetToExercise, endWorkout } = useCurrentWorkoutStore()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        getExercises()
        startWorkout()
    }, []);

    function handleSelectExercise(exercise) {
        addExercise(exercise)
        setIsMenuOpen(false)
    }

    function handleAddTempSet(exerciseId) {
        addSetToExercise(exerciseId, null, null, null)
    }

    function handleSetChange(exerciseId, setIndex, field, value) {
        addSetToExercise(exerciseId, setIndex, field, value)
    }

    function handleSearchChange(e) {
        setSearchQuery(e.target.value.toLowerCase())
    }

    async function handleFinishWorkout() {
        try {
            const savedWorkout = await endWorkout()
            navigate(`/workout/${savedWorkout._id}`)
        } catch (error) {
            console.error("Failed to finish workout:", error);
        }
    }

    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-primary text-base-content flex items-center justify-center">
            <div className="w-full max-w-7xl min-h-250 bg-base-300 text-base-content p-4 rounded-lg shadow-lg">
                <Link to="/" className="btn btn-ghost absolute top-4 left-4">← Back</Link>

                <button className="btn btn-success float-right text-xl p-5" onClick={() => { handleFinishWorkout() }} disabled={currentWorkout.exercises.length === 0}
                >
                    Finish Workout
                </button>

                <h1 className="text-4xl font-bold">Current Workout</h1>
                <p className="text-sm mb-4 text-gray-500">Started at: {new Date(currentWorkout.startTime).toLocaleString()} </p>
                <h2 className="text-2xl font-bold mb-4">Added Exercises</h2>
                {currentWorkout.exercises.length > 0 ? (
                    <ul className="space-y-4 max-h-190 overflow-y-auto">
                        {currentWorkout.exercises.map((exercise, index) => (
                            <li key={index} className="p-4 border rounded-lg">
                                <div className="float-right cursor-pointer" onClick={() => removeExercise(exercise._id)}>
                                    <X />
                                </div>
                                <div className="flex gap-5 items-center">
                                    <div className="avatar">
                                        <div className="w-20 rounded-full">
                                            <img src={exercise.video_url} alt={exercise.title} />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-bold">{exercise.title}</h3>
                                        <p className="text-sm capitalize">Primary Muscle: {exercise.muscle_groups.primary}</p>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <h4 className="font-bold">Sets:</h4>
                                    <ul>
                                        {exercise.sets.map((set, setIndex) => (
                                            <li key={setIndex} className="flex space-x-2 mt-2">
                                                <input
                                                    type="number"
                                                    placeholder="Weight (kg)"
                                                    className="input input-bordered w-24"
                                                    value={set.weight}
                                                    onChange={(e) =>
                                                        handleSetChange(exercise._id, setIndex, "weight", parseFloat(e.target.value))
                                                    }
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Reps"
                                                    className="input input-bordered w-20"
                                                    value={set.reps}
                                                    onChange={(e) =>
                                                        handleSetChange(exercise._id, setIndex, "reps", parseInt(e.target.value, 10))
                                                    }
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button className="btn btn-secondary mt-2" onClick={() => handleAddTempSet(exercise._id)}>
                                    Add Set
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500">No exercises added yet.</p>
                )}

                <button className="btn btn-primary mt-4" onClick={() => setIsMenuOpen(true)}>
                    Add Exercise
                </button>

                {isMenuOpen && (
                    <div className="absolute top-0 left-0 w-full h-full bg-opacity-50 flex items-center justify-center">
                        <div className="bg-base-100 p-6 rounded-lg shadow-lg max-w-lg w-full">
                            <h2 className="text-2xl font-bold mb-4">Select an Exercise</h2>

                            <input
                                type="text"
                                placeholder="Search for an exercise..."
                                className="input input-bordered w-full mb-4"
                                onChange={handleSearchChange}
                            />

                            <ul className="space-y-4 text-base-content h-150 overflow-y-auto">
                                {exercises
                                    .filter((exercise) =>
                                        !currentWorkout.exercises.some(
                                            (addedExercise) => addedExercise._id === exercise._id
                                        ) &&
                                        exercise.title.toLowerCase().includes(searchQuery)
                                    )
                                    .map((exercise) => (
                                        <li key={exercise._id} className="p-4 border rounded-lg cursor-pointer hover:bg-neutral flex justify-between" onClick={() => handleSelectExercise(exercise)}>
                                            <div>
                                                <h3 className="text-lg font-bold">{exercise.title}</h3>
                                                <p className="text-sm capitalize">Primary Muscle: {exercise.muscle_groups.primary}</p>
                                                <p className="text-sm">Difficulty: {exercise.difficulty}</p>
                                            </div>
                                            <div className="avatar">
                                                <div className="w-17 h-17 rounded-full">
                                                    <img src={exercise.video_url} alt={exercise.title} />
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

export default CurrentWorkoutPage;
