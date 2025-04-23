import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Exercise from '../src/models/exercise.model.js';
import Workout from '../src/models/workout.model.js';
import User from '../src/models/user.model.js';
import Follow from '../src/models/follow.model.js';
import { app } from '../src/index.js';

let mongoServer, agent, otherAgent;
let testUserId, otherUserId, testExerciseId1, testExerciseId2, createdWorkoutId, otherUserWorkoutId;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    // Użytkownik 1 (główny testowy)
    agent = request.agent(app);
    const user1Res = await agent.post('/api/auth/signup').send({ username: 'workoutuser', email: 'workout@example.com', password: 'Password123' });
    testUserId = user1Res.body._id;
    await agent.post('/api/auth/login').send({ email: 'workout@example.com', password: 'Password123' });


    // Użytkownik 2 (inny użytkownik)
    otherAgent = request.agent(app);
    const user2Res = await otherAgent.post('/api/auth/signup').send({ username: 'otherworkoutuser', email: 'otherworkout@example.com', password: 'Password456' });
    otherUserId = user2Res.body._id;
    await otherAgent.post('/api/auth/login').send({ email: 'otherworkout@example.com', password: 'Password456' });


    // Ćwiczenia
    const [ex1, ex2] = await Exercise.insertMany([
        { exercise_id: "ex-1", title: "Test Exercise 1", type: "weight_reps", muscle_groups: { primary: "test" }, difficulty: "beginner", instructions: ["Do it"] },
        { exercise_id: "ex-2", title: "Test Exercise 2", type: "weight_reps", muscle_groups: { primary: "test" }, difficulty: "beginner", instructions: ["Do it too"] }
    ]);
    testExerciseId1 = ex1._id;
    testExerciseId2 = ex2._id;
});

