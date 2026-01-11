const joi = require('joi');

const incomeSchema = joi.object({
    title: joi.string().min(1).max(100).required(),
    description: joi.string().max(500).allow('', null),
    amount: joi.number().min(0).required(),
    category: joi.string().valid('salary', 'freelance', 'investment', 'rental', 'bonus', 'gift', 'other'),
    date: joi.date(),
    source: joi.string().max(100).allow('', null),
    recurring: joi.boolean(),
    recurringFrequency: joi.string().valid('daily', 'weekly', 'monthly', 'yearly').when('recurring', {
        is: true,
        then: joi.required(),
        otherwise: joi.allow(null, '')
    }),
});

const updateIncomeSchema = joi.object({
    title: joi.string().min(1).max(100),
    description: joi.string().max(500).allow('', null),
    amount: joi.number().min(0),
    category: joi.string().valid('salary', 'freelance', 'investment', 'rental', 'bonus', 'gift', 'other'),
    date: joi.date(),
    source: joi.string().max(100).allow('', null),
    recurring: joi.boolean(),
    recurringFrequency: joi.string().valid('daily', 'weekly', 'monthly', 'yearly'),
});

module.exports = { incomeSchema, updateIncomeSchema };
