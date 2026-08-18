// tests/account.test.js
// Developed by: Markerson D Flomo and FATEHALRAHMAN HUSSEIN AHMED ALHASSAN, Reg No: 20724/2022 and 23782/2024

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const Account = require('../src/models/Account');
const bcrypt = require('bcrypt');
const generateToken = require('../src/utils/generateToken');

let mongoServer;
let userToken;
let testUser;
let testAccount;

beforeAll(async () => {

    // Ensure test user exists
    const hashedPassword = await bcrypt.hash('password123', 10);
    testUser = await User.create({
      email: 'testuser@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: hashedPassword,
      type: 'client'
    });
  
    userToken = generateToken(testUser);
  
    // Ensure test account exists
    testAccount = await Account.create({
      accountNumber: 1234567890,
      owner: testUser._id,
      type: 'savings',
      status: 'active',
      balance: 1000
    });
  
  });


describe('Account API Endpoints', () => {
  it('should create a new bank account', async () => {
    const res = await request(app)
      .post('/api/v1/accounts')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ type: 'current', openingBalance: 500 });

    expect(res.statusCode).toEqual(201);
    expect(res.body.data).toHaveProperty('accountNumber');
    expect(res.body.data.type).toBe('current');
  });

  it('should create an account with default balance if balance is not provided', async () => {
    const res = await request(app)
      .post('/api/v1/accounts')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ type: 'savings' }); // No balance provided
  
    expect(res.statusCode).toBe(201);
    expect(res.body.data.openingBalance).toBe(0); 
  });

  
  it('should return 500 if database error occurs during account creation', async () => {
    const res = await request(app)
      .post('/api/v1/accounts')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ type: 'savings', balance: 'invalid_balance' }); // Invalid balance
  
    expect(res.statusCode).toBe(500);
  });

  
  it('should return 400 if account is not found when updating status', async () => {
    const res = await request(app)
      .patch('/api/v1/accounts/9999999999') // Non-existent account number
      .set('Authorization', `Bearer ${userToken}`)
      .send({ status: 'dormant' });
  
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Account not found');
  });

  
  it('should return 404 if account to delete is not found', async () => {
    const res = await request(app)
      .delete('/api/v1/accounts/9999999999') // Non-existent account number
      .set('Authorization', `Bearer ${userToken}`);
  
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Account not found');
  });


  it('should fetch details of a specific account', async () => {
    const res = await request(app)
      .get(`/api/v1/accounts/${testAccount.accountNumber}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.accountNumber).toBe(testAccount.accountNumber);
  });

  it('should update account status', async () => {
    const res = await request(app)
      .patch(`/api/v1/accounts/${testAccount.accountNumber}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ status: 'dormant' });
    

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.status).toBe('dormant');
  });

  it('should delete an account', async () => {
    const res = await request(app)
      .delete(`/api/v1/accounts/${testAccount.accountNumber}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Account Successfully deleted');
  });
});
