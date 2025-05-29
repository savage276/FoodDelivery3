import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Result, 
  Button, 
  Card, 
  Steps, 
  Space, 
  Divider, 
  List, 
  Tag,
  Row,
  Col
} from 'antd';
import { 
  CheckCircle, 
  Clock, 
  ChefHat, 
  Truck, 
  Home, 
  MapPin, 
  Phone,
  Share2,
  MessageSquare
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Order } from '../types';
import { customStyles } from '../styles/theme';
import { useOrder } from '../contexts/OrderContext';
import BackButton from '../components/BackButton';

const { Title, Text, Paragraph } = Typography;

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${customStyles.spacing.lg};
  
  @media (max-width: 768px) {
    padding: ${customStyles.spacing.md};
  }
`;

const StyledCard = styled(Card)`
  margin-bottom: ${customStyles.spacing.md};
  border-radius: 8px;
  box-shadow: ${customStyles.shadows.small};
`;

const DeliveryInfoCard = styled(StyledCard)`
  background-color: #f6ffed;
  border-color: ${customStyles.colors.primary};
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const TotalRow = styled(SummaryRow)`
  margin-top: ${customStyles.spacing.md};
  font-weight: bold;
  font-size: 16px;
`;

const DeliveryMap = styled.div`
  height: 200px;
  background-color: #e5e5e5;
  border-radius: 8px;
  margin-bottom: ${customStyles.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${customStyles.colors.textSecondary};
`;

const ContactButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  
  svg {
    margin-right: 8px;
  }
`;

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addOrder } = useOrder();
  const [order, setOrder] = useState<Order>(location.state?.order);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState('30-45');
  
  useEffect(() => {
    if (!order) {
      navigate('/');
      return;
    }
    
    // Add order only once when component mounts
    addOrder(order);
  }, []);
  
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setCurrentStep(1);
      setTimeLeft('25-35');
    }, 5000);
    
    const timer2 = setTimeout(() => {
      setCurrentStep(2);
      setTimeLeft('15-20');
    }, 15000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);
  
  if (!order) {
    return null;
  }
  
  const subtotal = order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  
  return (
    <PageContainer>
      <BackButton onNavigateBack={() => navigate('/')} />
      <Result
        status="success"
        title="订单提交成功！"
        subTitle={`订单编号: ${order.id}`}
        extra={[
          <Button type="primary" key="track" onClick={() => navigate('/profile')}>
            查看全部订单
          </Button>,
          <Button key="home" onClick={() => navigate('/')}>
            返回首页
          </Button>,
        ]}
      />
      
      <DeliveryInfoCard>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={16}>
            <Title level={4}>订单状态</Title>
            <Steps
              current={currentStep}
              items={[
                {
                  title: '已确认',
                  icon: <CheckCircle size={16} />,
                },
                {
                  title: '制作中',
                  icon: <ChefHat size={16} />,
                },
                {
                  title: '配送中',
                  icon: <Truck size={16} />,
                },
                {
                  title: '已送达',
                  icon: <Home size={16} />,
                }
              ]}
              size="small"
            />
            
            <div style={{ marginTop: '16px' }}>
              <Space align="center">
                <Clock size={20} color={customStyles.colors.primary} />
                <Text strong>预计{timeLeft}分钟送达</Text>
              </Space>
              <Paragraph style={{ marginTop: '8px' }}>
                您的美食{currentStep === 0 ? '已确认，即将开始制作' : 
                         currentStep === 1 ? '正在精心制作中' : 
                         '正在配送途中'}！
              </Paragraph>
            </div>
          </Col>
          
          <Col xs={24} md={8}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <ContactButton icon={<Phone size={16} />}>
                联系骑手
              </ContactButton>
              <ContactButton icon={<MessageSquare size={16} />}>
                发送消息
              </ContactButton>
              <ContactButton icon={<Share2 size={16} />}>
                分享订单
              </ContactButton>
            </Space>
          </Col>
        </Row>
      </DeliveryInfoCard>
      
      <DeliveryMap>
        配送地图将在这里显示
      </DeliveryMap>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <StyledCard title="配送信息">
            <Space align="start">
              <MapPin size={16} color={customStyles.colors.primary} />
              <div>
                <Text strong>{order.address.label}</Text>
                <div>{order.address.address}</div>
                <div>{order.address.city}</div>
              </div>
            </Space>
          </StyledCard>
        </Col>
        
        <Col xs={24} md={12}>
          <StyledCard title="商家信息">
            <Space align="start">
              <div>
                <Link to={`/merchants/${order.merchantId}`}>
                  <Text strong>{order.merchantName}</Text>
                </Link>
                <div>
                  <Phone size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  <Text type="secondary">(123) 456-7890</Text>
                </div>
              </div>
            </Space>
          </StyledCard>
        </Col>
      </Row>
      
      <StyledCard title="订单明细">
        <List
          dataSource={order.items}
          renderItem={item => (
            <List.Item>
              <div>
                {item.name} x{item.quantity}
                {item.notes && <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>{item.notes}</Text>}
              </div>
              <div>¥{(item.price * item.quantity).toFixed(2)}</div>
            </List.Item>
          )}
        />
        
        <Divider style={{ margin: '12px 0' }} />
        
        <SummaryRow>
          <Text>小计</Text>
          <Text>¥{subtotal.toFixed(2)}</Text>
        </SummaryRow>
        
        <SummaryRow>
          <Text>配送费</Text>
          <Text>¥{order.deliveryFee.toFixed(2)}</Text>
        </SummaryRow>
        
        <SummaryRow>
          <Text>税费</Text>
          <Text>¥{tax.toFixed(2)}</Text>
        </SummaryRow>
        
        <Divider style={{ margin: '12px 0' }} />
        
        <TotalRow>
          <Text>总计</Text>
          <Text>¥{order.totalPrice.toFixed(2)}</Text>
        </TotalRow>
        
        <div style={{ marginTop: '16px' }}>
          <Text type="secondary">
            支付方式: {order.paymentMethod === 'card' ? '信用卡/借记卡' : '货到付款'}
          </Text>
        </div>
      </StyledCard>
      
      <div style={{ textAlign: 'center', margin: '32px 0' }}>
        <Paragraph>
          订单有问题？<Link to="/profile">联系客服</Link>
        </Paragraph>
      </div>
    </PageContainer>
  );
};

export default OrderConfirmation;