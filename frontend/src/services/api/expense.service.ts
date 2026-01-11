/**
 * Service de gestion des dépenses
 * Gère toutes les opérations CRUD pour les dépenses (create, read, update, delete)
 */

import apiClient from '@/lib/api-client';
import { API_ENDPOINTS, buildApiUrl } from '@/config/api';
import type { Expense, ExpenseFormData, ExpensesResponse } from '@/types';

/**
 * Service de gestion des dépenses
 * Toutes les méthodes nécessitent un token JWT valide
 */
export const expenseService = {
  /**
   * Crée une nouvelle dépense
   * POST /api/expenses
   * 
   * @param data - Données de la dépense à créer
   * @returns Promise<Expense> - La dépense créée avec son ID
   * @throws Error si la création échoue (validation, etc.)
   * 
   * @example
   * ```typescript
   * try {
   *   const expense = await expenseService.create({
   *     title: 'Courses supermarché',
   *     amount: 125.50,
   *     category: 'food',
   *     paymentMethod: 'card'
   *   });
   *   console.log('Dépense créée:', expense);
   * } catch (error) {
   *   console.error('Erreur:', error);
   * }
   * ```
   */
  async create(data: ExpenseFormData): Promise<Expense> {
    try {
      const response = await apiClient.post<{ message: string; expense: Expense }>(
        buildApiUrl(API_ENDPOINTS.EXPENSES.BASE),
        data
      );
      return response.data.expense;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la création de la dépense');
    }
  },

  /**
   * Récupère toutes les dépenses avec statistiques (total et nombre)
   * GET /api/expenses
   * 
   * @param filters - Filtres optionnels (category, startDate, endDate, paymentMethod)
   * @returns Promise<ExpensesResponse> - Liste des dépenses avec total et count
   * 
   * @example
   * ```typescript
   * // Récupérer toutes les dépenses
   * const { expenses, total, count } = await expenseService.getAll();
   * 
   * // Filtrer par catégorie et période
   * const { expenses, total } = await expenseService.getAll({
   *   category: 'food',
   *   startDate: '2024-01-01',
   *   endDate: '2024-01-31'
   * });
   * ```
   */
  async getAll(filters?: {
    category?: string;
    startDate?: string;
    endDate?: string;
    paymentMethod?: string;
  }): Promise<ExpensesResponse> {
    try {
      const response = await apiClient.get<ExpensesResponse>(
        buildApiUrl(API_ENDPOINTS.EXPENSES.BASE),
        { params: filters }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la récupération des dépenses');
    }
  },

  /**
   * Récupère une dépense spécifique par son ID
   * GET /api/expenses/:id
   * 
   * @param id - ID de la dépense à récupérer
   * @returns Promise<Expense> - Les détails de la dépense
   * @throws Error si la dépense n'est pas trouvée (404)
   */
  async getById(id: string): Promise<Expense> {
    try {
      const response = await apiClient.get<{ expense: Expense }>(
        buildApiUrl(API_ENDPOINTS.EXPENSES.BY_ID(id))
      );
      return response.data.expense;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la récupération de la dépense');
    }
  },

  /**
   * Met à jour une dépense existante
   * PUT /api/expenses/:id
   * 
   * @param id - ID de la dépense à mettre à jour
   * @param data - Données à mettre à jour (tous les champs sont optionnels)
   * @returns Promise<Expense> - La dépense mise à jour
   * @throws Error si la dépense n'est pas trouvée (404)
   */
  async update(id: string, data: Partial<ExpenseFormData>): Promise<Expense> {
    try {
      const response = await apiClient.put<{ message: string; expense: Expense }>(
        buildApiUrl(API_ENDPOINTS.EXPENSES.BY_ID(id)),
        data
      );
      return response.data.expense;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la mise à jour de la dépense');
    }
  },

  /**
   * Supprime une dépense
   * DELETE /api/expenses/:id
   * 
   * @param id - ID de la dépense à supprimer
   * @returns Promise<void>
   * @throws Error si la dépense n'est pas trouvée (404)
   */
  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(buildApiUrl(API_ENDPOINTS.EXPENSES.BY_ID(id)));
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la suppression de la dépense');
    }
  },
};
