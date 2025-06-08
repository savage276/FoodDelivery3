import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllMerchants, on, off } from '../services/api_merchants';
import { Merchant } from '../types';
import { useEffect } from 'react';

export const useAllMerchants = () => {
  const queryClient = useQueryClient();

  // Set up real-time event listeners for merchant updates
  useEffect(() => {
    const handleMerchantRegistered = (merchant: Merchant) => {
      queryClient.setQueryData(['merchants'], (oldData: Merchant[] | undefined) => {
        return oldData ? [...oldData, merchant] : [merchant];
      });
    };

    const handleMerchantUpdated = (data: { merchantId: string; merchant: Merchant }) => {
      queryClient.setQueryData(['merchants'], (oldData: Merchant[] | undefined) => {
        return oldData ? oldData.map(merchant => 
          merchant.id === data.merchantId ? data.merchant : merchant
        ) : [];
      });
    };

    on('merchantRegistered', handleMerchantRegistered);
    on('merchantUpdated', handleMerchantUpdated);

    return () => {
      off('merchantRegistered', handleMerchantRegistered);
      off('merchantUpdated', handleMerchantUpdated);
    };
  }, [queryClient]);

  return useQuery<Merchant[], Error>({
    queryKey: ['merchants'],
    queryFn: getAllMerchants,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export default useAllMerchants;