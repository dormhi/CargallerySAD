/**
 * Reservation Controller
 * Handles HTTP request/response for reservation endpoints
 */
const reservationService = require('../services/reservationService');
const { successResponse } = require('../utils/helpers');

const reservationController = {
  /**
   * GET /api/reservations
   */
  async getAll(req, res, next) {
    try {
      const reservations = await reservationService.getAll();
      res.json(successResponse(reservations, reservations.length));
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/reservations/:id
   */
  async getById(req, res, next) {
    try {
      const reservation = await reservationService.getById(Number(req.params.id));
      res.json(successResponse(reservation));
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/reservations
   */
  async create(req, res, next) {
    try {
      const reservation = await reservationService.create(req.body);
      res.status(201).json(successResponse(reservation));
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/reservations/:id/status
   */
  async updateStatus(req, res, next) {
    try {
      const reservation = await reservationService.updateStatus(
        Number(req.params.id),
        req.body.status
      );
      res.json(successResponse(reservation));
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/reservations/:id
   */
  async delete(req, res, next) {
    try {
      await reservationService.delete(Number(req.params.id));
      res.json(successResponse({ message: 'Reservation deleted successfully' }));
    } catch (error) {
      next(error);
    }
  },
};

module.exports = reservationController;
