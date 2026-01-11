const Business = require('../models/Business.model');

const createBusiness = async (req, res) => {
    try {
        const business = new Business({
            ...req.body,
            user: req.user._id
        });
        await business.save();

        res.status(201).json({ message: 'Business created successfully', business });
    } catch (err) {
        console.error('Create business error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getBusinesses = async (req, res) => {
    try {
        const { status, type } = req.query;
        const filter = { user: req.user._id };
        
        if (status) filter.status = status;
        if (type) filter.type = type;

        const businesses = await Business.find(filter).sort({ createdAt: -1 });
        res.json({ businesses });
    } catch (err) {
        console.error('Get businesses error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getBusinessById = async (req, res) => {
    try {
        const business = await Business.findOne({ _id: req.params.id, user: req.user._id });
        if (!business) {
            return res.status(404).json({ error: 'Business not found' });
        }
        res.json({ business });
    } catch (err) {
        console.error('Get business error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateBusiness = async (req, res) => {
    try {
        const business = await Business.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!business) {
            return res.status(404).json({ error: 'Business not found' });
        }

        res.json({ message: 'Business updated successfully', business });
    } catch (err) {
        console.error('Update business error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteBusiness = async (req, res) => {
    try {
        const business = await Business.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!business) {
            return res.status(404).json({ error: 'Business not found' });
        }
        res.json({ message: 'Business deleted successfully' });
    } catch (err) {
        console.error('Delete business error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { createBusiness, getBusinesses, getBusinessById, updateBusiness, deleteBusiness };
