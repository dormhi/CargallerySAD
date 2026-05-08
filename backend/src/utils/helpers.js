/**
 * Utility helper functions for CarGallery
 */

/**
 * Calculate number of days between two dates
 * @param {Date|string} startDate
 * @param {Date|string} endDate
 * @returns {number} Number of days
 */
function calculateDayCount(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Calculate total rental price
 * @param {number} pricePerDay
 * @param {Date|string} startDate
 * @param {Date|string} endDate
 * @returns {number} Total price
 */
function calculateTotalPrice(pricePerDay, startDate, endDate) {
  const days = calculateDayCount(startDate, endDate);
  return Number((days * parseFloat(pricePerDay)).toFixed(2));
}

/**
 * Format success response
 * @param {*} data - Response data
 * @param {number|null} count - Optional total count
 * @returns {object} Formatted response
 */
function successResponse(data, count = null) {
  const response = { success: true, data };
  if (count !== null) {
    response.count = count;
  }
  return response;
}

/**
 * Format error response
 * @param {string} message - Error message
 * @param {Array} details - Error details
 * @returns {object} Formatted error response
 */
function errorResponse(message, details = []) {
  return {
    success: false,
    error: { message, details },
  };
}

module.exports = {
  calculateDayCount,
  calculateTotalPrice,
  successResponse,
  errorResponse,
};
