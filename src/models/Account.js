// src/models/Account.js
// Developed by: Markerson D Flomo and FATEHALRAHMAN HUSSEIN AHMED ALHASSAN, Reg No: 20724/2022 and 23782/2024


const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  accountNumber: { type: Number, unique: true, required: true },
  createdOn: { type: Date, default: Date.now },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['savings', 'current'], required: true },
  status: { type: String, enum: ['draft', 'active', 'dormant'], default: 'draft' },
  balance: { type: Number, default: 0 }
});

module.exports = mongoose.model('Account', accountSchema);
