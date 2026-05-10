/**
 * Vehicle Validation Schemas
 * Joi schemas for validating vehicle request data
 */
const Joi = require('joi');

const currentYear = new Date().getFullYear();

const createVehicleSchema = Joi.object({
  brand: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'Brand is required',
    'string.min': 'Brand must be at least 2 characters',
    'string.max': 'Brand must be at most 50 characters',
    'any.required': 'Brand is required',
  }),
  model: Joi.string().trim().min(1).max(50).required().messages({
    'string.empty': 'Model is required',
    'string.min': 'Model must be at least 1 character',
    'string.max': 'Model must be at most 50 characters',
    'any.required': 'Model is required',
  }),
  year: Joi.number().integer().min(1990).max(currentYear + 1).required().messages({
    'number.base': 'Year must be a number',
    'number.min': 'Year must be at least 1990',
    'number.max': `Year must be at most ${currentYear + 1}`,
    'any.required': 'Year is required',
  }),
  pricePerDay: Joi.number().positive().precision(2).required().messages({
    'number.base': 'Price per day must be a number',
    'number.positive': 'Price per day must be greater than 0',
    'any.required': 'Price per day is required',
  }),
  fuelType: Joi.string().valid('Gasoline', 'Diesel', 'Electric', 'Hybrid').required().messages({
    'any.only': 'Fuel type must be one of: Gasoline, Diesel, Electric, Hybrid',
    'any.required': 'Fuel type is required',
  }),
  transmission: Joi.string().valid('Automatic', 'Manual').required().messages({
    'any.only': 'Transmission must be one of: Automatic, Manual',
    'any.required': 'Transmission is required',
  }),
  mileage: Joi.number().integer().min(0).required().messages({
    'number.base': 'Mileage must be a number',
    'number.min': 'Mileage cannot be negative',
    'any.required': 'Mileage is required',
  }),
  imageUrl: Joi.string().uri().allow('', null).optional().messages({
    'string.uri': 'Image URL must be a valid URL',
  }),
  available: Joi.boolean().optional(),
  categoryId: Joi.number().integer().positive().required().messages({
    'number.base': 'Category ID must be a number',
    'number.positive': 'Category ID must be a positive number',
    'any.required': 'Category ID is required',
  }),
});

const updateVehicleSchema = Joi.object({
  brand: Joi.string().trim().min(2).max(50).messages({
    'string.min': 'Brand must be at least 2 characters',
    'string.max': 'Brand must be at most 50 characters',
  }),
  model: Joi.string().trim().min(1).max(50).messages({
    'string.min': 'Model must be at least 1 character',
    'string.max': 'Model must be at most 50 characters',
  }),
  year: Joi.number().integer().min(1990).max(currentYear + 1).messages({
    'number.min': 'Year must be at least 1990',
    'number.max': `Year must be at most ${currentYear + 1}`,
  }),
  pricePerDay: Joi.number().positive().precision(2).messages({
    'number.positive': 'Price per day must be greater than 0',
  }),
  fuelType: Joi.string().valid('Gasoline', 'Diesel', 'Electric', 'Hybrid').messages({
    'any.only': 'Fuel type must be one of: Gasoline, Diesel, Electric, Hybrid',
  }),
  transmission: Joi.string().valid('Automatic', 'Manual').messages({
    'any.only': 'Transmission must be one of: Automatic, Manual',
  }),
  mileage: Joi.number().integer().min(0).messages({
    'number.min': 'Mileage cannot be negative',
  }),
  imageUrl: Joi.string().uri().allow('', null).optional().messages({
    'string.uri': 'Image URL must be a valid URL',
  }),
  available: Joi.boolean(),
  categoryId: Joi.number().integer().positive().messages({
    'number.positive': 'Category ID must be a positive number',
  }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

module.exports = { createVehicleSchema, updateVehicleSchema };
