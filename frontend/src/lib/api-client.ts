/**
 * Client API basique avec axios
 * Gère les appels HTTP, l'authentification via tokens, et les erreurs
 */

import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { API_BASE_URL, API_ENDPOINTS, buildApiUrl } from '@/config/api';
import { getAccessToken, setAccessToken } from '@/lib/auth-token';
import type { RefreshTokenResponse } from '@/types';

/**
 * Crée une instance axios avec la configuration de base
 * Cette instance est utilisée pour tous les appels API
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Permet l'envoi de cookies (utile pour le refresh token httpOnly)
  withCredentials: true,
});

/**
 * Instance dédiée au rafraîchissement de token pour éviter les intercepteurs circulaires.
 */
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Indicateur global de rafraîchissement en cours pour mutualiser les appels
let refreshPromise: Promise<string> | null = null;

/**
 * Rafraîchit le token d'accès en appelant l'endpoint /auth/refresh.
 * Ce helper est partagé entre l'intercepteur et le contexte d'auth si besoin.
 */
const performTokenRefresh = async (): Promise<string> => {
  if (!refreshPromise) {
    // Lance un nouveau rafraîchissement si aucun n'est en cours
    refreshPromise = refreshClient
      .post<RefreshTokenResponse>(buildApiUrl(API_ENDPOINTS.AUTH.REFRESH))
      .then((response: AxiosResponse<RefreshTokenResponse>) => {
        const newAccessToken = response.data.accessToken;
        // Met à jour le token en mémoire pour les futures requêtes
        setAccessToken(newAccessToken);
        return newAccessToken;
      })
      .finally(() => {
        // Réinitialise la promesse une fois le rafraîchissement terminé
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

/**
 * Intercepteur de requête : ajoute le token JWT à chaque requête
 * Le token est récupéré depuis la mémoire (et non plus depuis le localStorage)
 */
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getAccessToken();

    // Si un token existe, l'ajoute dans le header Authorization
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    // En cas d'erreur lors de la configuration de la requête
    return Promise.reject(error);
  }
);

type RetriableAxiosRequestConfig = AxiosRequestConfig & { _retry?: boolean };

/**
 * Intercepteur de réponse : gère les erreurs globales
 * - 401 : Token expiré -> tente un rafraîchissement silencieux puis rejoue la requête
 * - Si le refresh échoue : redirige vers /login
 */
apiClient.interceptors.response.use(
  (response) => {
    // Si la requête réussit, retourne simplement la réponse
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableAxiosRequestConfig | undefined;

    // Si aucune réponse ou aucune config, on propage l'erreur telle quelle
    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response.status;

    // Ne pas tenter de refresh pour certaines routes d'auth elles-mêmes
    const url = originalRequest.url || '';
    const isAuthRoute =
      url.includes(API_ENDPOINTS.AUTH.LOGIN) ||
      url.includes(API_ENDPOINTS.AUTH.REGISTER) ||
      url.includes(API_ENDPOINTS.AUTH.REFRESH) ||
      url.includes(API_ENDPOINTS.AUTH.LOGOUT);

    // Si 401 et que ce n'est pas une route d'auth, tente un rafraîchissement
    if (status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;

      try {
        // Rafraîchit le token d'accès de manière centralisée
        const newAccessToken = await performTokenRefresh();

        // Met à jour le header Authorization pour la requête originale
        if (!originalRequest.headers) {
          originalRequest.headers = {};
        }
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Rejoue la requête originale avec le nouveau token
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Si le refresh échoue, on réinitialise le token et redirige vers /login
        setAccessToken(null);

        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
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
