/**
 * Hook TanStack Query pour les statistiques du dashboard
 * Remplace l'utilisation de useEffect + useState dans la page.
 */

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/api';
import type { DashboardStats } from '@/types';
import { queryKeys } from '@/config/queryKeys';

interface UseDashboardStatsOptions {
  startDate?: string;
  endDate?: string;
}

export function useDashboardStats(filters?: UseDashboardStatsOptions) {
  return useQuery<DashboardStats>({
    queryKey: queryKeys.dashboard.stats(filters),
    queryFn: () => dashboardService.getStats(filters),
    // Les stats du dashboard peuvent être légèrement mises en cache
    staleTime: 1000 * 60, // 1 minute
  });
}

