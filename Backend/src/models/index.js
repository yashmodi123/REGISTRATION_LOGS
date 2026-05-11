const sequelize = require('../config/db');
const Registration = require('./registration.model');
const Log = require('./log.model');
const User = require('./user.model');

// Relationships
Registration.hasMany(Log, { foreignKey: 'user_id', as: 'logs' });
Log.belongsTo(Registration, { foreignKey: 'user_id', as: 'user' });

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully.');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

module.exports = {
  sequelize,
  Registration,
  Log,
  User,
  syncDatabase
};

