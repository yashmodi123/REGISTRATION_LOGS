const { Registration } = require('../models');
const { recordLog } = require('../utils/logger');

const getRegistrationByEmail = async (email) => {
  const user = await Registration.findOne({
    where: { email }
  });
  
  if (!user) {
    const error = new Error('Registration not found');
    error.statusCode = 404;
    throw error;
  }
  
  return user;
};

const { Op } = require('sequelize');

const getAllRegistrations = async (filters = {}) => {
  const { page = 1, limit = 10, search = '', startDate, endDate } = filters;
  const offset = (page - 1) * limit;

  const where = {};
  if (search) {
    where[Op.or] = [
      { company_name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { machine_number: { [Op.like]: `%${search}%` } },
      { country: { [Op.like]: `%${search}%` } }
    ];
  }

  // Date range filter (used for CSV export)
  if (startDate || endDate) {
    where.created_at = {};
    if (startDate) where.created_at[Op.gte] = new Date(startDate);
    if (endDate)   where.created_at[Op.lte] = new Date(endDate);
  }

  const { count, rows } = await Registration.findAndCountAll({
    where,
    order: [['created_at', 'DESC']],
    limit: parseInt(limit),
    offset: parseInt(offset)
  });

  const usingMcalCount = await Registration.count({
    where: { ...where, is_using_sinar_mcal: true }
  });

  return {
    total: count,
    data: rows,
    usingMcalCount,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(count / limit)
  };
};

const updateRegistration = async (id, data) => {
  const reg = await Registration.findByPk(id);
  if (!reg) {
    const error = new Error('Registration not found');
    error.statusCode = 404;
    throw error;
  }
  const updated = await reg.update(data);
  await recordLog(updated.email, 'REGISTRATION', 'Registration updated by admin', data);
  return updated;
};

const deleteRegistration = async (id) => {
  const reg = await Registration.findByPk(id);
  if (!reg) {
    const error = new Error('Registration not found');
    error.statusCode = 404;
    throw error;
  }
  const email = reg.email;
  await reg.destroy();
  await recordLog(email, 'REGISTRATION', 'Registration deleted by admin');
  return { message: 'Registration deleted successfully' };
};

module.exports = {
  getRegistrationByEmail,
  getAllRegistrations,
  updateRegistration,
  deleteRegistration
};
