/**
 * Vehicle Service Unit Tests
 * Tests business logic with mocked repositories
 */
const vehicleService = require('../src/services/vehicleService');
const vehicleRepository = require('../src/repositories/vehicleRepository');
const categoryRepository = require('../src/repositories/categoryRepository');

// Mock repositories
jest.mock('../src/repositories/vehicleRepository');
jest.mock('../src/repositories/categoryRepository');

describe('VehicleService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockVehicle = {
    id: 1,
    brand: 'Toyota',
    model: 'Corolla',
    year: 2024,
    pricePerDay: 75,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    mileage: 12000,
    available: true,
    categoryId: 1,
    category: { id: 1, name: 'Sedan' },
  };

  // ── getAll ──

  describe('getAll', () => {
    test('should return vehicles with filters applied', async () => {
      vehicleRepository.findAll.mockResolvedValue([mockVehicle]);

      const query = { brand: 'Toyota', sort: 'pricePerDay', order: 'asc' };
      const result = await vehicleService.getAll(query);

      expect(result).toEqual([mockVehicle]);
      expect(vehicleRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ brand: 'Toyota' }),
        expect.objectContaining({ field: 'pricePerDay', order: 'asc' })
      );
    });

    test('should handle empty query', async () => {
      vehicleRepository.findAll.mockResolvedValue([]);

      const result = await vehicleService.getAll({});

      expect(result).toEqual([]);
    });
  });

  // ── getById ──

  describe('getById', () => {
    test('should return vehicle when found', async () => {
      vehicleRepository.findById.mockResolvedValue(mockVehicle);

      const result = await vehicleService.getById(1);

      expect(result).toEqual(mockVehicle);
      expect(vehicleRepository.findById).toHaveBeenCalledWith(1);
    });

    test('should throw 404 when vehicle not found', async () => {
      vehicleRepository.findById.mockResolvedValue(null);

      await expect(vehicleService.getById(999))
        .rejects.toThrow('Vehicle not found');
    });
  });

  // ── create ──

  describe('create', () => {
    test('should create vehicle with valid category', async () => {
      categoryRepository.findById.mockResolvedValue({ id: 1, name: 'Sedan' });
      vehicleRepository.create.mockResolvedValue(mockVehicle);

      const input = { brand: 'Toyota', model: 'Corolla', categoryId: 1 };
      const result = await vehicleService.create(input);

      expect(result).toEqual(mockVehicle);
      expect(categoryRepository.findById).toHaveBeenCalledWith(1);
    });

    test('should throw 400 when category does not exist', async () => {
      categoryRepository.findById.mockResolvedValue(null);

      const input = { brand: 'Toyota', model: 'Corolla', categoryId: 999 };

      await expect(vehicleService.create(input))
        .rejects.toThrow('Category not found');

      try {
        await vehicleService.create(input);
      } catch (error) {
        expect(error.statusCode).toBe(400);
      }
    });
  });

  // ── update ──

  describe('update', () => {
    test('should update vehicle with valid data', async () => {
      const updated = { ...mockVehicle, brand: 'Honda' };
      vehicleRepository.findById.mockResolvedValue(mockVehicle);
      vehicleRepository.update.mockResolvedValue(updated);

      const result = await vehicleService.update(1, { brand: 'Honda' });

      expect(result.brand).toBe('Honda');
    });

    test('should validate category when categoryId is provided', async () => {
      vehicleRepository.findById.mockResolvedValue(mockVehicle);
      categoryRepository.findById.mockResolvedValue(null);

      await expect(vehicleService.update(1, { categoryId: 999 }))
        .rejects.toThrow('Category not found');
    });

    test('should skip category validation when categoryId is not provided', async () => {
      vehicleRepository.findById.mockResolvedValue(mockVehicle);
      vehicleRepository.update.mockResolvedValue({ ...mockVehicle, mileage: 15000 });

      const result = await vehicleService.update(1, { mileage: 15000 });

      expect(result.mileage).toBe(15000);
      expect(categoryRepository.findById).not.toHaveBeenCalled();
    });
  });

  // ── delete ──

  describe('delete', () => {
    test('should delete vehicle without active reservations', async () => {
      vehicleRepository.findById.mockResolvedValue(mockVehicle);
      vehicleRepository.hasActiveReservations.mockResolvedValue(false);
      vehicleRepository.delete.mockResolvedValue({ id: 1 });

      const result = await vehicleService.delete(1);

      expect(result).toEqual({ id: 1 });
    });

    test('should throw 409 when vehicle has active reservations', async () => {
      vehicleRepository.findById.mockResolvedValue(mockVehicle);
      vehicleRepository.hasActiveReservations.mockResolvedValue(true);

      await expect(vehicleService.delete(1))
        .rejects.toThrow('Cannot delete vehicle with active reservations');

      try {
        await vehicleService.delete(1);
      } catch (error) {
        expect(error.statusCode).toBe(409);
      }
    });

    test('should throw 404 when deleting non-existent vehicle', async () => {
      vehicleRepository.findById.mockResolvedValue(null);

      await expect(vehicleService.delete(999))
        .rejects.toThrow('Vehicle not found');
    });
  });
});
