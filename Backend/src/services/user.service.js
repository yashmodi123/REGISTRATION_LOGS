const { User } = require('../models');

/**
 * Get all admin users
 */
const getAllUsers = async () => {
  return await User.findAll({
    attributes: { exclude: ['password'] },
    order: [['created_at', 'DESC']]
  });
};

/**
 * Get single admin by ID
 */
const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] }
  });
  if (!user) {
    const error = new Error('Admin user not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

/**
 * Update admin user
 */
const updateUser = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) {
    const error = new Error('Admin user not found');
    error.statusCode = 404;
    throw error;
  }
  
  // Don't allow email/username updates if they conflict with others
  return await user.update(data);
};

/**
 * Delete admin user
 */
const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    const error = new Error('Admin user not found');
    error.statusCode = 404;
    throw error;
  }
  await user.destroy();
  return { message: 'Admin user deleted successfully' };
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
