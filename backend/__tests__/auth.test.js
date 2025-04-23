import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../src/models/user.model.js';
import { app } from '../src/index.js';

let mongoServer, agent, otherUserAgent;
let loggedInUserId, otherUserId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  agent = request.agent(app);
  const userRes = await agent.post('/api/auth/signup').send({ username: 'logintestuser', email: 'login@example.com', password: 'Password123' });
  loggedInUserId = userRes.body._id;
  await agent.post('/api/auth/login').send({ email: 'login@example.com', password: 'Password123' })

  otherUserAgent = request.agent(app);
  const otherUserRes = await otherUserAgent.post('/api/auth/signup').send({ username: 'otheruser', email: 'other@example.com', password: 'Password456' });
  otherUserId = otherUserRes.body._id;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Auth API', () => {
  describe('Signup', () => {
    beforeEach(async () => {
      await User.deleteMany({ email: { $nin: ['login@example.com', 'other@example.com'] } });
    });

    it('registers user (201)', async () => {
      const res = await request(app).post('/api/auth/signup').send({ username: 'testuser_signup', email: 'test_signup@example.com', password: 'Password123' });
      expect(res.statusCode).toBe(201);
      expect(res.body.username).toBe('testuser_signup');
    });

    it('rejects existing email (400)', async () => {
      const res = await request(app).post('/api/auth/signup').send({ username: 'x', email: 'login@example.com', password: 'x' });
      expect(res.statusCode).toBe(400);
    });

    it('rejects existing username (400)', async () => {
      const res = await request(app).post('/api/auth/signup').send({ username: 'logintestuser', email: 'x@x.com', password: 'x' });
      expect(res.statusCode).toBe(400);
    });

    it('rejects missing fields (400)', async () => {
      const res = await agent.post('/api/auth/signup').send({ username: 'x' });
      expect(res.statusCode).toBe(400);
    });

    it('rejects short password (400)', async () => {
      const res = await agent.post('/api/auth/signup').send({ username: 'x', email: 'x@x.com', password: '123' });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('Login & Logout', () => {
    beforeAll(async () => {
      await agent.post('/api/auth/logout');
    });
    afterAll(async () => {
      await agent.post('/api/auth/login').send({ email: 'login@example.com', password: 'Password123' });
    });

    it('logs in (200)', async () => {
      const res = await agent.post('/api/auth/login').send({ email: 'login@example.com', password: 'Password123' });
      expect(res.statusCode).toBe(200);
      expect(res.body.username).toBe('logintestuser');
    });

    it('rejects wrong password (400)', async () => {
      const res = await agent.post('/api/auth/login').send({ email: 'login@example.com', password: 'wrong' });
      expect(res.statusCode).toBe(400);
    });

    it('logs out (200)', async () => {
      await agent.post('/api/auth/login').send({ email: 'login@example.com', password: 'Password123' });
      const res = await agent.post('/api/auth/logout');
      expect(res.statusCode).toBe(200);
    });
  });

  describe('Check Auth', () => {
    it('returns user if authenticated (200)', async () => {
      const res = await agent.get('/api/auth/check');
      expect(res.statusCode).toBe(200);
      expect(res.body.username).toBe('logintestuser');
    });

    it('rejects if unauthenticated (401)', async () => {
      const res = await request(app).get('/api/auth/check');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('Get Profile (/user/:username)', () => {

    it('returns own profile when authenticated (200)', async () => {
      const res = await agent.get('/api/auth/user/logintestuser');
      expect(res.statusCode).toBe(200);
      expect(res.body.username).toBe('logintestuser');
      expect(res.body).toHaveProperty('isFollowing', false);
      expect(res.body).toHaveProperty('followersCount');
      expect(res.body).toHaveProperty('followingCount');
    });

    it('returns other user profile, not following (200)', async () => {
      const res = await agent.get('/api/auth/user/otheruser');
      expect(res.statusCode).toBe(200);
      expect(res.body.username).toBe('otheruser');
      expect(res.body).toHaveProperty('isFollowing', false);
    });

    it('returns other user profile, is following (200)', async () => {
      expect(otherUserId).toBeDefined();
      const followRes = await agent.post(`/api/follow/follow/${otherUserId}`);
      expect(followRes.statusCode).toBe(201);

      const res = await agent.get('/api/auth/user/otheruser');
      expect(res.statusCode).toBe(200);
      expect(res.body.username).toBe('otheruser');
      expect(res.body).toHaveProperty('isFollowing', true);

      await agent.delete(`/api/follow/unfollow/${otherUserId}`);
    });

    it('returns 404 for non-existent user', async () => {
      const res = await agent.get('/api/auth/user/nonexistent');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('Search User (/search/:username)', () => {
    it('should find users matching the query (200)', async () => {
      const res = await agent.get('/api/auth/search/user');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      expect(res.body.some(u => u.username === 'logintestuser')).toBe(true);
      expect(res.body.some(u => u.username === 'otheruser')).toBe(true);
      expect(res.body[0]).toHaveProperty('username');
      expect(res.body[0]).toHaveProperty('profilePic');
      expect(res.body[0]).not.toHaveProperty('password');
    });

    it('should find specific user (200)', async () => {
      const res = await agent.get('/api/auth/search/otheruser');
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].username).toBe('otheruser');
    });

    it('should return empty array for no matches (200)', async () => {
      const res = await agent.get('/api/auth/search/nomatch123xyz');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('should return empty array for empty query (200)', async () => {
      const res = await agent.get('/api/auth/search/%20');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('Update Profile', () => {
    it('updates profile (200)', async () => {
      const res = await agent.put('/api/auth/update-profile').send({ username: 'updateduser', bio: 'Updated!' });
      expect(res.statusCode).toBe(200);
      expect(res.body.username).toBe('updateduser');
      expect(res.body.bio).toBe('Updated!');
      await agent.put('/api/auth/update-profile').send({ username: 'logintestuser', bio: 'I love Ziutki Gym' });
    });

    it('rejects duplicate username (400)', async () => {
      const res = await agent.put('/api/auth/update-profile').send({ username: 'otheruser' });
      expect(res.statusCode).toBe(400);
    });

    it('rejects unauthenticated update (401)', async () => {
      const res = await request(app).put('/api/auth/update-profile').send({ username: 'unauth' });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('Update Password', () => {
    beforeAll(async () => {
      await agent.post('/api/auth/login').send({ email: 'login@example.com', password: 'Password123' });
    });

    it('updates password (200)', async () => {
      const updateRes = await agent.put('/api/auth/update-password').send({ currentPassword: 'Password123', newPassword: 'NewPass456' });
      expect(updateRes.statusCode).toBe(200);

      await agent.post('/api/auth/logout');
      const res = await agent.post('/api/auth/login').send({ email: 'login@example.com', password: 'NewPass456' });
      expect(res.statusCode).toBe(200);
      await agent.put('/api/auth/update-password').send({ currentPassword: 'NewPass456', newPassword: 'Password123' });
    });

    it('rejects wrong current password (400)', async () => {
      const res = await agent.put('/api/auth/update-password').send({ currentPassword: 'wrong', newPassword: 'x' });
      expect(res.statusCode).toBe(400);
    });

    it('rejects unauthenticated update (401)', async () => {
      const res = await request(app).put('/api/auth/update-password').send({ currentPassword: 'x', newPassword: 'y' });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('Delete Account', () => {
    let tempUserId;
    let tempAgent;

    beforeEach(async () => {
      tempAgent = request.agent(app);
      const signup = await tempAgent.post('/api/auth/signup').send({ username: 'todelete', email: 'delete@example.com', password: 'Password123' });
      tempUserId = signup.body._id;
      await tempAgent.post('/api/auth/login').send({ email: 'delete@example.com', password: 'Password123' });
    });

    it('deletes account (200)', async () => {
      const res = await tempAgent.delete('/api/auth/delete-account');
      expect(res.statusCode).toBe(200);
      const user = await User.findById(tempUserId);
      expect(user).toBeNull();
    });

    it('rejects unauthenticated delete (401)', async () => {
      const res = await request(app).delete('/api/auth/delete-account');
      expect(res.statusCode).toBe(401);
    });
  });
});
