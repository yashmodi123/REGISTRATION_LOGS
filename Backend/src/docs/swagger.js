const swaggerJsdoc = require('swagger-jsdoc');
const config = require('../config/config');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Device Login Admin — API',
      version: '1.0.0',
      description: `
## Device Login Admin Portal — REST API

Full documentation for all endpoints used by the Admin Portal.

### Authentication
- **Admin routes** require a JWT Bearer token obtained from \`POST /api/user-auth/login\`.
- Pass the token in the **Authorization** header: \`Bearer <token>\`
- Public device registration routes (\`/api/auth/*\`) do **not** require authentication.

### Debug Mode
- Delete endpoints on Registrations and Users are gated — they function normally via API but the UI only shows them when \`?debug=1\` is in the URL.
      `,
      contact: {
        name: 'Sinar Technology Admin',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Local Development',
      },
    ],
    tags: [
      { name: 'Device Auth', description: '📱 Device registration & public login' },
      { name: 'Admin Auth', description: '🔐 Admin portal login & session' },
      { name: 'Registrations', description: '🖥️ Machine registration management' },
      { name: 'Logs', description: '📋 System & usage log management' },
      { name: 'Admins', description: '👤 Admin user management' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token obtained from POST /api/user-auth/login',
        },
      },
      schemas: {
        Registration: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            machine_number: { type: 'string', example: 'M12345' },
            company_name: { type: 'string', example: 'ABC Pvt Ltd' },
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            is_using_sinar_mcal: { type: 'boolean', example: true },
            device_type: { type: 'string', enum: ['Android', 'iOS'], example: 'Android' },
            country: { type: 'string', example: 'India' },
            ip_address: { type: 'string', example: '1.1.1.1' },
            latitude: { type: 'number', example: 23.02 },
            longitude: { type: 'number', example: 72.57 },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Log: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            type: { type: 'string', enum: ['USAGE', 'ERROR', 'REGISTRATION', 'USER'], example: 'USAGE' },
            message: { type: 'string', example: 'User registered successfully' },
            details: { type: 'object', example: { ip_address: '127.0.0.1' } },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        AdminUser: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            username: { type: 'string', example: 'admin' },
            email: { type: 'string', format: 'email', example: 'admin@example.com' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Unauthorized' },
          },
        },
        PaginatedRegistrations: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'array', items: { '$ref': '#/components/schemas/Registration' } },
            total: { type: 'integer', example: 100 },
            usingMcalCount: { type: 'integer', example: 42 },
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            totalPages: { type: 'integer', example: 10 },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
