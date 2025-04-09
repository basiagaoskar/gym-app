import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../src/models/user.model.js';
import { app } from '../src/index.js';

let mongoServer, agent;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  agent = request.agent(app);
  await agent.post('/api/auth/signup').send({ username: 'logintestuser', email: 'login@example.com', password: 'Password123' });
  await agent.post('/api/auth/logout');
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Auth API', () => {
  describe('Signup', () => {
    beforeEach(async () => {
      await User.deleteMany({ email: { $ne: 'login@example.com' } });
    });

    it('registers user (201)', async () => {
      const res = await agent.post('/api/auth/signup').send({ username: 'testuser', email: 'test@example.com', password: 'Password123' });
      expect(res.statusCode).toBe(201);
      expect(res.body.username).toBe('testuser');
    });

    it('rejects existing email (400)', async () => {
      const res = await agent.post('/api/auth/signup').send({ username: 'x', email: 'login@example.com', password: 'x' });
      expect(res.statusCode).toBe(400);
    });

    it('rejects existing username (400)', async () => {
      const res = await agent.post('/api/auth/signup').send({ username: 'logintestuser', email: 'x@x.com', password: 'x' });
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
    beforeAll(async () => {
      await agent.post('/api/auth/login').send({ email: 'login@example.com', password: 'Password123' });
    });

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

  describe('Get Profile', () => {
    it('returns user profile (200)', async () => {
      const res = await request(app).get('/api/auth/user/logintestuser');
      expect(res.statusCode).toBe(200);
    });
  });

  describe('Update Profile', () => {
    beforeAll(async () => {
      await agent.post('/api/auth/login').send({ email: 'login@example.com', password: 'Password123' });
    });

    it('updates profile (200)', async () => {
      const res = await agent.put('/api/auth/update-profile').send({ username: 'updateduser', bio: 'Updated!' });
      expect(res.statusCode).toBe(200);
      await agent.put('/api/auth/update-profile').send({ username: 'logintestuser' }); // reset
    });

    it('rejects duplicate username (400)', async () => {
      await request(app).post('/api/auth/signup').send({ username: 'dupuser', email: 'dup@example.com', password: 'Password123' });
      const res = await agent.put('/api/auth/update-profile').send({ username: 'dupuser' });
      expect(res.statusCode).toBe(400);
      await User.deleteOne({ email: 'dup@example.com' });
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
      await agent.put('/api/auth/update-password').send({ currentPassword: 'Password123', newPassword: 'NewPass456' });
      await agent.post('/api/auth/logout');
      const res = await agent.post('/api/auth/login').send({ email: 'login@example.com', password: 'NewPass456' });
      expect(res.statusCode).toBe(200);
      await agent.put('/api/auth/update-password').send({ currentPassword: 'NewPass456', newPassword: 'Password123' }); // reset
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
    let tempId;

    beforeAll(async () => {
      const signup = await agent.post('/api/auth/signup').send({ username: 'todelete', email: 'delete@example.com', password: 'Password123' });
      tempId = signup.body._id;
      await agent.post('/api/auth/login').send({ email: 'delete@example.com', password: 'Password123' });
    });

    it('deletes account (200)', async () => {
      const res = await agent.delete('/api/auth/delete-account');
      expect(res.statusCode).toBe(200);
      const user = await User.findById(tempId);
      expect(user).toBeNull();
    });

    it('rejects unauthenticated delete (401)', async () => {
      const res = await request(app).delete('/api/auth/delete-account');
      expect(res.statusCode).toBe(401);
    });
  });
});
