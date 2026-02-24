import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessTransactionService } from '@/services/api/businessTransaction.service';
import type {
    BusinessTransaction,
    BusinessTransactionFormData,
    BusinessTransactionsResponse,
} from '@/types';
import { queryKeys } from '@/config/queryKeys';

export interface BusinessTransactionFilters {
    type?: string;
    category?: string;
}

export function useBusinessTransactions(
    businessId: string,
    filters?: BusinessTransactionFilters,
) {
    return useQuery<BusinessTransactionsResponse>({
        queryKey: queryKeys.businessTransactions.list(businessId, filters),
        queryFn: () => businessTransactionService.getAll(businessId, filters),
        enabled: !!businessId,
    });
}

export function useCreateBusinessTransaction(businessId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: BusinessTransactionFormData) =>
            businessTransactionService.create(businessId, data),
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: queryKeys.businessTransactions.root(businessId),
            });
            // Also invalidate the business list so totalRevenue/totalExpenses refresh
            void queryClient.invalidateQueries({ queryKey: queryKeys.businesses.root });
        },
    });
}

export function useUpdateBusinessTransaction(businessId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            txId,
            data,
        }: {
            txId: string;
            data: Partial<BusinessTransactionFormData>;
        }) => businessTransactionService.update(businessId, txId, data),
        onSuccess: (updated: BusinessTransaction) => {
            queryClient.setQueryData<BusinessTransactionsResponse | undefined>(
                queryKeys.businessTransactions.list(businessId),
                (current) =>
                    current
                        ? {
                            ...current,
                            transactions: current.transactions.map((tx) =>
                                tx._id === updated._id ? updated : tx,
                            ),
                        }
                        : current,
            );
            void queryClient.invalidateQueries({ queryKey: queryKeys.businesses.root });
        },
    });
}

export function useDeleteBusinessTransaction(businessId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (txId: string) => businessTransactionService.delete(businessId, txId),
        onSuccess: (_data, txId) => {
            queryClient.setQueryData<BusinessTransactionsResponse | undefined>(
                queryKeys.businessTransactions.list(businessId),
                (current) =>
                    current
                        ? {
                            ...current,
                            transactions: current.transactions.filter((tx) => tx._id !== txId),
                            count: current.count - 1,
                        }
                        : current,
            );
            void queryClient.invalidateQueries({
                queryKey: queryKeys.businessTransactions.root(businessId),
            });
            void queryClient.invalidateQueries({ queryKey: queryKeys.businesses.root });
        },
    });
}
