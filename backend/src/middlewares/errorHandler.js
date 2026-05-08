/**
 * Global error handler middleware
 */
const { errorResponse } = require('../utils/helpers');

function errorHandler(err, req, res, next) {
  console.error('Error:', err.message);

  // Prisma known errors
  if (err.code === 'P2002') {
    return res.status(409).json(
      errorResponse('A record with this value already exists', [
        { field: err.meta?.target?.[0] || 'unknown', message: 'Must be unique' },
      ])
    );
  }

  if (err.code === 'P2025') {
    return res.status(404).json(errorResponse('Record not found'));
  }

  if (err.code === 'P2003') {
    return res.status(400).json(
      errorResponse('Related record not found', [
        { field: err.meta?.field_name || 'unknown', message: 'Invalid reference' },
      ])
    );
  }

  // Custom application errors
  if (err.statusCode) {
    return res.status(err.statusCode).json(errorResponse(err.message, err.details || []));
  }

  // Validation errors (Joi)
  if (err.isJoi) {
    const details = err.details.map((d) => ({
      field: d.path.join('.'),
      message: d.message,
    }));
    return res.status(400).json(errorResponse('Validation failed', details));
  }

  // Default server error
  res.status(500).json(errorResponse('Internal server error'));
}

module.exports = errorHandler;
