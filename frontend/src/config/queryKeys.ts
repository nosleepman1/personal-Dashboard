/**
 * Clés de requêtes TanStack Query centralisées
 * Permet de garder une convention unique dans toute l'application.
 */

export const queryKeys = {
  dashboard: {
    root: ['dashboard'] as const,
    stats: (filters?: { startDate?: string; endDate?: string }) =>
      ['dashboard', 'stats', filters ?? {}] as const,
  },
  expenses: {
    root: ['expenses'] as const,
    list: (filters?: {
      category?: string;
      startDate?: string;
      endDate?: string;
      paymentMethod?: string;
    }) => ['expenses', 'list', filters ?? {}] as const,
    detail: (id: string) => ['expenses', 'detail', id] as const,
  },
  debts: {
    root: ['debts'] as const,
    list: (filters?: { status?: string; category?: string }) =>
      ['debts', 'list', filters ?? {}] as const,
    detail: (id: string) => ['debts', 'detail', id] as const,
  },
  incomes: {
    root: ['incomes'] as const,
    list: (filters?: {
      category?: string;
      startDate?: string;
      endDate?: string;
      source?: string;
    }) => ['incomes', 'list', filters ?? {}] as const,
    detail: (id: string) => ['incomes', 'detail', id] as const,
  },
  businesses: {
    root: ['businesses'] as const,
    list: (filters?: { status?: string; type?: string }) =>
      ['businesses', 'list', filters ?? {}] as const,
    detail: (id: string) => ['businesses', 'detail', id] as const,
  },
  businessTransactions: {
    root: (businessId: string) => ['businesses', businessId, 'transactions'] as const,
    list: (businessId: string, filters?: { type?: string; category?: string }) =>
      ['businesses', businessId, 'transactions', 'list', filters ?? {}] as const,
  },
  contributions: {
    root: ['contributions'] as const,
    list: (filters?: {
      category?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
    }) => ['contributions', 'list', filters ?? {}] as const,
    detail: (id: string) => ['contributions', 'detail', id] as const,
  },
} as const;
