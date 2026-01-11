const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { userSchema, loginSchema } = require('../middlewares/user.joi');

router.post('/register', validate(userSchema), register);
router.post('/login', validate(loginSchema), login);

module.exports = router;
