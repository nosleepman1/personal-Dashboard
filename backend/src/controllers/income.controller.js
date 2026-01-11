const Income = require('../models/Income.model');

const createIncome = async (req, res) => {
    try {
        const income = new Income({
            ...req.body,
            user: req.user._id
        });
        await income.save();

        res.status(201).json({ message: 'Income created successfully', income });
    } catch (err) {
        console.error('Create income error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getIncomes = async (req, res) => {
    try {
        const { category, startDate, endDate, source } = req.query;
        const filter = { user: req.user._id };
        
        if (category) filter.category = category;
        if (source) filter.source = source;
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        const incomes = await Income.find(filter).sort({ date: -1 });
        const total = incomes.reduce((sum, inc) => sum + inc.amount, 0);
        
        res.json({ incomes, total, count: incomes.length });
    } catch (err) {
        console.error('Get incomes error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getIncomeById = async (req, res) => {
    try {
        const income = await Income.findOne({ _id: req.params.id, user: req.user._id });
        if (!income) {
            return res.status(404).json({ error: 'Income not found' });
        }
        res.json({ income });
    } catch (err) {
        console.error('Get income error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateIncome = async (req, res) => {
    try {
        const income = await Income.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!income) {
            return res.status(404).json({ error: 'Income not found' });
        }

        res.json({ message: 'Income updated successfully', income });
    } catch (err) {
        console.error('Update income error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteIncome = async (req, res) => {
    try {
        const income = await Income.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!income) {
            return res.status(404).json({ error: 'Income not found' });
        }
        res.json({ message: 'Income deleted successfully' });
    } catch (err) {
        console.error('Delete income error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { createIncome, getIncomes, getIncomeById, updateIncome, deleteIncome };
