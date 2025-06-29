import React, { useState } from 'react';
import { 
  Typography, 
  Row, 
  Col, 
  Steps, 
  Button, 
  Form, 
  Input, 
  Select, 
  Radio, 
  Card, 
  Divider, 
  Space,
  List,
  Alert,
  Collapse,
  Modal,
  Tag
} from 'antd';
import { 
  ChevronLeft, 
  MapPin, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  Truck, 
  DollarSign,
  AlertCircle,
  ShoppingCart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CartItem, Address, Order } from '../types';
import { customStyles } from '../styles/theme';
import { useCart } from '../contexts/CartContext';
import BackButton from '../components/BackButton';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${customStyles.spacing.lg};
  
  @media (max-width: 768px) {
    padding: ${customStyles.spacing.md};
  }
`;

const CheckoutHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${customStyles.spacing.lg};
`;

const StepsContainer = styled.div`
  margin-bottom: ${customStyles.spacing.lg};
`;

const ContentContainer = styled.div`
  display: flex;
  gap: ${customStyles.spacing.lg};
  
  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

const MainContent = styled.div`
  flex: 3;
`;

const SidebarContent = styled.div`
  flex: 1;
`;

const StyledCard = styled(Card)`
  margin-bottom: ${customStyles.spacing.md};
  border-radius: 8px;
  box-shadow: ${customStyles.shadows.small};
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

const DeliveryTimeCard = styled(Card)`
  background-color: #f6ffed;
  border-color: ${customStyles.colors.primary};
  margin-bottom: ${customStyles.spacing.md};
`;

const PaymentOption = styled(Radio.Button)<{ $selected?: boolean }>`
  height: 80px;
  width: 100%;
  text-align: left;
  padding: 16px;
  margin-bottom: 8px;
  border-radius: 8px !important;
  display: flex;
  align-items: center;
  
  &.ant-radio-button-wrapper-checked {
    border-color: ${customStyles.colors.primary} !important;
    background-color: #f6ffed;
  }
  
  &::before {
    display: none !important;
  }
  
  svg {
    margin-right: 12px;
    color: ${props => props.$selected ? customStyles.colors.primary : customStyles.colors.textSecondary};
  }
`;

const AddressOption = styled(Radio.Button)<{ $selected?: boolean }>`
  height: auto;
  width: 100%;
  text-align: left;
  padding: 16px;
  margin-bottom: 8px;
  border-radius: 8px !important;
  display: block;
  
  &.ant-radio-button-wrapper-checked {
    border-color: ${customStyles.colors.primary} !important;
    background-color: #f6ffed;
  }
  
  &::before {
    display: none !important;
  }
`;

const AddressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  
  span {
    font-weight: bold;
  }
`;

const OrderButton = styled(Button)`
  width: 100%;
  height: 48px;
  font-size: 16px;
