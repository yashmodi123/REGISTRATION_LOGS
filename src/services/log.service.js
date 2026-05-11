const { Log, Registration } = require('../models');
const { Op } = require('sequelize');

const getLogs = async ({ email, type, startDate, endDate }) => {
  const where = {};
  
  if (email) {
    where.email = email;
  }
  
  if (type) {
    where.type = type;
  }
  
  if (startDate || endDate) {
    where.created_at = {};
    if (startDate) {
      where.created_at[Op.gte] = new Date(startDate);
    }
    if (endDate) {
      where.created_at[Op.lte] = new Date(endDate);
    }
  }
  
  return await Log.findAll({
    where,
    order: [['created_at', 'DESC']]
  });
};

const createErrorLog = async ({ user_id, error_type, error_string }) => {
  const user = await Registration.findByPk(user_id);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return await Log.create({
    user_id,
    email: user.email,
    type: 'ERROR',
    message: error_type || 'General Error',
    details: error_string
  });
};

module.exports = { getLogs, createErrorLog };
