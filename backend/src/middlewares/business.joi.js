const joi = require('joi');

const businessSchema = joi.object({
    name: joi.string().min(1).max(100).required(),
    description: joi.string().max(1000).allow('', null),
    type: joi.string().valid('sole_proprietorship', 'partnership', 'corporation', 'llc', 'other'),
    registrationNumber: joi.string().max(100).allow('', null),
    taxId: joi.string().max(100).allow('', null),
    address: joi.object({
        street: joi.string().max(200).allow('', null),
        city: joi.string().max(100).allow('', null),
        state: joi.string().max(100).allow('', null),
        zipCode: joi.string().max(20).allow('', null),
        country: joi.string().max(100).allow('', null),
    }),
    contact: joi.object({
        email: joi.string().email().allow('', null),
        phone: joi.string().max(20).allow('', null),
        website: joi.string().max(200).allow('', null),
    }),
    startDate: joi.date().allow(null),
    status: joi.string().valid('active', 'inactive', 'suspended', 'closed'),
});

const updateBusinessSchema = joi.object({
    name: joi.string().min(1).max(100),
    description: joi.string().max(1000).allow('', null),
    type: joi.string().valid('sole_proprietorship', 'partnership', 'corporation', 'llc', 'other'),
    registrationNumber: joi.string().max(100).allow('', null),
    taxId: joi.string().max(100).allow('', null),
    address: joi.object({
        street: joi.string().max(200).allow('', null),
        city: joi.string().max(100).allow('', null),
        state: joi.string().max(100).allow('', null),
        zipCode: joi.string().max(20).allow('', null),
        country: joi.string().max(100).allow('', null),
    }),
    contact: joi.object({
        email: joi.string().email().allow('', null),
        phone: joi.string().max(20).allow('', null),
        website: joi.string().max(200).allow('', null),
    }),
    startDate: joi.date().allow(null),
    status: joi.string().valid('active', 'inactive', 'suspended', 'closed'),
});

module.exports = { businessSchema, updateBusinessSchema };
