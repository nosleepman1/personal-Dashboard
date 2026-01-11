const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    type: {
        type: String,
        enum: ['sole_proprietorship', 'partnership', 'corporation', 'llc', 'other'],
        default: 'other'
    },
    registrationNumber: { type: String, trim: true },
    taxId: { type: String, trim: true },
    address: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        zipCode: { type: String, trim: true },
        country: { type: String, trim: true },
    },
    contact: {
        email: { type: String, trim: true, lowercase: true },
        phone: { type: String, trim: true },
        website: { type: String, trim: true },
    },
    startDate: { type: Date },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended', 'closed'],
        default: 'active'
    },
    totalRevenue: { type: Number, default: 0, min: 0 },
    totalExpenses: { type: Number, default: 0, min: 0 },
}, {
    timestamps: true
});

const Business = mongoose.model('Business', businessSchema);
module.exports = Business;
