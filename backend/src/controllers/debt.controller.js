const Debt = require('../models/Debt.model');

const createDebt = async (req, res) => {
    try {
        const debt = new Debt({
            ...req.body,
            user: req.user._id
        });
        await debt.save();

        res.status(201).json({ message: 'Debt created successfully', debt });
    } catch (err) {
        console.error('Create debt error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getDebts = async (req, res) => {
    try {
        const { status, category } = req.query;
        const filter = { user: req.user._id };
        
        if (status) filter.status = status;
        if (category) filter.category = category;

        const debts = await Debt.find(filter).sort({ createdAt: -1 });
        res.json({ debts });
    } catch (err) {
        console.error('Get debts error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getDebtById = async (req, res) => {
    try {
        const debt = await Debt.findOne({ _id: req.params.id, user: req.user._id });
        if (!debt) {
            return res.status(404).json({ error: 'Debt not found' });
        }
        res.json({ debt });
    } catch (err) {
        console.error('Get debt error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateDebt = async (req, res) => {
    try {
        const debt = await Debt.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!debt) {
            return res.status(404).json({ error: 'Debt not found' });
        }

        res.json({ message: 'Debt updated successfully', debt });
    } catch (err) {
        console.error('Update debt error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteDebt = async (req, res) => {
    try {
        const debt = await Debt.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!debt) {
            return res.status(404).json({ error: 'Debt not found' });
        }
        res.json({ message: 'Debt deleted successfully' });
    } catch (err) {
        console.error('Delete debt error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { createDebt, getDebts, getDebtById, updateDebt, deleteDebt };
