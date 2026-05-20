/**
 * Reservation Service
 * Business logic for reservation operations
 */
const reservationRepository = require('../repositories/reservationRepository');
const vehicleRepository = require('../repositories/vehicleRepository');
const userRepository = require('../repositories/userRepository');
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
   * 1. Vehicle must exist and be available
   * 2. No overlapping reservations
   * 3. User must have sufficient balance
   * 4. totalPrice is auto-calculated and deducted from balance
   */
  async create(data, user) {
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

    // Check user balance
    const currentUser = await userRepository.findById(user.id);
    if (Number(currentUser.balance) < totalPrice) {
      const error = new Error(`Insufficient balance. Required: $${totalPrice}, Available: $${Number(currentUser.balance).toFixed(2)}`);
      error.statusCode = 400;
      throw error;
    }

    // Deduct balance
    await userRepository.updateBalance(user.id, Number(currentUser.balance) - totalPrice);

    return reservationRepository.create({
      vehicleId: data.vehicleId,
      userId: user.id,
      customerName: user.name,
      customerPhone: user.phone || '',
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      totalPrice,
    });
  },

  /**
   * Update reservation status
   * Refund balance if cancelled
   */
  async updateStatus(id, status) {
    const reservation = await reservationService.getById(id);

    // Refund balance if cancelling
    if (status === 'cancelled' && reservation.status !== 'cancelled') {
      const user = await userRepository.findById(reservation.userId);
      if (user) {
        await userRepository.updateBalance(
          user.id,
          Number(user.balance) + Number(reservation.totalPrice)
        );
      }
    }

    return reservationRepository.updateStatus(id, status);
  },

  /**
   * Delete a reservation
   */
  async delete(id) {
    await reservationService.getById(id);
    return reservationRepository.delete(id);
  },
};

module.exports = reservationService;
