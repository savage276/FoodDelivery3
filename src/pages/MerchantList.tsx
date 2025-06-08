import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Pagination, Empty, Spin, Select, Button } from 'antd';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { RefreshCw, MapPin } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import MerchantCard from '../components/MerchantCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { Merchant } from '../types';
import { customStyles } from '../styles/theme';
import { useAllMerchants } from '../hooks/useAllMerchants';

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

const RefreshButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const MerchantList: React.FC = () => {
  const locationHook = useLocation();
  const [searchKeyword, setSearchKeyword] = useState(locationHook.state?.keyword || '');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    locationHook.state?.filters || {}
  );
  const [sortOrder, setSortOrder] = useState('recommended');
  const [currentPage, setCurrentPage] = useState(1);
  const [location, setLocation] = useState('北京');
  const [filteredMerchants, setFilteredMerchants] = useState<Merchant[]>([]);

  // Use the new hook with real-time updates
  const { data: merchants = [], isLoading, error, refetch } = useAllMerchants();

  useEffect(() => {
    const filtered = filterMerchants(merchants);
    const sorted = sortMerchants(filtered);
    setFilteredMerchants(sorted);
  }, [merchants, activeFilters, sortOrder, searchKeyword]);

  const filterMerchants = (merchantList: Merchant[]) => {
    return merchantList.filter(merchant => {
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

  const sortMerchants = (merchantList: Merchant[]) => {
    return [...merchantList].sort((a, b) => {
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
    setSearchKeyword(keyword);
    setActiveFilters(prev => ({ ...prev, ...filters }));
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

  const handleRefresh = () => {
    refetch();
  };
  
  if (isLoading) {
    return (
      <PageContainer>
        <HeaderSection>
          <Title level={2}>{location}的餐厅</Title>
        </HeaderSection>
        <LoadingSkeleton type="merchant" count={8} />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <HeaderSection>
          <Title level={2}>{location}的餐厅</Title>
        </HeaderSection>
        <LoadingContainer>
          <div style={{ textAlign: 'center' }}>
            <Text type="danger">加载失败，请重试</Text>
            <br />
            <RefreshButton onClick={handleRefresh} style={{ marginTop: '16px' }}>
              <RefreshCw size={16} />
              重新加载
            </RefreshButton>
          </div>
        </LoadingContainer>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <HeaderSection>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
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
          
          <RefreshButton onClick={handleRefresh}>
            <RefreshCw size={16} />
            刷新数据
          </RefreshButton>
        </div>
        
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
              total={filteredMerchants.length} 
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