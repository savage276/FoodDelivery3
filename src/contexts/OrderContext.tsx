import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Order } from '../types';

interface OrderState {
  orders: Order[];
}

interface OrderContextType {
  state: OrderState;
  addOrder: (order: Order) => void;
  getOrders: () => Order[];
  clearOrders: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const getInitialState = (): OrderState => {
  const savedState = localStorage.getItem('orders');
  return savedState ? JSON.parse(savedState) : { orders: [] };
};

type OrderAction =
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'CLEAR_ORDERS' };

const orderReducer = (state: OrderState, action: OrderAction): OrderState => {
  switch (action.type) {
    case 'ADD_ORDER': {
      // Check if order already exists
      const orderExists = state.orders.some(order => order.id === action.payload.id);
      if (orderExists) {
        return state;
      }
      
      const newOrders = [action.payload, ...state.orders];
      localStorage.setItem('orders', JSON.stringify({ orders: newOrders }));
      return {
        ...state,
        orders: newOrders
      };
    }
    case 'SET_ORDERS': {
      return {
        ...state,
        orders: action.payload
      };
    }
    case 'CLEAR_ORDERS': {
      localStorage.setItem('orders', JSON.stringify({ orders: [] }));
      return {
        ...state,
        orders: []
      };
    }
    default:
      return state;
  }
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, getInitialState());

  const addOrder = (order: Order) => {
    dispatch({ type: 'ADD_ORDER', payload: order });
  };

  const getOrders = () => {
    return state.orders;
  };

  const clearOrders = () => {
    dispatch({ type: 'CLEAR_ORDERS' });
  };

  return (
    <OrderContext.Provider value={{ state, addOrder, getOrders, clearOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};