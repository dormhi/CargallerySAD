/**
 * Reservation Service
 * Business logic for reservation operations
 */
const reservationRepository = require('../repositories/reservationRepository');
const vehicleRepository = require('../repositories/vehicleRepository');
const { calculateTotalPrice } = require('../utils/helpers');

const reservationService = {
  /**
   * Get all reservations
   */
  async getAll() {
    return reservationRepository.findAll();
  },

  /**
   * Get a single reservation by ID
   * @throws {Error} If reservation not found
   */
  async getById(id) {
    const reservation = await reservationRepository.findById(id);
    if (!reservation) {
      const error = new Error('Reservation not found');
      error.statusCode = 404;
      throw error;
    }
    return reservation;
  },

  /**
   * Create a new reservation
   * Business rules:
   * 1. Vehicle must exist
   * 2. Vehicle must be available
   * 3. No overlapping reservations for the same vehicle
   * 4. totalPrice is auto-calculated
   */
  async create(data) {
    // Check vehicle exists
    const vehicle = await vehicleRepository.findById(data.vehicleId);
    if (!vehicle) {
      const error = new Error('Vehicle not found');
      error.statusCode = 404;
      throw error;
    }

    // Check vehicle is available
    if (!vehicle.available) {
      const error = new Error('Vehicle is not available for reservation');
      error.statusCode = 400;
      throw error;
    }

    // Check for overlapping reservations
    const overlapping = await reservationRepository.findOverlapping(
      data.vehicleId,
      data.startDate,
      data.endDate
    );

    if (overlapping.length > 0) {
      const error = new Error('Vehicle is already reserved for the selected dates');
      error.statusCode = 409;
      error.details = [
        {
          field: 'dates',
          message: `Conflicting reservation from ${overlapping[0].startDate.toISOString().split('T')[0]} to ${overlapping[0].endDate.toISOString().split('T')[0]}`,
        },
      ];
      throw error;
    }

    // Auto-calculate total price
    const totalPrice = calculateTotalPrice(
      vehicle.pricePerDay,
      data.startDate,
      data.endDate
    );

    return reservationRepository.create({
      vehicleId: data.vehicleId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      totalPrice,
    });
  },

  /**
   * Update reservation status
   * @throws {Error} If reservation not found
   */
  async updateStatus(id, status) {
    await this.getById(id);
    return reservationRepository.updateStatus(id, status);
  },

  /**
   * Delete a reservation
   * @throws {Error} If reservation not found
   */
  async delete(id) {
    await this.getById(id);
    return reservationRepository.delete(id);
  },
};

module.exports = reservationService;
