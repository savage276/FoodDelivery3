import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './store'
import { ConfigProvider } from 'antd';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { FavoriteProvider } from './contexts/FavoriteContext';
import { OrderProvider } from './contexts/OrderContext';
import { MerchantProvider } from './contexts/MerchantContext';
import { UserProvider } from './contexts/UserContext';
import { theme } from './styles/theme';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ConfigProvider theme={theme}>
          <AuthProvider>
            <UserProvider>
              <MerchantProvider>
                <OrderProvider>
                  <FavoriteProvider>
                    <CartProvider>
                      <App />
                    </CartProvider>
                  </FavoriteProvider>
                </OrderProvider>
              </MerchantProvider>
            </UserProvider>
          </AuthProvider>
        </ConfigProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);