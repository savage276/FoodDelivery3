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
    console.log('🔍 useOrders queryFn: Called with params:', { merchantId, userId });
    if (merchantId) {
      console.log('🔍 useOrders queryFn: Calling fetchMerchantOrders for merchant:', merchantId);
      return fetchMerchantOrders(merchantId);
    } else if (userId) {
      console.log('🔍 useOrders queryFn: Calling fetchUserOrders for user:', userId);
      return fetchUserOrders(userId);
    } else {
      throw new Error('Either merchantId or userId must be provided');
    }
  };

  // Set up real-time event listeners for order updates
  useEffect(() => {
    const handleOrderStatusUpdated = (data: { orderId: string; status: Order['status']; order: Order }) => {
      console.log('🔄 useOrders handleOrderStatusUpdated: Received event:', data);
      console.log('🔄 useOrders handleOrderStatusUpdated: Current hook params:', { merchantId, userId });
      
      // Invalidate all order queries to ensure fresh data from source
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      console.log('🔄 useOrders handleOrderStatusUpdated: Invalidated all order queries');
    };

    const handleOrderAdded = (order: Order) => {
      console.log('➕ useOrders handleOrderAdded: Received event for order:', order);
      console.log('➕ useOrders handleOrderAdded: Current hook params:', { merchantId, userId });
      console.log('➕ useOrders handleOrderAdded: Order details - merchantId:', order.merchantId, 'userId:', order.userId);
      
      // Check if this order is relevant to current hook instance
      const isRelevant = (merchantId && order.merchantId === merchantId) || 
                        (userId && order.userId === userId);
      console.log('➕ useOrders handleOrderAdded: Is order relevant to this hook?', isRelevant);
      
      // Invalidate all order queries to ensure fresh data from source
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      console.log('➕ useOrders handleOrderAdded: Invalidated all order queries');
    };

    console.log('👂 useOrders: Setting up event listeners for params:', { merchantId, userId });
    on('orderStatusUpdated', handleOrderStatusUpdated);
    on('orderAdded', handleOrderAdded);

    return () => {
      console.log('🔇 useOrders: Cleaning up event listeners for params:', { merchantId, userId });
      off('orderStatusUpdated', handleOrderStatusUpdated);
      off('orderAdded', handleOrderAdded);
    };
  }, [queryClient, merchantId, userId]);

  const result = useQuery<Order[], Error>({
    queryKey,
    queryFn,
    staleTime: 0, // Always consider data stale to ensure fresh fetches
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!(merchantId || userId), // Only run query if we have an ID
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });

  console.log('🔍 useOrders: Query result for params', { merchantId, userId }, ':', {
    isLoading: result.isLoading,
    isError: result.isError,
    dataLength: result.data?.length || 0,
    error: result.error?.message
  });

  return result;
};

export default useOrders;