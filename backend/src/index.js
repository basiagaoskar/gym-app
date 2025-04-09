import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookierParser from "cookie-parser"

import authRoutes from './routes/auth.route.js';
import exerciseRoutes from './routes/exercise.route.js';
import workoutRoutes from './routes/workout.route.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';

import { connectDB } from './lib/db.js';

dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();

app.use(cookierParser())
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use("/api/auth", authRoutes);
app.use("/api/exercise", exerciseRoutes);
app.use("/api/workout", workoutRoutes);
app.use(errorHandler);

let server;

if (process.env.NODE_ENV !== 'test') {
    server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        connectDB();
    });
} else {
    server = app;
}

export { app, server };