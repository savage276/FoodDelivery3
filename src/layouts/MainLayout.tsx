import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Layout, Drawer } from 'antd';
import styled from 'styled-components';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import { customStyles } from '../styles/theme';

const { Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledContent = styled(Content)`
  padding-top: 64px;
  background-color: ${customStyles.colors.background};
`;

const MainLayout: React.FC = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();

  // Don't show cart drawer on cart/checkout pages
  const showCartDrawer = !location.pathname.includes('/cart') && 
                          !location.pathname.includes('/checkout') &&
                          !location.pathname.includes('/order-confirmation');

  return (
    <StyledLayout>
      <Header onCartClick={() => setCartOpen(true)} />
      <StyledContent>
        <Outlet />
      </StyledContent>
      <Footer />
      
      {showCartDrawer && (
        <CartDrawer 
          open={cartOpen} 
          onClose={() => setCartOpen(false)} 
        />
      )}
    </StyledLayout>
  );
};

export default MainLayout;