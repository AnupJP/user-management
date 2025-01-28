const express = require('express');
const userRoutes = require('./routes/userRoutes');
const statusRoutes = require('./routes/statusRoutes');
const authRouter = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/status', statusRoutes);
app.use('/api/v1/auth', authRouter);

module.exports = app;
