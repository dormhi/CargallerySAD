/**
 * User Controller
 * Request handling for user operations
 */
const userService = require('../services/userService');
const { successResponse, errorResponse } = require('../utils/helpers');

const userController = {
  async register(req, res, next) {
    try {
      const user = await userService.register(req.body);
      res.status(201).json(successResponse(user));
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const user = await userService.login(req.body.email, req.body.password);
      res.json(successResponse(user));
    } catch (error) {
      next(error);
    }
  },

  async getProfile(req, res, next) {
    try {
      const user = await userService.getProfile(req.user.id);
      res.json(successResponse(user));
    } catch (error) {
      next(error);
    }
  },

  async addBalance(req, res, next) {
    try {
      const user = await userService.addBalance(req.user.id, req.body.amount);
      res.json(successResponse(user));
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req, res, next) {
    try {
      const user = await userService.updateUser(Number(req.params.id), req.body, req.user);
      res.json(successResponse(user));
    } catch (error) {
      next(error);
    }
  },

  async createAdmin(req, res, next) {
    try {
      const admin = await userService.createAdmin(req.body);
      res.status(201).json(successResponse(admin));
    } catch (error) {
      next(error);
    }
  },

  async getAll(req, res, next) {
    try {
      const users = await userService.getAll(req.user.role);
      res.json(successResponse(users, users.length));
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req, res, next) {
    try {
      await userService.deleteUser(Number(req.params.id), req.user);
      res.json(successResponse({ message: 'User deleted successfully' }));
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
