const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    amount: { type: Number, required: true, min: 0 },
    category: { 
        type: String, 
        enum: ['food', 'transport', 'housing', 'entertainment', 'health', 'shopping', 'bills', 'education', 'other'],
        default: 'other'
    },
    date: { type: Date, default: Date.now },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'bank_transfer', 'mobile_payment', 'other'],
        default: 'other'
    },
    recurring: { type: Boolean, default: false },
    recurringFrequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
    },
}, {
    timestamps: true
});

const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;
