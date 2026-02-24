const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

// Durées de vie des tokens
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

// Récupération des secrets depuis les variables d'environnement
const getAccessTokenSecret = () => {
    if (!process.env.JWT_ACCESS_SECRET) {
        // On évite de démarrer sans secret pour des raisons de sécurité
        throw new Error('JWT_ACCESS_SECRET manquant dans les variables d\'environnement');
    }
    return process.env.JWT_ACCESS_SECRET;
};

const getRefreshTokenSecret = () => {
    if (!process.env.JWT_REFRESH_SECRET) {
        throw new Error('JWT_REFRESH_SECRET manquant dans les variables d\'environnement');
    }
    return process.env.JWT_REFRESH_SECRET;
};

// Génère un access token court
const generateAccessToken = (userId) => {
    // Utilise un token court pour limiter l'impact en cas de fuite
    return jwt.sign({ userId }, getAccessTokenSecret(), { expiresIn: ACCESS_TOKEN_EXPIRY });
};

// Génère un refresh token long
const generateRefreshToken = (userId) => {
    // Utilise un token long uniquement en cookie httpOnly
    return jwt.sign({ userId }, getRefreshTokenSecret(), { expiresIn: REFRESH_TOKEN_EXPIRY });
};

// Configure le cookie httpOnly pour le refresh token
const setRefreshTokenCookie = (res, refreshToken) => {
    const isProduction = process.env.NODE_ENV === 'production';

    // Le cookie est httpOnly pour empêcher l'accès depuis JS
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction, // En production, n'autorise que HTTPS
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
        path: '/api/auth/refresh',
    });
};

const clearRefreshTokenCookie = (res) => {
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        path: '/api/auth/refresh',
    });
};

const register = async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        const newUser = new User(req.body);
        await newUser.save();

        const accessToken = generateAccessToken(newUser._id);
        const refreshToken = generateRefreshToken(newUser._id);

        // Stocke le refresh token dans un cookie httpOnly
        setRefreshTokenCookie(res, refreshToken);

        res.status(201).json({
            message: 'User created successfully',
            accessToken,
            user: {
                id: newUser._id,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                email: newUser.email,
            },
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isPasswordValid = await user.comparePassword(req.body.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Met à jour le cookie de refresh à chaque connexion
        setRefreshTokenCookie(res, refreshToken);

        res.json({
            message: 'Login successful',
            accessToken,
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
            },
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Rafraîchit le token d'accès à partir du refresh token httpOnly
const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.cookies || {};

        if (!refreshToken) {
            return res.status(401).json({ error: 'No refresh token provided' });
        }

        let payload;
        try {
            payload = jwt.verify(refreshToken, getRefreshTokenSecret());
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Refresh token expired' });
            }
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        const user = await User.findById(payload.userId).select('-password');
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        const newAccessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        // Renouvelle le refresh token dans le cookie pour prolonger la session
        setRefreshTokenCookie(res, newRefreshToken);

        return res.json({
            accessToken: newAccessToken,
        });
    } catch (err) {
        console.error('Refresh token error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Déconnecte l'utilisateur en supprimant le refresh token
const logout = async (_req, res) => {
    try {
        clearRefreshTokenCookie(res);
        return res.json({ message: 'Logout successful' });
    } catch (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { register, login, refresh, logout };
