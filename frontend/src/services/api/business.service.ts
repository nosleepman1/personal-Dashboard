/**
 * Service de gestion des entreprises
 * Gère toutes les opérations CRUD pour les entreprises (create, read, update, delete)
 */

import apiClient from '@/lib/api-client';
import { API_ENDPOINTS, buildApiUrl } from '@/config/api';
import type { Business, BusinessFormData } from '@/types';

/**
 * Service de gestion des entreprises
 * Toutes les méthodes nécessitent un token JWT valide
 */
export const businessService = {
  /**
   * Crée une nouvelle entreprise
   * POST /api/businesses
   * 
   * @param data - Données de l'entreprise à créer
   * @returns Promise<Business> - L'entreprise créée avec son ID
   * @throws Error si la création échoue (validation, etc.)
   */
  async create(data: BusinessFormData): Promise<Business> {
    try {
      const response = await apiClient.post<{ message: string; business: Business }>(
        buildApiUrl(API_ENDPOINTS.BUSINESSES.BASE),
        data
      );
      return response.data.business;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la création de l\'entreprise');
    }
  },

  /**
   * Récupère toutes les entreprises de l'utilisateur
   * GET /api/businesses
   * 
   * @param filters - Filtres optionnels (status, type)
   * @returns Promise<Business[]> - Liste de toutes les entreprises
   */
  async getAll(filters?: { status?: string; type?: string }): Promise<Business[]> {
    try {
      const response = await apiClient.get<{ businesses: Business[] }>(
        buildApiUrl(API_ENDPOINTS.BUSINESSES.BASE),
        { params: filters }
      );
      return response.data.businesses;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la récupération des entreprises');
    }
  },

  /**
   * Récupère une entreprise spécifique par son ID
   * GET /api/businesses/:id
   * 
   * @param id - ID de l'entreprise à récupérer
   * @returns Promise<Business> - Les détails de l'entreprise
   * @throws Error si l'entreprise n'est pas trouvée (404)
   */
  async getById(id: string): Promise<Business> {
    try {
      const response = await apiClient.get<{ business: Business }>(
        buildApiUrl(API_ENDPOINTS.BUSINESSES.BY_ID(id))
      );
      return response.data.business;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la récupération de l\'entreprise');
    }
  },

  /**
   * Met à jour une entreprise existante
   * PUT /api/businesses/:id
   * 
   * @param id - ID de l'entreprise à mettre à jour
   * @param data - Données à mettre à jour (tous les champs sont optionnels)
   * @returns Promise<Business> - L'entreprise mise à jour
   * @throws Error si l'entreprise n'est pas trouvée (404)
   */
  async update(id: string, data: Partial<BusinessFormData>): Promise<Business> {
    try {
      const response = await apiClient.put<{ message: string; business: Business }>(
        buildApiUrl(API_ENDPOINTS.BUSINESSES.BY_ID(id)),
        data
      );
      return response.data.business;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la mise à jour de l\'entreprise');
    }
  },

  /**
   * Supprime une entreprise
   * DELETE /api/businesses/:id
   * 
   * @param id - ID de l'entreprise à supprimer
   * @returns Promise<void>
   * @throws Error si l'entreprise n'est pas trouvée (404)
   */
  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(buildApiUrl(API_ENDPOINTS.BUSINESSES.BY_ID(id)));
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la suppression de l\'entreprise');
    }
  },
};
