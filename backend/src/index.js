import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import adminRoutes from './routes/admin.route.js';
import authRoutes from './routes/auth.route.js';
import exerciseRoutes from './routes/exercise.route.js';
import workoutRoutes from './routes/workout.route.js';
import followRoutes from './routes/follow.route.js';
import commentRoutes from './routes/comment.route.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';

import { connectDB } from './lib/db.js';
import swaggerOptions from './swaggerDef.js';

dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/exercise", exerciseRoutes);
app.use("/api/workout", workoutRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/comment", commentRoutes);
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