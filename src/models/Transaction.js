// src/models/Transaction.js
// Developed by: Markerson D Flomo and FATEHALRAHMAN HUSSEIN AHMED ALHASSAN, Reg No: 20724/2022 and 23782/2024


const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  createdOn: { type: Date, default: Date.now },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  accountNumber: { type: Number, required: true },
  cashier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  oldBalance: { type: Number, required: true },
  newBalance: { type: Number, required: true }
});

module.exports = mongoose.model('Transaction', transactionSchema);
