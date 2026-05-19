/**
 * Helper Functions Unit Tests
 */
const {
  calculateDayCount,
  calculateTotalPrice,
  successResponse,
  errorResponse,
} = require('../src/utils/helpers');

describe('Helper Functions', () => {
  // ── calculateDayCount ──

  describe('calculateDayCount', () => {
    test('should calculate days between two dates', () => {
      const days = calculateDayCount('2026-06-01', '2026-06-05');
      expect(days).toBe(4);
    });

    test('should return 1 for consecutive days', () => {
      const days = calculateDayCount('2026-06-01', '2026-06-02');
      expect(days).toBe(1);
    });

    test('should handle Date objects', () => {
      const days = calculateDayCount(new Date('2026-01-01'), new Date('2026-01-10'));
      expect(days).toBe(9);
    });
  });

  // ── calculateTotalPrice ──

  describe('calculateTotalPrice', () => {
    test('should calculate total price correctly', () => {
      const total = calculateTotalPrice(75, '2026-06-01', '2026-06-05');
      expect(total).toBe(300);
    });

    test('should handle decimal prices', () => {
      const total = calculateTotalPrice(49.99, '2026-06-01', '2026-06-04');
      expect(total).toBe(149.97);
    });

    test('should return the daily price for 1 day', () => {
      const total = calculateTotalPrice(100, '2026-06-01', '2026-06-02');
      expect(total).toBe(100);
    });
  });

  // ── Response Formatters ──

  describe('successResponse', () => {
    test('should format success response with data', () => {
      const result = successResponse({ id: 1, name: 'Test' });
      expect(result).toEqual({
        success: true,
        data: { id: 1, name: 'Test' },
      });
    });

    test('should include count when provided', () => {
      const result = successResponse([1, 2, 3], 3);
      expect(result).toEqual({
        success: true,
        data: [1, 2, 3],
        count: 3,
      });
    });

    test('should not include count when null', () => {
      const result = successResponse('data');
      expect(result).not.toHaveProperty('count');
    });
  });

  describe('errorResponse', () => {
    test('should format error response', () => {
      const result = errorResponse('Something went wrong');
      expect(result).toEqual({
        success: false,
        error: { message: 'Something went wrong', details: [] },
      });
    });

    test('should include error details', () => {
      const details = [{ field: 'name', message: 'Required' }];
      const result = errorResponse('Validation failed', details);
      expect(result.error.details).toEqual(details);
    });
  });
});
