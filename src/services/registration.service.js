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

module.exports = {
  getRegistrationByEmail
};
