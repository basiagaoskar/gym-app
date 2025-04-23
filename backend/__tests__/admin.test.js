import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../src/models/user.model.js';
import { app } from '../src/index.js';

let mongoServer, adminAgent, userAgent;
let adminId, regularUserId, userToDeleteId;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    // Create Admin User
    const adminData = { username: 'adminTestUser', email: 'admin@test.com', password: 'Password123' };
    const adminRes = await request(app).post('/api/auth/signup').send(adminData);
    adminId = adminRes.body._id;
    await User.findByIdAndUpdate(adminId, { role: 'admin' });

    // Create Regular User
    const userData = { username: 'regularTestUser', email: 'user@test.com', password: 'Password123' };
    const userRes = await request(app).post('/api/auth/signup').send(userData);
    regularUserId = userRes.body._id;

    // Create User to be Deleted
    const deleteUserData = { username: 'userToDelete', email: 'delete@test.com', password: 'Password123' };
    const deleteUserRes = await request(app).post('/api/auth/signup').send(deleteUserData);
    userToDeleteId = deleteUserRes.body._id;


    // Setup agents and login
    adminAgent = request.agent(app);
    userAgent = request.agent(app);
    await adminAgent.post('/api/auth/login').send({ email: adminData.email, password: adminData.password });
    await userAgent.post('/api/auth/login').send({ email: userData.email, password: userData.password });

});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Admin API', () => {
    describe('GET /api/admin/users', () => {
        it('should get all users as admin (200)', async () => {
            const res = await adminAgent.get('/api/admin/users');
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThanOrEqual(3);
        });

        it('should forbid access for regular user (403)', async () => {
            const res = await userAgent.get('/api/admin/users');
            expect(res.statusCode).toBe(403);
        });

        it('should forbid access for unauthenticated user (401)', async () => {
            const res = await request(app).get('/api/admin/users');
            expect(res.statusCode).toBe(401);
        });
    });

    describe('PUT /api/admin/users/:userId', () => {
        it('should update a user as admin (200)', async () => {
            const res = await adminAgent.put(`/api/admin/users/${regularUserId}`).send({ username: 'updatedRegularUser', role: 'admin' });
            expect(res.statusCode).toBe(200);
            expect(res.body.username).toBe('updatedRegularUser');
            expect(res.body.role).toBe('admin');
            await User.findByIdAndUpdate(regularUserId, { username: 'regularTestUser', role: 'user' });
        });

        it('should forbid update for regular user (403)', async () => {
            const res = await userAgent.put(`/api/admin/users/${adminId}`).send({ role: 'user' });
            expect(res.statusCode).toBe(403);
        });

        it('should forbid update for unauthenticated user (401)', async () => {
            const res = await request(app).put(`/api/admin/users/${regularUserId}`).send({ role: 'admin' });
            expect(res.statusCode).toBe(401);
        });

        it('should return 404 for non-existent user', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const res = await adminAgent.put(`/api/admin/users/${nonExistentId}`).send({ role: 'admin' });
            expect(res.statusCode).toBe(404);
        });

        it('should return 409 for duplicate username', async () => {
            const res = await adminAgent.put(`/api/admin/users/${regularUserId}`).send({ username: 'adminTestUser' });
            expect(res.statusCode).toBe(409);
        });
    });

    describe('DELETE /api/admin/users/:userId', () => {
        it('should delete a user as admin (200)', async () => {
            const res = await adminAgent.delete(`/api/admin/users/${userToDeleteId}`);
            expect(res.statusCode).toBe(200);
            const deletedUser = await User.findById(userToDeleteId);
            expect(deletedUser).toBeNull();
        });

        it('should forbid deletion for regular user (403)', async () => {
            const res = await userAgent.delete(`/api/admin/users/${adminId}`);
            expect(res.statusCode).toBe(403);
        });

        it('should forbid deletion for unauthenticated user (401)', async () => {
            const res = await request(app).delete(`/api/admin/users/${regularUserId}`);
            expect(res.statusCode).toBe(401);
        });

        it('should return 404 when deleting non-existent user', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const res = await adminAgent.delete(`/api/admin/users/${nonExistentId}`);
            expect(res.statusCode).toBe(404);
        });
    });
});