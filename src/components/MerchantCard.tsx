import React from 'react';
import { Card, Rate, Tag, Space, Typography, Badge } from 'antd';
import { Clock, MapPin, TrendingUp, Award, Heart, DollarSign } from 'lucide-react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Merchant } from '../types';
import { customStyles } from '../styles/theme';
import { useFavorite } from '../contexts/FavoriteContext';

const { Text, Title } = Typography;

const StyledCard = styled(Card)`
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${customStyles.shadows.medium};
  }
`;

const CardCover = styled.div`
  position: relative;
  height: 160px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const MerchantLogo = styled.div`
  position: absolute;
  bottom: -20px;
  left: 16px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${customStyles.shadows.small};
  overflow: hidden;
  border: 2px solid white;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    bottom: -15px;
  }
`;

const CardContent = styled.div`
  padding-top: ${customStyles.spacing.md};
`;

const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${customStyles.spacing.xs};
  margin-top: ${customStyles.spacing.xs};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${customStyles.spacing.sm};
  margin: ${customStyles.spacing.md} 0;
  padding: ${customStyles.spacing.sm} 0;
  border-top: 1px solid ${customStyles.colors.border};
  border-bottom: 1px solid ${customStyles.colors.border};
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${customStyles.spacing.xs};
  
  svg {
    color: ${customStyles.colors.textSecondary};
    margin-bottom: 4px;
  }
  
  .info-label {
    font-size: 12px;
    color: ${customStyles.colors.textSecondary};
    margin-bottom: 2px;
  }
  
  .info-value {
    font-size: 14px;
    font-weight: 500;
    color: ${customStyles.colors.textPrimary};
    white-space: nowrap;
  }
`;

const PromotionBadge = styled(Badge)`
  position: absolute;
  top: 8px;
  right: 8px;
`;

const NewBadge = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: ${customStyles.colors.secondary};
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
`;

const FavoriteButton = styled.div<{ $isFavorite: boolean }>`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  svg {
    color: ${props => props.$isFavorite ? '#ff4d4f' : '#666'};
    fill: ${props => props.$isFavorite ? '#ff4d4f' : 'none'};
    transition: all 0.3s ease;
  }
  
  &:hover {
    background-color: white;
    transform: scale(1.1);
  }
`;

const FooterInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${customStyles.spacing.sm};
`;

const MerchantCard: React.FC<{ merchant: Merchant }> = ({ merchant }) => {
  const { isFavorite, toggleFavorite } = useFavorite();
  const favorite = isFavorite(merchant.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite(merchant.id);
  };

  return (
    <Link to={`/merchants/${merchant.id}`}>
      <StyledCard
        hoverable
        bodyStyle={{ padding: '16px' }}
      >
        <CardCover>
          <img src={merchant.coverImage} alt={merchant.name} />
          <MerchantLogo>
            <img src={merchant.logo} alt={merchant.name} />
          </MerchantLogo>
          
          {merchant.isNew && (
            <NewBadge>新店</NewBadge>
          )}
          
          <FavoriteButton 
            onClick={handleFavoriteClick}
            $isFavorite={favorite}
          >
            <Heart size={20} />
          </FavoriteButton>
        </CardCover>
        
        <CardContent>
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Title level={5} style={{ margin: 0 }}>{merchant.name}</Title>
              <Rate disabled defaultValue={merchant.rating} style={{ fontSize: 12 }} />
            </div>
            
            <TagsWrapper>
              {merchant.cuisine.map((type, index) => (
                <Tag key={index} color="green">{type}</Tag>
              ))}
            </TagsWrapper>
            
            <InfoGrid>
              <InfoItem>
                <Clock size={16} />
                <span className="info-label">配送时间</span>
                <span className="info-value">{merchant.deliveryTime}-{merchant.deliveryTime + 10}分钟</span>
              </InfoItem>
              
              <InfoItem>
                <MapPin size={16} />
                <span className="info-label">距离</span>
                <span className="info-value">{merchant.distance.toFixed(1)}公里</span>
              </InfoItem>
              
              <InfoItem>
                <DollarSign size={16} />
                <span className="info-label">人均消费</span>
                <span className="info-value">¥{merchant.averagePrice}/人</span>
              </InfoItem>
            </InfoGrid>
            
            <FooterInfo>
              {merchant.deliveryFee === 0 ? (
                <Tag color="volcano">免配送费</Tag>
              ) : (
                <Text type="secondary">配送费: ¥{merchant.deliveryFee.toFixed(2)}</Text>
              )}
              
              <Space size={8}>
                {merchant.isPopular && (
                  <Tag icon={<TrendingUp size={12} />} color="blue">
                    热门
                  </Tag>
                )}
                
                {merchant.rating >= 4.5 && (
                  <Tag icon={<Award size={12} />} color="gold">
                    高分好评
                  </Tag>
                )}
              </Space>
            </FooterInfo>
          </Space>
        </CardContent>
      </StyledCard>
    </Link>
  );
};

export default MerchantCard;