import React, { createContext, useContext, useReducer } from 'react';
import { User, Address } from '../types';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
}

interface UserContextType {
  state: UserState;
  updateProfile: (updates: Partial<User>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, updates: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  updateSettings: (settings: Partial<User['settings']>) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock initial user data
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

type UserAction =
  | { type: 'UPDATE_PROFILE'; payload: Partial<User> }
  | { type: 'ADD_ADDRESS'; payload: Address }
  | { type: 'UPDATE_ADDRESS'; payload: { id: string; updates: Partial<Address> } }
  | { type: 'DELETE_ADDRESS'; payload: string }
  | { type: 'SET_DEFAULT_ADDRESS'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<User['settings']> }
  | { type: 'LOGOUT' };

const userReducer = (state: UserState, action: UserAction): UserState => {
  if (!state.user) return state;

  switch (action.type) {
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };

    case 'ADD_ADDRESS':
      if (state.user.addresses.length >= 10) {
        console.error('Maximum address limit reached');
        return state;
      }
      return {
        ...state,
        user: {
          ...state.user,
          addresses: [...state.user.addresses, action.payload]
        }
      };

    case 'UPDATE_ADDRESS':
      return {
        ...state,
        user: {
          ...state.user,
          addresses: state.user.addresses.map(addr =>
            addr.id === action.payload.id
              ? { ...addr, ...action.payload.updates }
              : addr
          )
        }
      };

    case 'DELETE_ADDRESS':
      return {
        ...state,
        user: {
          ...state.user,
          addresses: state.user.addresses.filter(addr => addr.id !== action.payload)
        }
      };

    case 'SET_DEFAULT_ADDRESS':
      return {
        ...state,
        user: {
          ...state.user,
          addresses: state.user.addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === action.payload
          }))
        }
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        user: {
          ...state.user,
          settings: {
            ...state.user.settings,
            ...action.payload
          }
        }
      };

    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false
      };

    default:
      return state;
  }
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, {
    user: mockUser,
    isAuthenticated: true
  });

  const updateProfile = (updates: Partial<User>) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: updates });
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...address,
      id: `addr${Date.now()}`
    };
    dispatch({ type: 'ADD_ADDRESS', payload: newAddress });
  };

  const updateAddress = (id: string, updates: Partial<Address>) => {
    dispatch({ type: 'UPDATE_ADDRESS', payload: { id, updates } });
  };

  const deleteAddress = (id: string) => {
    dispatch({ type: 'DELETE_ADDRESS', payload: id });
  };

  const setDefaultAddress = (id: string) => {
    dispatch({ type: 'SET_DEFAULT_ADDRESS', payload: id });
  };

  const updateSettings = (settings: Partial<User['settings']>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <UserContext.Provider
      value={{
        state,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        updateSettings,
        logout
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};