// Developed by: Markerson D Flomo, Reg No: 20724/2022

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const authMiddleware = require('../src/middleware/authMiddleware');

describe('Auth Middleware', () => {
  
  it('should allow request with valid token', async () => {
    const validToken = jwt.sign({ id: '12345', role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const req = {
      headers: { authorization: `Bearer ${validToken}` }
    };
    const res = {};
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(req.user).toBeDefined(); // Ensures user is added to request
    expect(next).toHaveBeenCalled(); // Ensures next() is called
  });

  it('should return 401 if token is invalid', async () => {
    const req = {
      headers: { authorization: 'Bearer invalidtoken' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ status: 401, error: 'Unauthorized, token invalid' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if no token is provided', async () => {
    const req = { headers: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ status: 401, error: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

});
