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
const mockDelay = () => new Promise(resolve => setTimeout(resolve, 1000));

// Mock merchant data
const mockMerchant: Merchant = {
  id: 'merchant1',
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
  averagePrice: 50,
  email: 'merchant@example.com',
  phone: '13800138001',
  address: '北京市朝阳区某某路123号',
  description: '正宗粤菜，传承经典口味',
  isActive: true
};

// Mock menu items
const mockMenuItems: MenuItem[] = [
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
];

export const merchantLogin = async (credentials: MerchantLoginCredentials): Promise<MerchantAuthResponse> => {
  await mockDelay();

  // Mock validation
  if (!credentials.account || !credentials.password) {
    throw new ApiError('请输入账户和密码');
  }

  // Mock successful login
  if (credentials.account === 'merchant@example.com' && credentials.password === 'password') {
    const token = 'mock-merchant-jwt-token';
    Cookies.set('merchant_auth_token', token);
    Cookies.set('merchant_role_type', 'Merchant');
    return {
      success: true,
      data: {
        merchant: mockMerchant,
        token
      }
    };
  }

  throw new ApiError('账户或密码错误');
};

export const merchantRegister = async (data: MerchantRegisterData): Promise<MerchantAuthResponse> => {
  await mockDelay();

  // Mock validation
  if (!data.name || !data.account || !data.password || !data.contact) {
    throw new ApiError('请填写所有必填字段');
  }

  if (data.account === 'merchant@example.com') {
    throw new ApiError('该账户已被注册');
  }

  // Mock successful registration
  const token = 'mock-merchant-jwt-token';
  const newMerchant = {
    ...mockMerchant,
    name: data.name,
    email: data.account,
    phone: data.contact
  };

  Cookies.set('merchant_auth_token', token);
  Cookies.set('merchant_role_type', 'Merchant');
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
};

export const checkMerchantAuth = async (): Promise<MerchantAuthResponse | null> => {
  const token = Cookies.get('merchant_auth_token');
  if (!token) return null;

  await mockDelay();
  return {
    success: true,
    data: {
      merchant: mockMerchant,
      token
    }
  };
};

export const fetchMerchantMenu = async (): Promise<MenuItem[]> => {
  await mockDelay();
  return mockMenuItems;
};

export const addMenuItem = async (item: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
  await mockDelay();
  const newItem: MenuItem = {
    ...item,
    id: `m${Date.now()}`
  };
  mockMenuItems.push(newItem);
  return newItem;
};

export const updateMenuItem = async (id: string, item: Partial<MenuItem>): Promise<MenuItem> => {
  await mockDelay();
  const index = mockMenuItems.findIndex(menuItem => menuItem.id === id);
  if (index === -1) {
    throw new ApiError('菜品不存在');
  }
  mockMenuItems[index] = { ...mockMenuItems[index], ...item };
  return mockMenuItems[index];
};

export const deleteMenuItem = async (id: string): Promise<void> => {
  await mockDelay();
  const index = mockMenuItems.findIndex(menuItem => menuItem.id === id);
  if (index === -1) {
    throw new ApiError('菜品不存在');
  }
  mockMenuItems.splice(index, 1);
};