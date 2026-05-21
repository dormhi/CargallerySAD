/**
 * User Validation Schemas
 * Joi schemas for validating user request data
 */
const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must be at most 50 characters',
    'any.required': 'Name is required',
  }),
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required',
  }),
  phone: Joi.string()
    .trim()
    .pattern(/^[0-9+\-() ]{7,20}$/)
    .allow('', null)
    .optional()
    .messages({
      'string.pattern.base': 'Please enter a valid phone number',
    }),
  password: Joi.string().min(4).max(100).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 4 characters',
    'string.max': 'Password must be at most 100 characters',
    'any.required': 'Password is required',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
    'any.required': 'Password is required',
  }),
});

const addBalanceSchema = Joi.object({
  amount: Joi.number().positive().precision(2).required().messages({
    'number.base': 'Amount must be a number',
    'number.positive': 'Amount must be greater than 0',
    'any.required': 'Amount is required',
  }),
});

const createAdminSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must be at most 50 characters',
    'any.required': 'Name is required',
  }),
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(4).max(100).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 4 characters',
    'string.max': 'Password must be at most 100 characters',
    'any.required': 'Password is required',
  }),
});

module.exports = { registerSchema, loginSchema, addBalanceSchema, createAdminSchema };
