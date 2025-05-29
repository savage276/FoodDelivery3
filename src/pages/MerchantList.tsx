import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Pagination, Empty, Spin, Select } from 'antd';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import MerchantCard from '../components/MerchantCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { Merchant } from '../types';
import { customStyles } from '../styles/theme';
import { MapPin } from 'lucide-react';

const { Title, Text } = Typography;
const { Option } = Select;

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${customStyles.spacing.lg};
  
  @media (max-width: 768px) {
    padding: ${customStyles.spacing.md};
  }
`;

const HeaderSection = styled.div`
  margin-bottom: ${customStyles.spacing.lg};
`;

const LocationSelector = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${customStyles.spacing.md};
  
  svg {
    color: ${customStyles.colors.primary};
    margin-right: ${customStyles.spacing.xs};
  }
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: ${customStyles.spacing.lg} 0;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${customStyles.spacing.sm};
  }
`;

const PaginationContainer = styled.div`
  margin-top: ${customStyles.spacing.xl};
  display: flex;
  justify-content: center;
`;

// Mock data with averagePrice added
const mockMerchants: Merchant[] = [
  {
    id: '1',
    name: '金龙餐厅',
    logo: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg',
    coverImage: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
    cuisine: ['中餐', '粤菜'],
    rating: 4.8,
    deliveryTime: 25,
    deliveryFee: 2.99,
    minOrder: 15,
    distance: 1.2,
    promotions: [
      { id: 'p1', type: 'discount', description: '新用户下单立减20%' }
    ],
    isNew: true,
    averagePrice: 50
  },
  {
    id: '2',
    name: '意面天堂',
    logo: 'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg',
    coverImage: 'https://images.pexels.com/photos/1527603/pexels-photo-1527603.jpeg',
    cuisine: ['意餐', '地中海'],
    rating: 4.5,
    deliveryTime: 30,
    deliveryFee: 1.99,
    minOrder: 20,
    distance: 2.4,
    promotions: [
      { id: 'p2', type: 'freeDelivery', description: '订单满30元免配送费' }
    ],
    averagePrice: 120
  },
  {
    id: '3',
    name: '寿司速递',
    logo: 'https://images.pexels.com/photos/359993/pexels-photo-359993.jpeg',
    coverImage: 'https://images.pexels.com/photos/858508/pexels-photo-858508.jpeg',
    cuisine: ['日料', '亚洲菜'],
    rating: 4.7,
    deliveryTime: 20,
    deliveryFee: 3.99,
    minOrder: 25,
    distance: 1.8,
    promotions: [
      { id: 'p3', type: 'gift', description: '订单满35元赠送味增汤' }
    ],
    averagePrice: 150
  },
  {
    id: '4',
    name: '墨西哥风情',
    logo: 'https://images.pexels.com/photos/2087748/pexels-photo-2087748.jpeg',
    coverImage: 'https://images.pexels.com/photos/4958641/pexels-photo-4958641.jpeg',
    cuisine: ['墨西哥菜', '拉美菜'],
    rating: 4.3,
    deliveryTime: 35,
    deliveryFee: 0,
    minOrder: 15,
    distance: 3.1,
    promotions: [],
    averagePrice: 80
  }
];

