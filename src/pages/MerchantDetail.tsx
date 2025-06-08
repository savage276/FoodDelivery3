import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Rate, 
  Tabs, 
  Button, 
  Space, 
  Divider, 
  Tag,
  Anchor,
  Collapse,
  Result,
  Affix,
  Spin
} from 'antd';
import { 
  CheckCircle, 
  Clock, 
  ChefHat, 
  Truck, 
  Home, 
  MapPin, 
  Phone,
  Navigation,
  AlertCircle,
  Share2,
  Heart
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import MenuItemCard from '../components/MenuItemCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { customStyles } from '../styles/theme';
import { useFavorite } from '../contexts/FavoriteContext';
import BackButton from '../components/BackButton';
import { useMerchant } from '../hooks/useMerchant';
import { useMenu } from '../hooks/useMenu';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Link: AnchorLink } = Anchor;
const { Panel } = Collapse;

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${customStyles.spacing.lg};
  
  @media (max-width: 768px) {
    padding: ${customStyles.spacing.md};
  }
`;

const HeroContainer = styled.div`
  position: relative;
  height: 280px;
  overflow: hidden;
  border-radius: 8px;
  
  @media (max-width: 768px) {
    height: 200px;
  }
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RestaurantInfoContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${customStyles.spacing.lg};
  background: white;
  border-radius: 8px;
  margin-top: -60px;
  position: relative;
  box-shadow: ${customStyles.shadows.small};
  
  @media (max-width: 768px) {
    margin-top: -40px;
    padding: ${customStyles.spacing.md};
  }
`;

const RestaurantLogo = styled.div`
  position: absolute;
  top: -40px;
  left: ${customStyles.spacing.lg};
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  padding: 4px;
  overflow: hidden;
  box-shadow: ${customStyles.shadows.small};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
  
  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    top: -30px;
    left: ${customStyles.spacing.md};
  }
`;

const ContentContainer = styled.div`
  display: flex;
  gap: ${customStyles.spacing.lg};
  margin-top: ${customStyles.spacing.lg};
  
  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

const MainContent = styled.div`
  flex: 3;
`;

const SidebarContent = styled.div`
  flex: 1;
  
  @media (max-width: 992px) {
    order: -1;
  }
`;

const StyledCollapse = styled(Collapse)`
  background: white;
  border-radius: ${customStyles.borderRadius.lg};
  margin-bottom: ${customStyles.spacing.md};

  .ant-collapse-header {
    padding: ${customStyles.spacing.md} !important;
  }

  .ant-collapse-content-box {
    padding: ${customStyles.spacing.md} !important;
  }

  .ant-collapse-expand-icon {
    margin-right: ${customStyles.spacing.md} !important;
  }
`;

const CategoryHeader = styled.div`
  padding: ${customStyles.spacing.md} 0;
  background: white;
  margin-bottom: ${customStyles.spacing.md};
`;

