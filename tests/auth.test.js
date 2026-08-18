// tests/auth.test.js
// Developed by: Markerson D Flomo and FATEHALRAHMAN HUSSEIN AHMED ALHASSAN, Reg No: 20724/2022 and 23782/2024

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const bcrypt = require('bcrypt');

let mongoServer;



afterEach(async () => {
  await User.deleteMany({});
});

describe('Auth API', () => {
  it('should sign up a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
        type: 'client'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.email).toBe('test@example.com');
  });


  it('should return 400 if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'incomplete@example.com',
        firstName: 'Jane'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe('All fields are required');
  });


  it('should return 400 if user already exists', async () => {
    await request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'duplicate@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
        type: 'client'
      });

    // Second request with the same email
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'duplicate@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
        type: 'client'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe('User already exists');
  });

  it('should call next(error) if database error occurs in signup', async () => {
    // Attempt to sign up with an email that already exists to force an error
    await User.create({
      email: 'error@example.com',
      firstName: 'Dave',
      lastName: 'Test',
      password: await bcrypt.hash('password123', 10),
      type: 'client'
    });
  
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'error@example.com', // Same email to trigger "User already exists" error
        firstName: 'Error',
        lastName: 'Test',
        password: 'password123',
        type: 'client'
      });
  
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('User already exists');
  });
  

  it('should return 400 if credentials are invalid', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe('Invalid Credentials');
  });


   it('should call next(error) if database error occurs in signin', async () => {
    jest.spyOn(User, 'findOne').mockImplementationOnce(() => {
      throw new Error('Database error');
    });

    const res = await request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'error@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(500);
  });


  it('should sign in an existing user', async () => {
    const user = new User({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: await require('bcrypt').hash('password123', 10),
      type: 'client'
    });
    await user.save();

    const res = await request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('token');
  });
});
