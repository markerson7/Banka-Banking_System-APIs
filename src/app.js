// Developed by: Markerson D Flomo and FATEHALRAHMAN HUSSEIN AHMED ALHASSAN, Reg No: 20724/2022 and 23782/2024


// src/app.js
const express = require('express');
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Define API versioning
const apiPrefix = '/api/v1';

// Import route files
const authRoutes = require('./routes/authRoutes');
const accountRoutes = require('./routes/accountRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// Register routes under the correct prefix
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/accounts`, accountRoutes);
app.use(`${apiPrefix}/transactions`, transactionRoutes);

// Handle 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ status: 404, error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ status: err.status || 500, error: err.message });
});

module.exports = app;
