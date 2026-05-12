const path = require('path');
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const errorHandler = require('./middlewares/error.middleware');

const authRoutes = require('./routes/auth.routes');
const registrationRoutes = require('./routes/registration.routes');
const userRoutes = require('./routes/user.routes');
const userAuthRoutes = require('./routes/user.auth.routes');
const logRoutes = require('./routes/log.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Frontend Files
app.use(express.static(path.join(__dirname, '../public')));

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/user-auth', userAuthRoutes);
app.use('/api/logs', logRoutes);

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
