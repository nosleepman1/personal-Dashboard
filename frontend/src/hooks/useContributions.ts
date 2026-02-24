import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contributionService } from '@/services/api';
import type { Contribution, ContributionFormData, ContributionsResponse } from '@/types';
import { queryKeys } from '@/config/queryKeys';

export interface ContributionFilters {
    category?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
}

export function useContributions(filters?: ContributionFilters) {
    return useQuery<ContributionsResponse>({
        queryKey: queryKeys.contributions.list(filters),
        queryFn: () => contributionService.getAll(filters),
    });
}

export function useCreateContribution(filters?: ContributionFilters) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ContributionFormData) => contributionService.create(data),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: queryKeys.contributions.list(filters) });
        },
    });
}

export function useUpdateContribution(filters?: ContributionFilters) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<ContributionFormData> }) =>
            contributionService.update(id, data),
        onSuccess: (updated: Contribution) => {
            queryClient.setQueryData<ContributionsResponse | undefined>(
                queryKeys.contributions.list(filters),
                (current) =>
                    current
                        ? {
                            ...current,
                            contributions: current.contributions.map((contribution) =>
                                contribution._id === updated._id ? updated : contribution,
                            ),
                        }
                        : current,
            );
        },
    });
}

export function useDeleteContribution(filters?: ContributionFilters) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => contributionService.delete(id),
        onSuccess: (_data, id) => {
            queryClient.setQueryData<ContributionsResponse | undefined>(
                queryKeys.contributions.list(filters),
                (current) =>
                    current
                        ? {
                            ...current,
                            contributions: current.contributions.filter(
                                (contribution) => contribution._id !== id,
                            ),
                            count: current.count - 1,
                        }
                        : current,
            );
        },
    });
}
