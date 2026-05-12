const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

// Use __dirname so paths work regardless of where server.js is called from
const ROUTES_GLOB = path.join(__dirname, '../routes/*.js');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Device Login Admin — REST API',
      version: '1.0.0',
      description: `
## Device Login Admin Portal — REST API

Complete documentation for all endpoints powering the Admin Portal.

---

### 🔐 Authentication
- **Admin routes** require a JWT Bearer token obtained from \`POST /api/user-auth/login\`.
- Pass the token in the **Authorization** header as: \`Bearer <token>\`
- Public device routes (\`/api/auth/*\`) do **not** require authentication.

### ⚠️ Debug Mode
- Delete operations on Registrations and Users are only exposed in the UI when \`?debug=1\` is in the URL, but the API endpoints themselves are always active.

### 📦 Base URL
All endpoints are prefixed with \`/api\`.
      `,
      contact: {
        name: 'Sinar Technology',
        email: 'admin@sinar.com',
      },
      license: {
        name: 'Private',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: '🖥️ Local Development Server',
      },
      {
        url: 'http://localhost:3001',
        description: '🔧 Alt Local Port',
      },
    ],
    tags: [
      { name: 'Admin Auth', description: '🔐 Admin portal login, session & profile' },
      { name: 'User Auth', description: '👤 Admin user registration & login (legacy)' },
      { name: 'Device Auth', description: '📱 Device registration & public login endpoints' },
      { name: 'Registrations', description: '🖥️ Machine/device registration management' },
      { name: 'Logs', description: '📋 System event & usage log management' },
      { name: 'Admins', description: '🔧 Admin user CRUD (protected)' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token from POST /api/user-auth/login. Paste value without "Bearer " prefix.',
        },
      },
      schemas: {
        // ── Registration ────────────────────────────────────────────────────
        Registration: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            machine_number: { type: 'string', example: 'SN-M12345' },
            company_name: { type: 'string', example: 'ABC Pvt Ltd' },
            email: { type: 'string', format: 'email', example: 'device@abc.com' },
            is_using_sinar_mcal: { type: 'boolean', example: true },
            device_type: { type: 'string', enum: ['Android', 'iOS', ''], example: 'Android' },
            country: { type: 'string', example: 'India' },
            date_of_purchase: { type: 'string', format: 'date', example: '2024-01-15' },
            ip_address: { type: 'string', example: '103.0.0.1' },
            latitude: { type: 'number', example: 23.02 },
            longitude: { type: 'number', example: 72.57 },
            user_agent: { type: 'string', example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        RegistrationCreate: {
          type: 'object',
          required: ['machine_number', 'company_name', 'email'],
          properties: {
            machine_number: { type: 'string', example: 'SN-M12345' },
            company_name: { type: 'string', example: 'ABC Pvt Ltd' },
            email: { type: 'string', format: 'email', example: 'device@abc.com' },
            is_using_sinar_mcal: { type: 'boolean', example: true },
            device_type: { type: 'string', enum: ['Android', 'iOS', ''], example: 'Android' },
            country: { type: 'string', example: 'India' },
            date_of_purchase: { type: 'string', format: 'date', example: '2024-01-15' },
          },
        },
        // ── Log ─────────────────────────────────────────────────────────────
        Log: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            email: { type: 'string', format: 'email', example: 'device@abc.com' },
            type: { type: 'string', enum: ['USAGE', 'ERROR', 'REGISTRATION', 'USER'], example: 'USAGE' },
            message: { type: 'string', example: 'Device logged in successfully' },
            details: {
              type: 'object',
              example: { ip_address: '::1', user_agent: 'Mozilla/5.0...' },
            },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        // ── Admin User ──────────────────────────────────────────────────────
        AdminUser: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            username: { type: 'string', example: 'admin' },
            email: { type: 'string', format: 'email', example: 'admin@sinar.com' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        AdminUserCreate: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            username: { type: 'string', example: 'admin' },
            email: { type: 'string', format: 'email', example: 'admin@sinar.com' },
            password: { type: 'string', format: 'password', minLength: 6, example: 'secret123' },
          },
        },
        AdminUserUpdate: {
          type: 'object',
          properties: {
            username: { type: 'string', example: 'admin' },
            email: { type: 'string', format: 'email', example: 'admin@sinar.com' },
            password: {
              type: 'string',
              format: 'password',
              minLength: 6,
              example: 'newpassword123',
              description: 'Optional — omit to keep existing password',
            },
          },
        },
        // ── Generic responses ───────────────────────────────────────────────
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation successful' },
          },
        },
        ErrorResponse: {
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
            data: { type: 'array', items: { $ref: '#/components/schemas/Registration' } },
            total: { type: 'integer', example: 100 },
            usingMcalCount: { type: 'integer', example: 42 },
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            totalPages: { type: 'integer', example: 10 },
          },
        },
        PaginatedLogs: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'array', items: { $ref: '#/components/schemas/Log' } },
            total: { type: 'integer', example: 200 },
          },
        },
      },
    },
    // Apply bearerAuth globally — individual public routes override with security: []
    security: [{ bearerAuth: [] }],
  },
  // Absolute path so it works from any cwd (server.js in frontend-next/)
  apis: [ROUTES_GLOB],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
