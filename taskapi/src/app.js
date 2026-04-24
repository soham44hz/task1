const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const taskRoutes = require('./routes/tasks');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Security & utility middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Routes
app.use('/api/tasks', taskRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
