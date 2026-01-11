const joi = require('joi');

const debtSchema = joi.object({
    title: joi.string().min(1).max(100).required(),
    description: joi.string().max(500).allow('', null),
    amount: joi.number().min(0).required(),
    creditor: joi.string().max(100).allow('', null),
    dueDate: joi.date().allow(null),
    status: joi.string().valid('pending', 'paid', 'overdue'),
    category: joi.string().max(50).allow('', null),
});

const updateDebtSchema = joi.object({
    title: joi.string().min(1).max(100),
    description: joi.string().max(500).allow('', null),
    amount: joi.number().min(0),
    creditor: joi.string().max(100).allow('', null),
    dueDate: joi.date().allow(null),
    status: joi.string().valid('pending', 'paid', 'overdue'),
    category: joi.string().max(50).allow('', null),
});

module.exports = { debtSchema, updateDebtSchema };
