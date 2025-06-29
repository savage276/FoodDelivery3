import axios from 'axios';
import Cookies from 'js-cookie';
import { Merchant, MenuItem, Order } from '../types';

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

// Storage keys
const MERCHANT_STORAGE_KEY = 'mockMerchants';
const MENU_STORAGE_KEY = 'mockMenuItems';
const ORDERS_STORAGE_KEY = 'mockOrders';

// Helper functions for localStorage persistence
const loadMerchantsFromStorage = (): Record<string, Merchant & { password: string }> => {
  try {
    const stored = localStorage.getItem(MERCHANT_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading merchants from storage:', error);
  }
  
  // Return initial mock data if nothing in storage
  return {
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
      isActive: true,
      password: 'password'
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
      isActive: true,
      password: 'password123'
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
      isActive: true,
      password: 'sushi2024'
    }
  };
};

const saveMerchantsToStorage = (merchants: Record<string, Merchant & { password: string }>) => {
  try {
    localStorage.setItem(MERCHANT_STORAGE_KEY, JSON.stringify(merchants));
  } catch (error) {
    console.error('Error saving merchants to storage:', error);
  }
};

const loadMenuItemsFromStorage = (): Record<string, MenuItem[]> => {
  try {
    const stored = localStorage.getItem(MENU_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading menu items from storage:', error);
  }
  
  // Return initial mock data if nothing in storage
  return {
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
};

const saveMenuItemsToStorage = (menuItems: Record<string, MenuItem[]>) => {
  try {
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menuItems));
  } catch (error) {
    console.error('Error saving menu items to storage:', error);
  }
};

const loadOrdersFromStorage = (): Order[] => {
  try {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading orders from storage:', error);
  }
  
  // Return initial mock orders
  return [
    {
      id: 'ORD001',
      merchantId: '1',
      merchantName: '粤香茶餐厅',
      userId: 'user1',
      userName: '张三',
      items: [
        {
          id: 'm1',
          name: '脆皮烧鸭',
          description: '选用优质鸭肉，传统粤式烧制',
          price: 68,
          image: 'https://images.pexels.com/photos/2611917/pexels-photo-2611917.jpeg',
          category: '特色推荐',
          quantity: 1,
          notes: '不要太辣'
        }
      ],
      totalPrice: 70.99,
      deliveryFee: 2.99,
      status: 'confirmed',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      estimatedDeliveryTime: '30-45分钟',
      address: {
        id: 'addr1',
        label: '家',
        city: '北京市',
        address: '朝阳区某某路123号'
      },
      paymentMethod: 'card'
    },
    {
      id: 'ORD002',
      merchantId: '2',
      merchantName: '蜀香坊',
      userId: 'user1',
      userName: '张三',
      items: [
        {
          id: 'm4',
          name: '麻婆豆腐',
          description: '经典川菜，麻辣鲜香',
          price: 28,
          image: 'https://images.pexels.com/photos/2611917/pexels-photo-2611917.jpeg',
          category: '川菜经典',
          quantity: 2
        }
      ],
      totalPrice: 59.99,
      deliveryFee: 3.99,
      status: 'preparing',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      estimatedDeliveryTime: '25-35分钟',
      address: {
        id: 'addr1',
        label: '家',
        city: '北京市',
        address: '朝阳区某某路123号'
      },
      paymentMethod: 'cash'
    },
    {
      id: 'ORD003',
      merchantId: '1',
      merchantName: '粤香茶餐厅',
      userId: 'user2',
      userName: '李四',
      items: [
        {
          id: 'm2',
          name: '白切鸡',
          description: '选用本地散养鸡',
          price: 48,
          image: 'https://images.pexels.com/photos/2611917/pexels-photo-2611917.jpeg',
          category: '特色推荐',
          quantity: 1
        }
      ],
      totalPrice: 50.99,
      deliveryFee: 2.99,
      status: 'pending',
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      estimatedDeliveryTime: '30-45分钟',
      address: {
        id: 'addr2',
        label: '公司',
        city: '北京市',
        address: '海淀区某某路456号'
      },
      paymentMethod: 'card'
    }
  ];
};

const saveOrdersToStorage = (orders: Order[]) => {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    console.log('🔄 Orders saved to localStorage:', orders.length, 'orders');
  } catch (error) {
    console.error('Error saving orders to storage:', error);
  }
};

