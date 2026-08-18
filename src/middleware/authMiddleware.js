// src/middleware/authMiddleware.js
// Developed by: Markerson D Flomo and FATEHALRAHMAN HUSSEIN AHMED ALHASSAN, Reg No: 20724/2022 and 23782/2024

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(authHeader && authHeader.startsWith('Bearer')){
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err) {
                return res.status(401).json({status: 401, error: 'Unauthorized, token invalid'});
            }
            req.user = decoded;
            next();
        });
    } else {
        return res.status(401).json({status: 401, error: 'No token provided'});
    }
};

module.exports = authMiddleware;