import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Button, 
  Table, 
  Space, 
  Tag, 
  Popconfirm, 
  message, 
  Card, 
  Avatar,
  Row,
  Col,
  Statistic,
  Switch,
  Layout,
  Menu,
  Spin,
  Result
} from 'antd';
import { 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  Store, 
  DollarSign, 
  Package, 
  TrendingUp,
  User,
  BarChart3,
  Settings
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useMerchantAuth } from '../../contexts/MerchantAuthContext';
import { MenuItem } from '../../types';
import { customStyles } from '../../styles/theme';
import AddMenuItemModal from '../../components/merchant/AddMenuItemModal';
import EditMenuItemModal from '../../components/merchant/EditMenuItemModal';
import MerchantCenter from './MerchantCenter';
import { useMenu, useAddMenuItem, useUpdateMenuItem, useDeleteMenuItem } from '../../hooks/useMenu';

const { Title, Text } = Typography;
const { Sider, Content } = Layout;

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f0f2f5;
`;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledSider = styled(Sider)`
  background: white;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
`;

const HeaderCard = styled(Card)`
  margin-bottom: ${customStyles.spacing.lg};
  background: linear-gradient(135deg, #1890ff 0%, #722ed1 100%);
  color: white;
  
  .ant-card-body {
    padding: ${customStyles.spacing.lg};
  }
  
  .ant-statistic-title {
    color: rgba(255, 255, 255, 0.85) !important;
  }
  
  .ant-statistic-content {
    color: white !important;
  }
`;

const ContentContainer = styled.div`
  padding: ${customStyles.spacing.lg};
  
  @media (max-width: 768px) {
    padding: ${customStyles.spacing.md};
  }
`;

const ActionButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background-color: #fafafa;
    font-weight: 600;
  }
`;

const StyledMenu = styled(Menu)`
  border-right: none;
  
  .ant-menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 4px 0;
    border-radius: 6px;
  }
  
  .ant-menu-item-selected {
    background-color: #e6f7ff;
    color: ${customStyles.colors.primary};
  }
`;

const LogoSection = styled.div`
  padding: ${customStyles.spacing.lg};
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: ${customStyles.spacing.md};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const MerchantDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { merchant, merchant_logout } = useMerchantAuth();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('menu');

  // Use the new hooks
  const { data: menuItems = [], isLoading, error, refetch } = useMenu(merchant?.id);
  const addMenuItemMutation = useAddMenuItem(merchant?.id);
  const updateMenuItemMutation = useUpdateMenuItem(merchant?.id);
  const deleteMenuItemMutation = useDeleteMenuItem(merchant?.id);

  useEffect(() => {
    if (!merchant) {
      navigate('/login?tab=merchant');
      return;
    }
    
    // Get current page from URL
    const path = location.pathname;
    if (path.includes('center')) {
      setCurrentPage('center');
    } else {
      setCurrentPage('menu');
    }
  }, [merchant, navigate, location]);

  const handleAddItem = async (item: Omit<MenuItem, 'id'>) => {
    try {
      await addMenuItemMutation.mutateAsync(item);
      setAddModalVisible(false);
    } catch (error) {
      // Error is handled by the mutation
      throw error;
    }
  };

  const handleEditItem = async (id: string, item: Partial<MenuItem>) => {
    try {
      await updateMenuItemMutation.mutateAsync({ itemId: id, item });
      setEditModalVisible(false);
      setEditingItem(null);
    } catch (error) {
      // Error is handled by the mutation
      throw error;
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteMenuItemMutation.mutateAsync(id);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleAvailabilityChange = async (id: string, isAvailable: boolean) => {
    try {
      await updateMenuItemMutation.mutateAsync({ 
        itemId: id, 
        item: { isAvailable } 
      });
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleLogout = () => {
    merchant_logout();
  };

  const handleMenuClick = (key: string) => {
    setCurrentPage(key);
    if (key === 'center') {
      navigate('/merchant/center');
    } else {
      navigate('/merchant/dashboard');
    }
  };

  const menuConfig = [
    {
      key: 'menu',
      icon: <Package size={16} />,
      label: '菜品管理',
    },
    {
      key: 'center',
      icon: <User size={16} />,
      label: '商家中心',
    },
    {
      key: 'analytics',
      icon: <BarChart3 size={16} />,
      label: '数据分析',
    },
    {
      key: 'settings',
      icon: <Settings size={16} />,
      label: '店铺设置',
    },
  ];

  const columns = [
    {
      title: '菜品图片',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (image: string, record: MenuItem) => (
        <Avatar 
          src={image} 
          alt={record.name}
          size={60}
          shape="square"
        />
      ),
    },
    {
      title: '菜品名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: MenuItem) => (
        <div>
          <Text strong>{name}</Text>
          {record.isPopular && <Tag color="red" style={{ marginLeft: 8 }}>热门</Tag>}
          {record.isSpicy && <Tag color="orange">辣</Tag>}
          {record.isVegetarian && <Tag color="green">素</Tag>}
        </div>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => <Text strong>¥{price.toFixed(2)}</Text>,
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number) => (
        <Text type={stock > 10 ? 'success' : stock > 0 ? 'warning' : 'danger'}>
          {stock || 0}
        </Text>
      ),
    },
    {
      title: '状态',
      dataIndex: 'isAvailable',
      key: 'isAvailable',
      render: (isAvailable: boolean, record: MenuItem) => (
        <Switch
          checked={isAvailable}
          onChange={(checked) => handleAvailabilityChange(record.id, checked)}
          checkedChildren="上架"
          unCheckedChildren="下架"
          loading={updateMenuItemMutation.isPending}
        />
      ),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record: MenuItem) => (
        <Space>
          <ActionButton
            type="text"
            icon={<Edit size={16} />}
            onClick={() => {
              setEditingItem(record);
              setEditModalVisible(true);
            }}
          >
            编辑
          </ActionButton>
          <Popconfirm
            title="确定要删除这个菜品吗？"
            description="删除后无法恢复"
            onConfirm={() => handleDeleteItem(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <ActionButton
              type="text"
              danger
              icon={<Trash2 size={16} />}
              loading={deleteMenuItemMutation.isPending}
            >
              删除
            </ActionButton>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (!merchant) {
    return null;
  }

  const totalItems = menuItems.length;
  const availableItems = menuItems.filter(item => item.isAvailable).length;
  const totalValue = menuItems.reduce((sum, item) => sum + (item.price * (item.stock || 0)), 0);

  const renderContent = () => {
    if (currentPage === 'center') {
      return <MerchantCenter />;
    }

    if (currentPage === 'analytics') {
      return (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Title level={3}>数据分析</Title>
          <Text type="secondary">功能开发中...</Text>
        </div>
      );
    }

    if (currentPage === 'settings') {
      return (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Title level={3}>店铺设置</Title>
          <Text type="secondary">功能开发中...</Text>
        </div>
      );
    }

    // Default menu management page
    return (
      <>
        <HeaderCard>
          <Row gutter={24} align="middle">
            <Col>
              <Avatar 
                size={80} 
                src={merchant.logo} 
                icon={<Store />}
              />
            </Col>
            <Col flex="1">
              <Title level={2} style={{ color: 'white', margin: 0 }}>
                {merchant.name}
              </Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                {merchant.description || '欢迎来到商家管理后台'}
              </Text>
            </Col>
            <Col>
              <ActionButton
                icon={<LogOut size={16} />}
                onClick={handleLogout}
                style={{ 
                  background: 'rgba(255, 255, 255, 0.2)', 
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                退出登录
              </ActionButton>
            </Col>
          </Row>

          <Row gutter={24} style={{ marginTop: customStyles.spacing.lg }}>
            <Col xs={24} sm={8}>
              <Statistic
                title="菜品总数"
                value={totalItems}
                prefix={<Package size={20} />}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic
                title="在售菜品"
                value={availableItems}
                prefix={<TrendingUp size={20} />}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic
                title="库存总价值"
                value={totalValue}
                precision={2}
                prefix={<DollarSign size={20} />}
                suffix="元"
              />
            </Col>
          </Row>
        </HeaderCard>

        <Card>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: customStyles.spacing.lg 
          }}>
            <Title level={3} style={{ margin: 0 }}>菜品管理</Title>
            <ActionButton
              type="primary"
              icon={<Plus size={16} />}
              onClick={() => setAddModalVisible(true)}
              loading={addMenuItemMutation.isPending}
            >
              新增菜品
            </ActionButton>
          </div>

          {isLoading ? (
            <LoadingContainer>
              <Spin size="large" />
            </LoadingContainer>
          ) : error ? (
            <Result
              status="error"
              title="菜品加载失败"
              subTitle="请稍后重试"
              extra={
                <Button type="primary\" onClick={() => refetch()}>
                  重新加载
                </Button>
              }
            />
          ) : (
            <StyledTable
              columns={columns}
              dataSource={menuItems}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
              }}
              scroll={{ x: 800 }}
            />
          )}
        </Card>

        <AddMenuItemModal
          visible={addModalVisible}
          onCancel={() => setAddModalVisible(false)}
          onSubmit={handleAddItem}
        />

        <EditMenuItemModal
          visible={editModalVisible}
          item={editingItem}
          onCancel={() => {
            setEditModalVisible(false);
            setEditingItem(null);
          }}
          onSubmit={handleEditItem}
        />
      </>
    );
  };

  return (
    <PageContainer>
      <StyledLayout>
        <StyledSider 
          collapsible 
          collapsed={collapsed} 
          onCollapse={setCollapsed}
          width={250}
          collapsedWidth={80}
        >
          <LogoSection>
            <Avatar 
              size={collapsed ? 40 : 60} 
              src={merchant.logo} 
              icon={<Store />}
            />
            {!collapsed && (
              <div style={{ marginTop: 8 }}>
                <Text strong style={{ color: customStyles.colors.textPrimary }}>
                  {merchant.name}
                </Text>
              </div>
            )}
          </LogoSection>
          
          <StyledMenu
            mode="inline"
            selectedKeys={[currentPage]}
            onClick={({ key }) => handleMenuClick(key)}
            items={menuConfig}
          />
        </StyledSider>
        
        <Content>
          <ContentContainer>
            {renderContent()}
          </ContentContainer>
        </Content>
      </StyledLayout>
    </PageContainer>
  );
};

export default MerchantDashboard;