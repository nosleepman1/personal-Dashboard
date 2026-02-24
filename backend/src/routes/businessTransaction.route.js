const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams allows access to :businessId
const {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
} = require('../controllers/businessTransaction.controller');
const authenticate = require('../middlewares/auth.middleware');

router.post('/', authenticate, createTransaction);
router.get('/', authenticate, getTransactions);
router.get('/:id', authenticate, getTransactionById);
router.put('/:id', authenticate, updateTransaction);
router.delete('/:id', authenticate, deleteTransaction);

module.exports = router;
