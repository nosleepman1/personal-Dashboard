const express = require('express');
const router = express.Router();
const { createIncome, getIncomes, getIncomeById, updateIncome, deleteIncome } = require('../controllers/income.controller');
const authenticate = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { incomeSchema, updateIncomeSchema } = require('../middlewares/income.joi');

router.post('/', authenticate, validate(incomeSchema), createIncome);
router.get('/', authenticate, getIncomes);
router.get('/:id', authenticate, getIncomeById);
router.put('/:id', authenticate, validate(updateIncomeSchema), updateIncome);
router.delete('/:id', authenticate, deleteIncome);

module.exports = router;
