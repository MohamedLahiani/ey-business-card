import Joi from 'joi';

export const createBusinessCardSchema = Joi.object({
  first_name: Joi.string().min(1).required(),
  last_name: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  mobile: Joi.string().min(10).required(),
  job_title: Joi.string().min(1).required(),
  department: Joi.string().min(1).required()
});

export const updateBusinessCardSchema = Joi.object({
  mobile: Joi.string().min(10).optional(),
  job_title: Joi.string().min(1).optional(),
  department: Joi.string().min(1).optional()
});
