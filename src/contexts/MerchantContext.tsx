import React, { createContext, useContext } from 'react';
import { Merchant } from '../types';

// 统一的商家数据
const mockMerchants: Record<string, Merchant> = {
  '1': {
    id: '1',
    name: '粤香茶餐厅',
    logo: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg',
    coverImage: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
    cuisine: ['粤菜', '茶餐厅', '港式'],
    rating: 4.8,
    deliveryTime: 25,
    deliveryFee: 2.99,
    minOrder: 15,
    distance: 1.2,
    promotions: [
      { id: 'p1', type: 'discount', description: '新用户下单立减20%' }
    ],
    isNew: false,
    averagePrice: 50
  },
  '2': {
    id: '2',
    name: '蜀香坊',
    logo: 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg',
    coverImage: 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg',
    cuisine: ['川菜', '火锅', '小吃'],
    rating: 4.6,
    deliveryTime: 35,
    deliveryFee: 3.99,
    minOrder: 20,
    distance: 2.1,
    promotions: [
      { id: 'p2', type: 'discount', description: '下单满100减20' }
    ],
    isNew: false,
    averagePrice: 75
  },
  '3': {
    id: '3',
    name: '寿司の神',
    logo: 'https://images.pexels.com/photos/359993/pexels-photo-359993.jpeg',
    coverImage: 'https://images.pexels.com/photos/858508/pexels-photo-858508.jpeg',
    cuisine: ['日料', '寿司', '刺身'],
    rating: 4.7,
    deliveryTime: 20,
    deliveryFee: 3.99,
    minOrder: 25,
    distance: 1.8,
    promotions: [
      { id: 'p3', type: 'gift', description: '订单满200赠送味增汤' }
    ],
    averagePrice: 150
  },
  '4': {
    id: '4',
    name: '首尔烤肉',
    logo: 'https://images.pexels.com/photos/2233729/pexels-photo-2233729.jpeg',
    coverImage: 'https://images.pexels.com/photos/2233729/pexels-photo-2233729.jpeg',
    cuisine: ['韩餐', '烤肉', '韩式料理'],
    rating: 4.5,
    deliveryTime: 30,
    deliveryFee: 4.99,
    minOrder: 30,
    distance: 2.5,
    promotions: [
      { id: 'p4', type: 'discount', description: '双人套餐立减30' }
    ],
    averagePrice: 120
  },
  '5': {
    id: '5',
    name: '米兰西餐厅',
    logo: 'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg',
    coverImage: 'https://images.pexels.com/photos/1527603/pexels-photo-1527603.jpeg',
    cuisine: ['意餐', '披萨', '牛排'],
    rating: 4.4,
    deliveryTime: 40,
    deliveryFee: 5.99,
    minOrder: 35,
    distance: 3.0,
    promotions: [
      { id: 'p5', type: 'discount', description: '工作日午市9折' }
    ],
    averagePrice: 100
  },
  '6': {
    id: '6',
    name: '泰厨海鲜',
    logo: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg',
    coverImage: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg',
    cuisine: ['泰餐', '海鲜', '东南亚菜'],
    rating: 4.6,
    deliveryTime: 35,
    deliveryFee: 4.99,
    minOrder: 25,
    distance: 2.8,
    promotions: [
      { id: 'p6', type: 'gift', description: '赠送冬阴功汤' }
    ],
    averagePrice: 90
  },
  '7': {
    id: '7',
    name: '老北京面馆',
    logo: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
    coverImage: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
    cuisine: ['面食', '北京菜', '早点'],
    rating: 4.3,
    deliveryTime: 25,
    deliveryFee: 1.99,
    minOrder: 15,
    distance: 1.5,
    promotions: [],
    isNew: true,
    averagePrice: 30
  },
  '8': {
    id: '8',
    name: '巴黎甜品坊',
    logo: 'https://images.pexels.com/photos/1854652/pexels-photo-1854652.jpeg',
    coverImage: 'https://images.pexels.com/photos/1854652/pexels-photo-1854652.jpeg',
    cuisine: ['法式甜点', '咖啡', '下午茶'],
    rating: 4.7,
    deliveryTime: 20,
    deliveryFee: 2.99,
    minOrder: 20,
    distance: 1.7,
    promotions: [
      { id: 'p8', type: 'discount', description: '下午茶套餐85折' }
    ],
    averagePrice: 45
  },
  '9': {
    id: '9',
    name: '墨西哥玉米卷',
    logo: 'https://images.pexels.com/photos/2087748/pexels-photo-2087748.jpeg',
    coverImage: 'https://images.pexels.com/photos/4958641/pexels-photo-4958641.jpeg',
    cuisine: ['墨西哥菜', '玉米卷', '快餐'],
    rating: 4.3,
    deliveryTime: 30,
    deliveryFee: 3.99,
    minOrder: 20,
    distance: 2.2,
    promotions: [],
    averagePrice: 55
  },
  '10': {
    id: '10',
    name: '印度风味坊',
    logo: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg',
    coverImage: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg',
    cuisine: ['印度菜', '咖喱', '烤饼'],
    rating: 4.4,
    deliveryTime: 40,
    deliveryFee: 4.99,
    minOrder: 25,
    distance: 3.0,
    promotions: [
      { id: 'p10', type: 'gift', description: '赠送印度飞饼' }
    ],
    averagePrice: 65
  }
};

interface MerchantContextType {
  merchants: Record<string, Merchant>;
  getAllMerchants: () => Merchant[];
  getMerchant: (id: string) => Merchant | null;
}

const MerchantContext = createContext<MerchantContextType | undefined>(undefined);

export const MerchantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getAllMerchants = () => Object.values(mockMerchants);
  
  const getMerchant = (id: string) => mockMerchants[id] || null;

  return (
    <MerchantContext.Provider value={{ merchants: mockMerchants, getAllMerchants, getMerchant }}>
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