/**
 * Service de gestion des dettes
 * Gère toutes les opérations CRUD pour les dettes (create, read, update, delete)
 */

import apiClient from '@/lib/api-client';
import { API_ENDPOINTS, buildApiUrl } from '@/config/api';
import type { Debt, DebtFormData } from '@/types';

/**
 * Service de gestion des dettes
 * Toutes les méthodes nécessitent un token JWT valide
 */
export const debtService = {
  /**
   * Crée une nouvelle dette
   * POST /api/debts
   * 
   * @param data - Données de la dette à créer
   * @returns Promise<Debt> - La dette créée avec son ID
   * @throws Error si la création échoue (validation, etc.)
   * 
   * @example
   * ```typescript
   * try {
   *   const debt = await debtService.create({
   *     title: 'Prêt bancaire',
   *     amount: 15000,
   *     creditor: 'Banque XYZ',
   *     status: 'pending'
   *   });
   *   console.log('Dette créée:', debt);
   * } catch (error) {
   *   console.error('Erreur:', error);
   * }
   * ```
   */
  async create(data: DebtFormData): Promise<Debt> {
    try {
      const response = await apiClient.post<{ message: string; debt: Debt }>(
        buildApiUrl(API_ENDPOINTS.DEBTS.BASE),
        data
      );
      return response.data.debt;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la création de la dette');
    }
  },

  /**
   * Récupère toutes les dettes de l'utilisateur connecté
   * GET /api/debts
   * 
   * @param filters - Filtres optionnels (status, category)
   * @returns Promise<Debt[]> - Liste de toutes les dettes
   * 
   * @example
   * ```typescript
   * // Récupérer toutes les dettes
   * const debts = await debtService.getAll();
   * 
   * // Filtrer par statut
   * const pendingDebts = await debtService.getAll({ status: 'pending' });
   * ```
   */
  async getAll(filters?: { status?: string; category?: string }): Promise<Debt[]> {
    try {
      const response = await apiClient.get<{ debts: Debt[] }>(
        buildApiUrl(API_ENDPOINTS.DEBTS.BASE),
        { params: filters }
      );
      return response.data.debts;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la récupération des dettes');
    }
  },

  /**
   * Récupère une dette spécifique par son ID
   * GET /api/debts/:id
   * 
   * @param id - ID de la dette à récupérer
   * @returns Promise<Debt> - Les détails de la dette
   * @throws Error si la dette n'est pas trouvée (404)
   * 
   * @example
   * ```typescript
   * try {
   *   const debt = await debtService.getById('64f1a2b3c4d5e6f7g8h9i0j2');
   *   console.log('Dette:', debt);
   * } catch (error) {
   *   console.error('Dette non trouvée');
   * }
   * ```
   */
  async getById(id: string): Promise<Debt> {
    try {
      const response = await apiClient.get<{ debt: Debt }>(
        buildApiUrl(API_ENDPOINTS.DEBTS.BY_ID(id))
      );
      return response.data.debt;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la récupération de la dette');
    }
  },

  /**
   * Met à jour une dette existante
   * PUT /api/debts/:id
   * Tous les champs sont optionnels - seuls les champs fournis seront mis à jour
   * 
   * @param id - ID de la dette à mettre à jour
   * @param data - Données à mettre à jour (tous les champs sont optionnels)
   * @returns Promise<Debt> - La dette mise à jour
   * @throws Error si la dette n'est pas trouvée (404) ou si la mise à jour échoue
   * 
   * @example
   * ```typescript
   * try {
   *   const updatedDebt = await debtService.update('64f1a2b3c4d5e6f7g8h9i0j2', {
   *     status: 'paid',
   *     amount: 14000
   *   });
   *   console.log('Dette mise à jour:', updatedDebt);
   * } catch (error) {
   *   console.error('Erreur:', error);
   * }
   * ```
   */
  async update(id: string, data: Partial<DebtFormData>): Promise<Debt> {
    try {
      const response = await apiClient.put<{ message: string; debt: Debt }>(
        buildApiUrl(API_ENDPOINTS.DEBTS.BY_ID(id)),
        data
      );
      return response.data.debt;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la mise à jour de la dette');
    }
  },

  /**
   * Supprime une dette
   * DELETE /api/debts/:id
   * 
   * @param id - ID de la dette à supprimer
   * @returns Promise<void> - Aucune donnée retournée en cas de succès
   * @throws Error si la dette n'est pas trouvée (404)
   * 
   * @example
   * ```typescript
   * try {
   *   await debtService.delete('64f1a2b3c4d5e6f7g8h9i0j2');
   *   console.log('Dette supprimée avec succès');
   * } catch (error) {
   *   console.error('Erreur:', error);
   * }
   * ```
   */
  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(buildApiUrl(API_ENDPOINTS.DEBTS.BY_ID(id)));
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la suppression de la dette');
    }
  },
};
