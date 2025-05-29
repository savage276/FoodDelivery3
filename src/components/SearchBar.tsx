import React, { useState } from 'react';
import { Input, Select, Button, Space } from 'antd';
import { Search, Filter } from 'lucide-react';
import styled from 'styled-components';
import { customStyles } from '../styles/theme';

const { Option } = Select;

interface SearchBarProps {
  onSearch: (keyword: string, filters: any) => void;
}

const SearchContainer = styled.div`
  background-color: white;
  padding: ${customStyles.spacing.md};
  border-radius: 8px;
  box-shadow: ${customStyles.shadows.small};
`;

const SearchInput = styled(Input)`
  border-radius: 4px;
`;

const FilterButton = styled(Button)`
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 4px;
  }
`;

const SearchButton = styled(Button)`
  background-color: ${customStyles.colors.primary};
  border-color: ${customStyles.colors.primary};
  color: white;
  min-width: 80px;
  font-weight: 500;
  
  &:hover, &:focus {
    background-color: ${customStyles.colors.primary}cc !important;
    border-color: ${customStyles.colors.primary}cc !important;
    color: white !important;
  }
`;

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    cuisine: '',
    price: '',
    rating: '',
    distance: '',
  });

  const handleSearch = () => {
    onSearch(keyword, filters);
  };

  const updateFilter = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <SearchContainer>
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Space>
          <SearchInput
            placeholder="搜索餐厅或菜品"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={handleSearch}
            prefix={<Search size={16} />}
            size="large"
            style={{ width: 300 }}
          />
          
          <FilterButton 
            onClick={() => setShowFilters(!showFilters)}
            icon={<Filter size={16} />}
          >
            筛选
          </FilterButton>
          
          <SearchButton 
            type="primary" 
            onClick={handleSearch}
            size="large"
          >
            搜索
          </SearchButton>
        </Space>
        
        {showFilters && (
          <Space wrap>
            <Select
              placeholder="菜系"
              style={{ width: 120 }}
              onChange={(value) => updateFilter('cuisine', value)}
              allowClear
            >
              <Option value="chinese">中餐</Option>
              <Option value="japanese">日料</Option>
              <Option value="italian">意餐</Option>
              <Option value="american">美式</Option>
              <Option value="thai">泰餐</Option>
            </Select>
            
            <Select
              placeholder="价格"
              style={{ width: 120 }}
              onChange={(value) => updateFilter('price', value)}
              allowClear
            >
              <Option value="$">¥</Option>
              <Option value="$$">¥¥</Option>
              <Option value="$$$">¥¥¥</Option>
            </Select>
            
            <Select
              placeholder="评分"
              style={{ width: 120 }}
              onChange={(value) => updateFilter('rating', value)}
              allowClear
            >
              <Option value="4.5">4.5分以上</Option>
              <Option value="4">4.0分以上</Option>
              <Option value="3.5">3.5分以上</Option>
            </Select>
            
            <Select
              placeholder="距离"
              style={{ width: 120 }}
              onChange={(value) => updateFilter('distance', value)}
              allowClear
            >
              <Option value="1">&lt; 1 km</Option>
              <Option value="3">&lt; 3 km</Option>
              <Option value="5">&lt; 5 km</Option>
              <Option value="10">&lt; 10 km</Option>
            </Select>
          </Space>
        )}
      </Space>
    </SearchContainer>
  );
};

export default SearchBar;