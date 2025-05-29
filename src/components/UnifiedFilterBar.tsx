import React, { useState } from 'react';
import { Radio, Space, Select, Button, Tag, Drawer, Layout } from 'antd';
import { SortAsc, X, Filter, ChevronRight } from 'lucide-react';
import styled from 'styled-components';
import { customStyles } from '../styles/theme';

const { Sider, Content } = Layout;
const { Option } = Select;

interface UnifiedFilterBarProps {
  onFilterChange: (key: string, value: string | null) => void;
  onSortChange: (value: string) => void;
  activeFilters: Record<string, string>;
  clearFilters: () => void;
  showSidebar?: boolean;
}

const FilterContainer = styled.div`
  background-color: white;
  padding: ${customStyles.spacing.md};
  border-radius: 8px;
  box-shadow: ${customStyles.shadows.small};
  margin-bottom: ${customStyles.spacing.md};
`;

const FilterButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterSection = styled.div`
  margin-bottom: ${customStyles.spacing.md};
`;

const SortSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${customStyles.spacing.md};
`;

const FilterLabel = styled.div`
  font-weight: 500;
  margin-bottom: ${customStyles.spacing.sm};
  color: ${customStyles.colors.textPrimary};
`;

const ActiveFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${customStyles.spacing.sm};
  margin-top: ${customStyles.spacing.sm};
`;

const StyledSider = styled(Sider)`
  background: white;
  padding: ${customStyles.spacing.md};
  border-right: 1px solid ${customStyles.colors.border};
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileFilterDrawer = styled(Drawer)`
  .ant-drawer-body {
    padding: ${customStyles.spacing.md};
  }
`;

const cuisineOptions = [
  { value: 'all', label: '全部' },
  { value: '中餐', label: '中餐' },
  { value: '日料', label: '日料' },
  { value: '韩餐', label: '韩餐' },
  { value: '意餐', label: '意餐' },
  { value: '法餐', label: '法餐' },
  { value: '泰餐', label: '泰餐' },
  { value: '墨西哥菜', label: '墨西哥菜' },
  { value: '印度菜', label: '印度菜' }
];

const UnifiedFilterBar: React.FC<UnifiedFilterBarProps> = ({
  onFilterChange,
  onSortChange,
  activeFilters,
  clearFilters,
  showSidebar = false
}) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const activeFilterCount = Object.values(activeFilters).filter(value => value && value !== 'all').length;

  const getFilterLabel = (key: string, value: string) => {
    switch (key) {
      case 'cuisine':
        return cuisineOptions.find(opt => opt.value === value)?.label || value;
      case 'averagePrice':
        switch (value) {
          case '0-50': return '¥0-50';
          case '51-100': return '¥51-100';
          case '101-200': return '¥101-200';
          case '201+': return '¥201以上';
          default: return value;
        }
      case 'rating':
        return `${value}分以上`;
      case 'distance':
        switch (value) {
          case '0-1': return '1公里内';
          case '1-3': return '1-3公里';
          case '3-5': return '3-5公里';
          case '5+': return '5公里以上';
          default: return value;
        }
      default:
        return value;
    }
  };

  const renderFilterContent = () => (
    <>
      <FilterSection>
        <FilterLabel>菜系</FilterLabel>
        <Radio.Group 
          onChange={(e) => onFilterChange('cuisine', e.target.value)}
          value={activeFilters.cuisine || 'all'}
        >
          <Space direction="vertical">
            {cuisineOptions.map(option => (
              <Radio key={option.value} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </FilterSection>

      <FilterSection>
        <FilterLabel>人均消费</FilterLabel>
        <Radio.Group 
          onChange={(e) => onFilterChange('averagePrice', e.target.value)}
          value={activeFilters.averagePrice || 'all'}
        >
          <Space direction="vertical">
            <Radio value="all">全部</Radio>
            <Radio value="0-50">¥0-50</Radio>
            <Radio value="51-100">¥51-100</Radio>
            <Radio value="101-200">¥101-200</Radio>
            <Radio value="201+">¥201以上</Radio>
          </Space>
        </Radio.Group>
      </FilterSection>

      <FilterSection>
        <FilterLabel>评分</FilterLabel>
        <Radio.Group 
          onChange={(e) => onFilterChange('rating', e.target.value)}
          value={activeFilters.rating || 'all'}
        >
          <Space direction="vertical">
            <Radio value="all">全部</Radio>
            <Radio value="4.5">4.5分以上</Radio>
            <Radio value="4.0">4.0分以上</Radio>
            <Radio value="3.5">3.5分以上</Radio>
          </Space>
        </Radio.Group>
      </FilterSection>

      <FilterSection>
        <FilterLabel>距离</FilterLabel>
        <Radio.Group 
          onChange={(e) => onFilterChange('distance', e.target.value)}
          value={activeFilters.distance || 'all'}
        >
          <Space direction="vertical">
            <Radio value="all">全部</Radio>
            <Radio value="0-1">1公里内</Radio>
            <Radio value="1-3">1-3公里</Radio>
            <Radio value="3-5">3-5公里</Radio>
            <Radio value="5+">5公里以上</Radio>
          </Space>
        </Radio.Group>
      </FilterSection>
    </>
  );

  return (
    <Layout hasSider={showSidebar}>
      {showSidebar && (
        <StyledSider width={280} theme="light">
          {renderFilterContent()}
        </StyledSider>
      )}
      
      <Content>
        <FilterContainer>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space wrap>
              <FilterButton 
                icon={<Filter size={16} />}
                onClick={() => setDrawerVisible(true)}
              >
                筛选
                {activeFilterCount > 0 && (
                  <Tag color="blue">{activeFilterCount}</Tag>
                )}
              </FilterButton>

              <ActiveFilters>
                {Object.entries(activeFilters).map(([key, value]) => (
                  value && value !== 'all' ? (
                    <Tag 
                      key={key}
                      closable
                      onClose={() => onFilterChange(key, null)}
                      color={
                        key === 'cuisine' ? 'green' : 
                        key === 'averagePrice' ? 'gold' :
                        key === 'rating' ? 'blue' :
                        key === 'distance' ? 'purple' : 'default'
                      }
                    >
                      {key === 'cuisine' ? '菜系' : 
                       key === 'averagePrice' ? '人均' :
                       key === 'rating' ? '评分' :
                       key === 'distance' ? '距离' : '其他'}: {getFilterLabel(key, value)}
                    </Tag>
                  ) : null
                ))}
              </ActiveFilters>
            </Space>

            <SortSection>
              <SortAsc size={16} />
              <Select 
                defaultValue="recommended" 
                style={{ width: 150 }}
                onChange={onSortChange}
              >
                <Option value="recommended">推荐排序</Option>
                <Option value="rating">评分最高</Option>
                <Option value="delivery">配送最快</Option>
                <Option value="distance">距离最近</Option>
                <Option value="priceAsc">价格从低到高</Option>
                <Option value="priceDesc">价格从高到低</Option>
              </Select>
            </SortSection>
          </div>

          {activeFilterCount > 0 && (
            <Button 
              type="link" 
              onClick={clearFilters}
              style={{ padding: 0, marginTop: 8 }}
            >
              清除全部筛选
            </Button>
          )}
        </FilterContainer>
      </Content>

      <MobileFilterDrawer
        title="筛选条件"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={320}
        extra={
          activeFilterCount > 0 && (
            <Button type="text" onClick={clearFilters}>
              清除全部
            </Button>
          )
        }
      >
        {renderFilterContent()}
      </MobileFilterDrawer>
    </Layout>
  );
};

export default UnifiedFilterBar;