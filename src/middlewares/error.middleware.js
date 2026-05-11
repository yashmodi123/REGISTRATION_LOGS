const { recordLog } = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  const email = (req.user && req.user.email) || (req.body && req.body.email) || 'unknown';

  recordLog(email, 'ERROR', message, {
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
    stack: err.stack
  });

  res.status(statusCode).json({
    success: false,
    error: message
  });
};

module.exports = errorHandler;
