/**
 * User Service
 * Business logic for user operations
 */
const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');

const userService = {
  /**
   * Register a new user
   */
  async register(data) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      const error = new Error('Email is already registered');
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      password: hashedPassword,
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  /**
   * Login user
   */
  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  /**
   * Get user profile
   */
  async getProfile(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  /**
   * Add balance (no verification)
   */
  async addBalance(id, amount) {
    const user = await userRepository.findById(id);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    if (amount <= 0) {
      const error = new Error('Amount must be positive');
      error.statusCode = 400;
      throw error;
    }
    const newBalance = Number(user.balance) + amount;
    const updated = await userRepository.updateBalance(id, newBalance);
    const { password, ...userWithoutPassword } = updated;
    return userWithoutPassword;
  },

  /**
   * Create admin account (master_admin only)
   */
  async createAdmin(data) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      const error = new Error('Email is already taken');
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const admin = await userRepository.create({
      name: data.name,
      email: data.email,
      phone: '',
      password: hashedPassword,
      role: 'admin',
    });

    const { password, ...adminWithoutPassword } = admin;
    return adminWithoutPassword;
  },

  /**
   * Get all users (admin)
   */
  async getAll() {
    return userRepository.findAll();
  },
};

module.exports = userService;
