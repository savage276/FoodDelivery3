import React from 'react';
import { Drawer, Typography, Button, List, Space, Divider, Empty } from 'antd';
import { Trash2, Minus, Plus } from 'lucide-react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { customStyles } from '../styles/theme';

const { Text, Title } = Typography;

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const StyledDrawer = styled(Drawer)`
  .ant-drawer-body {
    padding: 16px;
    display: flex;
    flex-direction: column;
    height: calc(100% - 55px);
  }
`;

const CartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${customStyles.spacing.md};
`;

const ItemList = styled(List)`
  flex: 1;
  overflow-y: auto;
  margin-bottom: ${customStyles.spacing.md};
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemNote = styled(Text)`
  font-size: 12px;
  font-style: italic;
  display: block;
  margin-top: 4px;
  color: ${customStyles.colors.textLight};
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActionButton = styled(Button)`
  min-width: 28px;
  height: 28px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CartSummary = styled.div`
  margin-top: auto;
  padding-top: ${customStyles.spacing.md};
  border-top: 1px solid ${customStyles.colors.border};
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const TotalRow = styled(SummaryRow)`
  margin-top: ${customStyles.spacing.md};
  margin-bottom: ${customStyles.spacing.md};
  font-weight: bold;
  font-size: 16px;
`;

const CheckoutButton = styled(Button)`
  width: 100%;
  height: 48px;
  font-size: 16px;
  margin-top: ${customStyles.spacing.md};
`;

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const { items, merchantName } = state;
  
  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };
  
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = 2.99;
  const total = subtotal + deliveryFee;
  
  return (
    <StyledDrawer
      title="购物车"
      placement="right"
      onClose={onClose}
      open={open}
      width={400}
    >
      {items.length > 0 ? (
        <>
          <CartHeader>
            <Text strong>{merchantName}</Text>
            <Button 
              type="text" 
              danger 
              onClick={clearCart}
              style={{ fontSize: '13px' }}
            >
              清空购物车
            </Button>
          </CartHeader>
          
          <ItemList
            dataSource={items}
            renderItem={(item : any) => (
              <List.Item>
                <Space align="start" style={{ width: '100%' }}>
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                  />
                  
                  <ItemInfo>
                    <Text strong>{item.name}</Text>
                    <Text style={{ display: 'block' }}>¥{item.price.toFixed(2)}</Text>
                    {item.notes && <ItemNote>{item.notes}</ItemNote>}
                  </ItemInfo>
                  
                  <Space direction="vertical" align="end">
                    <QuantityControl>
                      <ActionButton 
                        type="text" 
                        icon={<Minus size={12} />} 
                        onClick={() => updateQuantity(item.id, -1)}
                        disabled={item.quantity <= 1}
                      />
                      
                      <Text>{item.quantity}</Text>
                      
                      <ActionButton 
                        type="text" 
                        icon={<Plus size={12} />} 
                        onClick={() => updateQuantity(item.id, 1)}
                      />
                      
                      <ActionButton 
                        type="text" 
                        danger 
                        icon={<Trash2 size={14} />} 
                        onClick={() => removeItem(item.id)}
                      />
                    </QuantityControl>
                    
                    <Text strong>¥{(item.price * item.quantity).toFixed(2)}</Text>
                  </Space>
                </Space>
              </List.Item>
            )}
          />
          
          <CartSummary>
            <SummaryRow>
              <Text>小计</Text>
              <Text>¥{subtotal.toFixed(2)}</Text>
            </SummaryRow>
            
            <SummaryRow>
              <Text>配送费</Text>
              <Text>¥{deliveryFee.toFixed(2)}</Text>
            </SummaryRow>
            
            <Divider style={{ margin: '12px 0' }} />
            
            <TotalRow>
              <Text>总计</Text>
              <Text>¥{total.toFixed(2)}</Text>
            </TotalRow>
            
            <CheckoutButton 
              type="primary" 
              size="large"
              onClick={handleCheckout}
            >
              去结算
            </CheckoutButton>
          </CartSummary>
        </>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="购物车是空的"
          style={{ margin: '80px 0' }}
        >
          <Button type="primary" onClick={onClose}>
            浏览餐厅
          </Button>
        </Empty>
      )}
    </StyledDrawer>
  );
};

export default CartDrawer;