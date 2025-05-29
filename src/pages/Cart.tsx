import React, { useState } from 'react';
import { 
  Typography, 
  Row, 
  Col, 
  Button, 
  Divider, 
  Space, 
  Card, 
  List,
  Input,
  Form,
  InputNumber,
  Radio,
  Alert
} from 'antd';
import { 
  Clock, 
  MapPin, 
  DollarSign, 
  Info, 
  Heart, 
  Star, 
  Phone,
  Navigation,
  AlertCircle,
  Share2,
  ChevronLeft,
  Plus,
  Minus,
  Trash2,
  ShoppingCart
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CartItem } from '../types';
import { customStyles } from '../styles/theme';
import { useCart } from '../contexts/CartContext';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const CartHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const BackButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SidebarContent = styled.div`
  position: sticky;
  top: 24px;
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
`;

const ItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemNote = styled(Text)`
  display: block;
  font-size: 12px;
  color: ${customStyles.colors.textLight};
  margin-top: 4px;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f5f5f5;
  padding: 4px;
  border-radius: 4px;
`;

const ActionButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  height: auto;
`;

const SummaryCard = styled(Card)`
  margin-bottom: 16px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const TotalRow = styled(SummaryRow)`
  font-weight: bold;
  font-size: 16px;
`;

const PromoInput = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

const CheckoutButton = styled(Button)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { state: cartState, updateQuantity, removeItem, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');
  const [utensils, setUtensils] = useState(true);
  
  const handleQuantityChange = (id: string, change: number) => {
    updateQuantity(id, change);
  };
  
  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };
  
  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'FIRST20') {
      setPromoApplied(true);
    }
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  const subtotal = cartState.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discount = promoApplied ? subtotal * 0.2 : 0;
  const deliveryFee = 2.99;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + deliveryFee + tax;
  
  const minOrderMet = subtotal >= 15; // Minimum order amount
  
  return (
    <PageContainer>
      <CartHeader>
        <BackButton 
          type="text" 
          icon={<ChevronLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          返回
        </BackButton>
        <Title level={2} style={{ margin: 0 }}>购物车</Title>
      </CartHeader>
      
      {cartState.items.length > 0 ? (
        <ContentContainer>
          <MainContent>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Title level={4} style={{ margin: 0 }}>{cartState.merchantName}</Title>
              <Link to={`/merchants/${cartState.merchantId}`} style={{ fontSize: '14px' }}>
                查看餐厅
              </Link>
            </div>
            
            <List
              itemLayout="horizontal"
              dataSource={cartState.items}
              renderItem={item => (
                <List.Item>
                  <Space align="start" style={{ width: '100%' }}>
                    <ItemImage src={item.image} alt={item.name} />
                    
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
                          onClick={() => handleQuantityChange(item.id, -1)}
                          disabled={item.quantity <= 1}
                        />
                        
                        <Text>{item.quantity}</Text>
                        
                        <ActionButton 
                          type="text" 
                          icon={<Plus size={12} />} 
                          onClick={() => handleQuantityChange(item.id, 1)}
                        />
                        
                        <ActionButton 
                          type="text" 
                          danger 
                          icon={<Trash2 size={14} />} 
                          onClick={() => handleRemoveItem(item.id)}
                        />
                      </QuantityControl>
                      
                      <Text strong>¥{(item.price * item.quantity).toFixed(2)}</Text>
                    </Space>
                  </Space>
                </List.Item>
              )}
            />
            
            <Divider />
            
            <Form layout="vertical">
              <Form.Item label="订单备注">
                <TextArea 
                  rows={3} 
                  placeholder="有什么特殊要求或注意事项吗？" 
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                />
              </Form.Item>
              
              <Form.Item>
                <Radio.Group value={utensils} onChange={(e) => setUtensils(e.target.value)}>
                  <Space direction="vertical">
                    <Radio value={true}>需要餐具和纸巾</Radio>
                    <Radio value={false}>不需要餐具（环保选择）</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </Form>
          </MainContent>
          
          <SidebarContent>
            <SummaryCard title="订单摘要">
              <SummaryRow>
                <Text>小计</Text>
                <Text>¥{subtotal.toFixed(2)}</Text>
              </SummaryRow>
              
              {promoApplied && (
                <SummaryRow>
                  <Text type="success">优惠 (20%)</Text>
                  <Text type="success">-¥{discount.toFixed(2)}</Text>
                </SummaryRow>
              )}
              
              <SummaryRow>
                <Text>配送费</Text>
                <Text>¥{deliveryFee.toFixed(2)}</Text>
              </SummaryRow>
              
              <SummaryRow>
                <Text>税费</Text>
                <Text>¥{tax.toFixed(2)}</Text>
              </SummaryRow>
              
              <Divider style={{ margin: '12px 0' }} />
              
              <TotalRow>
                <Text>总计</Text>
                <Text>¥{total.toFixed(2)}</Text>
              </TotalRow>
              
              <PromoInput>
                <Input 
                  placeholder="优惠码" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={promoApplied}
                />
                <Button 
                  type="primary" 
                  onClick={handleApplyPromo}
                  disabled={promoApplied || !promoCode}
                >
                  使用
                </Button>
              </PromoInput>
            </SummaryCard>
            
            {!minOrderMet && (
              <Alert
                message={`最低起送金额 ¥15.00`}
                description={`还差 ¥${(15 - subtotal).toFixed(2)} 才能下单`}
                type="warning"
                showIcon
                icon={<AlertCircle size={16} />}
                style={{ marginBottom: customStyles.spacing.md }}
              />
            )}
            
            <CheckoutButton 
              type="primary" 
              size="large"
              icon={<ShoppingCart size={18} />}
              onClick={handleCheckout}
              disabled={!minOrderMet}
            >
              去结算 (¥{total.toFixed(2)})
            </CheckoutButton>
          </SidebarContent>
        </ContentContainer>
      ) : (
        <Card style={{ textAlign: 'center', padding: '48px' }}>
          <ShoppingCart size={48} style={{ color: customStyles.colors.textLight, marginBottom: '16px' }} />
          <Title level={3}>购物车是空的</Title>
          <Paragraph>看起来您还没有添加任何商品</Paragraph>
          <Button 
            type="primary" 
            size="large"
            onClick={() => navigate('/')}
            style={{ marginTop: '16px' }}
          >
            浏览餐厅
          </Button>
        </Card>
      )}
    </PageContainer>
  );
};

export default Cart;