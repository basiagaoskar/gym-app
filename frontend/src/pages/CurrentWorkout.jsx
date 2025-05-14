import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, ArrowLeft, Edit3, Plus, Search } from 'lucide-react';
import { useCurrentWorkoutStore } from "../store/useCurrentWorkoutStore";
import LoggedInNavbar from "../components/LoggedInNavbar";

const CurrentWorkoutPage = () => {
    const { currentWorkout, exercises, startWorkout, getExercises, addExercise, removeExercise, addSetToExercise, updateWorkoutTitle, endWorkout } = useCurrentWorkoutStore()
    const [searchQuery, setSearchQuery] = useState("")
    const modalRef = useRef(null);
    const navigate = useNavigate()

    useEffect(() => {
        getExercises()
        startWorkout()
    }, []);

    function handleSelectExercise(exercise) {
        addExercise(exercise)
        modalRef.current.close()
        setSearchQuery("")
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

    const filteredExercises = exercises
        .filter((exercise) =>
            !currentWorkout.exercises.some(
                (addedExercise) => addedExercise._id === exercise._id
            ) &&
            exercise.title.toLowerCase().includes(searchQuery)
        )

    return (
        <div className="min-h-screen bg-base-200 text-base-content pt-20 pb-10">
            <LoggedInNavbar />
            <div className="container mx-auto max-w-4xl bg-base-300 text-base-content p-6 md:p-8 rounded-lg shadow-lg relative">

                <div className="flex justify-between items-center mb-4 sm:mb-6 gap-2">
                    <button onClick={() => navigate(-1)} className="btn btn-ghost">
                        <ArrowLeft className="w-5 h-5 hidden sm:inline-block sm:mr-1" />
                        <span className="hidden sm:inline">Back</span>
                        <span className="sm:hidden"><ArrowLeft className="w-5 h-5" /></span>
                    </button>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center hidden sm:block whitespace-nowrap  px-2">
                        Current Workout
                    </h1>
                    <button className="btn btn-success btn-sm sm:btn-md" onClick={handleFinishWorkout} disabled={currentWorkout.exercises.length === 0}>
                        Finish Workout
                    </button>
                </div>

                <div className="mb-6 relative">
                    <input
                        type="text"
                        placeholder="Workout Title (e.g., Monday Push)"
                        className="input w-full text-center text-lg font-semibold"
                        onChange={(e) => updateWorkoutTitle(e.target.value)}
                    />
                    <Edit3 className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/40 pointer-events-none" />
                </div>

                <p className="text-sm mb-6 text-base-content/70 text-center">
                    Started: {new Date(currentWorkout.startTime).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                </p>

                <h2 className="text-xl font-semibold mb-4 border-b border-base-content/10 pb-2">
                    Added Exercises ({currentWorkout.exercises.length || 0})
                </h2>

                {currentWorkout.exercises && currentWorkout.exercises.length > 0 ? (
                    <ul className="space-y-6 mb-6">
                        {currentWorkout.exercises.map((exercise) => (
                            <li key={exercise._id} className="p-4 rounded-lg shadow-md bg-base-100">
                                <div className="flex justify-between items-start gap-4 mb-3">
                                    <div className="flex items-center gap-4 flex-grow min-w-0">
                                        <div className="avatar flex-shrink-0">
                                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-base-200 flex items-center justify-center">
                                                <img src={exercise.video_url} alt={exercise.title} className="w-full h-full" />
                                            </div>
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-lg md:text-xl font-bold truncate">{exercise.title}</h3>
                                            <p className="text-xs md:text-sm text-base-content/70 capitalize">
                                                {exercise.muscle_groups.primary}
                                            </p>
                                        </div>
                                    </div>
                                    <button className="btn btn-ghost btn-sm btn-circle text-error/70 hover:bg-error/10 flex-shrink-0" onClick={() => removeExercise(exercise._id)}>
                                        <X size={20} />
                                    </button>
                                </div>

                                <h4 className="font-semibold mb-2 text-sm">Sets:</h4>
                                {exercise.sets && exercise.sets.length > 0 ? (
                                    <ul className="space-y-2">
                                        <li className="flex items-center gap-2 text-xs font-medium text-base-content/60 px-1">
                                            <span className="w-8 text-center">Set</span>
                                            <span className="flex-1 text-center">Weight (kg)</span>
                                            <span className="flex-1 text-center">Reps</span>
                                        </li>
                                        {exercise.sets.map((set, setIndex) => (
                                            <li key={setIndex} className="flex items-center gap-2">
                                                <span className="w-8 text-center font-mono text-sm text-base-content/80 pt-1">{setIndex + 1}.</span>
                                                <input
                                                    type="number"
                                                    placeholder="kg"
                                                    className="input input-bordered input-sm flex-1 w-full text-center"
                                                    value={set.weight}
                                                    onChange={(e) => handleSetChange(exercise._id, setIndex, "weight", e.target.value)}
                                                    min="0"
                                                    step="0.5"
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="reps"
                                                    className="input input-bordered input-sm flex-1 w-full text-center"
                                                    value={set.reps}
                                                    onChange={(e) => handleSetChange(exercise._id, setIndex, "reps", e.target.value)}
                                                    min="0"
                                                    step="1"
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-xs text-base-content/60">No sets recorded yet.</p>
                                )}
                                <button className="btn btn-secondary btn-sm mt-3 w-full md:w-auto" onClick={() => handleAddTempSet(exercise._id)}>
                                    <Plus size={16} className="mr-1" /> Add Set
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-base-content/70 text-center py-5">No exercises added yet.</p>
                )}

                <button className="btn btn-primary w-full mt-6" onClick={() => modalRef.current.showModal()}>
                    <Plus className="mr-1" size={20} /> Add Exercise
                </button>

                <dialog ref={modalRef} id="add_exercise_modal" className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box max-w md:max-w-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-xl md:text-2xl">Select an Exercise</h3>
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                        </div>

                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder="Search exercises..."
                                className="input input-bordered w-full pl-10"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40" />
                        </div>

                        <ul className="space-y-2 h-[50vh] overflow-y-auto pr-1">
                            {filteredExercises.length > 0 ? filteredExercises
                            .sort((a,b) => a.muscle_groups.primary.localeCompare(b.muscle_groups.primary))
                            .map((exercise) => (
                                <li
                                    key={exercise._id}
                                    onClick={() => handleSelectExercise(exercise)}
                                    className="flex items-center justify-between gap-3 p-3 border border-transparent rounded-lg cursor-pointer hover:bg-base-200 transition-colors duration-150"
                                >
                                    <div className="flex-grow min-w-0">
                                        <h4 className="text-base font-bold truncate">{exercise.title}</h4>
                                        <p className="text-xs text-base-content/70 capitalize">
                                            {exercise.muscle_groups.primary}
                                        </p>
                                    </div>
                                    <div className="avatar flex-shrink-0">
                                        <div className="w-15 h-15 rounded-lg bg-base-200 flex items-center justify-center overflow-hidden">
                                            <img src={exercise.video_url} alt={exercise.title} className="object-cover w-full h-full" />
                                        </div>
                                    </div>
                                </li>
                            )) : (
                                <p className="text-center text-base-content/60 py-4">No matching exercises found.</p>
                            )}
                        </ul>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>
            </div>
        </div>
    )
}

export default CurrentWorkoutPage;