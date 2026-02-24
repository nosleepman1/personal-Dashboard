import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseService } from '@/services/api';
import type { Expense, ExpenseFormData, ExpensesResponse } from '@/types';
import { queryKeys } from '@/config/queryKeys';

export interface ExpenseFilters {
  category?: string;
  startDate?: string;
  endDate?: string;
  paymentMethod?: string;
}

export function useExpenses(filters?: ExpenseFilters) {
  return useQuery<ExpensesResponse>({
    queryKey: queryKeys.expenses.list(filters),
    queryFn: () => expenseService.getAll(filters),
  });
}

export function useCreateExpense(filters?: ExpenseFilters) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ExpenseFormData) => expenseService.create(data),
    onSuccess: () => {
      // Invalide la liste pour recharger les données à jour.
      void queryClient.invalidateQueries({ queryKey: queryKeys.expenses.list(filters) });
    },
  });
}

export function useUpdateExpense(filters?: ExpenseFilters) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ExpenseFormData> }) =>
      expenseService.update(id, data),
    onSuccess: (updated: Expense) => {
      // Met à jour la liste courante en cache pour une sensation plus fluide.
      queryClient.setQueryData<ExpensesResponse | undefined>(
        queryKeys.expenses.list(filters),
        (current) =>
          current
            ? {
                ...current,
                expenses: current.expenses.map((expense) =>
                  expense._id === updated._id ? updated : expense,
                ),
              }
            : current,
      );
    },
  });
}

export function useDeleteExpense(filters?: ExpenseFilters) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => expenseService.delete(id),
    onSuccess: (_data, id) => {
      queryClient.setQueryData<ExpensesResponse | undefined>(
        queryKeys.expenses.list(filters),
        (current) =>
          current
            ? {
                ...current,
                expenses: current.expenses.filter((expense) => expense._id !== id),
                count: current.count - 1,
              }
            : current,
      );
    },
  });
}

