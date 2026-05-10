/**
 * Vehicle Service
 * Business logic for vehicle operations
 */
const vehicleRepository = require('../repositories/vehicleRepository');
const categoryRepository = require('../repositories/categoryRepository');

const vehicleService = {
  /**
   * Get all vehicles with filters and sorting
   */
  async getAll(query) {
    const filters = {
      brand: query.brand,
      categoryId: query.categoryId,
      fuelType: query.fuelType,
      transmission: query.transmission,
      available: query.available,
      search: query.search,
    };

    const sort = {
      field: query.sort,
      order: query.order,
    };

    return vehicleRepository.findAll(filters, sort);
  },

  /**
   * Get a single vehicle by ID
   * @throws {Error} If vehicle not found
   */
  async getById(id) {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      const error = new Error('Vehicle not found');
      error.statusCode = 404;
      throw error;
    }
    return vehicle;
  },

  /**
   * Create a new vehicle
   * @throws {Error} If category does not exist
   */
  async create(data) {
    const category = await categoryRepository.findById(data.categoryId);
    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 400;
      throw error;
    }
    return vehicleRepository.create(data);
  },

  /**
   * Update a vehicle
   * @throws {Error} If vehicle or category not found
   */
  async update(id, data) {
    await this.getById(id);

    if (data.categoryId) {
      const category = await categoryRepository.findById(data.categoryId);
      if (!category) {
        const error = new Error('Category not found');
        error.statusCode = 400;
        throw error;
      }
    }

    return vehicleRepository.update(id, data);
  },

  /**
   * Delete a vehicle
   * @throws {Error} If vehicle not found or has active reservations
   */
  async delete(id) {
    await this.getById(id);

    const hasReservations = await vehicleRepository.hasActiveReservations(id);
    if (hasReservations) {
      const error = new Error('Cannot delete vehicle with active reservations');
      error.statusCode = 409;
      throw error;
    }

    return vehicleRepository.delete(id);
  },
};

module.exports = vehicleService;
