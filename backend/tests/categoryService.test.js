/**
 * Category Service Unit Tests
 * Tests business logic with mocked repository
 */
const categoryService = require('../src/services/categoryService');
const categoryRepository = require('../src/repositories/categoryRepository');

// Mock the repository
jest.mock('../src/repositories/categoryRepository');

describe('CategoryService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // ── getAll ──

  describe('getAll', () => {
    test('should return all categories', async () => {
      const mockCategories = [
        { id: 1, name: 'Sedan', _count: { vehicles: 3 } },
        { id: 2, name: 'SUV', _count: { vehicles: 2 } },
      ];
      categoryRepository.findAll.mockResolvedValue(mockCategories);

      const result = await categoryService.getAll();

      expect(result).toEqual(mockCategories);
      expect(categoryRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  // ── getById ──

  describe('getById', () => {
    test('should return category when found', async () => {
      const mockCategory = { id: 1, name: 'Sedan' };
      categoryRepository.findById.mockResolvedValue(mockCategory);

      const result = await categoryService.getById(1);

      expect(result).toEqual(mockCategory);
      expect(categoryRepository.findById).toHaveBeenCalledWith(1);
    });

    test('should throw 404 when category not found', async () => {
      categoryRepository.findById.mockResolvedValue(null);

      await expect(categoryService.getById(999))
        .rejects.toThrow('Category not found');

      try {
        await categoryService.getById(999);
      } catch (error) {
        expect(error.statusCode).toBe(404);
      }
    });
  });

  // ── create ──

  describe('create', () => {
    test('should create a new category', async () => {
      const input = { name: 'Electric' };
      const created = { id: 5, name: 'Electric' };
      categoryRepository.create.mockResolvedValue(created);

      const result = await categoryService.create(input);

      expect(result).toEqual(created);
      expect(categoryRepository.create).toHaveBeenCalledWith(input);
    });
  });

  // ── update ──

  describe('update', () => {
    test('should update an existing category', async () => {
      const updated = { id: 1, name: 'Luxury Sedan' };
      categoryRepository.findById.mockResolvedValue({ id: 1, name: 'Sedan' });
      categoryRepository.update.mockResolvedValue(updated);

      const result = await categoryService.update(1, { name: 'Luxury Sedan' });

      expect(result).toEqual(updated);
    });

    test('should throw 404 when updating non-existent category', async () => {
      categoryRepository.findById.mockResolvedValue(null);

      await expect(categoryService.update(999, { name: 'Test' }))
        .rejects.toThrow('Category not found');
    });
  });

  // ── delete ──

  describe('delete', () => {
    test('should delete category without vehicles', async () => {
      categoryRepository.findById.mockResolvedValue({ id: 1, name: 'Sedan' });
      categoryRepository.hasVehicles.mockResolvedValue(false);
      categoryRepository.delete.mockResolvedValue({ id: 1 });

      const result = await categoryService.delete(1);

      expect(result).toEqual({ id: 1 });
      expect(categoryRepository.delete).toHaveBeenCalledWith(1);
    });

    test('should throw 409 when category has vehicles', async () => {
      categoryRepository.findById.mockResolvedValue({ id: 1, name: 'Sedan' });
      categoryRepository.hasVehicles.mockResolvedValue(true);

      await expect(categoryService.delete(1))
        .rejects.toThrow('Cannot delete category that has vehicles assigned to it');

      try {
        await categoryService.delete(1);
      } catch (error) {
        expect(error.statusCode).toBe(409);
      }
    });

    test('should throw 404 when deleting non-existent category', async () => {
      categoryRepository.findById.mockResolvedValue(null);

      await expect(categoryService.delete(999))
        .rejects.toThrow('Category not found');
    });
  });
});
