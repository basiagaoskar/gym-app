import React from "react";
import { Link } from "react-router-dom";
import LoggedInNavbar from "../components/LoggedInNavbar";
import { Plus } from "lucide-react";

const WorkoutPlansPage = () => {
    return (
        <div className="min-h-screen bg-base-200 text-base-content pt-20">
            <LoggedInNavbar />

            <div className="container mx-auto px-4 py-8">
                <div className="bg-base-100 p-6 rounded-lg shadow-lg">
                    <div className="flex flex-col items-start gap-y-4 mb-6 md:flex-row md:items-center md:justify-between">
                        <h1 className="text-3xl font-bold">Your Training Routines</h1>
                        <div className="flex flex-col gap-y-2 w-full md:w-auto">
                            <button className="btn btn-primary w-full md:w-auto">
                                <Plus className="w-5 h-5 mr-1" />
                                Create New Routine
                            </button>
                            <Link to="/current-workout" className="btn btn-primary w-full md:w-auto">
                                Log in New Workout
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow duration-200">
                            <div className="card-body">
                                <h2 className="card-title">Plan 1</h2>
                                <p>Back & Bi</p>
                                <div className="card-actions justify-end mt-4">
                                    <button className="btn btn-sm btn-outline btn-secondary">See details</button>
                                    <button className="btn btn-sm btn-primary">Start workout</button>

                                </div>
                            </div>
                        </div>

                        <div className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow duration-200">
                            <div className="card-body items-center text-center">
                                <h2 className="card-title">Add Routine</h2>
                                <p>Create new workout routine</p>
                                <button className="btn btn-circle btn-primary btn-lg mt-4">
                                    <Plus size={32} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WorkoutPlansPage