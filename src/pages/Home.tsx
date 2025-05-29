import React, { useState } from 'react';
import { Typography, Row, Col, Carousel, Card, Button, Tabs, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight, MapPin, ThumbsUp, Clock, Tag as TagIcon } from 'lucide-react';
import styled from 'styled-components';
import SearchBar from '../components/SearchBar';
import MerchantCard from '../components/MerchantCard';
import { Merchant } from '../types';
import { customStyles } from '../styles/theme';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${customStyles.spacing.lg};
  
  @media (max-width: 768px) {
    padding: ${customStyles.spacing.md};
  }
`;

const HeroBanner = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  margin-bottom: ${customStyles.spacing.xl};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${customStyles.shadows.medium};
  
  @media (max-width: 768px) {
    height: 300px;
  }
`;

const HeroContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: ${customStyles.spacing.xl};
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    rgba(0, 0, 0, 0) 100%
  );
  
  @media (max-width: 768px) {
    padding: ${customStyles.spacing.lg};
  }
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const SearchContainer = styled.div`
  margin: -80px auto 40px;
  max-width: 800px;
  z-index: 10;
  position: relative;
  
  @media (max-width: 768px) {
    margin-top: -40px;
  }
`;

const SectionTitle = styled(Title)`
  margin-bottom: ${customStyles.spacing.lg} !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ViewAllLink = styled(Button)`
  display: flex;
  align-items: center;
  
  svg {
    margin-left: 4px;
  }
`;

const CategoryCard = styled(Card)`
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${customStyles.shadows.medium};
  }
`;

const CategoryImage = styled.div`
  height: 140px;
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

const PromotionCard = styled(Card)`
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  background: linear-gradient(135deg, #00C73C 0%, #008c29 100%);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: ${customStyles.spacing.lg};
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const ViewAllButton = styled(Button)`
  background-color: ${customStyles.colors.primary};
  border-color: ${customStyles.colors.primary};
  color: white;
  font-weight: 500;
  
  &:hover, &:focus {
    background-color: ${customStyles.colors.primary}cc !important;
    border-color: ${customStyles.colors.primary}cc !important;
    color: white !important;
  }
