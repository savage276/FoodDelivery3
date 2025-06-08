import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMerchantById, updateMerchantProfile, on, off } from '../services/api_merchants';
import { Merchant } from '../types';
import { message } from 'antd';
import { useEffect } from 'react';

export const useMerchant = (merchantId?: string) => {
  const queryClient = useQueryClient();

  // Set up real-time event listeners
  useEffect(() => {
    const handleMerchantUpdate = (data: { merchantId: string; merchant: Merchant }) => {
      if (data.merchantId === merchantId) {
        queryClient.setQueryData(['merchant', merchantId], data.merchant);
      }
    };

    const handleMerchantRegistered = (merchant: Merchant) => {
      queryClient.setQueryData(['merchant', merchant.id], merchant);
      queryClient.invalidateQueries({ queryKey: ['merchants'] });
    };

    on('merchantUpdated', handleMerchantUpdate);
    on('merchantRegistered', handleMerchantRegistered);

    return () => {
      off('merchantUpdated', handleMerchantUpdate);
      off('merchantRegistered', handleMerchantRegistered);
    };
  }, [merchantId, queryClient]);

  return useQuery<Merchant, Error>({
    queryKey: ['merchant', merchantId],
    queryFn: () => {
      if (!merchantId) {
        throw new Error('Merchant ID is required');
      }
      return getMerchantById(merchantId);
    },
    enabled: !!merchantId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUpdateMerchantProfile = (merchantId?: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updates: Partial<Merchant>) => {
      if (!merchantId) {
        throw new Error('Merchant ID is required');
      }
      return updateMerchantProfile(merchantId, updates);
    },
    onSuccess: (updatedMerchant) => {
      // Update cache immediately
      queryClient.setQueryData(['merchant', merchantId], updatedMerchant);
      queryClient.invalidateQueries({ queryKey: ['merchants'] });
      message.success('商家信息更新成功');
    },
    onError: (error: Error) => {
      message.error(error.message || '更新失败');
    },
  });
};

export default useMerchant;