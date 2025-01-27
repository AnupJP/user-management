const express = require('express');
const userRoutes = require('./routes/userRoutes');
const statusRoutes = require('./routes/statusRoutes');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/status', statusRoutes);

module.exports = app;
