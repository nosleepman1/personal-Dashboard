const joi = require('joi');

const userSchema = joi.object({
    firstname: joi.string().min(2).max(30).required(),
    lastname: joi.string().min(2).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
});

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
});

module.exports = { userSchema, loginSchema };
