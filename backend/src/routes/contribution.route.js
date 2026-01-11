const express = require('express');
const router = express.Router();
const { createContribution, getContributions, getContributionById, updateContribution, deleteContribution } = require('../controllers/contribution.controller');
const authenticate = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { contributionSchema, updateContributionSchema } = require('../middlewares/contribution.joi');

router.post('/', authenticate, validate(contributionSchema), createContribution);
router.get('/', authenticate, getContributions);
router.get('/:id', authenticate, getContributionById);
router.put('/:id', authenticate, validate(updateContributionSchema), updateContribution);
router.delete('/:id', authenticate, deleteContribution);

module.exports = router;
