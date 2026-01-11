const express = require('express');
const router = express.Router();
const { createDebt, getDebts, getDebtById, updateDebt, deleteDebt } = require('../controllers/debt.controller');
const authenticate = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { debtSchema, updateDebtSchema } = require('../middlewares/debt.joi');

router.post('/', authenticate, validate(debtSchema), createDebt);
router.get('/', authenticate, getDebts);
router.get('/:id', authenticate, getDebtById);
router.put('/:id', authenticate, validate(updateDebtSchema), updateDebt);
router.delete('/:id', authenticate, deleteDebt);

module.exports = router;
