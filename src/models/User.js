// src/models/User.js
// Developed by: Markerson D Flomo and FATEHALRAHMAN HUSSEIN AHMED ALHASSAN, Reg No: 20724/2022 and 23782/2024


const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    type: { type: String, enum: ['client', 'staff'], required: true },
    isAdmin: { type: Boolean, default: false }
  }, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
