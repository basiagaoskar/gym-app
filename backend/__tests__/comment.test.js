import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../src/index.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../src/models/user.model.js';
import Workout from '../src/models/workout.model.js';
import Exercise from '../src/models/exercise.model.js';
import Comment from '../src/models/comment.model.js';

let mongoServer, user1Token, user2Token;
let user1Id, user2Id;
let testWorkoutId, testExerciseId, commentId;

const login = async (email, password) => {
    const res = await request(app).post('/api/auth/login').send({ email, password });
    return res.headers['set-cookie'];
};

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const user1 = { username: 'us1', email: 'us1@example.com', password: 'Password123' };
    const user2 = { username: 'us2', email: 'us2@example.com', password: 'Password123' };

    await request(app).post('/api/auth/signup').send(user1);
    await request(app).post('/api/auth/signup').send(user2);

    const us1 = await User.findOne({ email: user1.email });
    const us2 = await User.findOne({ email: user2.email });

    user1Id = us1._id;
    user2Id = us2._id;

    user1Token = await login(user1.email, user1.password);
    user2Token = await login(user2.email, user2.password);

    const ex = await new Exercise({ exercise_id: "ex-1", title: "Test Exercise 1", type: "weight_reps", muscle_groups: { primary: "test" }, difficulty: "beginner", instructions: ["Do it"] }).save();

    testExerciseId = ex._id;

    const workout = await new Workout({
        title: "My Test Workout",
        startTime: new Date(Date.now() - 3600000).toISOString(),
        endTime: new Date().toISOString(),
        user: user1Id,
        exercises: [
            { exercise: testExerciseId, sets: [{ weight: 50, reps: 10 }, { weight: 55, reps: 8 }] }
        ]
    }).save();

    testWorkoutId = workout._id;
}, 15000);

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Comment API', () => {
    describe('POST /api/comment/:workoutId', () => {
        it('allows authenticated user to comment', async () => {
            const res = await request(app)
                .post(`/api/comment/${testWorkoutId}`)
                .set('Cookie', user1Token)
                .send({ content: 'Nice workout!' });

            expect(res.statusCode).toBe(201);
            expect(res.body.content).toBe('Nice workout!');
            commentId = res.body._id;
        });

        it('rejects empty comment', async () => {
            const res = await request(app)
                .post(`/api/comment/${testWorkoutId}`)
                .set('Cookie', user1Token)
                .send({ content: '' });

            expect(res.statusCode).toBe(400);
        });

        it('blocks unauthenticated user', async () => {
            const res = await request(app)
                .post(`/api/comment/${testWorkoutId}`)
                .send({ content: 'Anon comment' });

            expect(res.statusCode).toBe(401);
        });
    });

    describe('GET /api/comment/:workoutId', () => {
        it('returns comments for workout', async () => {
            const res = await request(app)
                .get(`/api/comment/${testWorkoutId}`)
                .set('Cookie', user1Token);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    describe('DELETE /api/comment/:commentId', () => {
        it('allows comment author to delete', async () => {
            const res = await request(app)
                .delete(`/api/comment/${commentId}`)
                .set('Cookie', user1Token);

            expect(res.statusCode).toBe(200);
        });

        it('blocks non-author from deleting', async () => {
            const another = await new Comment({
                user: user1Id,
                workout: testWorkoutId,
                content: 'Test',
            }).save();

            const res = await request(app)
                .delete(`/api/comment/${another._id}`)
                .set('Cookie', user2Token);

            expect(res.statusCode).toBe(403);
        });
    });
});
