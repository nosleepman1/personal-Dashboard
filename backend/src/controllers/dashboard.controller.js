const Debt = require('../models/Debt.model');
const Expense = require('../models/Expense.model');
const Income = require('../models/Income.model');
const Business = require('../models/Business.model');
const Contribution = require('../models/Contribution.model');

const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const { startDate, endDate } = req.query;
        
        const dateFilter = {};
        if (startDate || endDate) {
            dateFilter.date = {};
            if (startDate) dateFilter.date.$gte = new Date(startDate);
            if (endDate) dateFilter.date.$lte = new Date(endDate);
        }

        // Get all data
        const [debts, expenses, incomes, businesses, contributions] = await Promise.all([
            Debt.find({ user: userId }),
            Expense.find({ user: userId, ...dateFilter }),
            Income.find({ user: userId, ...dateFilter }),
            Business.find({ user: userId }),
            Contribution.find({ user: userId, ...dateFilter })
        ]);

        // Calculate totals
        const totalDebts = debts.reduce((sum, debt) => {
            return debt.status === 'paid' ? sum : sum + debt.amount;
        }, 0);
        const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const totalIncomes = incomes.reduce((sum, inc) => sum + inc.amount, 0);
        const totalContributions = contributions.reduce((sum, cont) => sum + cont.amount, 0);
        
        // Business totals
        const businessStats = businesses.map(business => ({
            id: business._id,
            name: business.name,
            revenue: business.totalRevenue,
            expenses: business.totalExpenses,
            profit: business.totalRevenue - business.totalExpenses
        }));
        const totalBusinessRevenue = businesses.reduce((sum, biz) => sum + biz.totalRevenue, 0);
        const totalBusinessExpenses = businesses.reduce((sum, biz) => sum + biz.totalExpenses, 0);

        // Net balance
        const netBalance = totalIncomes - totalExpenses - totalContributions;

        // Statistics by category
        const expensesByCategory = {};
        expenses.forEach(exp => {
            expensesByCategory[exp.category] = (expensesByCategory[exp.category] || 0) + exp.amount;
        });

        const incomesByCategory = {};
        incomes.forEach(inc => {
            incomesByCategory[inc.category] = (incomesByCategory[inc.category] || 0) + inc.amount;
        });

        // Status counts
        const debtStatusCounts = {
            pending: debts.filter(d => d.status === 'pending').length,
            paid: debts.filter(d => d.status === 'paid').length,
            overdue: debts.filter(d => d.status === 'overdue').length
        };

        res.json({
            summary: {
                totalDebts,
                totalExpenses,
                totalIncomes,
                totalContributions,
                netBalance,
                totalBusinessRevenue,
                totalBusinessExpenses,
                totalBusinessProfit: totalBusinessRevenue - totalBusinessExpenses
            },
            counts: {
                debts: debts.length,
                expenses: expenses.length,
                incomes: incomes.length,
                businesses: businesses.length,
                contributions: contributions.length
            },
            debts: {
                total: debts.length,
                byStatus: debtStatusCounts,
                recent: debts.slice(0, 5).map(d => ({
                    id: d._id,
                    title: d.title,
                    amount: d.amount,
                    status: d.status,
                    dueDate: d.dueDate
                }))
            },
            expenses: {
                total: totalExpenses,
                byCategory: expensesByCategory,
                recent: expenses.slice(0, 5).map(e => ({
                    id: e._id,
                    title: e.title,
                    amount: e.amount,
                    category: e.category,
                    date: e.date
                }))
            },
            incomes: {
                total: totalIncomes,
                byCategory: incomesByCategory,
                recent: incomes.slice(0, 5).map(i => ({
                    id: i._id,
                    title: i.title,
                    amount: i.amount,
                    category: i.category,
                    date: i.date
                }))
            },
            businesses: businessStats,
            contributions: {
                total: totalContributions,
                recent: contributions.slice(0, 5).map(c => ({
                    id: c._id,
                    title: c.title,
                    amount: c.amount,
                    category: c.category,
                    status: c.status
                }))
            }
        });
    } catch (err) {
        console.error('Get dashboard stats error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getDashboardStats };
