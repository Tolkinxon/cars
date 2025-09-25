import Joi  from 'joi';

const first_name = Joi.string().trim().required().messages({
    "string.base": "First name must be a string",
    "string.empty": "First name cannot be empty", 
    "any.required": "First name is required"
});

const last_name = Joi.string().trim().required().messages({
    "string.base": "Last name must be a string",
    "string.empty": "Last name cannot be empty", 
    "any.required": "Last name is required"
});

const phone = Joi.string().trim().pattern(/^\+9989[012345789][0-9]{7}$/).required().messages({
  "string.base": "Phone must be a string",
  "string.empty": "Phone cannot be empty",
  "string.pattern.base": "Phone number is invalid",
  "any.required": "Phone number is required"
});

const email = Joi.string().trim().email().required().messages({
    "string.base": "Email must be a string", 
    "string.empty": "Email cannot be empty",
    "string.email": "Email must be a valid email", 
    "any.required": "Email is required"
});


const password = Joi.string().trim().min(5).required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password cannot be empty",
    "string.min": "Password must be at least 6 characters long", 
    "any.required": "Password is required"
});

const role = Joi.string().valid("user", "admin").default("user").messages({
        "string.base": "Role must be a string",
        "any.only": "Role must be either 'user' or 'admin'"
    });

const isVerified = Joi.boolean().default(false).messages({
    "boolean.base": "isVerified must be a boolean"
});

export const userSchema = Joi.object({
    first_name,
    last_name,
    phone,
    email,
    password,
    role,
    isVerified
})


export const changePasswordSchema = Joi.object({ 
    email,
    new_password: password
})

export const loginSchema = Joi.object({
    email, password
})

export const createUserSchema = (data) => {
    const schemaFields = {};
    if ("first_name" in data) schemaFields.first_name = first_name; 
    if ("last_name" in data) schemaFields.last_name = last_name;
    if ("phone" in data) schemaFields.phone = phone;
    if ("email" in data) schemaFields.email = email;
    if ("password" in data) schemaFields.password = password;
    if ("role" in data) schemaFields. role = role;
    if ("isVerified" in data) schemaFields.isVerified = isVerified;
    return Joi.object(schemaFields);
};