import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { incomeService } from '@/services/api';
import type { Income, IncomeFormData, IncomesResponse } from '@/types';
import { queryKeys } from '@/config/queryKeys';

export interface IncomeFilters {
    category?: string;
    startDate?: string;
    endDate?: string;
    source?: string;
}

export function useIncomes(filters?: IncomeFilters) {
    return useQuery<IncomesResponse>({
        queryKey: queryKeys.incomes.list(filters),
        queryFn: () => incomeService.getAll(filters),
    });
}

export function useCreateIncome(filters?: IncomeFilters) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: IncomeFormData) => incomeService.create(data),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: queryKeys.incomes.list(filters) });
        },
    });
}

export function useUpdateIncome(filters?: IncomeFilters) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<IncomeFormData> }) =>
            incomeService.update(id, data),
        onSuccess: (updated: Income) => {
            queryClient.setQueryData<IncomesResponse | undefined>(
                queryKeys.incomes.list(filters),
                (current) =>
                    current
                        ? {
                            ...current,
                            incomes: current.incomes.map((income) =>
                                income._id === updated._id ? updated : income,
                            ),
                        }
                        : current,
            );
        },
    });
}

export function useDeleteIncome(filters?: IncomeFilters) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => incomeService.delete(id),
        onSuccess: (_data, id) => {
            queryClient.setQueryData<IncomesResponse | undefined>(
                queryKeys.incomes.list(filters),
                (current) =>
                    current
                        ? {
                            ...current,
                            incomes: current.incomes.filter((income) => income._id !== id),
                            count: current.count - 1,
                        }
                        : current,
            );
        },
    });
}
