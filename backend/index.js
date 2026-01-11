const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const connectDB = require('./src/database/database');

// Import routes
const authRoute = require('./src/routes/auth.route');
const userRoute = require('./src/routes/user.route');
const debtRoute = require('./src/routes/debt.route');
const expenseRoute = require('./src/routes/expense.route');
const incomeRoute = require('./src/routes/income.route');
const businessRoute = require('./src/routes/business.route');
const contributionRoute = require('./src/routes/contribution.route');
const dashboardRoute = require('./src/routes/dashboard.route');

// Middleware CORS - Permet les requêtes depuis le frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // URL du frontend
  credentials: true, // Permet l'envoi de cookies/headers d'authentification
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Méthodes HTTP autorisées
  allowedHeaders: ['Content-Type', 'Authorization'] // Headers autorisés
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/debts', debtRoute);
app.use('/api/expenses', expenseRoute);
app.use('/api/incomes', incomeRoute);
app.use('/api/businesses', businessRoute);
app.use('/api/contributions', contributionRoute);
app.use('/api/dashboard', dashboardRoute);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
