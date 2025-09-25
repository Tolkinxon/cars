import Joi from 'joi';
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const email = Joi.string().trim().pattern(emailPattern).email().required().messages({
    "string.base": "Email must be a string", 
    "string.empty": "Email cannot be empty",
    "string.email": "Email must be a valid email", 
    "string.pattern.base": "Email is invalid",
    "any.required": "Email is required"
});

const otp = Joi.string().length(6).pattern(/^[0-9]+$/).required().messages({
        "string.base": "OTP must be a string",
        "string.length": "OTP must be exactly 6 digits", 
        "string.pattern.base": "OTP must contain only digits", 
        "any.required": "OTP is required"
    });

export const otpSchema= Joi.object({ email, otp });
export const resendSchema = Joi.object({ email }); 

