import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookierParser from "cookie-parser"

import authRoutes from './routes/auth.route.js';
import { connectDB } from './lib/db.js';

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(cookierParser())
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});