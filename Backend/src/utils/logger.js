const { Log } = require('../models');

const recordLog = async (email, type, message, details = {}) => {
  try {
    await Log.create({
      email: email || 'system',
      type,
      message,
      details: JSON.stringify(details)
    });
  } catch (error) {
    console.error('Failed to write log to DB:', error);
  }
};

module.exports = { recordLog };
