import axios from 'axios';
import Cookies from 'js-cookie';
import { Merchant, MenuItem } from '../types';

const API_BASE_URL = '/api';

export interface MerchantAuthResponse {
  success: boolean;
  data: {
    merchant: Merchant;
    token: string;
  };
  message?: string;
}

export interface MerchantLoginCredentials {
  account: string; // email or phone
  password: string;
}

export interface MerchantRegisterData {
  name: string;
  account: string; // email or phone
  password: string;
  contact: string;
}

class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Mock API delay
const mockDelay = () => new Promise(resolve => setTimeout(resolve, 800));

// Persistent mock data store - this simulates a real database
let mockMerchants: Record<string, Merchant> = {
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
    averagePrice: 50,
    email: 'merchant@example.com',
    phone: '13800138001',
    address: '北京市朝阳区某某路123号',
    description: '正宗粤菜，传承经典口味',
    isActive: true
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
    averagePrice: 75,
    email: 'sichuan@example.com',
    phone: '13800138002',
    address: '北京市海淀区某某路456号',
    description: '正宗川菜，麻辣鲜香',
    isActive: true
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
    averagePrice: 150,
    email: 'sushi@example.com',
    phone: '13800138003',
    address: '北京市朝阳区某某路789号',
    description: '新鲜日料，匠心制作',
    isActive: true
  }
};

// Mock menu items by merchant
let mockMenuItems: Record<string, MenuItem[]> = {
  '1': [
    {
      id: 'm1',
      name: '脆皮烧鸭',
      description: '选用优质鸭肉，传统粤式烧制，外皮金黄酥脆，肉质鲜嫩多汁',
      price: 68,
      image: 'https://images.pexels.com/photos/2611917/pexels-photo-2611917.jpeg',
      category: '特色推荐',
      isPopular: true,
      stock: 20,
      isAvailable: true
    },
    {
      id: 'm2',
      name: '白切鸡',
      description: '选用本地散养鸡，配以特制姜葱酱，肉质细嫩，口感鲜美',
      price: 48,
      image: 'https://images.pexels.com/photos/2611917/pexels-photo-2611917.jpeg',
      category: '特色推荐',
      isPopular: true,
      stock: 15,
      isAvailable: true
    },
    {
      id: 'm3',
      name: '蜜汁叉烧',
      description: '精选五花肉，秘制蜜汁腌制，烧制入味，肥瘦均匀',
      price: 42,
      image: 'https://images.pexels.com/photos/2611917/pexels-photo-2611917.jpeg',
      category: '粤式烧腊',
      stock: 25,
      isAvailable: true
    }
  ],
  '2': [
    {
      id: 'm4',
      name: '麻婆豆腐',
      description: '经典川菜，麻辣鲜香，豆腐嫩滑',
      price: 28,
      image: 'https://images.pexels.com/photos/2611917/pexels-photo-2611917.jpeg',
      category: '川菜经典',
      isPopular: true,
      stock: 30,
      isAvailable: true
    },
    {
      id: 'm5',
      name: '水煮鱼',
      description: '鲜嫩鱼片，麻辣汤底，配菜丰富',
      price: 58,
      image: 'https://images.pexels.com/photos/2611917/pexels-photo-2611917.jpeg',
      category: '川菜经典',
      isSpicy: true,
      stock: 20,
      isAvailable: true
    }
  ],
  '3': [
    {
      id: 'm6',
      name: '三文鱼刺身',
      description: '新鲜三文鱼，口感鲜美，营养丰富',
      price: 88,
      image: 'https://images.pexels.com/photos/2611917/pexels-photo-2611917.jpeg',
      category: '刺身',
      isPopular: true,
      stock: 15,
      isAvailable: true
    },
    {
      id: 'm7',
      name: '寿司拼盘',
      description: '多种寿司组合，口味丰富',
      price: 128,
      image: 'https://images.pexels.com/photos/2611917/pexels-photo-2611917.jpeg',
      category: '寿司',
      isPopular: true,
      stock: 10,
      isAvailable: true
    }
  ]
};

// Event system for real-time updates
type EventCallback = (data: any) => void;
const eventListeners: Record<string, EventCallback[]> = {};

const emit = (event: string, data: any) => {
  if (eventListeners[event]) {
    eventListeners[event].forEach(callback => callback(data));
  }
};

const on = (event: string, callback: EventCallback) => {
  if (!eventListeners[event]) {
    eventListeners[event] = [];
  }
  eventListeners[event].push(callback);
};

const off = (event: string, callback: EventCallback) => {
  if (eventListeners[event]) {
    eventListeners[event] = eventListeners[event].filter(cb => cb !== callback);
  }
};

// Auth functions
export const merchantLogin = async (credentials: MerchantLoginCredentials): Promise<MerchantAuthResponse> => {
  await mockDelay();

  if (!credentials.account || !credentials.password) {
    throw new ApiError('请输入账户和密码');
  }

  if (credentials.account === 'merchant@example.com' && credentials.password === 'password') {
    const token = 'mock-merchant-jwt-token';
    const merchantId = '1'; // Default merchant ID for demo login
    
    Cookies.set('merchant_auth_token', token, { expires: 7 });
    Cookies.set('merchant_role_type', 'Merchant', { expires: 7 });
    Cookies.set('current_merchant_id', merchantId, { expires: 7 }); // Store merchant ID
    
    return {
      success: true,
      data: {
        merchant: mockMerchants[merchantId],
        token
      }
    };
  }

  throw new ApiError('账户或密码错误');
};

