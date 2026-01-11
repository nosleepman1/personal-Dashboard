const joi = require('joi');

const expenseSchema = joi.object({
    title: joi.string().min(1).max(100).required(),
    description: joi.string().max(500).allow('', null),
    amount: joi.number().min(0).required(),
    category: joi.string().valid('food', 'transport', 'housing', 'entertainment', 'health', 'shopping', 'bills', 'education', 'other'),
    date: joi.date(),
    paymentMethod: joi.string().valid('cash', 'card', 'bank_transfer', 'mobile_payment', 'other'),
    recurring: joi.boolean(),
    recurringFrequency: joi.string().valid('daily', 'weekly', 'monthly', 'yearly').when('recurring', {
        is: true,
        then: joi.required(),
        otherwise: joi.allow(null, '')
    }),
});

const updateExpenseSchema = joi.object({
    title: joi.string().min(1).max(100),
    description: joi.string().max(500).allow('', null),
    amount: joi.number().min(0),
    category: joi.string().valid('food', 'transport', 'housing', 'entertainment', 'health', 'shopping', 'bills', 'education', 'other'),
    date: joi.date(),
    paymentMethod: joi.string().valid('cash', 'card', 'bank_transfer', 'mobile_payment', 'other'),
    recurring: joi.boolean(),
    recurringFrequency: joi.string().valid('daily', 'weekly', 'monthly', 'yearly'),
});

module.exports = { expenseSchema, updateExpenseSchema };
