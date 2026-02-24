const mongoose = require('mongoose');

const businessTransactionSchema = new mongoose.Schema({
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: ['revenue', 'expense'],
        required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    amount: { type: Number, required: true, min: 0.01 },
    category: { type: String, trim: true },
    date: { type: Date, default: Date.now },
}, {
    timestamps: true,
});

const BusinessTransaction = mongoose.model('BusinessTransaction', businessTransactionSchema);
module.exports = BusinessTransaction;