beforeEach(async () => {
    // Czyść tylko kolekcje istotne dla testów workout, a nie użytkowników
    await Workout.deleteMany({});
    await Follow.deleteMany({});
    createdWorkoutId = null;
    otherUserWorkoutId = null;
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Workout API Endpoints', () => {

    // ... (istniejące testy POST /save-workout, GET /user/:userId, GET /:workoutId) ...

    describe('DELETE /api/workout/:workoutId', () => {
        // Tworzenie treningów przeniesione do testów, które ich potrzebują
        it('should delete own workout (200)', async () => {
            const workout = await Workout.create({
                title: "Workout To Delete", user: testUserId, startTime: new Date(), endTime: new Date(),
                exercises: [{ exercise: testExerciseId1, sets: [{ weight: 10, reps: 10 }] }]
            });
            createdWorkoutId = workout._id;

            const res = await agent.delete(`/api/workout/${createdWorkoutId}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Workout deleted successfully');
            const deletedWorkout = await Workout.findById(createdWorkoutId);
            expect(deletedWorkout).toBeNull();
        });

        it('should forbid deleting another user\'s workout (403)', async () => {
            const otherWorkout = await Workout.create({
                title: "Other User Workout", user: otherUserId, startTime: new Date(), endTime: new Date(),
                exercises: [{ exercise: testExerciseId2, sets: [{ weight: 20, reps: 5 }] }]
            });
            otherUserWorkoutId = otherWorkout._id;

            const res = await agent.delete(`/api/workout/${otherUserWorkoutId}`);
            expect(res.statusCode).toBe(403);
            const foundOtherWorkout = await Workout.findById(otherUserWorkoutId);
            expect(foundOtherWorkout).not.toBeNull();
        });

        it('should return 404 for non-existent workout', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const res = await agent.delete(`/api/workout/${nonExistentId}`);
            expect(res.statusCode).toBe(404);
        });

        it('should require authentication (401)', async () => {
            const workout = await Workout.create({ // Stwórz trening do usunięcia
                title: "Temp Workout", user: testUserId, startTime: new Date(), endTime: new Date(),
                exercises: [{ exercise: testExerciseId1, sets: [{ weight: 10, reps: 10 }] }]
            });
            const tempWorkoutId = workout._id;

            const unauthAgent = request.agent(app);
            const res = await unauthAgent.delete(`/api/workout/${tempWorkoutId}`);
            expect(res.statusCode).toBe(401);
        });
    });

    describe('GET /api/workout/feed', () => {
        let workoutUser1_1, workoutUser1_2, workoutUser2_1;

        // Przeniesiono setup do `it` aby uniknąć konfliktów i upewnić się, że ID są dostępne
        it('should get feed including own and followed users workouts (200)', async () => {
            // Upewnij się, że ID są zdefiniowane
            expect(testUserId).toBeDefined();
            expect(otherUserId).toBeDefined();

            // User1 follows User2
            const followRes = await agent.post(`/api/follow/follow/${otherUserId}`);
            expect(followRes.statusCode).toBe(201); // Sprawdź powodzenie follow

            // Tworzenie treningów
            workoutUser2_1 = await Workout.create({
                user: otherUserId, title: "Other User Feed Workout", startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), endTime: new Date(Date.now() - 60 * 60 * 1000),
                exercises: [{ exercise: testExerciseId2, sets: [{ weight: 1, reps: 1 }] }]
            });
            workoutUser1_1 = await Workout.create({
                user: testUserId, title: "My First Feed Workout", startTime: new Date(Date.now() - 60 * 60 * 1000), endTime: new Date(),
                exercises: [{ exercise: testExerciseId1, sets: [{ weight: 1, reps: 1 }] }]
            });
            await new Promise(resolve => setTimeout(resolve, 10)); // Krótka pauza dla różnych timestampów
            workoutUser1_2 = await Workout.create({
                user: testUserId, title: "My Second Feed Workout", startTime: new Date(Date.now() - 5 * 60 * 1000), endTime: new Date(),
                exercises: [{ exercise: testExerciseId1, sets: [{ weight: 2, reps: 2 }] }]
            });

            // Pobierz feed
            const res = await agent.get('/api/workout/feed');
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(3);

            const workoutIds = res.body.map(w => w._id.toString());
            expect(workoutIds).toContain(workoutUser1_1._id.toString());
            expect(workoutIds).toContain(workoutUser1_2._id.toString());
            expect(workoutIds).toContain(workoutUser2_1._id.toString());

            expect(res.body[0].user).toHaveProperty('username');
            expect(res.body[0].exercises[0].exercise).toHaveProperty('title');

            const timestamps = res.body.map(w => new Date(w.createdAt).getTime());
            expect(timestamps[0]).toBeGreaterThanOrEqual(timestamps[1]);
            expect(timestamps[1]).toBeGreaterThanOrEqual(timestamps[2]);
            expect(res.body[0]._id.toString()).toBe(workoutUser1_2._id.toString());
        });

        it('should return only own workouts if not following anyone (200)', async () => {
            // Stwórz treningi tylko dla user1
            workoutUser1_1 = await Workout.create({
                user: testUserId, title: "My First Feed Workout", startTime: new Date(Date.now() - 60 * 60 * 1000), endTime: new Date(),
                exercises: [{ exercise: testExerciseId1, sets: [{ weight: 1, reps: 1 }] }]
            });
            await new Promise(resolve => setTimeout(resolve, 10));
            workoutUser1_2 = await Workout.create({
                user: testUserId, title: "My Second Feed Workout", startTime: new Date(Date.now() - 5 * 60 * 1000), endTime: new Date(),
                exercises: [{ exercise: testExerciseId1, sets: [{ weight: 2, reps: 2 }] }]
            });

            const res = await agent.get('/api/workout/feed');
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(2);
            const workoutIds = res.body.map(w => w._id.toString());
            expect(workoutIds).toContain(workoutUser1_1._id.toString());
            expect(workoutIds).toContain(workoutUser1_2._id.toString());
        });

        it('should require authentication (401)', async () => {
            const unauthAgent = request.agent(app);
            const res = await unauthAgent.get('/api/workout/feed');
            expect(res.statusCode).toBe(401);
        });
    });
});