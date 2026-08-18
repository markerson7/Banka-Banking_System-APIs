// src/routes/transactionRoutes.js
// Developed by: Markerson D Flomo and FATEHALRAHMAN HUSSEIN AHMED ALHASSAN, Reg No: 20724/2022 and 23782/2024

const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:accountNumber/debit', authMiddleware, transactionController.debitAccount);
router.post('/:accountNumber/credit', authMiddleware, transactionController.creditAccount);
router.get('/:transactionId', authMiddleware, transactionController.getTransaction);

module.exports = router;
