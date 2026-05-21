/**
 * User Validation Schemas
 * Joi schemas for validating user request data
 */
const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().trim().alphanum().min(2).max(30).required().messages({
    'string.empty': 'Username is required',
    'string.alphanum': 'Username must only contain letters and numbers',
    'string.min': 'Username must be at least 2 characters',
    'string.max': 'Username must be at most 30 characters',
    'any.required': 'Username is required',
  }),
  name: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must be at most 50 characters',
    'any.required': 'Name is required',
  }),
  email: Joi.string().trim().email().allow('', null).optional().messages({
    'string.email': 'Please enter a valid email address',
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
  email: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Username or email is required',
    'any.required': 'Username or email is required',
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
  username: Joi.string().trim().alphanum().min(2).max(30).required().messages({
    'string.empty': 'Username is required',
    'string.alphanum': 'Username must only contain letters and numbers',
    'string.min': 'Username must be at least 2 characters',
    'string.max': 'Username must be at most 30 characters',
    'any.required': 'Username is required',
  }),
  name: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must be at most 50 characters',
    'any.required': 'Name is required',
  }),
  email: Joi.string().trim().email().allow('', null).optional().messages({
    'string.email': 'Please enter a valid email address',
  }),
  password: Joi.string().min(4).max(100).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 4 characters',
    'string.max': 'Password must be at most 100 characters',
    'any.required': 'Password is required',
  }),
});

const updateUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must be at most 50 characters',
  }),
  email: Joi.string().trim().email().allow('', null).messages({
    'string.email': 'Please enter a valid email address',
  }),
  phone: Joi.string().trim().pattern(/^[0-9+\-() ]{7,20}$/).allow('', null).optional().messages({
    'string.pattern.base': 'Please enter a valid phone number',
  }),
  balance: Joi.number().min(0).precision(2).messages({
    'number.base': 'Balance must be a number',
    'number.min': 'Balance cannot be negative',
  }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

module.exports = { registerSchema, loginSchema, addBalanceSchema, createAdminSchema, updateUserSchema };
