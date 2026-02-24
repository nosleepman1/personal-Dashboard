import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { debtService } from '@/services/api';
import type { Debt, DebtFormData } from '@/types';
import { queryKeys } from '@/config/queryKeys';

export interface DebtFilters {
    status?: string;
    category?: string;
}

interface DebtsResponse {
    debts: Debt[];
}

export function useDebts(filters?: DebtFilters) {
    return useQuery<DebtsResponse>({
        queryKey: queryKeys.debts.list(filters),
        queryFn: async () => {
            const debts = await debtService.getAll(filters);
            return { debts };
        },
    });
}

export function useCreateDebt(filters?: DebtFilters) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: DebtFormData) => debtService.create(data),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: queryKeys.debts.list(filters) });
        },
    });
}

export function useUpdateDebt(filters?: DebtFilters) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<DebtFormData> }) =>
            debtService.update(id, data),
        onSuccess: (updated: Debt) => {
            queryClient.setQueryData<DebtsResponse | undefined>(
                queryKeys.debts.list(filters),
                (current) =>
                    current
                        ? {
                            ...current,
                            debts: current.debts.map((debt) =>
                                debt._id === updated._id ? updated : debt,
                            ),
                        }
                        : current,
            );
        },
    });
}

export function useDeleteDebt(filters?: DebtFilters) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => debtService.delete(id),
        onSuccess: (_data, id) => {
            queryClient.setQueryData<DebtsResponse | undefined>(
                queryKeys.debts.list(filters),
                (current) =>
                    current
                        ? {
                            ...current,
                            debts: current.debts.filter((debt) => debt._id !== id),
                        }
                        : current,
            );
        },
    });
}