// Initialize data from localStorage
let mockMerchants = loadMerchantsFromStorage();
let mockMenuItems = loadMenuItemsFromStorage();

// Mock API delay
const mockDelay = () => new Promise(resolve => setTimeout(resolve, 800));

// Event system for real-time updates
type EventCallback = (data: any) => void;
const eventListeners: Record<string, EventCallback[]> = {};

const emit = (event: string, data: any) => {
  console.log(`🚀 Emitting event: ${event}`, data);
  if (eventListeners[event]) {
    console.log(`📡 Found ${eventListeners[event].length} listeners for event: ${event}`);
    eventListeners[event].forEach(callback => {
      console.log(`📞 Calling listener for event: ${event}`);
      callback(data);
    });
  } else {
    console.log(`⚠️ No listeners found for event: ${event}`);
  }
};

const on = (event: string, callback: EventCallback) => {
  if (!eventListeners[event]) {
    eventListeners[event] = [];
  }
  eventListeners[event].push(callback);
  console.log(`👂 Added listener for event: ${event}. Total listeners: ${eventListeners[event].length}`);
};

const off = (event: string, callback: EventCallback) => {
  if (eventListeners[event]) {
    eventListeners[event] = eventListeners[event].filter(cb => cb !== callback);
    console.log(`🔇 Removed listener for event: ${event}. Remaining listeners: ${eventListeners[event].length}`);
  }
};

