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
  customerName: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Customer name is required',
    'string.min': 'Customer name must be at least 2 characters',
    'string.max': 'Customer name must be at most 100 characters',
    'any.required': 'Customer name is required',
  }),
  customerPhone: Joi.string()
    .trim()
    .pattern(/^[0-9+\-() ]{7,20}$/)
    .required()
    .messages({
      'string.empty': 'Customer phone is required',
      'string.pattern.base': 'Please enter a valid phone number',
      'any.required': 'Customer phone is required',
    }),
  startDate: Joi.date().iso().min('now').required().messages({
    'date.base': 'Start date must be a valid date',
    'date.min': 'Start date cannot be in the past',
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
    .valid('pending', 'approved', 'cancelled')
    .required()
    .messages({
      'any.only': 'Status must be one of: pending, approved, cancelled',
      'any.required': 'Status is required',
    }),
});

module.exports = { createReservationSchema, updateStatusSchema };
