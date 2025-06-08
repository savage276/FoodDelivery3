import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Merchant } from '../types';
import { getAllMerchants, getMerchantById } from '../services/api_merchants';

interface MerchantContextType {
  merchants: Record<string, Merchant>;
  getAllMerchants: () => Merchant[];
  getMerchant: (id: string) => Merchant | null;
  updateMerchantData: (id: string, data: Partial<Merchant>) => void;
  refreshMerchantData: () => Promise<void>;
}

const MerchantContext = createContext<MerchantContextType | undefined>(undefined);

export const MerchantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [merchants, setMerchants] = useState<Record<string, Merchant>>({});
  const queryClient = useQueryClient();

  // Initialize merchant data
  useEffect(() => {
    const initializeMerchants = async () => {
      try {
        const merchantList = await getAllMerchants();
        const merchantMap = merchantList.reduce((acc, merchant) => {
          acc[merchant.id] = merchant;
          return acc;
        }, {} as Record<string, Merchant>);
        setMerchants(merchantMap);
      } catch (error) {
        console.error('Failed to initialize merchants:', error);
      }
    };

    initializeMerchants();
  }, []);

  const getAllMerchantsData = () => Object.values(merchants);
  
  const getMerchant = (id: string) => merchants[id] || null;

  const updateMerchantData = (id: string, data: Partial<Merchant>) => {
    setMerchants(prev => ({
      ...prev,
      [id]: { ...prev[id], ...data }
    }));
    
    // Update React Query cache
    queryClient.setQueryData(['merchant', id], (oldData: Merchant | undefined) => {
      if (oldData) {
        return { ...oldData, ...data };
      }
      return oldData;
    });
    
    // Invalidate related queries to trigger refetch
    queryClient.invalidateQueries({ queryKey: ['merchants'] });
    queryClient.invalidateQueries({ queryKey: ['merchant', id] });
  };

  const refreshMerchantData = async () => {
    try {
      const merchantList = await getAllMerchants();
      const merchantMap = merchantList.reduce((acc, merchant) => {
        acc[merchant.id] = merchant;
        return acc;
      }, {} as Record<string, Merchant>);
      setMerchants(merchantMap);
      
      // Update all React Query caches
      queryClient.invalidateQueries({ queryKey: ['merchants'] });
      Object.keys(merchantMap).forEach(id => {
        queryClient.setQueryData(['merchant', id], merchantMap[id]);
      });
    } catch (error) {
      console.error('Failed to refresh merchant data:', error);
    }
  };

  return (
    <MerchantContext.Provider value={{ 
      merchants, 
      getAllMerchants: getAllMerchantsData, 
      getMerchant, 
      updateMerchantData,
      refreshMerchantData
    }}>
      {children}
    </MerchantContext.Provider>
  );
};

export const useMerchant = () => {
  const context = useContext(MerchantContext);
  if (context === undefined) {
    throw new Error('useMerchant must be used within a MerchantProvider');
  }
  return context;
};