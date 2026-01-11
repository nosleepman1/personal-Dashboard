const express = require('express');
const router = express.Router();
const { createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense } = require('../controllers/expense.controller');
const authenticate = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { expenseSchema, updateExpenseSchema } = require('../middlewares/expense.joi');

router.post('/', authenticate, validate(expenseSchema), createExpense);
router.get('/', authenticate, getExpenses);
router.get('/:id', authenticate, getExpenseById);
router.put('/:id', authenticate, validate(updateExpenseSchema), updateExpense);
router.delete('/:id', authenticate, deleteExpense);

module.exports = router;
