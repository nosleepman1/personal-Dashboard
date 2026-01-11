/**
 * Client API basique avec axios
 * Gère les appels HTTP, l'authentification via tokens, et les erreurs
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/config/api';

/**
 * Crée une instance axios avec la configuration de base
 * Cette instance est utilisée pour tous les appels API
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Intercepteur de requête : ajoute le token JWT à chaque requête
 * Le token est récupéré depuis le localStorage
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Récupère le token depuis le localStorage
    const token = localStorage.getItem('token');
    
    // Si un token existe, l'ajoute dans le header Authorization
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    // En cas d'erreur lors de la configuration de la requête
    return Promise.reject(error);
  }
);

/**
 * Intercepteur de réponse : gère les erreurs globales
 * - 401 : Token invalide ou expiré -> redirige vers login
 * - Autres erreurs : retourne l'erreur formatée
 */
apiClient.interceptors.response.use(
  (response) => {
    // Si la requête réussit, retourne simplement la réponse
    return response;
  },
  (error: AxiosError) => {
    // Gestion des erreurs HTTP
    if (error.response) {
      const status = error.response.status;
      
      // 401 : Non autorisé - Token invalide ou expiré
      if (status === 401) {
        // Supprime le token invalide
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirige vers la page de connexion (uniquement côté client)
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    
    // Retourne l'erreur pour qu'elle soit gérée par le code appelant
    return Promise.reject(error);
  }
);

/**
 * Exporte l'instance axios configurée
 * Utilisez cette instance pour tous les appels API
 */
export default apiClient;
