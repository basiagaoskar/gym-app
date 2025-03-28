import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCurrentWorkoutStore } from "../store/useCurrentWorkoutStore";

const CurrentWorkoutPage = () => {
    const { currentWorkout, exercises, startWorkout, getExercises, addExercise, addSetToExercise, endWorkout } = useCurrentWorkoutStore()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [exerciseData, setExerciseData] = useState({})

    useEffect(() => {
        getExercises()
        startWorkout()
    }, []);

    function handleSelectExercise(exercise) {
        addExercise(exercise)
        setIsMenuOpen(false)
    }

    function handleAddTempSet(exerciseId) {
        setExerciseData(prevData => ({
            ...prevData,
            [exerciseId]: [
                ...(prevData[exerciseId] || []),
                { weight: "", reps: "" }
            ]
        }));
    }

    function handleTempSetChange(exerciseId, index, field, value) {
        setExerciseData(prevData => ({
            ...prevData,
            [exerciseId]: prevData[exerciseId].map((set, i) =>
                i === index ? { ...set, [field]: value } : set
            )
        }));
    }

    function handleSaveSets(exerciseId) {
        if (!exerciseData[exerciseId]) return;

        exerciseData[exerciseId].forEach(set => {
            if (set.weight && set.reps) {
                addSetToExercise(exerciseId, {
                    weight: parseFloat(set.weight),
                    reps: parseInt(set.reps, 10),
                });
            }
        });

        setExerciseData(prevData => ({
            ...prevData,
            [exerciseId]: []
        }));
    }

    const navigate = useNavigate()


    return (
        <div className="min-h-screen bg-primary text-base-content flex items-center justify-center">
            <div className="w-full max-w-7xl bg-base-300 text-base-content p-4 rounded-lg shadow-lg">
                <Link to="/" className="btn btn-ghost absolute top-4 left-4">← Back</Link>

                <h1 className="text-4xl font-bold mb-6">Current Workout</h1>
                <p className="text-lg mb-4">Started at: {new Date(currentWorkout.startTime).toLocaleString()} </p>

                <button className="btn btn-primary mb-4" onClick={() => setIsMenuOpen(true)}>
                    Add Exercise
                </button>

                <h2 className="text-2xl font-bold mb-4">Added Exercises</h2>
                {currentWorkout.exercises.length > 0 ? (
                    <ul className="space-y-4">
                        {currentWorkout.exercises.map((exercise, index) => (
                            <li key={index} className="p-4 border rounded-lg">
                                <div className="flex justify-between items-center">
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
                                </div>

                                <div className="mt-4">
                                    <h4 className="font-bold">Sets:</h4>
                                    <ul>
                                        {exercise.sets.map((set, setIndex) => (
                                            <li key={setIndex} className="text-sm">
                                                {setIndex + 1}. {set.weight}kg × {set.reps} reps
                                            </li>
                                        ))}
                                    </ul>

                                    {exerciseData[exercise._id]?.map((set, setIndex) => (
                                        <div key={setIndex} className="flex space-x-2 mt-2">
                                            <input
                                                type="number"
                                                placeholder="Weight (kg)"
                                                className="input input-bordered w-24"
                                                value={set.weight}
                                                onChange={(e) => handleTempSetChange(exercise._id, setIndex, "weight", e.target.value)}
                                            />
                                            <input
                                                type="number"
                                                placeholder="Reps"
                                                className="input input-bordered w-20"
                                                value={set.reps}
                                                onChange={(e) => handleTempSetChange(exercise._id, setIndex, "reps", e.target.value)}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <button className="btn btn-secondary mt-2" onClick={() => handleAddTempSet(exercise._id)}>
                                    Add Set
                                </button>

                                {exerciseData[exercise._id]?.length > 0 && (
                                    <button className="btn btn-success mt-2 ml-2" onClick={() => handleSaveSets(exercise._id)}>
                                        Save Sets
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500">No exercises added yet.</p>
                )}

                <button className="btn btn-error mt-5" onClick={() => {endWorkout(); navigate('/')} }>Finish Workout</button>

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
