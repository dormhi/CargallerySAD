/**
 * Vehicle Controller
 * Handles HTTP request/response for vehicle endpoints
 */
const vehicleService = require('../services/vehicleService');
const { successResponse } = require('../utils/helpers');

const vehicleController = {
  /**
   * GET /api/vehicles
   */
  async getAll(req, res, next) {
    try {
      const vehicles = await vehicleService.getAll(req.query);
      res.json(successResponse(vehicles, vehicles.length));
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/vehicles/:id
   */
  async getById(req, res, next) {
    try {
      const vehicle = await vehicleService.getById(Number(req.params.id));
      res.json(successResponse(vehicle));
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/vehicles
   */
  async create(req, res, next) {
    try {
      const vehicle = await vehicleService.create(req.body);
      res.status(201).json(successResponse(vehicle));
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/vehicles/:id
   */
  async update(req, res, next) {
    try {
      const vehicle = await vehicleService.update(Number(req.params.id), req.body);
      res.json(successResponse(vehicle));
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/vehicles/:id
   */
  async delete(req, res, next) {
    try {
      await vehicleService.delete(Number(req.params.id));
      res.json(successResponse({ message: 'Vehicle deleted successfully' }));
    } catch (error) {
      next(error);
    }
  },
};

module.exports = vehicleController;
