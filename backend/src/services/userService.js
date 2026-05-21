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
   * Update user info (admin only)
   * Admins can edit regular users only
   * Master admins can edit anyone except other master admins
   */
  async updateUser(targetId, data, requester) {
    const target = await userRepository.findById(targetId);
    if (!target) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Permission checks
    if (requester.role === 'admin' && target.role !== 'user') {
      const error = new Error('You can only edit regular users');
      error.statusCode = 403;
      throw error;
    }

    // Build update data (only allowed fields)
    const updateData = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.balance !== undefined) updateData.balance = data.balance;

    const updated = await userRepository.update(targetId, updateData);
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
   * Normal admins don't see master_admin accounts
   */
  async getAll(requesterRole) {
    const excludeRole = requesterRole === 'admin' ? 'master_admin' : null;
    return userRepository.findAll(excludeRole);
  },

  /**
   * Delete a user (admin only)
   * Admins can only delete regular users
   * Master admins can delete anyone except master_admin
   * Cannot delete users with active reservations
   */
  async deleteUser(targetId, requester) {
    const target = await userRepository.findById(targetId);
    if (!target) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Cannot delete yourself
    if (target.id === requester.id) {
      const error = new Error('You cannot delete your own account');
      error.statusCode = 400;
      throw error;
    }

    // Permission checks
    if (target.role === 'master_admin') {
      const error = new Error('Cannot delete master admin accounts');
      error.statusCode = 403;
      throw error;
    }

    if (requester.role === 'admin' && target.role !== 'user') {
      const error = new Error('You can only delete regular users');
      error.statusCode = 403;
      throw error;
    }

    return userRepository.delete(targetId);
  },
};

module.exports = userService;
