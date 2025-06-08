import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import store from './store'
import { ConfigProvider } from 'antd';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { MerchantAuthProvider } from './contexts/MerchantAuthContext';
import { CartProvider } from './contexts/CartContext';
import { FavoriteProvider } from './contexts/FavoriteContext';
import { OrderProvider } from './contexts/OrderContext';
import { UserProvider } from './contexts/UserContext';
import { theme } from './styles/theme';
import './index.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>
          <ConfigProvider theme={theme}>
            <AuthProvider>
              <MerchantAuthProvider>
                <UserProvider>
                  <OrderProvider>
                    <FavoriteProvider>
                      <CartProvider>
                        <App />
                      </CartProvider>
                    </FavoriteProvider>
                  </OrderProvider>
                </UserProvider>
              </MerchantAuthProvider>
            </AuthProvider>
          </ConfigProvider>
        </BrowserRouter>
      </Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);