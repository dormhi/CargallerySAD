/**
 * Reservation Validation Schemas
 * Joi schemas for validating reservation request data
 */
const Joi = require('joi');

const createReservationSchema = Joi.object({
  vehicleId: Joi.number().integer().positive().required().messages({
    'number.base': 'Vehicle ID must be a number',
    'number.positive': 'Vehicle ID must be a positive number',
    'any.required': 'Vehicle ID is required',
  }),
  customerName: Joi.string().trim().min(2).max(100).optional().messages({
    'string.min': 'Customer name must be at least 2 characters',
    'string.max': 'Customer name must be at most 100 characters',
  }),
  customerPhone: Joi.string()
    .trim()
    .pattern(/^[0-9+\-() ]{7,20}$/)
    .allow('', null)
    .optional()
    .messages({
      'string.pattern.base': 'Please enter a valid phone number',
    }),
  startDate: Joi.date().iso().required().messages({
    'date.base': 'Start date must be a valid date',
    'any.required': 'Start date is required',
  }),
  endDate: Joi.date().iso().greater(Joi.ref('startDate')).required().messages({
    'date.base': 'End date must be a valid date',
    'date.greater': 'End date must be after start date',
    'any.required': 'End date is required',
  }),
});

const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'approved', 'cancel_requested', 'cancelled')
    .required()
    .messages({
      'any.only': 'Status must be one of: pending, approved, cancel_requested, cancelled',
      'any.required': 'Status is required',
    }),
});

module.exports = { createReservationSchema, updateStatusSchema };
