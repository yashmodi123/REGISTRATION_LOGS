const jwt = require('jsonwebtoken');
const { Registration } = require('../models');
const config = require('../config/config');
const { getIpLocation } = require('../utils/ipLocation');
const { recordLog } = require('../utils/logger');

const registerUser = async (userData, ip, userAgent) => {
  const existingUser = await Registration.findOne({ where: { email: userData.email } });
  if (existingUser) {
    const error = new Error('Email already in use');
    error.statusCode = 400;
    throw error;
  }

  const locationData = await getIpLocation(userData.ip_address || ip);

  const user = await Registration.create({
    machine_number: userData.machine_number,
    company_name: userData.company_name,
    date_of_purchase: userData.date_of_purchase,
    email: userData.email,
    is_using_sinar_mcal: userData.is_using_sinar_mcal,
    device_type: userData.device_type,
    ip_address: userData.ip_address || ip,
    user_agent: userAgent,
    country: userData.country || locationData.country,
    latitude: userData.latitude || locationData.latitude,
    longitude: userData.longitude || locationData.longitude
  });

  const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, { expiresIn: '1d' });

  recordLog(user.email, 'USAGE', 'User registered successfully', {
    ip_address: ip,
    user_agent: userAgent
  });

  return { user: { id: user.id, email: user.email } };
};

const loginUser = async (email) => {
  const user = await Registration.findOne({ where: { email } });
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, { expiresIn: '1d' });

  recordLog(user.email, 'USAGE', 'User logged in successfully');

  return { user: { id: user.id, email: user.email } };
};

module.exports = {
  registerUser,
  loginUser
};