const CategoryNavigation = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  padding: ${customStyles.spacing.sm} 0;
  margin-bottom: ${customStyles.spacing.md};
  border-bottom: 1px solid ${customStyles.colors.border};
  
  @media (max-width: 768px) {
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const CategoryButton = styled(Button)<{ $active?: boolean }>`
  margin-right: ${customStyles.spacing.sm};
  border-radius: 16px;
  
  ${props => props.$active && `
    background: ${customStyles.colors.primary};
    color: white;
    border-color: ${customStyles.colors.primary};
    
    &:hover, &:focus {
      background: ${customStyles.colors.primary};
      color: white;
      border-color: ${customStyles.colors.primary};
      opacity: 0.9;
    }
  `}
  
  @media (max-width: 768px) {
    margin-bottom: 0;
  }
`;

const FavoriteButton = styled(Button)<{ $isFavorite: boolean }>`
  svg {
    color: ${props => props.$isFavorite ? '#ff4d4f' : 'inherit'};
    fill: ${props => props.$isFavorite ? '#ff4d4f' : 'none'};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const MerchantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeCollapse, setActiveCollapse] = useState<string[]>(['notice', 'delivery']);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const { isFavorite, toggleFavorite } = useFavorite();
  
  // Use the new hooks
  const { data: merchant, isLoading: merchantLoading, error: merchantError } = useMerchant(id);
  const { data: menuItems = [], isLoading: menuLoading, error: menuError } = useMenu(id);
  
  const favorite = merchant ? isFavorite(merchant.id) : false;
  
  // Group menu items by category
  const menuByCategory = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);
  
  const categories = Object.keys(menuByCategory);

  useEffect(() => {
    if (categories.length > 0) {
      setActiveCategory(categories[0]);
    }
  }, [categories]);

  const scrollToCategory = (category: string) => {
    setActiveCategory(category);
    const element = document.getElementById(category);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const categoryElements = categories.map(category => ({
        category,
        element: document.getElementById(category)
      }));
      
      const currentCategory = categoryElements.find(({ element }) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom > 100;
      });
      
      if (currentCategory) {
        setActiveCategory(currentCategory.category);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories]);

  if (merchantLoading) {
    return (
      <PageContainer>
        <LoadingSkeleton type="detail" />
      </PageContainer>
    );
  }

  if (merchantError || !merchant) {
    return (
      <PageContainer>
        <Result
          status="404"
          title="商家不存在"
          subTitle="抱歉，您访问的商家不存在或已下线"
          extra={
            <Button type="primary" onClick={() => navigate('/')}>
              返回首页
            </Button>
          }
        />
      </PageContainer>
    );
  }

  return (
    <div>
      <PageContainer>
        <BackButton />
        <HeroContainer>
          <HeroImage src={merchant.coverImage} alt={merchant.name} />
        </HeroContainer>

        <RestaurantInfoContainer>
          <RestaurantLogo>
            <img src={merchant.logo} alt={merchant.name} />
          </RestaurantLogo>

          <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Title level={2} style={{ margin: 0 }}>{merchant.name}</Title>
              {merchant.isNew && (
                <Tag color={customStyles.colors.primary}>新店</Tag>
              )}
            </div>

            <Space align="center" style={{ marginTop: '8px' }}>
              <Rate disabled defaultValue={merchant.rating} style={{ fontSize: 14 }} />
              <Text strong>{merchant.rating}</Text>
              <Text type="secondary">(200+ 评价)</Text>
            </Space>

            <div style={{ marginTop: '8px' }}>
              {merchant.cuisine.map((type, index) => (
                <Tag key={index} color="green">{type}</Tag>
              ))}
            </div>

            <Space size={16} style={{ marginTop: '16px' }}>
              <Space>
                <Clock size={16} />
                <Text>{merchant.deliveryTime} 分钟</Text>
              </Space>

              <Space>
                <MapPin size={16} />
                <Text>{merchant.distance} km</Text>
              </Space>

              <Space>
                <ChefHat size={16} />
                <Text>人均 ¥{merchant.averagePrice}</Text>
              </Space>

              {merchant.deliveryFee === 0 ? (
                <Tag color="volcano">免配送费</Tag>
              ) : (
                <Text>配送费: ¥{merchant.deliveryFee.toFixed(2)}</Text>
              )}
            </Space>

            <Space style={{ marginTop: '16px' }}>
              <Button icon={<Share2 size={16} />}>
                分享
              </Button>
              <FavoriteButton
                icon={<Heart size={16} />}
                $isFavorite={favorite}
                onClick={() => toggleFavorite(merchant.id)}
              >
                {favorite ? '已收藏' : '收藏'}
              </FavoriteButton>
            </Space>
          </div>
        </RestaurantInfoContainer>

        <ContentContainer>
          <MainContent>
            {categories.length > 0 && (
              <Affix offsetTop={0}>
                <CategoryNavigation>
                  {categories.map(category => (
                    <CategoryButton
                      key={category}
                      $active={activeCategory === category}
                      onClick={() => scrollToCategory(category)}
                    >
                      {category}
                    </CategoryButton>
                  ))}
                </CategoryNavigation>
              </Affix>
            )}

            {menuLoading ? (
              <LoadingContainer>
                <Spin size="large" />
              </LoadingContainer>
            ) : menuError ? (
              <Result
                status="error"
                title="菜单加载失败"
                subTitle="请稍后重试"
              />
            ) : categories.length === 0 ? (
              <Result
                status="info"
                title="暂无菜品"
                subTitle="该商家暂未上传菜品信息"
              />
            ) : (
              categories.map(category => (
                <div key={category} id={category}>
                  <CategoryHeader>
                    <Title level={3}>{category}</Title>
                    <Divider style={{ margin: '12px 0' }} />
                  </CategoryHeader>
                  
                  <div>
                    {menuByCategory[category].map(item => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        merchantId={merchant.id}
                        merchantName={merchant.name}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </MainContent>
          
          <SidebarContent>
            <StyledCollapse
              activeKey={activeCollapse}
              onChange={(keys) => setActiveCollapse(keys as string[])}
              expandIconPosition="start"
            >
              <Panel
                key="notice"
                header={
                  <Space>
                    <AlertCircle size={16} />
                    <Text strong>温馨提示</Text>
                  </Space>
                }
              >
                <Text type="secondary">
                  最低起送金额: ¥{merchant.minOrder}
                </Text>
              </Panel>
              
              <Panel
                key="delivery"
                header={
                  <Space>
                    <Navigation size={16} />
                    <Text strong>配送信息</Text>
                  </Space>
                }
              >
                <Space direction="vertical">
                  <Text>配送时间: {merchant.deliveryTime}分钟</Text>
                  <Text>配送费: ¥{merchant.deliveryFee}</Text>
                </Space>
              </Panel>
            </StyledCollapse>

            {categories.length > 0 && (
              <div>
                <Title level={5}>菜品分类</Title>
                {categories.map(category => (
                  <AnchorLink 
                    key={category} 
                    href={`#${category}`} 
                    title={category}
                  />
                ))}
              </div>
            )}
          </SidebarContent>
        </ContentContainer>
      </PageContainer>
    </div>
  );
};

export default MerchantDetail;