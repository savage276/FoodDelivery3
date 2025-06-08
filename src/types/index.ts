export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  gender?: 'male' | 'female' | 'other';
  birthday?: string;
  addresses: Address[];
  settings: UserSettings;
}

export interface Merchant {
  id: string;
  name: string;
  logo: string;
  coverImage: string;
  cuisine: string[];
  rating: number;
  deliveryTime: number;
  deliveryFee: number;
  minOrder: number;
  distance: number;
  promotions: Promotion[];
  isNew?: boolean;
  isFavorite?: boolean;
  averagePrice: number;
  // Merchant-specific fields
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
  isActive?: boolean;
}

export interface Address {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  address: string;
  zipCode: string;
  isDefault: boolean;
}

export interface UserSettings {
  notifications: {
    email: boolean;
    sms: boolean;
    promotions: boolean;
    orderUpdates: boolean;
  };
  privacy: {
    showProfile: boolean;
    showOrders: boolean;
    showReviews: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
  };
}

export interface Promotion {
  id: string;
  type: 'discount' | 'gift' | 'freeDelivery';
  description: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isSpicy?: boolean;
  isPopular?: boolean;
  isVegetarian?: boolean;
  stock?: number;
  isAvailable?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  merchantId: string;
  merchantName: string;
  items: CartItem[];
  totalPrice: number;
  deliveryFee: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';
  createdAt: string;
  estimatedDeliveryTime: string;
  address: Address;
  paymentMethod: 'cash' | 'card' | 'wallet';
}