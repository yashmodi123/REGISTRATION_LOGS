// Custom Next.js + Express combined server
// Mirrors Backend/src/app.js but replaces the Angular catch-all with Next.js
// The Backend folder is completely untouched.

'use strict';

const path = require('path');
const http = require('http');
const { parse } = require('url');

const next = require('next');
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const dev = process.env.NODE_ENV !== 'production';
const PORT = parseInt(process.env.PORT || '3000', 10);

// ── Resolve paths relative to this file (frontend-next/server.js) ──────────
const BACKEND = path.resolve(__dirname, './Backend/src');

// Load the backend's .env BEFORE requiring any backend modules
// (dotenv.config() in config.js uses process.cwd() which is frontend-next/)
require('dotenv').config({ path: path.resolve(__dirname, './Backend/.env') });

// ── Require backend modules ──────────────────────────────────────────────────
const swaggerSpec    = require(path.join(BACKEND, 'docs/swagger'));
const errorHandler   = require(path.join(BACKEND, 'middlewares/error.middleware'));
const authRoutes     = require(path.join(BACKEND, 'routes/auth.routes'));
const registrationRoutes = require(path.join(BACKEND, 'routes/registration.routes'));
const userRoutes     = require(path.join(BACKEND, 'routes/user.routes'));
const userAuthRoutes = require(path.join(BACKEND, 'routes/user.auth.routes'));
const logRoutes      = require(path.join(BACKEND, 'routes/log.routes'));
const { syncDatabase } = require(path.join(BACKEND, 'models'));

