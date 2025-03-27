import React from "react";
import { Link } from "react-router-dom";
import LoggedInNavbar from "../components/LoggedInNavbar";

const HomePage = () => {
    return (
        <div className="min-h-screen bg-base-200 text-base-content">
            <LoggedInNavbar />
            <div className="container mx-auto p-4 mt-15">
                <h1 className="text-4xl font-bold mb-6">Workouts</h1>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl">Your Workouts Feed</h2>
                    <Link to="/current-workout" className="btn btn-primary">
                        Start Workout
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default HomePage;