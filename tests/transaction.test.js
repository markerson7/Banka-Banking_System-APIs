// tests/transaction.test.js
// Developed by: Markerson D Flomo and FATEHALRAHMAN HUSSEIN AHMED ALHASSAN, Reg No: 20724/2022 and 23782/2024
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const Account = require('../src/models/Account');
const Transaction = require('../src/models/Transaction');
const bcrypt = require('bcrypt');
const generateToken = require('../src/utils/generateToken');

let mongoServer;
let cashierToken;
let testCashier;
let testAccount;

beforeAll(async () => {
  // Create test cashier
  const hashedPassword = await bcrypt.hash('password123', 10);
  testCashier = await User.create({
    email: 'cashier@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    password: hashedPassword,
    type: 'staff',
    isAdmin: false,
  });

  cashierToken = generateToken(testCashier);

  // Create test account
  testAccount = await Account.create({
    accountNumber: 1234567890,
    owner: testCashier._id,
    type: 'savings',
    status: 'active',
    balance: 2000,
  });
});

afterEach(async () => {
  await Transaction.deleteMany({});
});

describe('Transaction API Endpoints', () => {
  it('should credit an account', async () => {
    const res = await request(app)
      .post(`/api/v1/transactions/${testAccount.accountNumber}/credit`)
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({ amount: 500 });

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.transactionType).toBe('credit');
    expect(res.body.data.accountBalance).toBe(2500);
  });

  it('should debit an account', async () => {
    const res = await request(app)
      .post(`/api/v1/transactions/${testAccount.accountNumber}/debit`)
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({ amount: 300 });

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.transactionType).toBe('debit');
    expect(res.body.data.accountBalance).toBe(2200);
  });

  it('should handle database error when debiting an account', async () => {
    const res = await request(app)
      .post(`/api/v1/transactions/invalidAccount123/debit`) // Invalid account format
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({ amount: 500 });

    expect(res.statusCode).toBe(500);
  });

  it('should handle database error when crediting an account', async () => {
    const res = await request(app)
      .post(`/api/v1/transactions/invalidAccount123/credit`) // Invalid account format
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({ amount: 500 });

    expect(res.statusCode).toBe(500);
  });

  it('should return 404 if transaction does not exist', async () => {
    const fakeTransactionId = new mongoose.Types.ObjectId(); // Generate a random ObjectId

    const res = await request(app)
      .get(`/api/v1/transactions/${fakeTransactionId}`)
      .set('Authorization', `Bearer ${cashierToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Transaction not found');
  });

  it('should return an error if account does not exist during debit', async () => {
    const res = await request(app)
      .post(`/api/v1/transactions/9999999999/debit`) // Non-existent account
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({ amount: 500 });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Account not found');
  });

  it('should return an error if account does not exist during credit', async () => {
    const res = await request(app)
      .post(`/api/v1/transactions/9999999999/credit`) // Non-existent account
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({ amount: 500 });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Account not found');
  });

  it('should return an error if database error occurs when fetching transaction', async () => {
    const res = await request(app)
      .get('/api/v1/transactions/invalidTransactionId') // Invalid transaction ID
      .set('Authorization', `Bearer ${cashierToken}`);

    expect(res.statusCode).toBe(500); // Ensure error is handled
  });

  it('should return an error if insufficient funds', async () => {
    const res = await request(app)
      .post(`/api/v1/transactions/${testAccount.accountNumber}/debit`)
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({ amount: 5000 }); // More than balance

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe('Insufficient funds');
  });

  it('should fetch a specific transaction', async () => {
    const transaction = await Transaction.create({
      type: 'credit',
      accountNumber: testAccount.accountNumber,
      cashier: testCashier._id,
      amount: 100,
      oldBalance: 2000,
      newBalance: 2100,
    });

    const res = await request(app)
      .get(`/api/v1/transactions/${transaction._id}`)
      .set('Authorization', `Bearer ${cashierToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.amount).toBe(100);
  });
  
});
