/**
 * Category Repository
 * Handles all database operations for categories
 */
const prisma = require('../config/database');

const categoryRepository = {
  /**
   * Get all categories with vehicle count
   */
  async findAll() {
    return prisma.category.findMany({
      include: { _count: { select: { vehicles: true } } },
      orderBy: { name: 'asc' },
    });
  },

  /**
   * Get a single category by ID
   */
  async findById(id) {
    return prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { vehicles: true } } },
    });
  },

  /**
   * Create a new category
   */
  async create(data) {
    return prisma.category.create({ data });
  },

  /**
   * Update a category
   */
  async update(id, data) {
    return prisma.category.update({
      where: { id },
      data,
    });
  },

  /**
   * Delete a category
   */
  async delete(id) {
    return prisma.category.delete({ where: { id } });
  },

  /**
   * Check if category has vehicles
   */
  async hasVehicles(id) {
    const count = await prisma.vehicle.count({ where: { categoryId: id } });
    return count > 0;
  },
};

module.exports = categoryRepository;
