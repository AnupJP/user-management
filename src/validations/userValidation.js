const Joi = require('joi');

const createUserSchema = Joi.object({
  username: Joi.string().min(3).required().messages({
    'string.min': 'Username must be at least 3 characters.',
    'any.required': 'Username is required.'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format.',
    'any.required': 'Email is required.'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters.',
    'any.required': 'Password is required.'
  }),
  mobile_no: Joi.string().pattern(/^[0-9]{10}$/).optional().messages({
    'string.pattern.base': 'Mobile number must be a valid 10-digit number.'
  }),
  role: Joi.string().valid('admin', 'user').optional()
});

const updateUserSchema = Joi.object({
  username: Joi.string().min(3),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  mobile_no: Joi.string().pattern(/^[0-9]{10}$/),
  role: Joi.string().valid('admin', 'user')
}).or('username', 'email', 'password', 'mobile_no', 'role').messages({
  'object.missing': 'At least one field should be updated.'
});

const userIdSchema = Joi.object({
    id: Joi.number().integer().positive().required().messages({
      'number.base': 'User ID must be a valid number.',
      'any.required': 'User ID is required.'
    })
  }).unknown(true);

module.exports = {
  createUserSchema,
  updateUserSchema,
  userIdSchema
};
