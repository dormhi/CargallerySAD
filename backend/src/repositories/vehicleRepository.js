/**
 * Vehicle Repository
 * Handles all database operations for vehicles
 */
const prisma = require('../config/database');

const vehicleRepository = {
  /**
   * Get all vehicles with optional filters and sorting
   * @param {object} filters - Filter criteria
   * @param {object} sort - Sort options { field, order }
   */
  async findAll(filters = {}, sort = {}) {
    const where = {};

    if (filters.brand) {
      where.brand = { contains: filters.brand, mode: 'insensitive' };
    }
    if (filters.categoryId) {
      where.categoryId = Number(filters.categoryId);
    }
    if (filters.fuelType) {
      where.fuelType = filters.fuelType;
    }
    if (filters.transmission) {
      where.transmission = filters.transmission;
    }
    if (filters.available !== undefined) {
      where.available = filters.available === 'true';
    }
    if (filters.search) {
      where.OR = [
        { brand: { contains: filters.search, mode: 'insensitive' } },
        { model: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const orderBy = {};
    if (sort.field) {
      orderBy[sort.field] = sort.order || 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    return prisma.vehicle.findMany({
      where,
      include: { category: true },
      orderBy,
    });
  },

  /**
   * Get a single vehicle by ID with category and reservations
   */
  async findById(id) {
    return prisma.vehicle.findUnique({
      where: { id },
      include: {
        category: true,
        reservations: {
          where: { status: { not: 'cancelled' } },
          orderBy: { startDate: 'asc' },
        },
      },
    });
  },

  /**
   * Create a new vehicle
   */
  async create(data) {
    return prisma.vehicle.create({
      data,
      include: { category: true },
    });
  },

  /**
   * Update a vehicle
   */
  async update(id, data) {
    return prisma.vehicle.update({
      where: { id },
      data,
      include: { category: true },
    });
  },

  /**
   * Delete a vehicle
   */
  async delete(id) {
    return prisma.vehicle.delete({ where: { id } });
  },

  /**
   * Check if vehicle has active reservations
   */
  async hasActiveReservations(id) {
    const count = await prisma.reservation.count({
      where: {
        vehicleId: id,
        status: { in: ['pending', 'approved'] },
      },
    });
    return count > 0;
  },
};

module.exports = vehicleRepository;
