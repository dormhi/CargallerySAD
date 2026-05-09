/**
 * Category Validation Schemas
 * Joi schemas for validating category request data
 */
const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'Category name is required',
    'string.min': 'Category name must be at least 2 characters',
    'string.max': 'Category name must be at most 50 characters',
    'any.required': 'Category name is required',
  }),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'Category name is required',
    'string.min': 'Category name must be at least 2 characters',
    'string.max': 'Category name must be at most 50 characters',
    'any.required': 'Category name is required',
  }),
});

module.exports = { createCategorySchema, updateCategorySchema };
