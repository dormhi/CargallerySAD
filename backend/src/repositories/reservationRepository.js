/**
 * Reservation Repository
 * Handles all database operations for reservations
 */
const prisma = require('../config/database');

const reservationRepository = {
  /**
   * Get all reservations with vehicle info
   */
  async findAll() {
    return prisma.reservation.findMany({
      include: {
        vehicle: {
          include: { category: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  /**
   * Get a single reservation by ID
   */
  async findById(id) {
    return prisma.reservation.findUnique({
      where: { id },
      include: {
        vehicle: {
          include: { category: true },
        },
      },
    });
  },

  /**
   * Create a new reservation
   */
  async create(data) {
    return prisma.reservation.create({
      data,
      include: {
        vehicle: {
          include: { category: true },
        },
      },
    });
  },

  /**
   * Update reservation status
   */
  async updateStatus(id, status) {
    return prisma.reservation.update({
      where: { id },
      data: { status },
      include: {
        vehicle: {
          include: { category: true },
        },
      },
    });
  },

  /**
   * Delete a reservation
   */
  async delete(id) {
    return prisma.reservation.delete({ where: { id } });
  },

  /**
   * Find overlapping reservations for a vehicle
   * A reservation overlaps if its date range intersects with the given range
   * and it is not cancelled
   */
  async findOverlapping(vehicleId, startDate, endDate, excludeId = null) {
    const where = {
      vehicleId,
      status: { not: 'cancelled' },
      startDate: { lt: new Date(endDate) },
      endDate: { gt: new Date(startDate) },
    };

    if (excludeId) {
      where.id = { not: excludeId };
    }

    return prisma.reservation.findMany({ where });
  },
};

module.exports = reservationRepository;
