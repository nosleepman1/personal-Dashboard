const BusinessTransaction = require('../models/BusinessTransaction.model');
const Business = require('../models/Business.model');

/**
 * After any mutation, recompute totalRevenue and totalExpenses on the parent Business.
 */
const recomputeBusinessTotals = async (businessId) => {
    const [revenueAgg, expenseAgg] = await Promise.all([
        BusinessTransaction.aggregate([
            { $match: { business: businessId, type: 'revenue' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        BusinessTransaction.aggregate([
            { $match: { business: businessId, type: 'expense' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
    ]);

    await Business.findByIdAndUpdate(businessId, {
        totalRevenue: revenueAgg[0]?.total ?? 0,
        totalExpenses: expenseAgg[0]?.total ?? 0,
    });
};

/* ─── CREATE ─────────────────────────────────────────────── */
const createTransaction = async (req, res) => {
    try {
        const business = await Business.findOne({ _id: req.params.businessId, user: req.user._id });
        if (!business) return res.status(404).json({ error: 'Business not found' });

        const transaction = new BusinessTransaction({
            ...req.body,
            business: business._id,
            user: req.user._id,
        });
        await transaction.save();
        await recomputeBusinessTotals(business._id);

        res.status(201).json({ message: 'Transaction created successfully', transaction });
    } catch (err) {
        console.error('Create transaction error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/* ─── GET ALL ─────────────────────────────────────────────── */
const getTransactions = async (req, res) => {
    try {
        const business = await Business.findOne({ _id: req.params.businessId, user: req.user._id });
        if (!business) return res.status(404).json({ error: 'Business not found' });

        const { type, category } = req.query;
        const filter = { business: business._id };
        if (type) filter.type = type;
        if (category) filter.category = category;

        const transactions = await BusinessTransaction.find(filter).sort({ date: -1 });
        const totalRevenue = transactions.filter(t => t.type === 'revenue').reduce((s, t) => s + t.amount, 0);
        const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

        res.json({ transactions, totalRevenue, totalExpenses, profit: totalRevenue - totalExpenses, count: transactions.length });
    } catch (err) {
        console.error('Get transactions error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/* ─── GET BY ID ───────────────────────────────────────────── */
const getTransactionById = async (req, res) => {
    try {
        const transaction = await BusinessTransaction.findOne({
            _id: req.params.id,
            user: req.user._id,
        });
        if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
        res.json({ transaction });
    } catch (err) {
        console.error('Get transaction error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/* ─── UPDATE ──────────────────────────────────────────────── */
const updateTransaction = async (req, res) => {
    try {
        const transaction = await BusinessTransaction.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!transaction) return res.status(404).json({ error: 'Transaction not found' });

        await recomputeBusinessTotals(transaction.business);
        res.json({ message: 'Transaction updated successfully', transaction });
    } catch (err) {
        console.error('Update transaction error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/* ─── DELETE ──────────────────────────────────────────────── */
const deleteTransaction = async (req, res) => {
    try {
        const transaction = await BusinessTransaction.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });
        if (!transaction) return res.status(404).json({ error: 'Transaction not found' });

        await recomputeBusinessTotals(transaction.business);
        res.json({ message: 'Transaction deleted successfully' });
    } catch (err) {
        console.error('Delete transaction error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
};
