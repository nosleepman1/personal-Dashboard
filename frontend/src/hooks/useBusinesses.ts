import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessService } from '@/services/api';
import type { Business, BusinessFormData } from '@/types';
import { queryKeys } from '@/config/queryKeys';

export interface BusinessFilters {
    status?: string;
    type?: string;
}

interface BusinessesResponse {
    businesses: Business[];
}

export function useBusinesses(filters?: BusinessFilters) {
    return useQuery<BusinessesResponse>({
        queryKey: queryKeys.businesses.list(filters),
        queryFn: async () => {
            const businesses = await businessService.getAll(filters);
            return { businesses };
        },
    });
}

export function useCreateBusiness(filters?: BusinessFilters) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: BusinessFormData) => businessService.create(data),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: queryKeys.businesses.list(filters) });
        },
    });
}

export function useUpdateBusiness(filters?: BusinessFilters) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<BusinessFormData> }) =>
            businessService.update(id, data),
        onSuccess: (updated: Business) => {
            queryClient.setQueryData<BusinessesResponse | undefined>(
                queryKeys.businesses.list(filters),
                (current) =>
                    current
                        ? {
                            ...current,
                            businesses: current.businesses.map((business) =>
                                business._id === updated._id ? updated : business,
                            ),
                        }
                        : current,
            );
        },
    });
}

export function useDeleteBusiness(filters?: BusinessFilters) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => businessService.delete(id),
        onSuccess: (_data, id) => {
            queryClient.setQueryData<BusinessesResponse | undefined>(
                queryKeys.businesses.list(filters),
                (current) =>
                    current
                        ? {
                            ...current,
                            businesses: current.businesses.filter((business) => business._id !== id),
                        }
                        : current,
            );
        },
    });
}
