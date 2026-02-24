const express = require('express');
const router = express.Router();
const { register, login, refresh, logout } = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { userSchema, loginSchema } = require('../middlewares/user.joi');

// Enregistrement et connexion ne nécessitent pas d'être authentifié
router.post('/register', validate(userSchema), register);
router.post('/login', validate(loginSchema), login);

// Rafraîchissement du token d'accès à partir du refresh token httpOnly
router.post('/refresh', refresh);

// Déconnexion: supprime le cookie contenant le refresh token
router.post('/logout', logout);

module.exports = router;
