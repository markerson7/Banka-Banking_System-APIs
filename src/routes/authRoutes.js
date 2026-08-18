// src/routes/authRoutes.js
// Developed by: Markerson D Flomo and FATEHALRAHMAN HUSSEIN AHMED ALHASSAN, Reg No: 20724/2022 and 23782/2024


const express = require('express');
const router = express.Router();
const authController = require ('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

module.exports = router;