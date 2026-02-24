const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

// Récupère le secret utilisé pour les access tokens
const getAccessTokenSecret = () => {
    if (!process.env.JWT_ACCESS_SECRET) {
        throw new Error('JWT_ACCESS_SECRET manquant dans les variables d\'environnement');
    }
    return process.env.JWT_ACCESS_SECRET;
};

const authenticate = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        const token = header?.startsWith('Bearer ') ? header.split(' ')[1] : null;

        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, getAccessTokenSecret());
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ error: 'Invalid token.' });
            }
            if (error.name === 'TokenExpiredError') {
                // On renvoie 401 pour déclencher le flux de refresh côté frontend
                return res.status(401).json({ error: 'Token expired.' });
            }
            return res.status(401).json({ error: 'Authentication failed.' });
        }

        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({ error: 'Invalid token. User not found.' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication middleware error:', error);
        res.status(500).json({ error: 'Authentication failed.' });
    }
};

module.exports = authenticate;
