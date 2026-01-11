const Expense = require('../models/Expense.model');

const createExpense = async (req, res) => {
    try {
        const expense = new Expense({
            ...req.body,
            user: req.user._id
        });
        await expense.save();

        res.status(201).json({ message: 'Expense created successfully', expense });
    } catch (err) {
        console.error('Create expense error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getExpenses = async (req, res) => {
    try {
        const { category, startDate, endDate, paymentMethod } = req.query;
        const filter = { user: req.user._id };
        
        if (category) filter.category = category;
        if (paymentMethod) filter.paymentMethod = paymentMethod;
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        const expenses = await Expense.find(filter).sort({ date: -1 });
        const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        
        res.json({ expenses, total, count: expenses.length });
    } catch (err) {
        console.error('Get expenses error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.json({ expense });
    } catch (err) {
        console.error('Get expense error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        res.json({ message: 'Expense updated successfully', expense });
    } catch (err) {
        console.error('Update expense error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.json({ message: 'Expense deleted successfully' });
    } catch (err) {
        console.error('Delete expense error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense };
