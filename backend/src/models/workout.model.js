import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        exercises: [
            {
                exercise: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Exercise",
                    required: true,
                },
                sets: [
                    {
                        weight: {
                            type: Number,
                            required: true,
                            min: 0,
                        },
                        reps: {
                            type: Number,
                            required: true,
                            min: 1,
                        },
                    },
                ],
            },
        ],
        startTime: {
            type: Date,
            required: true,
        },
        duration: {
            type: Number,
            default: null,
        },
        title: {
            type: String,
            default: "",
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }]
    },
    { timestamps: true }
);

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;