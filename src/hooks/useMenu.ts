import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getMenuByMerchantId, 
  addMenuItem, 
  updateMenuItem, 
  deleteMenuItem 
} from '../services/api_merchants';
import { MenuItem } from '../types';
import { message } from 'antd';

export const useMenu = (merchantId?: string) => {
  return useQuery<MenuItem[], Error>({
    queryKey: ['menu', merchantId],
    queryFn: () => {
      if (!merchantId) {
        throw new Error('Merchant ID is required');
      }
      return getMenuByMerchantId(merchantId);
    },
    enabled: !!merchantId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useAddMenuItem = (merchantId?: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (item: Omit<MenuItem, 'id'>) => addMenuItem(item, merchantId),
    onSuccess: () => {
      // Invalidate and refetch menu data
      queryClient.invalidateQueries({ queryKey: ['menu', merchantId] });
      message.success('菜品添加成功');
    },
    onError: (error: Error) => {
      message.error(error.message || '添加菜品失败');
    },
  });
};

export const useUpdateMenuItem = (merchantId?: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ itemId, item }: { itemId: string; item: Partial<MenuItem> }) => 
      updateMenuItem(itemId, item, merchantId),
    onSuccess: () => {
      // Invalidate and refetch menu data
      queryClient.invalidateQueries({ queryKey: ['menu', merchantId] });
      message.success('菜品更新成功');
    },
    onError: (error: Error) => {
      message.error(error.message || '更新菜品失败');
    },
  });
};

export const useDeleteMenuItem = (merchantId?: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (itemId: string) => deleteMenuItem(itemId, merchantId),
    onSuccess: () => {
      // Invalidate and refetch menu data
      queryClient.invalidateQueries({ queryKey: ['menu', merchantId] });
      message.success('菜品删除成功');
    },
    onError: (error: Error) => {
      message.error(error.message || '删除菜品失败');
    },
  });
};

export default useMenu;