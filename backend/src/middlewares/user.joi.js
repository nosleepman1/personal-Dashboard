const joi = require('joi');

const userSchema = joi.object({
    firstname: joi.string().min(2).max(30).required(),
    lastname: joi.string().min(2).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
});

module.exports = userSchema;