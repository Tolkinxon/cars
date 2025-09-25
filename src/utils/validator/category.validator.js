import Joi from 'joi';

const name = Joi.string().trim().required().messages({
    "string.base": "Category name must be a string",
    "string.empty": "Category name cannot be empty",
    "any.required": "Category name is required"
  });

let categorySchema = Joi.object({ name });

export { categorySchema };
