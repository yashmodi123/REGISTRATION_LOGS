require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret',
  env: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'master',
    port: parseInt(process.env.DB_PORT) || 1433,
    integratedSecurity: process.env.DB_INTEGRATED_SECURITY === 'true',
    encrypt: process.env.DB_ENCRYPT === 'true' // false by default as per your string
  }
};