const MerchantList: React.FC = () => {
  const locationHook = useLocation();
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState(locationHook.state?.keyword || '');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    locationHook.state?.filters || {}
  );
  const [sortOrder, setSortOrder] = useState('recommended');
  const [currentPage, setCurrentPage] = useState(1);
  const [location, setLocation] = useState('北京');
  const [filteredMerchants, setFilteredMerchants] = useState<Merchant[]>(mockMerchants);

  useEffect(() => {
    setLoading(true);
    const filtered = filterMerchants(mockMerchants);
    const sorted = sortMerchants(filtered);
    setFilteredMerchants(sorted);
    setLoading(false);
  }, [activeFilters, sortOrder, searchKeyword]);

  const filterMerchants = (merchants: Merchant[]) => {
    return merchants.filter(merchant => {
      // 菜系筛选
      if (activeFilters.cuisine && activeFilters.cuisine !== 'all') {
        const cuisineMatch = merchant.cuisine.some(c => 
          c === activeFilters.cuisine
        );
        if (!cuisineMatch) return false;
      }

      // 人均消费筛选
      if (activeFilters.averagePrice && activeFilters.averagePrice !== 'all') {
        const price = merchant.averagePrice;
        switch (activeFilters.averagePrice) {
          case '0-50':
            if (price > 50) return false;
            break;
          case '51-100':
            if (price < 51 || price > 100) return false;
            break;
          case '101-200':
            if (price < 101 || price > 200) return false;
            break;
          case '201+':
            if (price <= 200) return false;
            break;
        }
      }

      // 评分筛选
      if (activeFilters.rating && activeFilters.rating !== 'all') {
        const minRating = parseFloat(activeFilters.rating);
        if (merchant.rating < minRating) return false;
      }

      // 距离筛选
      if (activeFilters.distance && activeFilters.distance !== 'all') {
        const distance = merchant.distance;
        switch (activeFilters.distance) {
          case '0-1':
            if (distance > 1) return false;
            break;
          case '1-3':
            if (distance < 1 || distance > 3) return false;
            break;
          case '3-5':
            if (distance < 3 || distance > 5) return false;
            break;
          case '5+':
            if (distance <= 5) return false;
            break;
        }
      }

      // 关键词搜索
      if (searchKeyword) {
        const searchLower = searchKeyword.toLowerCase();
        return (
          merchant.name.toLowerCase().includes(searchLower) ||
          merchant.cuisine.some(c => c.toLowerCase().includes(searchLower))
        );
      }

      return true;
    });
  };

  const sortMerchants = (merchants: Merchant[]) => {
    return [...merchants].sort((a, b) => {
      switch (sortOrder) {
        case 'rating':
          return b.rating - a.rating;
        case 'delivery':
          return a.deliveryTime - b.deliveryTime;
        case 'distance':
          return a.distance - b.distance;
        case 'priceAsc':
          return a.averagePrice - b.averagePrice;
        case 'priceDesc':
          return b.averagePrice - a.averagePrice;
        default:
          return 0;
      }
    });
  };

  const handleSearch = (keyword: string, filters: any) => {
    setLoading(true);
    setSearchKeyword(keyword);
    setActiveFilters(prev => ({ ...prev, ...filters }));
    
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };
  
  const handleFilterChange = (key: string, value: string | null) => {
    if (value === null) {
      const newFilters = { ...activeFilters };
      delete newFilters[key];
      setActiveFilters(newFilters);
    } else {
      setActiveFilters({ ...activeFilters, [key]: value });
    }
  };
  
  const handleSortChange = (value: string) => {
    setSortOrder(value);
  };
  
  const clearFilters = () => {
    setActiveFilters({});
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  if (loading) {
    return (
      <PageContainer>
        <HeaderSection>
          <Title level={2}>{location}的餐厅</Title>
        </HeaderSection>
        <LoadingSkeleton type="merchant" count={8} />
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <HeaderSection>
        <LocationSelector>
          <MapPin size={20} />
          <Select
            value={location}
            onChange={setLocation}
            style={{ width: 200 }}
          >
            <Option value="北京">北京</Option>
            <Option value="上海">上海</Option>
            <Option value="广州">广州</Option>
            <Option value="深圳">深圳</Option>
          </Select>
        </LocationSelector>
        
        <Title level={2}>{location}的餐厅</Title>
        
        <SearchBar onSearch={handleSearch} />
        
        <FilterBar 
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          activeFilters={activeFilters}
          clearFilters={clearFilters}
        />
      </HeaderSection>
      
      <ResultsHeader>
        <Text style={{ fontSize: '16px' }}>
          找到 {filteredMerchants.length} 家餐厅
          {searchKeyword && ` 包含"${searchKeyword}"`}
        </Text>
      </ResultsHeader>
      
      {filteredMerchants.length > 0 ? (
        <>
          <Row gutter={[16, 24]}>
            {filteredMerchants.map(merchant => (
              <Col xs={24} sm={12} md={8} lg={6} key={merchant.id}>
                <MerchantCard merchant={merchant} />
              </Col>
            ))}
          </Row>
          
          <PaginationContainer>
            <Pagination 
              current={currentPage} 
              total={50} 
              pageSize={12} 
              onChange={handlePageChange} 
              showSizeChanger={false}
            />
          </PaginationContainer>
        </>
      ) : (
        <Empty 
          description="没有找到符合条件的餐厅" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </PageContainer>
  );
};

export default MerchantList;