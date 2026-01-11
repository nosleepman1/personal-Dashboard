const mongoose = require('mongoose');

const debtSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    amount: { type: Number, required: true, min: 0 },
    creditor: { type: String, trim: true },
    dueDate: { type: Date },
    status: { 
        type: String, 
        enum: ['pending', 'paid', 'overdue'], 
        default: 'pending' 
    },
    category: { type: String, trim: true },
}, {
    timestamps: true
});

const Debt = mongoose.model('Debt', debtSchema);
module.exports = Debt;
