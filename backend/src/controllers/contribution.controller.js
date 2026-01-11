const Contribution = require('../models/Contribution.model');

const createContribution = async (req, res) => {
    try {
        const contribution = new Contribution({
            ...req.body,
            user: req.user._id
        });
        await contribution.save();

        res.status(201).json({ message: 'Contribution created successfully', contribution });
    } catch (err) {
        console.error('Create contribution error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getContributions = async (req, res) => {
    try {
        const { category, status, startDate, endDate } = req.query;
        const filter = { user: req.user._id };
        
        if (category) filter.category = category;
        if (status) filter.status = status;
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        const contributions = await Contribution.find(filter).sort({ date: -1 });
        const total = contributions.reduce((sum, cont) => sum + cont.amount, 0);
        
        res.json({ contributions, total, count: contributions.length });
    } catch (err) {
        console.error('Get contributions error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getContributionById = async (req, res) => {
    try {
        const contribution = await Contribution.findOne({ _id: req.params.id, user: req.user._id });
        if (!contribution) {
            return res.status(404).json({ error: 'Contribution not found' });
        }
        res.json({ contribution });
    } catch (err) {
        console.error('Get contribution error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateContribution = async (req, res) => {
    try {
        const contribution = await Contribution.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!contribution) {
            return res.status(404).json({ error: 'Contribution not found' });
        }

        res.json({ message: 'Contribution updated successfully', contribution });
    } catch (err) {
        console.error('Update contribution error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteContribution = async (req, res) => {
    try {
        const contribution = await Contribution.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!contribution) {
            return res.status(404).json({ error: 'Contribution not found' });
        }
        res.json({ message: 'Contribution deleted successfully' });
    } catch (err) {
        console.error('Delete contribution error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { createContribution, getContributions, getContributionById, updateContribution, deleteContribution };
