const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');
const errorHandler = require('./middlewares/errorHandler');
const { auth } = require('./middlewares/auth');

// Import routes
const categoryRoutes = require('./routes/categoryRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(auth); // Attach user to req from X-User-Id header

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../../frontend')));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'CarGallery API Docs',
}));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/reservations', reservationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend for all non-API routes (SPA support)
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../../frontend/index.html'));
  }
});

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
