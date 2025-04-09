import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Exercise from '../src/models/exercise.model.js';
import Workout from '../src/models/workout.model.js';
import { app } from '../src/index.js';

let mongoServer, agent;
let testUserId, testExerciseId1, testExerciseId2, createdWorkoutId;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    agent = request.agent(app);
    await agent.post('/api/auth/signup').send({ username: 'workoutuser', email: 'workout@example.com', password: 'Password123' });
    const loginRes = await agent.post('/api/auth/login').send({ email: 'workout@example.com', password: 'Password123' });
    testUserId = loginRes.body._id;

    const [ex1, ex2] = await Exercise.insertMany([
        { exercise_id: "ex-1", title: "Test Exercise 1", type: "weight_reps", muscle_groups: { primary: "test" }, difficulty: "beginner", instructions: ["Do it"] },
        { exercise_id: "ex-2", title: "Test Exercise 2", type: "weight_reps", muscle_groups: { primary: "test" }, difficulty: "beginner", instructions: ["Do it too"] }
    ]);

    testExerciseId1 = ex1._id;
    testExerciseId2 = ex2._id;
});

beforeEach(async () => {
    await Workout.deleteMany({});
    createdWorkoutId = null;
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Workout API Endpoints', () => {

    describe('POST /api/workout/save-workout', () => {
        it('creates a workout for logged-in user', async () => {
            const res = await agent.post('/api/workout/save-workout').send({
                title: "My Test Workout",
                startTime: new Date(Date.now() - 3600000).toISOString(),
                endTime: new Date().toISOString(),
                exercises: [
                    { exercise: testExerciseId1, sets: [{ weight: 50, reps: 10 }, { weight: 55, reps: 8 }] },
                    { exercise: testExerciseId2, sets: [{ weight: 20, reps: 12 }] }
                ]
            });

            expect(res.statusCode).toBe(201);
            expect(res.body).toMatchObject({ title: 'My Test Workout' });
            expect(res.body.exercises).toHaveLength(2);
            expect(res.body).toHaveProperty('duration');

            createdWorkoutId = res.body._id;
            const workoutInDb = await Workout.findById(createdWorkoutId);
            expect(workoutInDb?.user.toString()).toBe(testUserId.toString());
        });

        it('returns 400 when fields are missing', async () => {
            const res = await agent.post('/api/workout/save-workout').send({ title: "Incomplete" });
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Missing required fields');
        });

        it('returns 401 when unauthenticated', async () => {
            const unauthAgent = request.agent(app);
            const res = await unauthAgent.post('/api/workout/save-workout').send({
                title: "No Auth",
                startTime: new Date().toISOString(),
                endTime: new Date().toISOString(),
                exercises: [{ exercise: testExerciseId1, sets: [{ weight: 1, reps: 1 }] }]
            });
            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Unauthorized - No Token Provided');
        });
    });

    describe('GET /api/workout/user/:userId', () => {
        beforeEach(async () => {
            const workout = await Workout.create({
                title: "Workout For Get Test",
                startTime: new Date(),
                endTime: new Date(),
                user: testUserId,
                exercises: [{ exercise: testExerciseId1, sets: [{ weight: 10, reps: 10 }] }]
            });
            createdWorkoutId = workout._id;
        });

        it('returns all workouts for user', async () => {
            const res = await agent.get(`/api/workout/user/${testUserId}`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.some(w => w._id === createdWorkoutId.toString())).toBe(true);
            expect(res.body[0].exercises[0].exercise.title).toBe('Test Exercise 1');
        });

        it('returns empty array if user has no workouts', async () => {
            const newUser = await request(app).post('/api/auth/signup').send({ username: 'empty', email: 'empty@example.com', password: 'Password123' });
            const res = await agent.get(`/api/workout/user/${newUser.body._id}`);
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveLength(0);
        });

        it('returns 401 if unauthenticated', async () => {
            const res = await request(app).get(`/api/workout/user/${testUserId}`);
            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Unauthorized - No Token Provided');
        });
    });

    describe('GET /api/workout/:workoutId', () => {
        beforeEach(async () => {
            const workout = await Workout.create({
                title: "Workout By ID",
                startTime: new Date(),
                endTime: new Date(),
                user: testUserId,
                exercises: [{ exercise: testExerciseId1, sets: [{ weight: 15, reps: 5 }] }]
            });
            createdWorkoutId = workout._id;
        });

        it('returns a specific workout by ID', async () => {
            const res = await request(app).get(`/api/workout/${createdWorkoutId}`);
            expect(res.statusCode).toBe(200);
            expect(res.body._id).toBe(createdWorkoutId.toString());
            expect(res.body.exercises[0].exercise.title).toBe('Test Exercise 1');
        });

        it('returns 404 if workout not found', async () => {
            const res = await request(app).get(`/api/workout/${new mongoose.Types.ObjectId()}`);
            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Workout not found');
        });

        it('returns 400 for invalid workout ID', async () => {
            const res = await request(app).get('/api/workout/invalid-id');
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Invalid workout ID format');
        });
    });
});
