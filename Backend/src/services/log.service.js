const { Log, Registration } = require('../models');
const { Op } = require('sequelize');

const getLogs = async ({ email, type, startDate, endDate }) => {
  const where = {};
  
  if (email) {
    where.email = email;
  }
  
  if (type) {
    where.type = type;
  } else {
    // Only show machine-related logs, exclude 'USER' admin logs
    where.type = { [Op.in]: ['USAGE', 'ERROR'] };
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
    include: [{
      model: Registration,
      as: 'registration',
      attributes: ['machine_number', 'company_name'],
      required: true // Inner join: only show logs if registration exists
    }],
    order: [['created_at', 'DESC']]
  });
};

const createErrorLog = async ({ registration_id, error_type, error_string }) => {
  const reg = await Registration.findByPk(registration_id);
  if (!reg) {
    const error = new Error('Registration not found');
    error.statusCode = 404;
    throw error;
  }

  return await Log.create({
    registration_id,
    email: reg.email,
    type: 'ERROR',
    message: error_type || 'General Error',
    details: error_string
  });
};

module.exports = { getLogs, createErrorLog };
