import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Input, Badge, Avatar, Dropdown } from 'antd';
import { ShoppingCart, User, MapPin, Search, Package } from 'lucide-react';
import styled from 'styled-components';
import { useCart } from '../contexts/CartContext';
import { customStyles } from '../styles/theme';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  onCartClick: () => void;
}

const StyledHeader = styled(AntHeader)<{ $transparent?: boolean }>`
  position: fixed;
  width: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 0 ${customStyles.spacing.lg};
  background-color: ${props => props.$transparent ? 'transparent' : 'white'};
  box-shadow: ${props => props.$transparent ? 'none' : customStyles.shadows.small};
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  height: 64px;

  @media (max-width: 768px) {
    padding: 0 ${customStyles.spacing.md};
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: ${customStyles.colors.primary};
  margin-right: ${customStyles.spacing.lg};
  
  svg {
    margin-right: ${customStyles.spacing.xs};
  }
`;

const SearchWrapper = styled.div`
  flex: 1;
  max-width: 500px;
  margin: 0 ${customStyles.spacing.md};

  @media (max-width: 768px) {
    display: none;
  }
`;

const StyledSearch = styled(Input.Search)`
  .ant-input-wrapper {
    border-radius: 16px;
    overflow: hidden;
  }
`;

const RightMenu = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const LocationButton = styled(Button)`
  margin-right: ${customStyles.spacing.md};
  display: flex;
  align-items: center;
`;

const CartButton = styled(Button)`
  margin-right: ${customStyles.spacing.md};
`;

const userMenuItems = [
  {
    key: 'profile',
    label: '我的主页',
  },
  {
    key: 'orders',
    label: '我的订单',
  },
  {
    key: 'favorites',
    label: '收藏夹',
  },
  {
    key: 'logout',
    label: '退出登录',
  },
];

const Header: React.FC<HeaderProps> = ({ onCartClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [transparent, setTransparent] = useState(location.pathname === '/');
  const [scrolled, setScrolled] = useState(false);
  const { state: cartState } = useCart();

  useEffect(() => {
    setTransparent(location.pathname === '/');

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'profile' || key === 'orders') {
      navigate('/profile');
    }
  };

  const cartCount = cartState.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <StyledHeader $transparent={transparent && !scrolled}>
      <Logo to="/">
        <Package size={24} />
        美饭
      </Logo>

      <SearchWrapper>
        <StyledSearch
          placeholder="搜索餐厅或菜品"
          prefix={<Search size={16} />}
        />
      </SearchWrapper>

      <RightMenu>
        <LocationButton type="text" icon={<MapPin size={16} />}>
          当前位置
        </LocationButton>

        <CartButton 
          type="text" 
          icon={
            <Badge count={cartCount} size="small">
              <ShoppingCart size={20} />
            </Badge>
          }
          onClick={onCartClick}
        />

        <Dropdown 
          menu={{ items: userMenuItems, onClick: handleUserMenuClick }} 
          placement="bottomRight"
        >
          <Button type="text" icon={<User size={20} />} />
        </Dropdown>
      </RightMenu>
    </StyledHeader>
  );
};

export default Header;