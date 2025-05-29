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
  Affix
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
import { MenuItem } from '../types';
import { customStyles } from '../styles/theme';
import { useFavorite } from '../contexts/FavoriteContext';
import { useMerchant } from '../contexts/MerchantContext';
import BackButton from '../components/BackButton';

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

const mockMenuItems: Record<string, MenuItem[]> = {
  '特色推荐': [
    {
      id: 'm1',
      name: '脆皮烧鸭',
      description: '选用优质鸭肉，传统粤式烧制，外皮金黄酥脆，肉质鲜嫩多汁',
      price: 68,
      image: 'https://images.pexels.com/photos/2611917/pexels-photo-2611917.jpeg',
      category: '特色推荐',
      isPopular: true
    },
    {
      id: 'm2',
      name: '白切鸡',
      description: '选用本地散养鸡，配以特制姜葱酱，肉质细嫩，口感鲜美',
      price: 48,
      image: 'https://images.pexels.com/photos/2611917/pexels-photo-2611917.jpeg',
      category: '特色推荐',
      isPopular: true
    }
  ],
  '粤式烧腊': [
    {
      id: 'r1',
      name: '蜜汁叉烧',
      description: '精选五花肉，秘制蜜汁腌制，烧制入味，肥瘦均匀',
      price: 42,
      image: 'https://images.pexels.com/photos/2611917/pexels-photo-2611917.jpeg',
      category: '粤式烧腊',
      isPopular: true
    },
    {
      id: 'r2',
      name: '油鸡',
      description: '传统工艺制作，皮爽肉滑，配以特制酱料',
      price: 38,
      image: 'https://images.pexels.com/photos/2611917/pexels-photo-2611917.jpeg',
      category: '粤式烧腊'
    },
    {
      id: 'r3',
      name: '烧肉',
      description: '五层肉烧制，皮脆肉嫩，口感层次丰富',
      price: 45,
      image: 'https://images.pexels.com/photos/2611917/pexels-photo-2611917.jpeg',
      category: '粤式烧腊',
      isPopular: true
    }
  ],
  '粥品': [
    {
      id: 'c1',
      name: '皮蛋瘦肉粥',
      description: '选用优质大米熬制，配以皮蛋和瘦肉，浓稠绵密',
      price: 22,
      image: 'https://images.pexels.com/photos/2611917/pexels-photo-2611917.jpeg',
      category: '粥品',
      isPopular: true
    },
    {
      id: 'c2',
      name: '海鲜粥',
      description: '配料丰富，有虾仁、蛤蜊、鱿鱼等海鲜，鲜美可口',
      price: 32,
      image: 'https://images.pexels.com/photos/2611917/pexels-photo-2611917.jpeg',
      category: '粥品'
    }
  ],
  '炖汤': [
    {
      id: 's1',
      name: '老火靓汤',
      description: '每日新鲜炖煮，滋补养生，可选配料',
      price: 28,
      image: 'https://images.pexels.com/photos/2611917/pexels-photo-2611917.jpeg',
      category: '炖汤'
    },
    {
      id: 's2',
      name: '莲藕排骨汤',
      description: '精选猪排骨，配以莲藕，清甜滋补',
      price: 32,
      image: 'https://images.pexels.com/photos/2611917/pexels-photo-2611917.jpeg',
      category: '炖汤'
    }
  ],
  '小炒': [
    {
      id: 'v1',
      name: '豉油皇炒面',
      description: '传统港式炒面，配以豆芽和韭黄，口感爽滑',
      price: 28,
      image: 'https://images.pexels.com/photos/2611917/pexels-photo-2611917.jpeg',
      category: '小炒'
    },
    {
      id: 'v2',
      name: '干炒牛河',
      description: '选用优质河粉，配以嫩滑牛肉，锅气十足',
      price: 32,
      image: 'https://images.pexels.com/photos/2611917/pexels-photo-2611917.jpeg',
      category: '小炒',
      isPopular: true
    }
  ],
  '海鲜': [
    {
      id: 'sf1',
      name: '清蒸海斑',
      description: '新鲜海斑鱼，清蒸保持原汁原味，肉质细嫩',
      price: 128,
      image: 'https://images.pexels.com/photos/2611917/pexels-photo-2611917.jpeg',
      category: '海鲜'
    },
    {
      id: 'sf2',
      name: '椒盐濑尿虾',
      description: '新鲜濑尿虾，椒盐调味，外酥内嫩',
      price: 88,
      image: 'https://images.pexels.com/photos/2611917/pexels-photo-2611917.jpeg',
      category: '海鲜',
      isPopular: true
    }
  ],
  '点心': [
    {
      id: 'd1',
      name: '虾饺皇',
      description: '鲜虾馅料，晶莹剔透，皮薄馅大',
      price: 28,
      image: 'https://images.pexels.com/photos/2611917/pexels-photo-2611917.jpeg',
      category: '点心',
      isPopular: true
    },
    {
      id: 'd2',
      name: '叉烧包',
      description: '蜜汁叉烧馅，松软包皮，香甜可口',
      price: 22,
      image: 'https://images.pexels.com/photos/2611917/pexels-photo-2611917.jpeg',
      category: '点心'
    }
  ],
  '甜品': [
    {
      id: 'ds1',
      name: '杨枝甘露',
      description: '选用泰国青柚，配以西米和芒果，清爽解暑',
      price: 26,
      image: 'https://images.pexels.com/photos/2611917/pexels-photo-2611917.jpeg',
      category: '甜品',
      isPopular: true
    },
    {
      id: 'ds2',
      name: '双皮奶',
      description: '传统港式甜品，滑嫩香甜，口感细腻',
      price: 22,
      image: 'https://images.pexels.com/photos/2611917/pexels-photo-2611917.jpeg',
      category: '甜品'
    }
  ]
};

const MerchantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeCollapse, setActiveCollapse] = useState<string[]>(['notice', 'delivery']);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const { isFavorite, toggleFavorite } = useFavorite();
  const { getMerchant } = useMerchant();
  
  const merchant = id ? getMerchant(id) : null;
  const favorite = merchant ? isFavorite(merchant.id) : false;
  const categories = Object.keys(mockMenuItems);

  useEffect(() => {
    if (categories.length > 0) {
      setActiveCategory(categories[0]);
    }
    
    setTimeout(() => {
      setLoading(false);
    }, 800);
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

  if (loading) {
    return (
      <PageContainer>
        <LoadingSkeleton type="detail" />
      </PageContainer>
    );
  }

  if (!merchant) {
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

            {categories.map(category => (
              <div key={category} id={category}>
                <CategoryHeader>
                  <Title level={3}>{category}</Title>
                  <Divider style={{ margin: '12px 0' }} />
                </CategoryHeader>
                
                <div>
                  {mockMenuItems[category].map(item => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      merchantId={merchant.id}
                      merchantName={merchant.name}
                    />
                  ))}
                </div>
              </div>
            ))}
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
          </SidebarContent>
        </ContentContainer>
      </PageContainer>
    </div>
  );
};

export default MerchantDetail;