/**
 * Configuration de l'API
 * Centralise l'URL de base de l'API et les endpoints
 */

/**
 * URL de base de l'API backend
 * En développement, utilisez http://localhost:3000
 * En production, remplacez par l'URL de votre serveur
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Endpoints de l'API
 * Tous les endpoints sont centralisés ici pour faciliter la maintenance
 */
export const API_ENDPOINTS = {
  // Authentification
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
  },
  
  // Utilisateurs
  USERS: {
    PROFILE: '/api/users/profile',
  },
  
  // Dettes
  DEBTS: {
    BASE: '/api/debts',
    BY_ID: (id: string) => `/api/debts/${id}`,
  },
  
  // Dépenses
  EXPENSES: {
    BASE: '/api/expenses',
    BY_ID: (id: string) => `/api/expenses/${id}`,
  },
  
  // Recettes
  INCOMES: {
    BASE: '/api/incomes',
    BY_ID: (id: string) => `/api/incomes/${id}`,
  },
  
  // Entreprises
  BUSINESSES: {
    BASE: '/api/businesses',
    BY_ID: (id: string) => `/api/businesses/${id}`,
  },
  
  // Apports
  CONTRIBUTIONS: {
    BASE: '/api/contributions',
    BY_ID: (id: string) => `/api/contributions/${id}`,
  },
  
  // Dashboard
  DASHBOARD: {
    BASE: '/api/dashboard',
  },
  
  // Santé
  HEALTH: '/api/health',
} as const;

/**
 * Fonction utilitaire pour construire une URL complète
 * @param endpoint - Endpoint à utiliser
 * @returns URL complète avec la base URL
 */
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};