// ── Boot Next.js ─────────────────────────────────────────────────────────────
const nextApp = next({ dev, dir: __dirname });
const handle  = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
  // ── Sync DB ────────────────────────────────────────────────────────────────
  await syncDatabase();

  // ── Build Express app ──────────────────────────────────────────────────────
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve Next.js public assets (logo, favicon) — required for Swagger UI branding
  app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

  // Swagger UI — clean light theme
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Device Admin — API Docs',
    customfavIcon: '/assets/angular.ico',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      docExpansion: 'list',
      defaultModelsExpandDepth: 1,
      tryItOutEnabled: false,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customCss: `
      /* ── Page & fonts ── */
      body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f6fa; }

      /* ── Top bar ── */
      .swagger-ui .topbar {
        background: #ffffff;
        border-bottom: 3px solid #F57C00;
        padding: 8px 20px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.08);
      }
      .swagger-ui .topbar-wrapper img {
        content: url('/assets/SINAR-TECHNOLOGY-LOGO.avif');
        height: 38px;
        width: auto;
      }
      .swagger-ui .topbar-wrapper .link::after {
        content: 'Device Admin · API Docs';
        color: #F57C00;
        font-size: 16px;
        font-weight: 700;
        margin-left: 10px;
      }
      .swagger-ui .topbar .download-url-wrapper { display: none; }

      /* ── Main info block ── */
      .swagger-ui .info { margin: 24px 0 16px; }
      .swagger-ui .info .title { color: #333; font-size: 26px; font-weight: 700; }
      .swagger-ui .info .title small { background: #F57C00; color: #fff; border-radius: 4px; padding: 2px 8px; font-size: 13px; }
      .swagger-ui .info p, .swagger-ui .info li { color: #555; font-size: 14px; line-height: 1.6; }
      .swagger-ui .info a { color: #F57C00; }

      /* ── Tag section headers ── */
      .swagger-ui .opblock-tag {
        background: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        margin-bottom: 6px;
        padding: 10px 16px;
        font-size: 15px;
        font-weight: 600;
        color: #333;
      }
      .swagger-ui .opblock-tag:hover { border-color: #F57C00; color: #F57C00; }
      .swagger-ui .opblock-tag-section { margin-bottom: 12px; }

      /* ── Operation blocks ── */
      .swagger-ui .opblock {
        border-radius: 6px;
        border: 1px solid #e0e0e0;
        margin-bottom: 6px;
        box-shadow: none;
      }
      .swagger-ui .opblock .opblock-summary {
        padding: 8px 16px;
        border-radius: 5px;
      }
      .swagger-ui .opblock .opblock-summary-method {
        border-radius: 4px;
        font-size: 12px;
        font-weight: 700;
        min-width: 60px;
        text-align: center;
        padding: 4px 8px;
      }
      .swagger-ui .opblock .opblock-summary-path {
        font-size: 14px;
        font-weight: 500;
        color: #333;
      }
      .swagger-ui .opblock .opblock-summary-description {
        color: #777;
        font-size: 13px;
      }

      /* GET = blue, POST = green, PUT = orange, DELETE = red, PATCH = teal */
      .swagger-ui .opblock-get { background: #f0f7ff; border-color: #2196f3; }
      .swagger-ui .opblock-get .opblock-summary { background: #e3f2fd; }
      .swagger-ui .opblock-get .opblock-summary-method { background: #2196f3; }

      .swagger-ui .opblock-post { background: #f1faf3; border-color: #4caf50; }
      .swagger-ui .opblock-post .opblock-summary { background: #e8f5e9; }
      .swagger-ui .opblock-post .opblock-summary-method { background: #4caf50; }

      .swagger-ui .opblock-put { background: #fff8f0; border-color: #F57C00; }
      .swagger-ui .opblock-put .opblock-summary { background: #fff3e0; }
      .swagger-ui .opblock-put .opblock-summary-method { background: #F57C00; }

      .swagger-ui .opblock-delete { background: #fff5f5; border-color: #f44336; }
      .swagger-ui .opblock-delete .opblock-summary { background: #ffebee; }
      .swagger-ui .opblock-delete .opblock-summary-method { background: #f44336; }

      .swagger-ui .opblock-patch { background: #f0fbfb; border-color: #009688; }
      .swagger-ui .opblock-patch .opblock-summary { background: #e0f2f1; }
      .swagger-ui .opblock-patch .opblock-summary-method { background: #009688; }

      /* ── Authorize button ── */
      .swagger-ui .btn.authorize {
        background: #fff;
        color: #F57C00;
        border: 2px solid #F57C00;
        border-radius: 5px;
        font-weight: 600;
      }
      .swagger-ui .btn.authorize:hover { background: #F57C00; color: #fff; }
      .swagger-ui .btn.authorize svg { fill: #F57C00; }
      .swagger-ui .btn.authorize:hover svg { fill: #fff; }

      /* ── Scheme container (server selector + auth) ── */
      .swagger-ui .scheme-container {
        background: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        padding: 16px 20px;
        box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        margin-bottom: 20px;
      }

      /* ── Parameters & response table ── */
      .swagger-ui table { border-collapse: collapse; width: 100%; }
      .swagger-ui table thead tr th {
        background: #f5f6fa;
        color: #555;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        padding: 8px 12px;
        border-bottom: 2px solid #e0e0e0;
      }
      .swagger-ui table tbody tr td {
        padding: 8px 12px;
        font-size: 13px;
        color: #444;
        border-bottom: 1px solid #f0f0f0;
        vertical-align: top;
      }
      .swagger-ui table tbody tr:last-child td { border-bottom: none; }
      .swagger-ui .parameter__name { font-weight: 600; color: #333; }
      .swagger-ui .parameter__type { color: #888; font-size: 12px; }
      .swagger-ui .parameter__in { color: #aaa; font-size: 11px; font-style: italic; }

      /* ── Response codes ── */
      .swagger-ui .responses-inner h4 { color: #555; font-size: 13px; font-weight: 600; }
      .swagger-ui .response-col_status { font-weight: 700; }

      /* ── Models section ── */
      .swagger-ui section.models {
        background: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        margin-top: 20px;
      }
      .swagger-ui section.models h4 { color: #333; font-size: 15px; padding: 12px 16px; margin: 0; }
      .swagger-ui .model-title { color: #F57C00; font-weight: 600; }

      /* ── Try it out button ── */
      .swagger-ui .btn.try-out__btn {
        background: #F57C00;
        color: #fff;
        border: none;
        border-radius: 4px;
        font-size: 12px;
        padding: 5px 12px;
      }
      .swagger-ui .btn.try-out__btn:hover { background: #e65100; }

      /* ── Execute button ── */
      .swagger-ui .btn.execute {
        background: #4caf50;
        color: #fff;
        border: none;
        border-radius: 4px;
      }
      .swagger-ui .btn.execute:hover { background: #388e3c; }

      /* ── Input fields ── */
      .swagger-ui input[type=text], .swagger-ui textarea, .swagger-ui select {
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 6px 10px;
        font-size: 13px;
        color: #333;
        background: #fafafa;
      }
      .swagger-ui input[type=text]:focus, .swagger-ui textarea:focus {
        border-color: #F57C00;
        outline: none;
        background: #fff;
      }

      /* ── Code blocks ── */
      .swagger-ui .microlight {
        background: #f8f9fc;
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        padding: 12px;
        font-size: 13px;
        color: #333;
      }
    `,
  }));

  // API Routes (identical to Backend/src/app.js)
  app.use('/api/auth',       authRoutes);
  app.use('/api/registrations', registrationRoutes);
  app.use('/api/users',      userRoutes);
  app.use('/api/user-auth',  userAuthRoutes);
  app.use('/api/logs',       logRoutes);

  // Error handler (must come before Next.js catch-all)
  app.use(errorHandler);

  // ── Next.js catch-all (replaces Angular index.html serve) ─────────────────
  // Express v4 wildcard — passes all unmatched routes to Next.js
  app.all('*', (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // ── Start server ───────────────────────────────────────────────────────────
  http.createServer(app).listen(PORT, () => {
    console.log(`\n🚀 Combined server ready:`);
    console.log(`   App      → http://localhost:${PORT}`);
    console.log(`   API Docs → http://localhost:${PORT}/api-docs`);
    console.log(`   Mode     → ${dev ? 'development' : 'production'}\n`);
  });
});
