import mongoose from "mongoose"

const exerciseScheme = new mongoose.Schema(
    {
        exercise_id: {
            type: String,
            required: true,
            unique: true
        },
        title: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ["weight_reps", "time_based", "bodyweight"],
            required: true
        },
        muscle_groups: {
            primary: {
                type: String,
                required: true
            },
            secondary: {
                type: [String],
                default: []
            }
        },
        difficulty: {
            type: String,
            enum: ["beginner", "intermediate", "advanced"],
            required: true
        },
        equipment: {
            type: [String],
            default: []
        },
        instructions: {
            type: [String],
            required: true
        },
        video_url: {
            type: String,
            default: ""

        },
        is_custom: {
            type: Boolean,
            default: false
        }
    }, { timestamps: true }
);

const Exercise = mongoose.model("Exercise", exerciseScheme)

export default Exercise