export const merchantRegister = async (data: MerchantRegisterData): Promise<MerchantAuthResponse> => {
  await mockDelay();

  if (!data.name || !data.account || !data.password || !data.contact) {
    throw new ApiError('请填写所有必填字段');
  }

  if (data.account === 'merchant@example.com') {
    throw new ApiError('该账户已被注册');
  }

  // Generate new merchant ID
  const newId = String(Object.keys(mockMerchants).length + 1);
  const token = 'mock-merchant-jwt-token';
  
  const newMerchant: Merchant = {
    id: newId,
    name: data.name,
    email: data.account,
    phone: data.contact,
    logo: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg',
    coverImage: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
    cuisine: ['中餐'],
    rating: 5.0,
    deliveryTime: 30,
    deliveryFee: 3.99,
    minOrder: 20,
    distance: 2.0,
    promotions: [],
    isNew: true,
    averagePrice: 60,
    address: '待完善',
    description: '新注册商家',
    isActive: true
  };

  // Persist new merchant
  mockMerchants[newId] = newMerchant;
  mockMenuItems[newId] = [];

  // Emit event for real-time updates
  emit('merchantRegistered', newMerchant);

  Cookies.set('merchant_auth_token', token, { expires: 7 });
  Cookies.set('merchant_role_type', 'Merchant', { expires: 7 });
  Cookies.set('current_merchant_id', newId, { expires: 7 }); // Store new merchant ID
  
  return {
    success: true,
    data: {
      merchant: newMerchant,
      token
    }
  };
};

export const merchantLogout = () => {
  Cookies.remove('merchant_auth_token');
  Cookies.remove('merchant_role_type');
  Cookies.remove('current_merchant_id'); // Remove merchant ID
};

export const checkMerchantAuth = async (): Promise<MerchantAuthResponse | null> => {
  const token = Cookies.get('merchant_auth_token');
  if (!token) return null;

  await mockDelay();
  
  // Get the current merchant ID from cookies
  const currentMerchantId = Cookies.get('current_merchant_id');
  if (!currentMerchantId || !mockMerchants[currentMerchantId]) {
    // If no valid merchant ID found, clear auth and return null
    merchantLogout();
    return null;
  }
  
  return {
    success: true,
    data: {
      merchant: mockMerchants[currentMerchantId], // Return the correct merchant
      token
    }
  };
};

// Unified API functions for both user and merchant sides
export const getMerchantById = async (merchantId: string): Promise<Merchant> => {
  await mockDelay();
  const merchant = mockMerchants[merchantId];
  if (!merchant) {
    throw new ApiError('商家不存在');
  }
  return { ...merchant }; // Return a copy to prevent direct mutation
};

export const getMenuByMerchantId = async (merchantId: string): Promise<MenuItem[]> => {
  await mockDelay();
  return [...(mockMenuItems[merchantId] || [])]; // Return a copy
};

export const getAllMerchants = async (): Promise<Merchant[]> => {
  await mockDelay();
  return Object.values(mockMerchants).map(merchant => ({ ...merchant })); // Return copies
};

// Merchant management functions with real-time updates
export const updateMerchantProfile = async (merchantId: string, updates: Partial<Merchant>): Promise<Merchant> => {
  await mockDelay();
  
  if (!mockMerchants[merchantId]) {
    throw new ApiError('商家不存在');
  }
  
  // Update merchant data
  mockMerchants[merchantId] = { ...mockMerchants[merchantId], ...updates };
  
  // Emit event for real-time updates
  emit('merchantUpdated', { merchantId, updates, merchant: mockMerchants[merchantId] });
  
  return { ...mockMerchants[merchantId] };
};

export const fetchMerchantMenu = async (merchantId?: string): Promise<MenuItem[]> => {
  await mockDelay();
  const id = merchantId || '1';
  return [...(mockMenuItems[id] || [])];
};

export const addMenuItem = async (item: Omit<MenuItem, 'id'>, merchantId?: string): Promise<MenuItem> => {
  await mockDelay();
  const newItem: MenuItem = {
    ...item,
    id: `m${Date.now()}`
  };
  
  const id = merchantId || '1';
  if (!mockMenuItems[id]) {
    mockMenuItems[id] = [];
  }
  mockMenuItems[id].push(newItem);
  
  // Emit event for real-time updates
  emit('menuItemAdded', { merchantId: id, item: newItem });
  
  return { ...newItem };
};

export const updateMenuItem = async (itemId: string, item: Partial<MenuItem>, merchantId?: string): Promise<MenuItem> => {
  await mockDelay();
  const id = merchantId || '1';
  const menuItems = mockMenuItems[id] || [];
  const index = menuItems.findIndex(menuItem => menuItem.id === itemId);
  
  if (index === -1) {
    throw new ApiError('菜品不存在');
  }
  
  mockMenuItems[id][index] = { ...mockMenuItems[id][index], ...item };
  
  // Emit event for real-time updates
  emit('menuItemUpdated', { merchantId: id, itemId, item: mockMenuItems[id][index] });
  
  return { ...mockMenuItems[id][index] };
};

export const deleteMenuItem = async (itemId: string, merchantId?: string): Promise<void> => {
  await mockDelay();
  const id = merchantId || '1';
  const menuItems = mockMenuItems[id] || [];
  const index = menuItems.findIndex(menuItem => menuItem.id === itemId);
  
  if (index === -1) {
    throw new ApiError('菜品不存在');
  }
  
  mockMenuItems[id].splice(index, 1);
  
  // Emit event for real-time updates
  emit('menuItemDeleted', { merchantId: id, itemId });
};

// Export event system for components to use
export { on, off, emit };