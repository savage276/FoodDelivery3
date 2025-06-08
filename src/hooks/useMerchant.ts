import { useQuery } from '@tanstack/react-query';
import { getMerchantById } from '../services/api_merchants';
import { Merchant } from '../types';

export const useMerchant = (merchantId?: string) => {
  return useQuery<Merchant, Error>({
    queryKey: ['merchant', merchantId],
    queryFn: () => {
      if (!merchantId) {
        throw new Error('Merchant ID is required');
      }
      return getMerchantById(merchantId);
    },
    enabled: !!merchantId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export default useMerchant;