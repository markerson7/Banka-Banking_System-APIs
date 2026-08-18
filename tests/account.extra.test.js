// tests/account.extra.test.js
// Developed by: Markerson D Flomo and FATEHALRAHMAN HUSSEIN AHMED ALHASSAN
// This file adds tests for uncovered branches and functions in accountController.js

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
let userToken;
let testUser;
let testAccount;

beforeAll(async () => {
    // mongoServer = await MongoMemoryServer.create();
    // await mongoose.connect(mongoServer.getUri());

    const hashedPassword = await bcrypt.hash('password123', 10);
    testUser = await User.create({
        email: 'extrauser@example.com',
        firstName: 'Extra',
        lastName: 'User',
        password: hashedPassword,
        type: 'client'
    });

    userToken = generateToken(testUser);

    testAccount = await Account.create({
        accountNumber: 9876543210,
        owner: testUser._id,
        type: 'savings',
        status: 'active',
        balance: 1000
    });
});

// afterAll(async () => {
//     await mongoose.disconnect();
//     await mongoServer.stop();
// });

describe('Account Controller Extra Tests (Uncovered branches)', () => {

    it('should return 400 if createAccount with non-existent user', async () => {
        const fakeToken = generateToken({ id: new mongoose.Types.ObjectId() });
        const res = await request(app)
            .post('/api/v1/accounts')
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ type: 'current', balance: 100 });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('User not found');
    });

    it('should handle database error in createAccount', async () => {
        jest.spyOn(Account, 'create').mockImplementationOnce(() => {
            throw new Error('Database failure');
        });

        const res = await request(app)
            .post('/api/v1/accounts')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ type: 'current', balance: 100 });

        expect(res.statusCode).toBe(500);
        jest.restoreAllMocks();
    });

    it('should handle invalid accountNumber type in updateAccountStatus', async () => {
        const res = await request(app)
            .patch('/api/v1/accounts/invalidNumber')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ status: 'dormant' });

        // Mongoose will throw a CastError and be caught by error middleware
        expect(res.statusCode).toBe(500);
    });

    it('should handle database error in updateAccountStatus', async () => {
        jest.spyOn(Account, 'findOne').mockImplementationOnce(() => {
            throw new Error('DB error');
        });

        const res = await request(app)
            .patch(`/api/v1/accounts/${testAccount.accountNumber}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ status: 'dormant' });

        expect(res.statusCode).toBe(500);
        jest.restoreAllMocks();
    });

    it('should handle database error in deleteAccount', async () => {
        jest.spyOn(Account, 'findOneAndDelete').mockImplementationOnce(() => {
            throw new Error('Delete DB error');
        });

        const res = await request(app)
            .delete(`/api/v1/accounts/${testAccount.accountNumber}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toBe(500);
        jest.restoreAllMocks();
    });

    it('should return 404 in getUserAccounts if user not found', async () => {
        const res = await request(app)
            .get('/api/v1/accounts/user/:email/accounts')
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('User not found');
    });

    // it('should handle database error in getUserAccounts', async () => {
    //     jest.spyOn(User, 'findOne').mockImplementationOnce(() => {
    //         throw new Error('User DB error');
    //     });

    //     const res = await request(app)
    //         .get(`/api/v1/accounts/user/${testUser.email}`)
    //         .set('Authorization', `Bearer ${userToken}`);

    //     expect(res.statusCode).toBe(500);
    //     jest.restoreAllMocks();
    // });

    it('should return 404 in getAccountDetails if account not found', async () => {
        const res = await request(app)
            .get('/api/v1/accounts/1111111111')
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Account not found');
    });

    it('should handle database error in getAccountDetails', async () => {
        jest.spyOn(Account, 'findOne').mockImplementationOnce(() => {
            throw new Error('Account DB error');
        });

        const res = await request(app)
            .get(`/api/v1/accounts/${testAccount.accountNumber}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toBe(500);
        jest.restoreAllMocks();
    });

    it('should handle database error in getAllAccounts', async () => {
        jest.spyOn(Account, 'find').mockImplementationOnce(() => {
            throw new Error('Find DB error');
        });

        const res = await request(app)
            .get('/api/v1/accounts')
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toBe(500);
        jest.restoreAllMocks();
    });

    it('should handle database error in getAccountTransactions', async () => {
        jest.spyOn(Transaction, 'find').mockImplementationOnce(() => {
            throw new Error('Transaction DB error');
        });

        const res = await request(app)
            .get(`/api/v1/accounts/${testAccount.accountNumber}/transactions`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toBe(500);
        jest.restoreAllMocks();
    });

});
