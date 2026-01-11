const joi = require('joi');

const contributionSchema = joi.object({
    title: joi.string().min(1).max(100).required(),
    description: joi.string().max(500).allow('', null),
    amount: joi.number().min(0).required(),
    category: joi.string().valid('investment', 'savings', 'loan', 'donation', 'subscription', 'other'),
    date: joi.date(),
    recipient: joi.string().max(100).allow('', null),
    status: joi.string().valid('pending', 'completed', 'cancelled'),
    recurring: joi.boolean(),
    recurringFrequency: joi.string().valid('daily', 'weekly', 'monthly', 'yearly').when('recurring', {
        is: true,
        then: joi.required(),
        otherwise: joi.allow(null, '')
    }),
});

const updateContributionSchema = joi.object({
    title: joi.string().min(1).max(100),
    description: joi.string().max(500).allow('', null),
    amount: joi.number().min(0),
    category: joi.string().valid('investment', 'savings', 'loan', 'donation', 'subscription', 'other'),
    date: joi.date(),
    recipient: joi.string().max(100).allow('', null),
    status: joi.string().valid('pending', 'completed', 'cancelled'),
    recurring: joi.boolean(),
    recurringFrequency: joi.string().valid('daily', 'weekly', 'monthly', 'yearly'),
});

module.exports = { contributionSchema, updateContributionSchema };
