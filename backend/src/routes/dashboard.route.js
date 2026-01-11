const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboard.controller');
const authenticate = require('../middlewares/auth.middleware');

router.get('/', authenticate, getDashboardStats);

module.exports = router;
