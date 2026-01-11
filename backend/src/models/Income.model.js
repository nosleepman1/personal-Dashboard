const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    amount: { type: Number, required: true, min: 0 },
    category: { 
        type: String, 
        enum: ['salary', 'freelance', 'investment', 'rental', 'bonus', 'gift', 'other'],
        default: 'other'
    },
    date: { type: Date, default: Date.now },
    source: { type: String, trim: true },
    recurring: { type: Boolean, default: false },
    recurringFrequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
    },
}, {
    timestamps: true
});

const Income = mongoose.model('Income', incomeSchema);
module.exports = Income;
