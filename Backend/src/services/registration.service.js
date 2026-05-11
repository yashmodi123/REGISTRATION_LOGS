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

const getAllRegistrations = async () => {
  return await Registration.findAll({
    order: [['created_at', 'DESC']]
  });
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
