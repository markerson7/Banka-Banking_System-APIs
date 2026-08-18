// src/routes/accountRoutes.js
// Developed by: Markerson D Flomo and FATEHALRAHMAN HUSSEIN AHMED ALHASSAN, Reg No: 20724/2022 and 23782/2024


const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected routes
router.post('/', authMiddleware, accountController.createAccount);
router.patch('/:accountNumber', authMiddleware, accountController.updateAccountStatus);
router.delete('/:accountNumber', authMiddleware, accountController.deleteAccount);
router.get('/:accountNumber', authMiddleware, accountController.getAccountDetails);
router.get('/', authMiddleware, accountController.getAllAccounts);
router.get('/:accountNumber/transactions', authMiddleware, accountController.getAccountTransactions);
router.get('/user/:email/accounts', authMiddleware, accountController.getUserAccounts);

module.exports = router;
