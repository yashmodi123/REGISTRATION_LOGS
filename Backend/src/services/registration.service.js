const { Registration } = require('../models');

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
  return await reg.update(data);
};

const deleteRegistration = async (id) => {
  const reg = await Registration.findByPk(id);
  if (!reg) {
    const error = new Error('Registration not found');
    error.statusCode = 404;
    throw error;
  }
  await reg.destroy();
  return { message: 'Registration deleted successfully' };
};

module.exports = {
  getRegistrationByEmail,
  getAllRegistrations,
  updateRegistration,
  deleteRegistration
};
