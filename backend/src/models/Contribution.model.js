const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    amount: { type: Number, required: true, min: 0 },
    category: {
        type: String,
        enum: ['investment', 'savings', 'loan', 'donation', 'subscription', 'other'],
        default: 'other'
    },
    date: { type: Date, default: Date.now },
    recipient: { type: String, trim: true },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    recurring: { type: Boolean, default: false },
    recurringFrequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
    },
}, {
    timestamps: true
});

const Contribution = mongoose.model('Contribution', contributionSchema);
module.exports = Contribution;
