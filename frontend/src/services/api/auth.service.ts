/**
 * Service d'authentification
 * Gère toutes les opérations liées à l'authentification (login, register)
 */

import apiClient from '@/lib/api-client';
import { API_ENDPOINTS, buildApiUrl } from '@/config/api';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types';

/**
 * Service d'authentification
 * Toutes les méthodes retournent des Promises pour permettre l'utilisation d'async/await
 */
export const authService = {
  /**
   * Inscrit un nouvel utilisateur
   * POST /api/auth/register
   * 
   * @param data - Données d'inscription (firstname, lastname, email, password)
   * @returns Promise<AuthResponse> - Token JWT et informations utilisateur
   * @throws Error si l'inscription échoue (email déjà utilisé, validation, etc.)
   * 
   * @example
   * ```typescript
   * try {
   *   const response = await authService.register({
   *     firstname: 'Jean',
   *     lastname: 'Dupont',
   *     email: 'jean@example.com',
   *     password: 'motdepasse123'
   *   });
   *   console.log('Token:', response.token);
   *   console.log('User:', response.user);
   * } catch (error) {
   *   console.error('Erreur lors de l\'inscription:', error);
   * }
   * ```
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        buildApiUrl(API_ENDPOINTS.AUTH.REGISTER),
        data
      );
      return response.data;
    } catch (error: any) {
      // Transforme l'erreur axios en erreur plus lisible
      throw new Error(error.response?.data?.error || 'Erreur lors de l\'inscription');
    }
  },

  /**
   * Connecte un utilisateur existant
   * POST /api/auth/login
   * 
   * @param data - Données de connexion (email, password)
   * @returns Promise<AuthResponse> - Token JWT et informations utilisateur
   * @throws Error si la connexion échoue (email/password incorrect, validation, etc.)
   * 
   * @example
   * ```typescript
   * try {
   *   const response = await authService.login({
   *     email: 'jean@example.com',
   *     password: 'motdepasse123'
   *   });
   *   // Stocke le token dans le localStorage
   *   localStorage.setItem('token', response.token);
   *   localStorage.setItem('user', JSON.stringify(response.user));
   * } catch (error) {
   *   console.error('Erreur lors de la connexion:', error);
   * }
   * ```
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        buildApiUrl(API_ENDPOINTS.AUTH.LOGIN),
        data
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la connexion');
    }
  },

  /**
   * Récupère le profil de l'utilisateur connecté
   * GET /api/users/profile
   * Nécessite un token JWT valide
   * 
   * @returns Promise<User> - Informations de l'utilisateur connecté
   * @throws Error si le token est invalide ou si l'utilisateur n'existe plus
   * 
   * @example
   * ```typescript
   * try {
   *   const user = await authService.getProfile();
   *   console.log('Utilisateur:', user);
   * } catch (error) {
   *   console.error('Erreur lors de la récupération du profil:', error);
   * }
   * ```
   */
  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get<{ user: User }>(
        buildApiUrl(API_ENDPOINTS.USERS.PROFILE)
      );
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la récupération du profil');
    }
  },

  /**
   * Met à jour le profil de l'utilisateur connecté
   * PUT /api/users/profile
   * Nécessite un token JWT valide
   * 
   * @param data - Données à mettre à jour (firstname, lastname, email - tous optionnels)
   * @returns Promise<User> - Informations utilisateur mises à jour
   * @throws Error si la mise à jour échoue (email déjà utilisé, validation, etc.)
   * 
   * @example
   * ```typescript
   * try {
   *   const updatedUser = await authService.updateProfile({
   *     firstname: 'Jean-Pierre',
   *     email: 'nouveau.email@example.com'
   *   });
   *   console.log('Profil mis à jour:', updatedUser);
   * } catch (error) {
   *   console.error('Erreur lors de la mise à jour du profil:', error);
   * }
   * ```
   */
  async updateProfile(data: Partial<Pick<User, 'firstname' | 'lastname' | 'email'>>): Promise<User> {
    try {
      const response = await apiClient.put<{ user: User }>(
        buildApiUrl(API_ENDPOINTS.USERS.PROFILE),
        data
      );
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la mise à jour du profil');
    }
  },
};
