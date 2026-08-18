// src/utils/generateToken.js
// Developed by: Your Name, Reg No: 123456

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const generateToken = (user) => {
    return jwt.sign({
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    }, process.env.JWT_SECRET, { expiresIn: '2h'
    });
};

module.exports = generateToken;