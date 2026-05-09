/**
 * Category Service
 * Business logic for category operations
 */
const categoryRepository = require('../repositories/categoryRepository');

const categoryService = {
  /**
   * Get all categories
   */
  async getAll() {
    return categoryRepository.findAll();
  },

  /**
   * Get a single category by ID
   * @throws {Error} If category not found
   */
  async getById(id) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }
    return category;
  },

  /**
   * Create a new category
   */
  async create(data) {
    return categoryRepository.create(data);
  },

  /**
   * Update a category
   * @throws {Error} If category not found
   */
  async update(id, data) {
    await this.getById(id);
    return categoryRepository.update(id, data);
  },

  /**
   * Delete a category
   * @throws {Error} If category not found or has vehicles
   */
  async delete(id) {
    await this.getById(id);

    const hasVehicles = await categoryRepository.hasVehicles(id);
    if (hasVehicles) {
      const error = new Error('Cannot delete category that has vehicles assigned to it');
      error.statusCode = 409;
      throw error;
    }

    return categoryRepository.delete(id);
  },
};

module.exports = categoryService;
