const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config/config');

/**
 * Register a new admin/user account
 */
const registerUser = async ({ username, email, password }) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    const error = new Error('Email already in use');
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({ username, email, password });
  const token = _signToken(user);
  return { user: _safeUser(user), token };
};

/**
 * Login with email + password
 */
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const token = _signToken(user);
  return { user: _safeUser(user), token };
};

// ── helpers ──────────────────────────────────────────────────────────────────

const _signToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, username: user.username }, config.jwtSecret, {
    expiresIn: '7d'
  });

const _safeUser = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  created_at: user.created_at
});

module.exports = { registerUser, loginUser };
