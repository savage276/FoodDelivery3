import Cookies from 'js-cookie';
import { User, Order } from '../types';
import { fetchUserOrders as fetchUserOrdersFromMerchants } from './api_merchants';

const API_BASE_URL = '/api';

export interface UserAuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message?: string;
}

export interface UserLoginCredentials {
  phone: string;
  password: string;
}

export interface UserRegisterData {
  username: string;
  email: string;
  password: string;
}

class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Mock API delay
const mockDelay = () => new Promise(resolve => setTimeout(resolve, 1000));

// Mock user data
const mockUser: User = {
  id: 'user1',
  name: '张三',
  email: 'zhangsan@example.com',
  phone: '13800138000',
  gender: 'male',
  birthday: '1990-01-01',
  addresses: [
    {
      id: 'addr1',
      label: '家',
      recipientName: '张三',
      phone: '13800138000',
      province: '北京市',
      city: '北京市',
      district: '朝阳区',
      address: '某某路123号',
      zipCode: '100000',
      isDefault: true
    }
  ],
  settings: {
    notifications: {
      email: true,
      sms: true,
      promotions: false,
      orderUpdates: true
    },
    privacy: {
      showProfile: true,
      showOrders: false,
      showReviews: true
    },
    security: {
      twoFactorEnabled: false,
      lastPasswordChange: '2023-01-01'
    }
  }
};

export const api_users_login = async (credentials: UserLoginCredentials): Promise<UserAuthResponse> => {
  await mockDelay();

  // Mock validation
  if (!credentials.phone || !credentials.password) {
    throw new ApiError('请输入邮箱和密码');
  }

  // Mock successful login
  if (credentials.phone === 'zhangsan@example.com' && credentials.password === 'password') {
    const token = 'mock-jwt-token';
    Cookies.set('auth_token', token, { expires: 7 });
    Cookies.set('role_type', 'User', { expires: 7 });
    return {
      success: true,
      data: {
        user: mockUser,
        token
      }
    };
  }

  throw new ApiError('邮箱或密码错误');
};

export const api_users_register = async (data: UserRegisterData): Promise<UserAuthResponse> => {
  await mockDelay();

  // Mock validation
  if (!data.username || !data.email || !data.password) {
    throw new ApiError('请填写所有必填字段');
  }

  if (data.email === 'zhangsan@example.com') {
    throw new ApiError('该邮箱已被注册');
  }

  // Mock successful registration
  const token = 'mock-jwt-token';
  const newUser = {
    ...mockUser,
    name: data.username,
    email: data.email
  };

  Cookies.set('auth_token', token, { expires: 7 });
  Cookies.set('role_type', 'User', { expires: 7 });
  return {
    success: true,
    data: {
      user: newUser,
      token
    }
  };
};

export const logout = () => {
  Cookies.remove('auth_token');
  Cookies.remove('role_type');
};

export const checkAuth = async (): Promise<UserAuthResponse | null> => {
  const token = Cookies.get('auth_token');
  if (!token) return null;

  await mockDelay();
  return {
    success: true,
    data: {
      user: mockUser,
      token
    }
  };
};

// Order functions - delegate to merchant API for unified data source
export const fetchUserOrders = async (userId: string): Promise<Order[]> => {
  return fetchUserOrdersFromMerchants(userId);
};