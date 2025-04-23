import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../src/models/user.model.js';
import Follow from '../src/models/follow.model.js';
import { app } from '../src/index.js';

let mongoServer, user1Agent, user2Agent;
let user1Id, user2Id;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    // Create user 1
    user1Agent = request.agent(app);
    const res1 = await user1Agent.post('/api/auth/signup').send({ username: 'userFollow1', email: 'follow1@example.com', password: 'Password123' });
    user1Id = res1.body._id;

    // Create user 2
    user2Agent = request.agent(app);
    const res2 = await user2Agent.post('/api/auth/signup').send({ username: 'userFollow2', email: 'follow2@example.com', password: 'Password123' });
    user2Id = res2.body._id;

    // Login users
    await user1Agent.post('/api/auth/login').send({ email: 'follow1@example.com', password: 'Password123' });
    await user2Agent.post('/api/auth/login').send({ email: 'follow2@example.com', password: 'Password123' });
});

afterEach(async () => {
    await Follow.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Follow API', () => {
    describe('POST /api/follow/follow/:userIdToFollow', () => {
        it('should allow user1 to follow user2 (201)', async () => {
            const res = await user1Agent.post(`/api/follow/follow/${user2Id}`);
            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe('User followed successfully.');
            const followExists = await Follow.findOne({ follower: user1Id, following: user2Id });
            expect(followExists).not.toBeNull();
        });

        it('should prevent following self (400)', async () => {
            const res = await user1Agent.post(`/api/follow/follow/${user1Id}`);
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('You cannot follow yourself.');
        });

        it('should prevent following a non-existent user (404)', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const res = await user1Agent.post(`/api/follow/follow/${nonExistentId}`);
            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('User to follow not found.');
        });

        it('should prevent following a user already followed (400)', async () => {
            await user1Agent.post(`/api/follow/follow/${user2Id}`);
            const res = await user1Agent.post(`/api/follow/follow/${user2Id}`);
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toMatch(/You are already following this user/);
        });

        it('should require authentication (401)', async () => {
            const unauthAgent = request.agent(app);
            const res = await unauthAgent.post(`/api/follow/follow/${user2Id}`);
            expect(res.statusCode).toBe(401);
        });
    });

    describe('DELETE /api/follow/unfollow/:userIdToUnfollow', () => {
        beforeEach(async () => {
            await user1Agent.post(`/api/follow/follow/${user2Id}`);
        });

        it('should allow user1 to unfollow user2 (200)', async () => {
            const res = await user1Agent.delete(`/api/follow/unfollow/${user2Id}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('User unfollowed successfully.');
            const followExists = await Follow.findOne({ follower: user1Id, following: user2Id });
            expect(followExists).toBeNull();
        });

        it('should handle unfollowing a user not being followed (400)', async () => {
            await user1Agent.delete(`/api/follow/unfollow/${user2Id}`);
            const res = await user1Agent.delete(`/api/follow/unfollow/${user2Id}`);
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toMatch(/not following/);
        });

        it('should require authentication (401)', async () => {
            const unauthAgent = request.agent(app);
            const res = await unauthAgent.delete(`/api/follow/unfollow/${user2Id}`);
            expect(res.statusCode).toBe(401);
        });
    });

    describe('GET /api/follow/following/:userId', () => {
        it('should return the list of users user1 is following (200)', async () => {
            await user1Agent.post(`/api/follow/follow/${user2Id}`);
            const res = await user1Agent.get(`/api/follow/following/${user1Id}`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(1);
            expect(res.body[0]._id.toString()).toBe(user2Id.toString());
            expect(res.body[0].username).toBe('userFollow2');
        });

        it('should return empty list if user follows no one (200)', async () => {
            const res = await user1Agent.get(`/api/follow/following/${user1Id}`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(0);
        });
    });

    describe('GET /api/follow/followers/:userId', () => {
        it('should return the list of users following user2 (200)', async () => {
            await user1Agent.post(`/api/follow/follow/${user2Id}`);
            const res = await user2Agent.get(`/api/follow/followers/${user2Id}`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(1);
            expect(res.body[0]._id.toString()).toBe(user1Id.toString());
            expect(res.body[0].username).toBe('userFollow1');
        });

        it('should return empty list if user has no followers (200)', async () => {
            const res = await user2Agent.get(`/api/follow/followers/${user2Id}`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(0);
        });
    });
});