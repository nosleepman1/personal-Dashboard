/**
 * Service de gestion des recettes
 * Gère toutes les opérations CRUD pour les recettes (create, read, update, delete)
 */

import apiClient from '@/lib/api-client';
import { API_ENDPOINTS, buildApiUrl } from '@/config/api';
import type { Income, IncomeFormData, IncomesResponse } from '@/types';

/**
 * Service de gestion des recettes
 * Toutes les méthodes nécessitent un token JWT valide
 */
export const incomeService = {
  /**
   * Crée une nouvelle recette
   * POST /api/incomes
   * 
   * @param data - Données de la recette à créer
   * @returns Promise<Income> - La recette créée avec son ID
   * @throws Error si la création échoue (validation, etc.)
   * 
   * @example
   * ```typescript
   * try {
   *   const income = await incomeService.create({
   *     title: 'Salaire janvier',
   *     amount: 3500,
   *     category: 'salary',
   *     source: 'Entreprise ABC',
   *     recurring: true,
   *     recurringFrequency: 'monthly'
   *   });
   *   console.log('Recette créée:', income);
   * } catch (error) {
   *   console.error('Erreur:', error);
   * }
   * ```
   */
  async create(data: IncomeFormData): Promise<Income> {
    try {
      const response = await apiClient.post<{ message: string; income: Income }>(
        buildApiUrl(API_ENDPOINTS.INCOMES.BASE),
        data
      );
      return response.data.income;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la création de la recette');
    }
  },

  /**
   * Récupère toutes les recettes avec statistiques (total et nombre)
   * GET /api/incomes
   * 
   * @param filters - Filtres optionnels (category, startDate, endDate, source)
   * @returns Promise<IncomesResponse> - Liste des recettes avec total et count
   * 
   * @example
   * ```typescript
   * // Récupérer toutes les recettes
   * const { incomes, total, count } = await incomeService.getAll();
   * 
   * // Filtrer par catégorie et période
   * const { incomes, total } = await incomeService.getAll({
   *   category: 'salary',
   *   startDate: '2024-01-01',
   *   endDate: '2024-01-31'
   * });
   * ```
   */
  async getAll(filters?: {
    category?: string;
    startDate?: string;
    endDate?: string;
    source?: string;
  }): Promise<IncomesResponse> {
    try {
      const response = await apiClient.get<IncomesResponse>(
        buildApiUrl(API_ENDPOINTS.INCOMES.BASE),
        { params: filters }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la récupération des recettes');
    }
  },

  /**
   * Récupère une recette spécifique par son ID
   * GET /api/incomes/:id
   * 
   * @param id - ID de la recette à récupérer
   * @returns Promise<Income> - Les détails de la recette
   * @throws Error si la recette n'est pas trouvée (404)
   */
  async getById(id: string): Promise<Income> {
    try {
      const response = await apiClient.get<{ income: Income }>(
        buildApiUrl(API_ENDPOINTS.INCOMES.BY_ID(id))
      );
      return response.data.income;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la récupération de la recette');
    }
  },

  /**
   * Met à jour une recette existante
   * PUT /api/incomes/:id
   * 
   * @param id - ID de la recette à mettre à jour
   * @param data - Données à mettre à jour (tous les champs sont optionnels)
   * @returns Promise<Income> - La recette mise à jour
   * @throws Error si la recette n'est pas trouvée (404)
   */
  async update(id: string, data: Partial<IncomeFormData>): Promise<Income> {
    try {
      const response = await apiClient.put<{ message: string; income: Income }>(
        buildApiUrl(API_ENDPOINTS.INCOMES.BY_ID(id)),
        data
      );
      return response.data.income;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la mise à jour de la recette');
    }
  },

  /**
   * Supprime une recette
   * DELETE /api/incomes/:id
   * 
   * @param id - ID de la recette à supprimer
   * @returns Promise<void>
   * @throws Error si la recette n'est pas trouvée (404)
   */
  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(buildApiUrl(API_ENDPOINTS.INCOMES.BY_ID(id)));
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la suppression de la recette');
    }
  },
};
