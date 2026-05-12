const { Log, Registration } = require('../models');

const recordLog = async (email, type, message, details = {}) => {
  try {
    let registration_id = null;
    if (email && email !== 'system') {
      const reg = await Registration.findOne({ where: { email } });
      if (!reg) return; // Skip if no registration found
      registration_id = reg.id;
    }

    await Log.create({
      email: email || 'system',
      registration_id,
      type,
      message,
      details: JSON.stringify(details)
    });
  } catch (error) {
    console.error('Failed to write log to DB:', error);
  }
};

module.exports = { recordLog };
