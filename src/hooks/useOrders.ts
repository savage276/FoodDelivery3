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
    console.log('🔍 useOrders queryFn called with:', { merchantId, userId });
    if (merchantId) {
      console.log('📞 Calling fetchMerchantOrders for merchant:', merchantId);
      return fetchMerchantOrders(merchantId);
    } else if (userId) {
      console.log('📞 Calling fetchUserOrders for user:', userId);
      return fetchUserOrders(userId);
    } else {
      throw new Error('Either merchantId or userId must be provided');
    }
  };

  // Set up real-time event listeners for order updates
  useEffect(() => {
    const handleOrderStatusUpdated = (data: { orderId: string; status: Order['status']; order: Order }) => {
      console.log('🔄 useOrders received orderStatusUpdated event:', data);
      // Invalidate all order queries to ensure fresh data from source
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    };

    const handleOrderAdded = (order: Order) => {
      console.log('➕ useOrders received orderAdded event:', order);
      console.log('🔍 Current hook params:', { merchantId, userId });
      console.log('🔍 Order details:', { orderMerchantId: order.merchantId, orderUserId: order.userId });
      
      // Invalidate all order queries to ensure fresh data from source
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      console.log('🔄 Invalidated all order queries');
    };

    console.log('👂 useOrders setting up event listeners for:', { merchantId, userId });
    on('orderStatusUpdated', handleOrderStatusUpdated);
    on('orderAdded', handleOrderAdded);

    return () => {
      console.log('🔇 useOrders cleaning up event listeners');
      off('orderStatusUpdated', handleOrderStatusUpdated);
      off('orderAdded', handleOrderAdded);
    };
  }, [queryClient, merchantId, userId]);

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