import React, { useState } from 'react';
import { Card, Typography, Button, InputNumber, Modal, Form, Input, Checkbox } from 'antd';
import { Plus, Minus } from 'lucide-react';
import styled from 'styled-components';
import { MenuItem } from '../types';
import { useCart } from '../contexts/CartContext';
import { customStyles } from '../styles/theme';

const { Text, Title } = Typography;
const { TextArea } = Input;

interface MenuItemCardProps {
  item: MenuItem;
  merchantId: string;
  merchantName: string;
}

const StyledCard = styled(Card)`
  display: flex;
  margin-bottom: ${customStyles.spacing.md};
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    box-shadow: ${customStyles.shadows.small};
  }
`;

const ItemImage = styled.div`
  width: 120px;
  height: 120px;
  overflow: hidden;
  
  @media (max-width: 576px) {
    width: 80px;
    height: 80px;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.1);
  }
`;

const ItemContent = styled.div`
  flex: 1;
  padding: ${customStyles.spacing.md};
  display: flex;
  flex-direction: column;
`;

const TagsContainer = styled.div`
  display: flex;
  gap: ${customStyles.spacing.xs};
  margin-top: ${customStyles.spacing.xs};
`;

const Tag = styled.span<{ $type: string }>`
  font-size: 12px;
  padding: 1px 6px;
  border-radius: 4px;
  background-color: ${props => 
    props.$type === 'spicy' 
      ? '#ffece8' 
      : props.$type === 'popular' 
        ? '#e6f7ff' 
        : '#f6ffed'};
  color: ${props => 
    props.$type === 'spicy' 
      ? '#ff4d4f' 
      : props.$type === 'popular' 
        ? '#1677ff' 
        : '#52c41a'};
`;

const PriceActionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
`;

const QuantityButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
`;

const QuantityText = styled(Text)`
  margin: 0 ${customStyles.spacing.sm};
  min-width: 20px;
  text-align: center;
`;

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, merchantId, merchantName }) => {
  const [quantity, setQuantity] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (quantity > 0) {
      setIsModalVisible(true);
    }
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      addItem(
        { ...item, quantity, notes: values.notes },
        merchantId,
        merchantName
      );
      setIsModalVisible(false);
      setQuantity(1);
      form.resetFields();
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setQuantity(1);
  };

  return (
    <>
      <StyledCard bordered={false}>
        <ItemImage>
          <img src={item.image} alt={item.name} />
        </ItemImage>
        
        <ItemContent>
          <Title level={5} style={{ margin: 0 }}>{item.name}</Title>
          
          <TagsContainer>
            {item.isSpicy && <Tag $type="spicy">辣</Tag>}
            {item.isPopular && <Tag $type="popular">热门</Tag>}
            {item.isVegetarian && <Tag $type="vegetarian">素食</Tag>}
          </TagsContainer>
          
          <Text type="secondary" style={{ marginTop: '8px', fontSize: '13px' }}>
            {item.description}
          </Text>
          
          <PriceActionContainer>
            <Text strong style={{ fontSize: '16px' }}>¥{item.price.toFixed(2)}</Text>
            
            <QuantityControl>
              <QuantityButton
                type="text"
                icon={<Minus size={14} />}
                onClick={() => setQuantity(prev => Math.max(prev - 1, 1))}
                disabled={quantity <= 1}
              />
              
              <QuantityText>{quantity}</QuantityText>
              
              <QuantityButton
                type="text"
                icon={<Plus size={14} />}
                onClick={() => setQuantity(prev => prev + 1)}
              />
              
              <Button
                type="primary"
                style={{ marginLeft: '8px' }}
                onClick={handleAddToCart}
              >
                加入购物车
              </Button>
            </QuantityControl>
          </PriceActionContainer>
        </ItemContent>
      </StyledCard>

      <Modal
        title={`添加 ${item.name} 到购物车`}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="加入购物车"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="特殊要求" name="notes">
            <TextArea 
              rows={4} 
              placeholder="有什么特殊要求或注意事项吗？" 
            />
          </Form.Item>
          
          <Form.Item name="removeItems" valuePropName="checked">
            <Checkbox>不要辣</Checkbox>
          </Form.Item>
          
          <div style={{ marginBottom: '16px' }}>
            <Text strong>数量: {quantity}</Text>
            <div style={{ marginTop: '8px' }}>
              <Button 
                icon={<Minus size={14} />} 
                onClick={() => setQuantity(prev => Math.max(prev - 1, 1))}
                disabled={quantity <= 1}
              />
              <Button 
                icon={<Plus size={14} />} 
                onClick={() => setQuantity(prev => prev + 1)}
                style={{ marginLeft: '8px' }}
              />
            </div>
          </div>
          
          <Text strong>总计: ¥{(item.price * quantity).toFixed(2)}</Text>
        </Form>
      </Modal>
    </>
  );
};

export default MenuItemCard;