/**
 * Validation middleware
 * 
 * Provides request validation using Joi schemas
 */

const Joi = require('joi');

/**
 * Validates request data against a Joi schema
 * @param {Object} schema - Joi validation schema
 * @param {string} property - Request property to validate ('body', 'query', 'params')
 * @returns {Function} Express middleware function
 */
const validate = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    
    if (!error) {
      next();
    } else {
      const { details } = error;
      const message = details.map(detail => detail.message).join(', ');
      
      res.status(400).json({
        error: message
      });
    }
  };
};

// Schema for creating/updating a bill
const billSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('', null),
  due_date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
  paid: Joi.boolean().default(false),
  items: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      description: Joi.string().allow('', null),
      amount: Joi.number().required().min(0),
      quantity: Joi.number().integer().min(1).default(1)
    })
  )
});

// Schema for ID parameter validation
const idParamSchema = Joi.object({
  id: Joi.number().integer().required()
});

module.exports = {
  validate,
  schemas: {
    billSchema,
    idParamSchema
  }
};