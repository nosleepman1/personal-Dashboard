import apiClient from '@/lib/api-client';
import { API_ENDPOINTS, buildApiUrl } from '@/config/api';
import type { BusinessTransaction, BusinessTransactionFormData, BusinessTransactionsResponse } from '@/types';

export const businessTransactionService = {
    async create(businessId: string, data: BusinessTransactionFormData): Promise<BusinessTransaction> {
        try {
            const response = await apiClient.post<{ transaction: BusinessTransaction }>(
                buildApiUrl(API_ENDPOINTS.BUSINESSES.TRANSACTIONS(businessId)),
                data,
            );
            return response.data.transaction;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Erreur lors de la création de la transaction');
        }
    },

    async getAll(
        businessId: string,
        filters?: { type?: string; category?: string },
    ): Promise<BusinessTransactionsResponse> {
        try {
            const response = await apiClient.get<BusinessTransactionsResponse>(
                buildApiUrl(API_ENDPOINTS.BUSINESSES.TRANSACTIONS(businessId)),
                { params: filters },
            );
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Erreur lors de la récupération des transactions');
        }
    },

    async update(
        businessId: string,
        txId: string,
        data: Partial<BusinessTransactionFormData>,
    ): Promise<BusinessTransaction> {
        try {
            const response = await apiClient.put<{ transaction: BusinessTransaction }>(
                buildApiUrl(API_ENDPOINTS.BUSINESSES.TRANSACTION_BY_ID(businessId, txId)),
                data,
            );
            return response.data.transaction;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Erreur lors de la mise à jour de la transaction');
        }
    },

    async delete(businessId: string, txId: string): Promise<void> {
        try {
            await apiClient.delete(
                buildApiUrl(API_ENDPOINTS.BUSINESSES.TRANSACTION_BY_ID(businessId, txId)),
            );
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Erreur lors de la suppression de la transaction');
        }
    },
};
