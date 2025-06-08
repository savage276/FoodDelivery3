import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { Merchant } from '../types';
import {
  merchantLogin,
  merchantRegister,
  checkMerchantAuth,
  merchantLogout as merchantLogoutApi,
} from '../services/api_merchants';
import Cookies from "js-cookie";

interface MerchantAuthContextType {
  merchant: Merchant | null;
  token: string | null;
  loading: boolean;
  merchant_login: (account: string, password: string) => Promise<void>;
  merchant_register: (name: string, account: string, password: string, contact: string) => Promise<void>;
  merchant_logout: () => void;
}

const MerchantAuthContext = createContext<MerchantAuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ['/login', '/register'];

export const MerchantAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // 获取持久化的token
        const auth_token = Cookies.get('merchant_auth_token');
        if (!auth_token) {
          // 无token，如果在商家路由则重定向到登录页
          if (location.pathname.startsWith('/merchant')) {
            navigate('/login?tab=merchant', { replace: true });
          }
        } else {
          // 有token，验证token合法性
          const auth = await checkMerchantAuth();
          if (auth) {
            // 合法
            setMerchant(auth.data.merchant);
            setToken(auth.data.token);

            // Only redirect if on a public route
            if (PUBLIC_ROUTES.includes(location.pathname)) {
              navigate('/merchant/dashboard', { replace: true });
            }
          } else if (location.pathname.startsWith('/merchant')) {
            // 非法且在商家路由
            navigate('/login?tab=merchant', { replace: true });
          }
        }
      } catch (error) {
        console.error('Merchant auth initialization error:', error);
        if (location.pathname.startsWith('/merchant')) {
          navigate('/login?tab=merchant', { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const merchant_login = async (account: string, password: string) => {
    try {
      const response = await merchantLogin({ account, password });

      // Update state first
      setMerchant(response.data.merchant);
      setToken(response.data.token);

      message.success('登录成功');

      // Navigate after state is updated
      navigate('/merchant/dashboard', { replace: true });
    } catch (error) {
      message.error(error instanceof Error ? error.message : '登录失败');
      throw error;
    }
  };

  const merchant_register = async (name: string, account: string, password: string, contact: string) => {
    try {
      const response = await merchantRegister({ name, account, password, contact });

      // Update state first
      setMerchant(response.data.merchant);
      setToken(response.data.token);

      message.success('注册成功');

      // Navigate after state is updated
      setTimeout(() => {
        navigate('/merchant/dashboard', { replace: true });
      }, 100);
    } catch (error) {
      message.error(error instanceof Error ? error.message : '注册失败');
      throw error;
    }
  };

  const merchant_logout = () => {
    merchantLogoutApi();
    setMerchant(null);
    setToken(null);
    message.success('已退出登录');
    navigate('/login?tab=merchant', { replace: true });
  };

  return (
    <MerchantAuthContext.Provider value={{ merchant, token, loading, merchant_login, merchant_register, merchant_logout }}>
      {loading ? null : children}
    </MerchantAuthContext.Provider>
  );
};

export const useMerchantAuth = () => {
  const context = useContext(MerchantAuthContext);
  if (context === undefined) {
    throw new Error('useMerchantAuth must be used within a MerchantAuthProvider');
  }
  return context;
};