// src/controllers/transactionController.js
// Developed by: Markerson D Flomo and FATEHALRAHMAN HUSSEIN AHMED ALHASSAN, Reg No: 20724/2022 and 23782/2024


const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

exports.debitAccount = async (req, res, next) => {
    try {
      const { accountNumber } = req.params;
      const { amount } = req.body;
      const cashier = req.user.id;
  
      const account = await Account.findOne({ accountNumber });
      if (!account) return res.status(404).json({ status: 404, error: 'Account not found' });
  
      if (account.balance < amount) {
        return res.status(400).json({ status: 400, error: 'Insufficient funds' });
      }
  
      const oldBalance = account.balance;
      const newBalance = oldBalance - amount; 
  
        // Update account balance
      await Account.updateOne({ accountNumber }, { $set: { balance: newBalance } });
  
      // Save transaction
      const transaction = await Transaction.create({
        type: 'debit',
        accountNumber,
        cashier,
        amount,
        oldBalance,
        newBalance
      });
  
      res.status(200).json({
        status: 200,
        data: {
          transactionId: transaction._id,
          accountNumber: transaction.accountNumber,
          amount: transaction.amount,
          cashier: transaction.cashier,
          transactionType: transaction.type,
          accountBalance: newBalance
        }
      });
    } catch (error) {
      next(error);
    }
  };
  

exports.creditAccount = async (req, res, next) => {
  try {
    const { accountNumber } = req.params;
    const { amount } = req.body;
    const cashier = req.user.id;

    const account = await Account.findOne({ accountNumber });
    if (!account) return res.status(404).json({ status: 404, error: 'Account not found' });

    const oldBalance = account.balance;
    account.balance += amount;
    await account.save();

    const transaction = await Transaction.create({
      type: 'credit',
      accountNumber,
      cashier,
      amount,
      oldBalance,
      newBalance: account.balance
    });

    res.status(200).json({
      status: 200,
      data: {
        transactionId: transaction._id,
        accountNumber: transaction.accountNumber,
        amount: transaction.amount,
        cashier: transaction.cashier,
        transactionType: transaction.type,
        accountBalance: account.balance
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getTransaction = async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
        return res.status(404).json({ status: 404, error: 'Transaction not found' });
    }
    res.status(200).json({
      status: 200,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};
