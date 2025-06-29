import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Order } from '../types';
import { fetchMerchantOrders, fetchUserOrders, on, off } from '../services/api_merchants';

interface UseOrdersOptions {
  merchantId?: string;
  userId?: string;
}

export const useOrders = ({ merchantId, userId }: UseOrdersOptions) => {
  const queryClient = useQueryClient();
  
  // Determine query key and fetch function based on parameters
  const queryKey = merchantId ? ['orders', 'merchant', merchantId] : ['orders', 'user', userId];
  const queryFn = () => {
    if (merchantId) {
      return fetchMerchantOrders(merchantId);
    } else if (userId) {
      return fetchUserOrders(userId);
    } else {
      throw new Error('Either merchantId or userId must be provided');
    }
  };

  // Set up real-time event listeners for order updates
  useEffect(() => {
    const handleOrderStatusUpdated = (data: { orderId: string; status: Order['status']; order: Order }) => {
      // Invalidate all order queries to ensure fresh data from source
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    };

    const handleOrderAdded = (order: Order) => {
      // Invalidate all order queries to ensure fresh data from source
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    };

    on('orderStatusUpdated', handleOrderStatusUpdated);
    on('orderAdded', handleOrderAdded);

    return () => {
      off('orderStatusUpdated', handleOrderStatusUpdated);
      off('orderAdded', handleOrderAdded);
    };
  }, [queryClient]);

  return useQuery<Order[], Error>({
    queryKey,
    queryFn,
    staleTime: 0, // Always consider data stale to ensure fresh fetches
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!(merchantId || userId), // Only run query if we have an ID
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });
};

export default useOrders;