// Auth functions
export const merchantLogin = async (credentials: MerchantLoginCredentials): Promise<MerchantAuthResponse> => {
  await mockDelay();

  if (!credentials.account || !credentials.password) {
    throw new ApiError('请输入账户和密码');
  }

  // Search through all merchants for matching credentials
  const merchant = Object.values(mockMerchants).find(m => 
    (m.email === credentials.account || m.phone === credentials.account) && 
    m.password === credentials.password
  );

  if (merchant) {
    const token = 'mock-merchant-jwt-token';
    
    Cookies.set('merchant_auth_token', token, { expires: 7 });
    Cookies.set('merchant_role_type', 'Merchant', { expires: 7 });
    Cookies.set('current_merchant_id', merchant.id, { expires: 7 });
    
    // Return merchant without password
    const { password, ...merchantData } = merchant;
    
    return {
      success: true,
      data: {
        merchant: merchantData,
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

  // Check if account already exists
  const existingMerchant = Object.values(mockMerchants).find(m => 
    m.email === data.account || m.phone === data.account
  );
  
  if (existingMerchant) {
    throw new ApiError('该账户已被注册');
  }

  // Generate new merchant ID
  const newId = String(Date.now());
  const token = 'mock-merchant-jwt-token';
  
  const newMerchant: Merchant & { password: string } = {
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
    isActive: true,
    password: data.password
  };

  // Persist new merchant
  mockMerchants[newId] = newMerchant;
  mockMenuItems[newId] = [];
  
  // Save to localStorage immediately
  saveMerchantsToStorage(mockMerchants);
  saveMenuItemsToStorage(mockMenuItems);

  // Emit event for real-time updates
  const { password, ...merchantData } = newMerchant;
  emit('merchantRegistered', merchantData);

  Cookies.set('merchant_auth_token', token, { expires: 7 });
  Cookies.set('merchant_role_type', 'Merchant', { expires: 7 });
  Cookies.set('current_merchant_id', newId, { expires: 7 });
  
  return {
    success: true,
    data: {
      merchant: merchantData,
      token
    }
  };
};

export const merchantLogout = () => {
  Cookies.remove('merchant_auth_token');
  Cookies.remove('merchant_role_type');
  Cookies.remove('current_merchant_id');
};

export const checkMerchantAuth = async (): Promise<MerchantAuthResponse | null> => {
  const token = Cookies.get('merchant_auth_token');
  if (!token) return null;

  await mockDelay();
  
  const currentMerchantId = Cookies.get('current_merchant_id');
  if (!currentMerchantId || !mockMerchants[currentMerchantId]) {
    merchantLogout();
    return null;
  }
  
  const { password, ...merchantData } = mockMerchants[currentMerchantId];
  
  return {
    success: true,
    data: {
      merchant: merchantData,
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
  const { password, ...merchantData } = merchant;
  return { ...merchantData };
};

export const getMenuByMerchantId = async (merchantId: string): Promise<MenuItem[]> => {
  await mockDelay();
  return [...(mockMenuItems[merchantId] || [])];
};

export const getAllMerchants = async (): Promise<Merchant[]> => {
  await mockDelay();
  return Object.values(mockMerchants).map(merchant => {
    const { password, ...merchantData } = merchant;
    return { ...merchantData };
  });
};

// Order management functions - FIXED to always read from localStorage
export const fetchMerchantOrders = async (merchantId?: string): Promise<Order[]> => {
  console.log('🔍 fetchMerchantOrders called with merchantId:', merchantId);
  await mockDelay();
  
  // Always load fresh data from localStorage
  const currentOrders = loadOrdersFromStorage();
  
  const currentMerchantId = merchantId || Cookies.get('current_merchant_id');
  if (!currentMerchantId) {
    throw new ApiError('商家ID不存在');
  }
  
  const orders = currentOrders.filter(order => order.merchantId === currentMerchantId);
  console.log('📦 fetchMerchantOrders returning orders:', orders.length, 'orders for merchant', currentMerchantId);
  return orders;
};

export const fetchUserOrders = async (userId: string): Promise<Order[]> => {
  console.log('🔍 fetchUserOrders called with userId:', userId);
  await mockDelay();
  
  // Always load fresh data from localStorage
  const currentOrders = loadOrdersFromStorage();
  
  const orders = currentOrders.filter(order => order.userId === userId);
  console.log('📦 fetchUserOrders returning orders:', orders.length, 'orders for user', userId);
  return orders;
};

export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<Order> => {
  console.log('🔄 updateOrderStatus called:', { orderId, status });
  await mockDelay();
  
  // Always load fresh data from localStorage
  const currentOrders = loadOrdersFromStorage();
  
  const orderIndex = currentOrders.findIndex(order => order.id === orderId);
  if (orderIndex === -1) {
    throw new ApiError('订单不存在');
  }
  
  currentOrders[orderIndex].status = status;
  
  // Save updated orders back to localStorage
  saveOrdersToStorage(currentOrders);
  
  // Emit event for real-time updates
  console.log('🚀 About to emit orderStatusUpdated event');
  emit('orderStatusUpdated', { orderId, status, order: currentOrders[orderIndex] });
  
  return { ...currentOrders[orderIndex] };
};

export const addOrder = async (order: Omit<Order, 'id'>): Promise<Order> => {
  console.log('➕ addOrder called with order data:', order);
  await mockDelay();
  
  // Always load fresh data from localStorage
  const currentOrders = loadOrdersFromStorage();
  
  const newOrder: Order = {
    ...order,
    id: `ORD${Date.now()}`
  };
  
  console.log('📝 Created new order:', newOrder);
  
  currentOrders.unshift(newOrder);
  
  // Save updated orders back to localStorage
  saveOrdersToStorage(currentOrders);
  
  // Emit event for real-time updates
  console.log('🚀 About to emit orderAdded event for order:', newOrder.id);
  emit('orderAdded', newOrder);
  console.log('✅ orderAdded event emitted successfully');
  
  return { ...newOrder };
};

// Merchant management functions with real-time updates
export const updateMerchantProfile = async (merchantId: string, updates: Partial<Merchant>): Promise<Merchant> => {
  await mockDelay();
  
  if (!mockMerchants[merchantId]) {
    throw new ApiError('商家不存在');
  }
  
  // Update merchant data
  mockMerchants[merchantId] = { ...mockMerchants[merchantId], ...updates };
  
  // Save to localStorage
  saveMerchantsToStorage(mockMerchants);
  
  // Emit event for real-time updates
  const { password, ...merchantData } = mockMerchants[merchantId];
  emit('merchantUpdated', { merchantId, updates, merchant: merchantData });
  
  return { ...merchantData };
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
  
  // Save to localStorage
  saveMenuItemsToStorage(mockMenuItems);
  
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
  
  // Save to localStorage
  saveMenuItemsToStorage(mockMenuItems);
  
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
  
  // Save to localStorage
  saveMenuItemsToStorage(mockMenuItems);
  
  // Emit event for real-time updates
  emit('menuItemDeleted', { merchantId: id, itemId });
};

// Export event system for components to use
export { on, off, emit };