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
      // Update the specific order in cache
      queryClient.setQueryData(queryKey, (oldData: Order[] | undefined) => {
        if (!oldData) return [];
        return oldData.map(order => 
          order.id === data.orderId ? data.order : order
        );
      });
      
      // Also invalidate related queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    };

    const handleOrderAdded = (order: Order) => {
      // Add new order to relevant caches
      if (merchantId && order.merchantId === merchantId) {
        queryClient.setQueryData(queryKey, (oldData: Order[] | undefined) => {
          return oldData ? [order, ...oldData] : [order];
        });
      }
      
      if (userId && order.userId === userId) {
        queryClient.setQueryData(queryKey, (oldData: Order[] | undefined) => {
          return oldData ? [order, ...oldData] : [order];
        });
      }
      
      // Invalidate all order queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    };

    on('orderStatusUpdated', handleOrderStatusUpdated);
    on('orderAdded', handleOrderAdded);

    return () => {
      off('orderStatusUpdated', handleOrderStatusUpdated);
      off('orderAdded', handleOrderAdded);
    };
  }, [queryClient, queryKey, merchantId, userId]);

  return useQuery<Order[], Error>({
    queryKey,
    queryFn,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!(merchantId || userId), // Only run query if we have an ID
  });
};

export default useOrders;