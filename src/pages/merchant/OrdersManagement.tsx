import React, { useState } from 'react';
import { 
  Typography, 
  Card, 
  Space, 
  Button, 
  Select, 
  DatePicker, 
  Statistic, 
  Row, 
  Col,
  message,
  Modal,
  Descriptions,
  Tag,
  List,
  Spin,
  Result
} from 'antd';
import { 
  Package, 
  TrendingUp, 
  Clock, 
  DollarSign,
  RefreshCw,
  Filter,
  Download
} from 'lucide-react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { useMerchantAuth } from '../../contexts/MerchantAuthContext';
import { useOrders } from '../../hooks/useOrders';
import { updateOrderStatus } from '../../services/api_merchants';
import OrderTable from '../../components/OrderTable';
import { Order } from '../../types';
import { customStyles } from '../../styles/theme';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const PageContainer = styled.div`
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

const FilterCard = styled(Card)`
  margin-bottom: ${customStyles.spacing.md};
`;

const ActionButton = styled(Button)`
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

const OrdersManagement: React.FC = () => {
  const { merchant } = useMerchantAuth();
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  
  // Use the unified orders hook
  const { data: orders = [], isLoading, error, refetch } = useOrders({ 
    merchantId: merchant?.id 
  });

  console.log('🏪 OrdersManagement: Component rendered with merchant:', merchant?.id, 'orders:', orders.length, 'loading:', isLoading, 'error:', error);

  const handleStatusUpdate = async (orderId: string, status: Order['status']) => {
    console.log('🔄 OrdersManagement handleStatusUpdate: Updating order', orderId, 'to status', status);
    try {
      await updateOrderStatus(orderId, status);
      message.success('订单状态更新成功');
    } catch (error) {
      console.error('🔄 OrdersManagement handleStatusUpdate: Error updating status:', error);
      message.error('更新失败，请重试');
    }
  };

  const handleViewDetails = (order: Order) => {
    console.log('👁️ OrdersManagement handleViewDetails: Viewing order details for:', order.id);
    setSelectedOrder(order);
    setDetailModalVisible(true);
  };

  const handleRefresh = () => {
    console.log('🔄 OrdersManagement handleRefresh: Refreshing orders data');
    refetch();
    message.success('数据已刷新');
  };

  const handleExport = () => {
    message.info('导出功能开发中...');
  };

  // Filter orders based on status and date range
  const filteredOrders = orders.filter(order => {
    const statusMatch = statusFilter === 'all' || order.status === statusFilter;
    
    let dateMatch = true;
    if (dateRange) {
      const orderDate = dayjs(order.createdAt);
      dateMatch = orderDate.isAfter(dateRange[0].startOf('day')) && 
                  orderDate.isBefore(dateRange[1].endOf('day'));
    }
    
    return statusMatch && dateMatch;
  });

  console.log('🏪 OrdersManagement: Filtered orders:', filteredOrders.length, 'from total:', orders.length);

  // Calculate statistics
  const todayOrders = orders.filter(order => 
    dayjs(order.createdAt).isSame(dayjs(), 'day')
  );
  
  const todayRevenue = todayOrders.reduce((sum, order) => 
    order.status !== 'cancelled' ? sum + order.totalPrice : sum, 0
  );
  
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const completionRate = orders.length > 0 
    ? (orders.filter(order => order.status === 'delivered').length / orders.length * 100)
    : 0;

  if (!merchant) {
    console.log('🏪 OrdersManagement: No merchant found, showing error');
    return (
      <Result
        status="error"
        title="未找到商家信息"
        subTitle="请重新登录"
      />
    );
  }

  if (isLoading) {
    console.log('🏪 OrdersManagement: Showing loading state');
    return (
      <LoadingContainer>
        <Spin size="large" />
      </LoadingContainer>
    );
  }

  if (error) {
    console.log('🏪 OrdersManagement: Showing error state:', error);
    return (
      <Result
        status="error"
        title="订单加载失败"
        subTitle="请稍后重试"
        extra={
          <Button type="primary" onClick={handleRefresh}>
            重新加载
          </Button>
        }
      />
    );
  }

  console.log('🏪 OrdersManagement: Rendering main content with', orders.length, 'orders');

  return (
    <PageContainer>
      <Title level={2}>订单管理</Title>
      
      {/* Statistics Header */}
      <HeaderCard>
        <Row gutter={24}>
          <Col xs={12} sm={6}>
            <Statistic
              title="今日订单"
              value={todayOrders.length}
              prefix={<Package size={20} />}
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic
              title="今日营业额"
              value={todayRevenue}
              precision={2}
              prefix={<DollarSign size={20} />}
              suffix="元"
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic
              title="待处理订单"
              value={pendingOrders}
              prefix={<Clock size={20} />}
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic
              title="完成率"
              value={completionRate}
              precision={1}
              prefix={<TrendingUp size={20} />}
              suffix="%"
            />
          </Col>
        </Row>
      </HeaderCard>

      {/* Filters */}
      <FilterCard>
        <Row gutter={16} align="middle">
          <Col xs={24} sm={6}>
            <Space>
              <Filter size={16} />
              <Text strong>筛选条件:</Text>
            </Space>
          </Col>
          
          <Col xs={24} sm={4}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
              placeholder="订单状态"
            >
              <Option value="all">全部状态</Option>
              <Option value="pending">待确认</Option>
              <Option value="confirmed">已确认</Option>
              <Option value="preparing">制作中</Option>
              <Option value="delivering">配送中</Option>
              <Option value="delivered">已送达</Option>
              <Option value="cancelled">已取消</Option>
            </Select>
          </Col>
          
          <Col xs={24} sm={6}>
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              style={{ width: '100%' }}
              placeholder={['开始日期', '结束日期']}
            />
          </Col>
          
          <Col xs={24} sm={8}>
            <Space>
              <ActionButton
                icon={<RefreshCw size={16} />}
                onClick={handleRefresh}
              >
                刷新
              </ActionButton>
              
              <ActionButton
                icon={<Download size={16} />}
                onClick={handleExport}
              >
                导出
              </ActionButton>
              
              <Button
                onClick={() => {
                  setStatusFilter('all');
                  setDateRange(null);
                }}
              >
                清除筛选
              </Button>
            </Space>
          </Col>
        </Row>
      </FilterCard>

      {/* Orders Table */}
      <Card>
        <div style={{ marginBottom: '16px' }}>
          <Text strong>
            共找到 {filteredOrders.length} 条订单记录
          </Text>
        </div>
        
        <OrderTable
          orders={filteredOrders}
          loading={isLoading}
          onViewDetails={handleViewDetails}
          onUpdateStatus={handleStatusUpdate}
          showMerchantActions={true}
        />
      </Card>

      {/* Order Detail Modal */}
      <Modal
        title={`订单详情 - ${selectedOrder?.id}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="订单ID">
                {selectedOrder.id}
              </Descriptions.Item>
              <Descriptions.Item label="用户">
                {selectedOrder.userName || '用户'}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={selectedOrder.status === 'delivered' ? 'green' : 'blue'}>
                  {selectedOrder.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="支付方式">
                {selectedOrder.paymentMethod === 'card' ? '在线支付' : '货到付款'}
              </Descriptions.Item>
              <Descriptions.Item label="预计送达">
                {selectedOrder.estimatedDeliveryTime}
              </Descriptions.Item>
              <Descriptions.Item label="配送地址" span={2}>
                {selectedOrder.address.city} {selectedOrder.address.address}
              </Descriptions.Item>
            </Descriptions>

            <Title level={4} style={{ marginTop: '24px' }}>订单明细</Title>
            <List
              dataSource={selectedOrder.items}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={`${item.name} x${item.quantity}`}
                    description={item.notes && `备注: ${item.notes}`}
                  />
                  <div>¥{(item.price * item.quantity).toFixed(2)}</div>
                </List.Item>
              )}
            />

            <div style={{ marginTop: '16px', textAlign: 'right' }}>
              <Space direction="vertical">
                <Text>配送费: ¥{selectedOrder.deliveryFee.toFixed(2)}</Text>
                <Text strong style={{ fontSize: '16px' }}>
                  总计: ¥{selectedOrder.totalPrice.toFixed(2)}
                </Text>
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default OrdersManagement;