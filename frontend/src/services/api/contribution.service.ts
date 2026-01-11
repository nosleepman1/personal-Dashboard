/**
 * Service de gestion des apports
 * Gère toutes les opérations CRUD pour les apports (create, read, update, delete)
 */

import apiClient from '@/lib/api-client';
import { API_ENDPOINTS, buildApiUrl } from '@/config/api';
import type { Contribution, ContributionFormData, ContributionsResponse } from '@/types';

/**
 * Service de gestion des apports
 * Toutes les méthodes nécessitent un token JWT valide
 */
export const contributionService = {
  /**
   * Crée un nouvel apport
   * POST /api/contributions
   * 
   * @param data - Données de l'apport à créer
   * @returns Promise<Contribution> - L'apport créé avec son ID
   * @throws Error si la création échoue (validation, etc.)
   */
  async create(data: ContributionFormData): Promise<Contribution> {
    try {
      const response = await apiClient.post<{ message: string; contribution: Contribution }>(
        buildApiUrl(API_ENDPOINTS.CONTRIBUTIONS.BASE),
        data
      );
      return response.data.contribution;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la création de l\'apport');
    }
  },

  /**
   * Récupère tous les apports avec statistiques (total et nombre)
   * GET /api/contributions
   * 
   * @param filters - Filtres optionnels (category, status, startDate, endDate)
   * @returns Promise<ContributionsResponse> - Liste des apports avec total et count
   */
  async getAll(filters?: {
    category?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ContributionsResponse> {
    try {
      const response = await apiClient.get<ContributionsResponse>(
        buildApiUrl(API_ENDPOINTS.CONTRIBUTIONS.BASE),
        { params: filters }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la récupération des apports');
    }
  },

  /**
   * Récupère un apport spécifique par son ID
   * GET /api/contributions/:id
   * 
   * @param id - ID de l'apport à récupérer
   * @returns Promise<Contribution> - Les détails de l'apport
   * @throws Error si l'apport n'est pas trouvé (404)
   */
  async getById(id: string): Promise<Contribution> {
    try {
      const response = await apiClient.get<{ contribution: Contribution }>(
        buildApiUrl(API_ENDPOINTS.CONTRIBUTIONS.BY_ID(id))
      );
      return response.data.contribution;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la récupération de l\'apport');
    }
  },

  /**
   * Met à jour un apport existant
   * PUT /api/contributions/:id
   * 
   * @param id - ID de l'apport à mettre à jour
   * @param data - Données à mettre à jour (tous les champs sont optionnels)
   * @returns Promise<Contribution> - L'apport mis à jour
   * @throws Error si l'apport n'est pas trouvé (404)
   */
  async update(id: string, data: Partial<ContributionFormData>): Promise<Contribution> {
    try {
      const response = await apiClient.put<{ message: string; contribution: Contribution }>(
        buildApiUrl(API_ENDPOINTS.CONTRIBUTIONS.BY_ID(id)),
        data
      );
      return response.data.contribution;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la mise à jour de l\'apport');
    }
  },

  /**
   * Supprime un apport
   * DELETE /api/contributions/:id
   * 
   * @param id - ID de l'apport à supprimer
   * @returns Promise<void>
   * @throws Error si l'apport n'est pas trouvé (404)
   */
  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(buildApiUrl(API_ENDPOINTS.CONTRIBUTIONS.BY_ID(id)));
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la suppression de l\'apport');
    }
  },
};
