import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Exercise from '../src/models/exercise.model.js';
import { app } from '../src/index.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  await Exercise.insertMany([
    {
      exercise_id: "test-bench-press",
      title: "Bench Press",
      type: "weight_reps",
      muscle_groups: { primary: "chest", secondary: ["triceps", "shoulders"] },
      difficulty: "intermediate",
      equipment: ["barbell", "bench"],
      instructions: ["Lie on the bench...", "Lower the bar..."],
      is_custom: false
    },
    {
      exercise_id: "test-pull-ups",
      title: "Pull Ups",
      type: "bodyweight",
      muscle_groups: { primary: "back", secondary: ["biceps"] },
      difficulty: "intermediate",
      equipment: ["pull-up bar"],
      instructions: ["Grab the bar...", "Pull yourself up..."],
      is_custom: false
    }
  ]);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('GET /api/exercise/all-exercises', () => {
  it('returns non-custom exercises (200)', async () => {
    const res = await request(app).get('/api/exercise/all-exercises');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
    expect(res.body.every(ex => !ex.is_custom)).toBe(true);
    expect(res.body.some(ex => ex.title === 'Bench Press')).toBe(true);
  });
});
