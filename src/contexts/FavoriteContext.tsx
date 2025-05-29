import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Merchant } from '../types';

interface FavoriteState {
  merchants: string[]; // 存储商家ID
}

interface FavoriteContextType {
  state: FavoriteState;
  toggleFavorite: (merchantId: string) => void;
  isFavorite: (merchantId: string) => boolean;
  getFavoriteMerchants: () => Merchant[];
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

// 从 localStorage 获取初始状态
const getInitialState = (): FavoriteState => {
  const savedState = localStorage.getItem('favorites');
  return savedState ? JSON.parse(savedState) : { merchants: [] };
};

type FavoriteAction =
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'SET_FAVORITES'; payload: string[] };

const favoriteReducer = (state: FavoriteState, action: FavoriteAction): FavoriteState => {
  switch (action.type) {
    case 'TOGGLE_FAVORITE': {
      const isFavorite = (state.merchants || []).includes(action.payload);
      const newMerchants = isFavorite
        ? (state.merchants || []).filter(id => id !== action.payload)
        : [...(state.merchants || []), action.payload];
      
      // 保存到 localStorage
      localStorage.setItem('favorites', JSON.stringify({ merchants: newMerchants }));
      
      return {
        ...state,
        merchants: newMerchants
      };
    }
    case 'SET_FAVORITES': {
      return {
        ...state,
        merchants: action.payload
      };
    }
    default:
      return state;
  }
};

// 模拟商家数据，实际应该从 API 获取
const mockMerchants: Record<string, Merchant> = {
  '1': {
    id: '1',
    name: '金龙餐厅',
    logo: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg',
    coverImage: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
    cuisine: ['中餐', '粤菜'],
    rating: 4.8,
    deliveryTime: 25,
    deliveryFee: 2.99,
    minOrder: 15,
    distance: 1.2,
    promotions: [
      { id: 'p1', type: 'discount', description: '新用户下单立减20%' }
    ],
    isNew: true
  },
  '2': {
    id: '2',
    name: '意面天堂',
    logo: 'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg',
    coverImage: 'https://images.pexels.com/photos/1527603/pexels-photo-1527603.jpeg',
    cuisine: ['意大利菜', '地中海'],
    rating: 4.5,
    deliveryTime: 30,
    deliveryFee: 1.99,
    minOrder: 20,
    distance: 2.4,
    promotions: [
      { id: 'p2', type: 'freeDelivery', description: '订单满30元免配送费' }
    ]
  },
  '3': {
    id: '3',
    name: '寿司速递',
    logo: 'https://images.pexels.com/photos/359993/pexels-photo-359993.jpeg',
    coverImage: 'https://images.pexels.com/photos/858508/pexels-photo-858508.jpeg',
    cuisine: ['日本料理', '亚洲菜'],
    rating: 4.7,
    deliveryTime: 20,
    deliveryFee: 3.99,
    minOrder: 25,
    distance: 1.8,
    promotions: [
      { id: 'p3', type: 'gift', description: '订单满35元赠送味增汤' }
    ]
  },
  '4': {
    id: '4',
    name: '墨西哥风情',
    logo: 'https://images.pexels.com/photos/2087748/pexels-photo-2087748.jpeg',
    coverImage: 'https://images.pexels.com/photos/4958641/pexels-photo-4958641.jpeg',
    cuisine: ['墨西哥菜', '拉美菜'],
    rating: 4.3,
    deliveryTime: 35,
    deliveryFee: 0,
    minOrder: 15,
    distance: 3.1,
    promotions: []
  }
};

export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(favoriteReducer, getInitialState());

  const toggleFavorite = (merchantId: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: merchantId });
  };

  const isFavorite = (merchantId: string) => {
    return (state.merchants || []).includes(merchantId);
  };

  const getFavoriteMerchants = () => {
    return (state.merchants || []).map(id => mockMerchants[id]).filter(Boolean);
  };

  return (
    <FavoriteContext.Provider value={{ state, toggleFavorite, isFavorite, getFavoriteMerchants }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error('useFavorite must be used within a FavoriteProvider');
  }
  return context;
};