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
}, 15000);

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

    // --- POST /save-workout ---
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
            expect(res.body).toHaveProperty('likes'); // Sprawdź czy pole likes istnieje
            expect(res.body.likes).toEqual([]); // Powinno być puste na początku

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

    // --- GET /user/:userId ---
    describe('GET /api/workout/user/:userId', () => {
        it('returns all workouts for user', async () => {
            const workout = await Workout.create({
                title: "Workout For Get Test", user: testUserId, startTime: new Date(), endTime: new Date(),
                exercises: [{ exercise: testExerciseId1, sets: [{ weight: 10, reps: 10 }] }]
            });
            createdWorkoutId = workout._id;

            const res = await agent.get(`/api/workout/user/${testUserId}`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.some(w => w._id === createdWorkoutId.toString())).toBe(true);
            expect(res.body[0].exercises[0].exercise.title).toBe('Test Exercise 1');
            // Upewnij się, że backend zwraca 'likes' (nawet jeśli puste)
            expect(res.body[0]).toHaveProperty('likes');
        });

        it('returns empty array if user has no workouts', async () => {
            // Użyj ID innego użytkownika, który nie ma treningów
            const res = await agent.get(`/api/workout/user/${otherUserId}`);
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveLength(0);
        });

        it('returns 401 if unauthenticated', async () => {
            const res = await request(app).get(`/api/workout/user/${testUserId}`);
            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Unauthorized - No Token Provided');
        });
    });

    // --- GET /:workoutId ---
    describe('GET /api/workout/:workoutId', () => {
        it('returns a specific workout by ID', async () => {
            const workout = await Workout.create({
                title: "Workout By ID", user: testUserId, startTime: new Date(), endTime: new Date(),
                exercises: [{ exercise: testExerciseId1, sets: [{ weight: 15, reps: 5 }] }]
            });
            createdWorkoutId = workout._id;

            const res = await request(app).get(`/api/workout/${createdWorkoutId}`);
            expect(res.statusCode).toBe(200);
            expect(res.body._id).toBe(createdWorkoutId.toString());
            expect(res.body.exercises[0].exercise.title).toBe('Test Exercise 1');
            // Upewnij się, że backend zwraca 'likes'
            expect(res.body).toHaveProperty('likes');
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

    // --- DELETE /:workoutId ---
    describe('DELETE /api/workout/:workoutId', () => {
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

        it('should get feed including own and followed users workouts (200)', async () => {
            expect(testUserId).toBeDefined();
            expect(otherUserId).toBeDefined();

            const followRes = await agent.post(`/api/follow/follow/${otherUserId}`);
            expect(followRes.statusCode).toBe(201);

            workoutUser2_1 = await Workout.create({
                user: otherUserId, title: "Other User Feed Workout", startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), endTime: new Date(Date.now() - 60 * 60 * 1000),
                exercises: [{ exercise: testExerciseId2, sets: [{ weight: 1, reps: 1 }] }]
            });
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
            expect(typeof res.body).toBe('object');
            expect(Array.isArray(res.body.workouts)).toBe(true);
            expect(res.body.workouts.length).toBe(3);
            expect(res.body).toHaveProperty('currentPage', 1);
            expect(res.body).toHaveProperty('hasMore', false);

            const workoutIds = res.body.workouts.map(w => w._id.toString());
            expect(workoutIds).toContain(workoutUser1_1._id.toString());
            expect(workoutIds).toContain(workoutUser1_2._id.toString());
            expect(workoutIds).toContain(workoutUser2_1._id.toString());

            expect(res.body.workouts[0].user).toHaveProperty('username');
            expect(res.body.workouts[0].exercises[0].exercise).toHaveProperty('title');
            expect(res.body.workouts[0]).toHaveProperty('likes');

            const timestamps = res.body.workouts.map(w => new Date(w.createdAt).getTime());
            expect(timestamps[0]).toBeGreaterThanOrEqual(timestamps[1]);
            expect(timestamps[1]).toBeGreaterThanOrEqual(timestamps[2]);
            expect(res.body.workouts[0]._id.toString()).toBe(workoutUser1_2._id.toString());
        });

        it('should return only own workouts if not following anyone (200)', async () => {
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
            expect(typeof res.body).toBe('object');
            expect(Array.isArray(res.body.workouts)).toBe(true);
            expect(res.body.workouts.length).toBe(2);
            expect(res.body).toHaveProperty('hasMore', false);
            const workoutIds = res.body.workouts.map(w => w._id.toString());
            expect(workoutIds).toContain(workoutUser1_1._id.toString());
            expect(workoutIds).toContain(workoutUser1_2._id.toString());
        });

        it('should require authentication (401)', async () => {
            const unauthAgent = request.agent(app);
            const res = await unauthAgent.get('/api/workout/feed');
            expect(res.statusCode).toBe(401);
        });
    });

    describe('POST /api/workout/like/:workoutId', () => {
        let workoutToLikeId;

        beforeEach(async () => {
            const workout = await Workout.create({
                title: "Workout To Like/Unlike",
                user: testUserId,
                startTime: new Date(),
                endTime: new Date(),
                exercises: [{ exercise: testExerciseId1, sets: [{ weight: 5, reps: 5 }] }],
                likes: []
            });
            workoutToLikeId = workout._id;
        });

        it('should like a workout (200)', async () => {
            const res = await agent.post(`/api/workout/like/${workoutToLikeId}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toMatch(/liked/i);
            expect(res.body.workout.likes).toContain(testUserId.toString());
            const updatedWorkoutDb = await Workout.findById(workoutToLikeId);
            const likesAsStrings = updatedWorkoutDb.likes.map(id => id.toString());
            expect(likesAsStrings).toContain(testUserId.toString());
        });

        it('should unlike a workout (200)', async () => {
            await agent.post(`/api/workout/like/${workoutToLikeId}`);

            const res = await agent.post(`/api/workout/like/${workoutToLikeId}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toMatch(/unliked/i);
            expect(res.body.workout.likes).not.toContain(testUserId.toString());
            const updatedWorkoutDb = await Workout.findById(workoutToLikeId);
            expect(updatedWorkoutDb.likes).not.toContainEqual(testUserId);
        });

        it('should return 404 for non-existent workout', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const res = await agent.post(`/api/workout/like/${nonExistentId}`);
            expect(res.statusCode).toBe(404);
        });

        it('should require authentication (401)', async () => {
            const unauthAgent = request.agent(app);
            const res = await unauthAgent.post(`/api/workout/like/${workoutToLikeId}`);
            expect(res.statusCode).toBe(401);
        });

        it('other user should be able to like the same workout', async () => {
            await agent.post(`/api/workout/like/${workoutToLikeId}`);
            const resOther = await otherAgent.post(`/api/workout/like/${workoutToLikeId}`);
            expect(resOther.statusCode).toBe(200);
            expect(resOther.body.workout.likes).toContain(otherUserId.toString());
            expect(resOther.body.workout.likes).toContain(testUserId.toString());
            expect(resOther.body.workout.likes.length).toBe(2);

            const updatedWorkoutDb = await Workout.findById(workoutToLikeId);
            const likesAsStrings = updatedWorkoutDb.likes.map(id => id.toString());
            expect(likesAsStrings).toContain(testUserId.toString());
            expect(likesAsStrings).toContain(otherUserId.toString());
            expect(likesAsStrings.length).toBe(2);
        });
    });
});