`;

// Mock addresses
const mockAddresses: Address[] = [
  {
    id: 'a1',
    label: '家',
    address: '朝阳区某某路123号',
    city: '北京市',
    zipCode: '100000',
    isDefault: true
  },
  {
    id: 'a2',
    label: '公司',
    address: '海淀区某某路456号',
    city: '北京市',
    zipCode: '100000',
    isDefault: false
  }
];

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { state: cartState, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [selectedAddress, setSelectedAddress] = useState(mockAddresses[0].id);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // Calculate totals
  const subtotal = cartState.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = 2.99;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  // Redirect if cart is empty
  React.useEffect(() => {
    if (cartState.items.length === 0) {
      navigate('/cart');
    }
  }, [cartState.items, navigate]);
  
  const handleStepChange = (step: number) => {
    form.validateFields()
      .then(() => {
        setCurrentStep(step);
      })
      .catch(error => {
        console.log('验证失败:', error);
      });
  };
  
  const handleAddressChange = (e: any) => {
    setSelectedAddress(e.target.value);
    if (e.target.value === 'new') {
      setShowNewAddressForm(true);
    } else {
      setShowNewAddressForm(false);
    }
  };
  
  const handlePlaceOrder = () => {
    setShowConfirmModal(true);
  };
  
  const confirmOrder = () => {
    setShowConfirmModal(false);
    setOrderProcessing(true);
    
    // Create new order object
    const newOrder: Order = {
      id: `ORD${Date.now()}`,
      merchantId: cartState.merchantId!,
      merchantName: cartState.merchantName!,
      items: cartState.items,
      totalPrice: total,
      deliveryFee: deliveryFee,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: '30-45分钟',
      address: mockAddresses.find(addr => addr.id === selectedAddress) || mockAddresses[0],
      paymentMethod: paymentMethod as 'card' | 'cash'
    };
    
    // 模拟订单处理
    setTimeout(() => {
      setOrderProcessing(false);
      // Clear cart after successful order
      clearCart();
      // Pass the order data through navigation
      navigate('/order-confirmation', { state: { order: newOrder } });
    }, 2000);
  };
  
  const renderDeliveryStep = () => {
    return (
      <StyledCard>
        <Title level={4}>配送地址</Title>
        
        <Form layout="vertical">
          <Form.Item>
            <Radio.Group 
              value={selectedAddress} 
              onChange={handleAddressChange}
              style={{ width: '100%' }}
            >
              {mockAddresses.map(address => (
                <AddressOption 
                  key={address.id} 
                  value={address.id}
                  $selected={selectedAddress === address.id}
                >
                  <AddressLabel>
                    <span>{address.label}</span>
                    {address.isDefault && <Tag color="green">默认</Tag>}
                  </AddressLabel>
                  <div>{address.address}</div>
                  <div>{address.city}</div>
                </AddressOption>
              ))}
              
              <AddressOption 
                value="new"
                $selected={selectedAddress === 'new'}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <MapPin size={16} style={{ marginRight: '8px' }} />
                  添加新地址
                </div>
              </AddressOption>
            </Radio.Group>
          </Form.Item>
          
          {showNewAddressForm && (
            <div style={{ border: '1px solid #f0f0f0', padding: '16px', borderRadius: '8px' }}>
              <Form.Item label="地址标签" name="addressLabel" rules={[{ required: true }]}>
                <Input placeholder="家、公司等" />
              </Form.Item>
              
              <Form.Item label="详细地址" name="streetAddress" rules={[{ required: true }]}>
                <Input placeholder="街道、门牌号" />
              </Form.Item>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="城市" name="city" rules={[{ required: true }]}>
                    <Input placeholder="城市" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="邮政编码" name="zipCode" rules={[{ required: true }]}>
                    <Input placeholder="邮政编码" />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item name="setDefault" valuePropName="checked">
                <Radio>设为默认地址</Radio>
              </Form.Item>
            </div>
          )}
          
          <Form.Item label="配送说明（可选）" name="deliveryInstructions">
            <Input.TextArea 
              placeholder="有什么特殊要求吗？（如：放在门口、到了打电话等）"
              rows={3}
            />
          </Form.Item>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Button 
              type="primary" 
              onClick={() => handleStepChange(1)}
            >
              继续支付
            </Button>
          </div>
        </Form>
      </StyledCard>
    );
  };
  
  const renderPaymentStep = () => {
    return (
      <StyledCard>
        <Title level={4}>支付方式</Title>
        
        <Form layout="vertical">
          <Form.Item>
            <Radio.Group 
              value={paymentMethod} 
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ width: '100%' }}
            >
              <PaymentOption 
                value="card"
                $selected={paymentMethod === 'card'}
              >
                <CreditCard size={24} />
                <div>
                  <div><strong>信用卡/借记卡</strong></div>
                  <Text type="secondary">支持Visa、Mastercard等</Text>
                </div>
              </PaymentOption>
              
              <PaymentOption 
                value="cash"
                $selected={paymentMethod === 'cash'}
              >
                <DollarSign size={24} />
                <div>
                  <div><strong>货到付款</strong></div>
                  <Text type="secondary">收货时现金支付</Text>
                </div>
              </PaymentOption>
            </Radio.Group>
          </Form.Item>
          
          {paymentMethod === 'card' && (
            <>
              <Form.Item label="卡号" name="cardNumber" rules={[{ required: true }]}>
                <Input placeholder="1234 5678 9012 3456" />
              </Form.Item>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="有效期" name="expiryDate" rules={[{ required: true }]}>
                    <Input placeholder="MM/YY" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="安全码" name="cvv" rules={[{ required: true }]}>
                    <Input placeholder="123" />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item label="持卡人姓名" name="nameOnCard" rules={[{ required: true }]}>
                <Input placeholder="张三" />
              </Form.Item>
            </>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
            <Button 
              onClick={() => handleStepChange(0)}
            >
              返回配送
            </Button>
            
            <Button 
              type="primary" 
              onClick={() => handleStepChange(2)}
            >
              确认订单
            </Button>
          </div>
        </Form>
      </StyledCard>
    );
  };
  
  const renderReviewStep = () => {
    // 获取选中的地址
    const address = mockAddresses.find(addr => addr.id === selectedAddress) || mockAddresses[0];
    
    return (
      <StyledCard>
        <Title level={4}>确认订单</Title>
        
        <Collapse defaultActiveKey={['1', '2', '3']} expandIconPosition="end">
          <Panel 
            header={
              <Space>
                <MapPin size={16} color={customStyles.colors.primary} />
                <Text strong>配送地址</Text>
              </Space>
            } 
            key="1"
          >
            <div>
              <Text strong>{address.label}</Text>
              <div>{address.address}</div>
              <div>{address.city}</div>
            </div>
          </Panel>
          
          <Panel 
            header={
              <Space>
                <CreditCard size={16} color={customStyles.colors.primary} />
                <Text strong>支付方式</Text>
              </Space>
            } 
            key="2"
          >
            <div>
              {paymentMethod === 'card' ? (
                <div>
                  <Text strong>信用卡/借记卡</Text>
                  <div>卡号尾号 **** 3456</div>
                </div>
              ) : (
                <div>
                  <Text strong>货到付款</Text>
                  <div>请准备好现金</div>
                </div>
              )}
            </div>
          </Panel>
          
          <Panel 
            header={
              <Space>
                <ShoppingCart size={16} color={customStyles.colors.primary} />
                <Text strong>订单明细</Text>
              </Space>
            } 
            key="3"
          >
            <List
              itemLayout="horizontal"
              dataSource={cartState.items}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={`${item.name} x${item.quantity}`}
                    description={item.notes && `备注: ${item.notes}`}
                  />
                  <div>¥{(item.price * item.quantity).toFixed(2)}</div>
                </List.Item>
              )}
            />
          </Panel>
        </Collapse>
        
        <DeliveryTimeCard>
          <Space align="start">
            <Clock size={20} color={customStyles.colors.primary} />
            <div>
              <Text strong>预计送达时间</Text>
              <div>下单后30-45分钟送达</div>
            </div>
          </Space>
        </DeliveryTimeCard>
        
        <Alert
          message="下单即表示您同意我们的服务条款和隐私政策"
          type="info"
          showIcon
          icon={<AlertCircle size={16} />}
          style={{ marginBottom: customStyles.spacing.md }}
        />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
          <Button 
            onClick={() => handleStepChange(1)}
          >
            返回支付
          </Button>
          
          <OrderButton 
            type="primary" 
            size="large"
            loading={orderProcessing}
            onClick={handlePlaceOrder}
          >
            提交订单 (¥{total.toFixed(2)})
          </OrderButton>
        </div>
      </StyledCard>
    );
  };
  
  return (
    <PageContainer>
      <CheckoutHeader>
        <BackButton />
        <Title level={2} style={{ margin: 0 }}>订单结算</Title>
      </CheckoutHeader>
      
      <StepsContainer>
        <Steps
          current={currentStep}
          items={[
            {
              title: '配送',
              icon: <MapPin size={16} />
            },
            {
              title: '支付',
              icon: <CreditCard size={16} />
            },
            {
              title: '确认',
              icon: <CheckCircle size={16} />
            }
          ]}
          onChange={handleStepChange}
        />
      </StepsContainer>
      
      <ContentContainer>
        <MainContent>
          {currentStep === 0 && renderDeliveryStep()}
          {currentStep === 1 && renderPaymentStep()}
          {currentStep === 2 && renderReviewStep()}
        </MainContent>
        
        <SidebarContent>
          <StyledCard title="订单摘要">
            <List
              dataSource={cartState.items}
              renderItem={item => (
                <List.Item>
                  <div>{item.name} x{item.quantity}</div>
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
          </StyledCard>
          
          <StyledCard>
            <Space align="start">
              <Truck size={20} color={customStyles.colors.primary} />
              <div>
                <Text strong>配送信息</Text>
                <div>预计送达时间: 30-45分钟</div>
                <div>商家: {cartState.merchantName}</div>
              </div>
            </Space>
          </StyledCard>
        </SidebarContent>
      </ContentContainer>
      
      <Modal
        title="确认订单"
        open={showConfirmModal}
        onOk={confirmOrder}
        onCancel={() => setShowConfirmModal(false)}
        okText="确认下单"
        cancelText="再看看"
      >
        <Paragraph>
          您即将从{cartState.merchantName}下单，总金额为¥{total.toFixed(2)}。
        </Paragraph>
        <Paragraph>
          您的美食将在30-45分钟内送达指定地址。
        </Paragraph>
        <Paragraph strong>
          是否确认下单？
        </Paragraph>
      </Modal>
    </PageContainer>
  );
};

export default Checkout;