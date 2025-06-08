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
  Switch
} from 'antd';
import { 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  Store, 
  DollarSign, 
  Package, 
  TrendingUp 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useMerchantAuth } from '../../contexts/MerchantAuthContext';
import { MenuItem } from '../../types';
import { customStyles } from '../../styles/theme';
import { 
  fetchMerchantMenu, 
  addMenuItem, 
  updateMenuItem, 
  deleteMenuItem 
} from '../../services/api_merchants';
import AddMenuItemModal from '../../components/merchant/AddMenuItemModal';
import EditMenuItemModal from '../../components/merchant/EditMenuItemModal';

const { Title, Text } = Typography;

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${customStyles.spacing.lg};
  
  @media (max-width: 768px) {
    padding: ${customStyles.spacing.md};
  }
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

const MerchantDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { merchant, merchant_logout } = useMerchantAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    if (!merchant) {
      navigate('/login?tab=merchant');
      return;
    }
    loadMenuItems();
  }, [merchant, navigate]);

  const loadMenuItems = async () => {
    setLoading(true);
    try {
      const items = await fetchMerchantMenu();
      setMenuItems(items);
    } catch (error) {
      message.error('加载菜品失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (item: Omit<MenuItem, 'id'>) => {
    try {
      const newItem = await addMenuItem(item);
      setMenuItems(prev => [...prev, newItem]);
    } catch (error) {
      message.error('添加菜品失败');
      throw error;
    }
  };

  const handleEditItem = async (id: string, item: Partial<MenuItem>) => {
    try {
      const updatedItem = await updateMenuItem(id, item);
      setMenuItems(prev => prev.map(menuItem => 
        menuItem.id === id ? updatedItem : menuItem
      ));
    } catch (error) {
      message.error('更新菜品失败');
      throw error;
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteMenuItem(id);
      setMenuItems(prev => prev.filter(item => item.id !== id));
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleAvailabilityChange = async (id: string, isAvailable: boolean) => {
    try {
      await handleEditItem(id, { isAvailable });
      message.success(isAvailable ? '菜品已上架' : '菜品已下架');
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleLogout = () => {
    merchant_logout();
  };

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
          {stock}
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

  return (
    <PageContainer>
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
          >
            新增菜品
          </ActionButton>
        </div>

        <StyledTable
          columns={columns}
          dataSource={menuItems}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
          }}
          scroll={{ x: 800 }}
        />
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
    </PageContainer>
  );
};

export default MerchantDashboard;