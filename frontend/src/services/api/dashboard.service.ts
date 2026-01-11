/**
 * Service de gestion du dashboard
 * Récupère toutes les statistiques agrégées pour le dashboard
 */

import apiClient from '@/lib/api-client';
import { API_ENDPOINTS, buildApiUrl } from '@/config/api';
import type { DashboardStats } from '@/types';

/**
 * Service de gestion du dashboard
 * Nécessite un token JWT valide
 */
export const dashboardService = {
  /**
   * Récupère toutes les statistiques agrégées du dashboard
   * GET /api/dashboard
   * 
   * Retourne un résumé financier complet incluant:
   * - Totaux (dettes, dépenses, recettes, apports, balance nette)
   * - Statistiques par catégorie
   * - Éléments récents (5 plus récents de chaque type)
   * - Statistiques des entreprises
   * 
   * @param filters - Filtres optionnels (startDate, endDate) pour filtrer les données par période
   * @returns Promise<DashboardStats> - Toutes les statistiques du dashboard
   * @throws Error si la récupération échoue
   * 
   * @example
   * ```typescript
   * // Récupérer toutes les statistiques
   * const stats = await dashboardService.getStats();
   * console.log('Balance nette:', stats.summary.netBalance);
   * console.log('Total dépenses:', stats.summary.totalExpenses);
   * 
   * // Filtrer par période (ex: mois de janvier 2024)
   * const stats = await dashboardService.getStats({
   *   startDate: '2024-01-01',
   *   endDate: '2024-01-31'
   * });
   * ```
   */
  async getStats(filters?: {
    startDate?: string;
    endDate?: string;
  }): Promise<DashboardStats> {
    try {
      const response = await apiClient.get<DashboardStats>(
        buildApiUrl(API_ENDPOINTS.DASHBOARD.BASE),
        { params: filters }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la récupération des statistiques du dashboard');
    }
  },
};
