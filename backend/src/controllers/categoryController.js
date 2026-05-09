/**
 * Category Controller
 * Handles HTTP request/response for category endpoints
 */
const categoryService = require('../services/categoryService');
const { successResponse } = require('../utils/helpers');

const categoryController = {
  /**
   * GET /api/categories
   */
  async getAll(req, res, next) {
    try {
      const categories = await categoryService.getAll();
      res.json(successResponse(categories, categories.length));
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/categories/:id
   */
  async getById(req, res, next) {
    try {
      const category = await categoryService.getById(Number(req.params.id));
      res.json(successResponse(category));
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/categories
   */
  async create(req, res, next) {
    try {
      const category = await categoryService.create(req.body);
      res.status(201).json(successResponse(category));
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/categories/:id
   */
  async update(req, res, next) {
    try {
      const category = await categoryService.update(Number(req.params.id), req.body);
      res.json(successResponse(category));
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/categories/:id
   */
  async delete(req, res, next) {
    try {
      await categoryService.delete(Number(req.params.id));
      res.json(successResponse({ message: 'Category deleted successfully' }));
    } catch (error) {
      next(error);
    }
  },
};

module.exports = categoryController;
