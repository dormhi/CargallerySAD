/**
 * Reservation Service Unit Tests
 * Tests business logic: conflict detection, pricing, availability
 */
const reservationService = require('../src/services/reservationService');
const reservationRepository = require('../src/repositories/reservationRepository');
const vehicleRepository = require('../src/repositories/vehicleRepository');

// Mock repositories
jest.mock('../src/repositories/reservationRepository');
jest.mock('../src/repositories/vehicleRepository');

describe('ReservationService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockVehicle = {
    id: 1,
    brand: 'Toyota',
    model: 'Corolla',
    pricePerDay: 75,
    available: true,
  };

  const mockReservation = {
    id: 1,
    vehicleId: 1,
    customerName: 'John Doe',
    customerPhone: '+90 555 123 4567',
    startDate: new Date('2026-06-01'),
    endDate: new Date('2026-06-05'),
    totalPrice: 300,
    status: 'pending',
  };

  // ── getAll ──

  describe('getAll', () => {
    test('should return all reservations', async () => {
      reservationRepository.findAll.mockResolvedValue([mockReservation]);

      const result = await reservationService.getAll();

      expect(result).toEqual([mockReservation]);
    });
  });

  // ── getById ──

  describe('getById', () => {
    test('should return reservation when found', async () => {
      reservationRepository.findById.mockResolvedValue(mockReservation);

      const result = await reservationService.getById(1);

      expect(result).toEqual(mockReservation);
    });

    test('should throw 404 when reservation not found', async () => {
      reservationRepository.findById.mockResolvedValue(null);

      await expect(reservationService.getById(999))
        .rejects.toThrow('Reservation not found');
    });
  });

  // ── create ──

  describe('create', () => {
    const validInput = {
      vehicleId: 1,
      customerName: 'John Doe',
      customerPhone: '+90 555 123 4567',
      startDate: '2026-06-01',
      endDate: '2026-06-05',
    };

    test('should create reservation with auto-calculated price', async () => {
      vehicleRepository.findById.mockResolvedValue(mockVehicle);
      reservationRepository.findOverlapping.mockResolvedValue([]);
      reservationRepository.create.mockResolvedValue(mockReservation);

      const result = await reservationService.create(validInput);

      expect(result).toEqual(mockReservation);
      expect(reservationRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          totalPrice: 300, // 4 days × $75
          vehicleId: 1,
        })
      );
    });

    test('should throw 404 when vehicle does not exist', async () => {
      vehicleRepository.findById.mockResolvedValue(null);

      await expect(reservationService.create(validInput))
        .rejects.toThrow('Vehicle not found');
    });

    test('should throw 400 when vehicle is not available', async () => {
      vehicleRepository.findById.mockResolvedValue({ ...mockVehicle, available: false });

      await expect(reservationService.create(validInput))
        .rejects.toThrow('Vehicle is not available for reservation');

      try {
        await reservationService.create(validInput);
      } catch (error) {
        expect(error.statusCode).toBe(400);
      }
    });

    test('should throw 409 when dates overlap with existing reservation', async () => {
      vehicleRepository.findById.mockResolvedValue(mockVehicle);
      reservationRepository.findOverlapping.mockResolvedValue([
        {
          startDate: new Date('2026-06-02'),
          endDate: new Date('2026-06-04'),
        },
      ]);

      await expect(reservationService.create(validInput))
        .rejects.toThrow('Vehicle is already reserved for the selected dates');

      try {
        await reservationService.create(validInput);
      } catch (error) {
        expect(error.statusCode).toBe(409);
        expect(error.details).toBeDefined();
        expect(error.details[0].field).toBe('dates');
      }
    });
  });

  // ── updateStatus ──

  describe('updateStatus', () => {
    test('should update reservation status', async () => {
      const approved = { ...mockReservation, status: 'approved' };
      reservationRepository.findById.mockResolvedValue(mockReservation);
      reservationRepository.updateStatus.mockResolvedValue(approved);

      const result = await reservationService.updateStatus(1, 'approved');

      expect(result.status).toBe('approved');
      expect(reservationRepository.updateStatus).toHaveBeenCalledWith(1, 'approved');
    });

    test('should throw 404 for non-existent reservation', async () => {
      reservationRepository.findById.mockResolvedValue(null);

      await expect(reservationService.updateStatus(999, 'approved'))
        .rejects.toThrow('Reservation not found');
    });
  });

  // ── delete ──

  describe('delete', () => {
    test('should delete existing reservation', async () => {
      reservationRepository.findById.mockResolvedValue(mockReservation);
      reservationRepository.delete.mockResolvedValue({ id: 1 });

      const result = await reservationService.delete(1);

      expect(result).toEqual({ id: 1 });
    });

    test('should throw 404 for non-existent reservation', async () => {
      reservationRepository.findById.mockResolvedValue(null);

      await expect(reservationService.delete(999))
        .rejects.toThrow('Reservation not found');
    });
  });
});