`;

// Mock data
const mockMerchants: Merchant[] = [
  {
    id: '1',
    name: '金龙餐厅',
    logo: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    coverImage: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    cuisine: ['中餐', '亚洲菜'],
    rating: 4.8,
    deliveryTime: 25,
    deliveryFee: 2.99,
    minOrder: 15,
    distance: 1.2,
    promotions: [
      { id: 'p1', type: 'discount', description: '新用户下单立减20%' }
    ],
    isNew: true
  },
  {
    id: '2',
    name: '意面天堂',
    logo: 'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    coverImage: 'https://images.pexels.com/photos/1527603/pexels-photo-1527603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    cuisine: ['意大利菜', '地中海'],
    rating: 4.5,
    deliveryTime: 30,
    deliveryFee: 1.99,
    minOrder: 20,
    distance: 2.4,
    promotions: [
      { id: 'p2', type: 'freeDelivery', description: '订单满30元免配送费' }
    ]
  },
  {
    id: '3',
    name: '寿司速递',
    logo: 'https://images.pexels.com/photos/359993/pexels-photo-359993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    coverImage: 'https://images.pexels.com/photos/858508/pexels-photo-858508.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    cuisine: ['日本料理', '亚洲菜'],
    rating: 4.7,
    deliveryTime: 20,
    deliveryFee: 3.99,
    minOrder: 25,
    distance: 1.8,
    promotions: [
      { id: 'p3', type: 'gift', description: '订单满35元赠送味增汤' }
    ]
  },
  {
    id: '4',
    name: '墨西哥风情',
    logo: 'https://images.pexels.com/photos/2087748/pexels-photo-2087748.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    coverImage: 'https://images.pexels.com/photos/4958641/pexels-photo-4958641.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    cuisine: ['墨西哥菜', '拉美菜'],
    rating: 4.3,
    deliveryTime: 35,
    deliveryFee: 0,
    minOrder: 15,
    distance: 3.1,
    promotions: []
  }
];

const categories = [
  { id: 1, name: '中餐', image: 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: 2, name: '日料', image: 'https://images.pexels.com/photos/858508/pexels-photo-858508.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: 3, name: '意餐', image: 'https://images.pexels.com/photos/1527603/pexels-photo-1527603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: 4, name: '墨西哥菜', image: 'https://images.pexels.com/photos/4958641/pexels-photo-4958641.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: 5, name: '泰餐', image: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: 6, name: '印度菜', image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: 7, name: '快餐', image: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: 8, name: '甜点', image: 'https://images.pexels.com/photos/1854652/pexels-photo-1854652.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('nearby');
  
  const handleSearch = (keyword: string, filters: any) => {
    navigate('/merchants', { 
      state: { 
        keyword,
        filters
      }
    });
  };
  
  const handleCategoryClick = (category: string) => {
    navigate('/merchants', {
      state: {
        filters: {
          cuisine: category
        }
      }
    });
  };
  
  return (
    <div>
      <HeroBanner>
        <HeroImage src="https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="美食外卖" />
        <HeroContent>
          <Title level={1} style={{ color: 'white', marginBottom: '16px' }}>
            美味佳肴，送到家门
          </Title>
          <Text style={{ color: 'white', fontSize: '18px', maxWidth: '600px' }}>
            从当地最好的餐厅订购，轻松实现随时随地的外卖服务。
          </Text>
        </HeroContent>
      </HeroBanner>
      
      <PageContainer>
        <SearchContainer>
          <SearchBar onSearch={handleSearch} />
        </SearchContainer>
        
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <SectionTitle level={3}>
              美食分类
              <ViewAllLink type="link" onClick={() => navigate('/merchants')}>
                查看全部 <ChevronRight size={16} />
              </ViewAllLink>
            </SectionTitle>
            
            <Row gutter={[16, 16]}>
              {categories.map(category => (
                <Col xs={12} sm={8} md={6} lg={3} key={category.id}>
                  <CategoryCard
                    hoverable
                    cover={
                      <CategoryImage>
                        <img src={category.image} alt={category.name} />
                      </CategoryImage>
                    }
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <Card.Meta title={category.name} style={{ textAlign: 'center' }} />
                  </CategoryCard>
                </Col>
              ))}
            </Row>
          </Col>
          
          <Col span={24} style={{ marginTop: '32px' }}>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="附近" key="nearby" />
              <TabPane tab="人气" key="popular" />
              <TabPane tab="新店" key="new" />
              <TabPane tab="好评" key="topRated" />
            </Tabs>
            
            <Row gutter={[16, 16]}>
              {mockMerchants.map(merchant => (
                <Col xs={24} sm={12} md={8} lg={6} key={merchant.id}>
                  <MerchantCard merchant={merchant} />
                </Col>
              ))}
            </Row>
            
            <div style={{ textAlign: 'center', margin: '32px 0' }}>
              <ViewAllButton 
                type="primary" 
                size="large"
                onClick={() => navigate('/merchants')}
                icon={<ArrowRight size={16} />}
              >
                查看全部餐厅
              </ViewAllButton>
            </div>
          </Col>
          
          <Col span={24}>
            <SectionTitle level={3}>特别优惠</SectionTitle>
            
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <PromotionCard>
                  <Title level={3} style={{ color: 'white', marginBottom: '8px' }}>
                    免费配送
                  </Title>
                  <Text style={{ color: 'white', fontSize: '16px' }}>
                    新用户首单满15元免配送费
                  </Text>
                  <Button 
                    style={{ 
                      marginTop: '16px', 
                      background: 'white', 
                      color: customStyles.colors.primary,
                      width: 'fit-content'
                    }}
                  >
                    立即点餐
                  </Button>
                </PromotionCard>
              </Col>
              
              <Col xs={24} md={8}>
                <PromotionCard style={{ background: 'linear-gradient(135deg, #FFBA00 0%, #FF9000 100%)' }}>
                  <Title level={3} style={{ color: 'white', marginBottom: '8px' }}>
                    周末特惠
                  </Title>
                  <Text style={{ color: 'white', fontSize: '16px' }}>
                    所有餐厅满减20%
                  </Text>
                  <Button 
                    style={{ 
                      marginTop: '16px', 
                      background: 'white', 
                      color: '#FF9000',
                      width: 'fit-content'
                    }}
                  >
                    立即领取
                  </Button>
                </PromotionCard>
              </Col>
              
              <Col xs={24} md={8}>
                <PromotionCard style={{ background: 'linear-gradient(135deg, #FF5252 0%, #FF1744 100%)' }}>
                  <Title level={3} style={{ color: 'white', marginBottom: '8px' }}>
                    推荐有奖
                  </Title>
                  <Text style={{ color: 'white', fontSize: '16px' }}>
                    每推荐一位好友送10元红包
                  </Text>
                  <Button 
                    style={{ 
                      marginTop: '16px', 
                      background: 'white', 
                      color: '#FF1744',
                      width: 'fit-content'
                    }}
                  >
                    邀请好友
                  </Button>
                </PromotionCard>
              </Col>
            </Row>
          </Col>
          
          <Col span={24} style={{ marginTop: '48px' }}>
            <Row gutter={[32, 32]} align="middle">
              <Col xs={24} md={12}>
                <Title level={2}>为什么选择美饭外卖？</Title>
                <Space direction="vertical" size={16}>
                  <Space align="start">
                    <ThumbsUp size={24} color={customStyles.colors.primary} />
                    <div>
                      <Text strong style={{ fontSize: '18px', display: 'block' }}>
                        优质美食
                      </Text>
                      <Text>
                        我们与您所在地区最好的餐厅合作，确保每一餐的品质。
                      </Text>
                    </div>
                  </Space>
                  
                  <Space align="start">
                    <Clock size={24} color={customStyles.colors.primary} />
                    <div>
                      <Text strong style={{ fontSize: '18px', display: 'block' }}>
                        快速配送
                      </Text>
                      <Text>
                        我们的配送团队确保您的美食新鲜送达。
                      </Text>
                    </div>
                  </Space>
                  
                  <Space align="start">
                    <TagIcon size={24} color={customStyles.colors.primary} />
                    <div>
                      <Text strong style={{ fontSize: '18px', display: 'block' }}>
                        超值优惠
                      </Text>
                      <Text>
                        定期推出优惠活动，让您的美食体验更加实惠。
                      </Text>
                    </div>
                  </Space>
                  
                  <Space align="start">
                    <MapPin size={24} color={customStyles.colors.primary} />
                    <div>
                      <Text strong style={{ fontSize: '18px', display: 'block' }}>
                        广泛覆盖
                      </Text>
                      <Text>
                        覆盖城市主要区域，让美食随时随地触手可及。
                      </Text>
                    </div>
                  </Space>
                </Space>
              </Col>
              
              <Col xs={24} md={12}>
                <img 
                  src="https://images.pexels.com/photos/3887985/pexels-photo-3887985.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="外卖配送" 
                  style={{ 
                    width: '100%', 
                    borderRadius: '12px', 
                    boxShadow: customStyles.shadows.medium 
                  }} 
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </PageContainer>
    </div>
  );
};

export default Home;