const express = require('express');
const router = express.Router();
const { createBusiness, getBusinesses, getBusinessById, updateBusiness, deleteBusiness } = require('../controllers/business.controller');
const authenticate = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { businessSchema, updateBusinessSchema } = require('../middlewares/business.joi');

router.post('/', authenticate, validate(businessSchema), createBusiness);
router.get('/', authenticate, getBusinesses);
router.get('/:id', authenticate, getBusinessById);
router.put('/:id', authenticate, validate(updateBusinessSchema), updateBusiness);
router.delete('/:id', authenticate, deleteBusiness);

module.exports = router;
