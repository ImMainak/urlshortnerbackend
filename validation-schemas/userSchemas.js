import JoiBase from 'joi';
import JoiDate from '@hapi/joi-date';
const Joi = JoiBase.extend(JoiDate); // extend Joi with Joi Date

// Create User Schema
export const userCreateSchema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    confirm_password: Joi.string().valid(Joi.ref('password')).required()
        .messages({
            'any.only': `"Confirm Password" should match with "Password"`
        }),
}).with('password', 'confirm_password');

// Login User Schema
export const userLoginSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
});

// Reset User Password Schema
export const userPasswordResetSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
});