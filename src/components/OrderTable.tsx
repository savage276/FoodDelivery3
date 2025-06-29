import React from 'react';
import { Table, Tag, Button, Space, Typography, Avatar } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Eye, CheckCircle, XCircle, Clock, Truck } from 'lucide-react';
import styled from 'styled-components';
import { Order } from '../types';
import { customStyles } from '../styles/theme';

const { Text } = Typography;

interface OrderTableProps {
  orders: Order[];
  columns?: ColumnsType<Order>;
  loading?: boolean;
  onViewDetails?: (order: Order) => void;
  onUpdateStatus?: (orderId: string, status: Order['status']) => void;
  showMerchantActions?: boolean;
  showUserActions?: boolean;
}

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background-color: #fafafa;
    font-weight: 600;
  }
  
  .ant-table-tbody > tr:hover > td {
    background-color: #f5f5f5;
  }
`;

const StatusTag = styled(Tag)<{ $status: Order['status'] }>`
  font-weight: 500;
`;

const ActionButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const AddressText = styled(Text)`
  max-width: 200px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  columns,
  loading = false,
  onViewDetails,
  onUpdateStatus,
  showMerchantActions = false,
  showUserActions = false
}) => {
  const getStatusColor = (status: Order['status']) => {
    const colorMap = {
      pending: 'orange',
      confirmed: 'blue',
      preparing: 'cyan',
      delivering: 'purple',
      delivered: 'green',
      cancelled: 'red'
    };
    return colorMap[status] || 'default';
  };

  const getStatusText = (status: Order['status']) => {
    const textMap = {
      pending: '待确认',
      confirmed: '已确认',
      preparing: '制作中',
      delivering: '配送中',
      delivered: '已送达',
      cancelled: '已取消'
    };
    return textMap[status] || status;
  };

  const defaultColumns: ColumnsType<Order> = [
    {
      title: '订单ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id: string) => (
        <Text code style={{ fontSize: '12px' }}>{id}</Text>
      )
    },
    {
      title: '用户信息',
      key: 'user',
      width: 120,
      render: (_, record) => (
        <div>
          <Text strong>{record.userName || '用户'}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            ID: {record.userId}
          </Text>
        </div>
      )
    },
    {
      title: '商家',
      dataIndex: 'merchantName',
      key: 'merchantName',
      width: 150,
      render: (name: string) => (
        <Text strong>{name}</Text>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (createdAt: string) => (
        <div>
          <Text>{new Date(createdAt).toLocaleDateString()}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {new Date(createdAt).toLocaleTimeString()}
          </Text>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: Order['status']) => (
        <StatusTag 
          color={getStatusColor(status)} 
          $status={status}
        >
          {getStatusText(status)}
        </StatusTag>
      )
    },
    {
      title: '订单金额',
      key: 'amount',
      width: 120,
      render: (_, record) => (
        <div>
          <Text strong>¥{record.totalPrice.toFixed(2)}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            配送费: ¥{record.deliveryFee.toFixed(2)}
          </Text>
        </div>
      )
    },
    {
      title: '配送地址',
      key: 'address',
      width: 200,
      render: (_, record) => (
        <div>
          <Text strong>{record.address.label}</Text>
          <br />
          <AddressText type="secondary">
            {record.address.city} {record.address.address}
          </AddressText>
        </div>
      )
    },
    {
      title: '菜品',
      key: 'items',
      width: 200,
      render: (_, record) => (
        <div>
          {record.items.slice(0, 2).map((item, index) => (
            <div key={index} style={{ marginBottom: '4px' }}>
              <Text style={{ fontSize: '12px' }}>
                {item.name} x{item.quantity}
              </Text>
            </div>
          ))}
          {record.items.length > 2 && (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              等{record.items.length}个菜品
            </Text>
          )}
        </div>
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <ActionButton
            type="text"
            size="small"
            icon={<Eye size={14} />}
            onClick={() => onViewDetails?.(record)}
          >
            详情
          </ActionButton>
          
          {showMerchantActions && (
            <Space size="small">
              {record.status === 'pending' && (
                <ActionButton
                  type="text"
                  size="small"
                  icon={<CheckCircle size={14} />}
                  onClick={() => onUpdateStatus?.(record.id, 'confirmed')}
                  style={{ color: customStyles.colors.success }}
                >
                  接单
                </ActionButton>
              )}
              
              {record.status === 'confirmed' && (
                <ActionButton
                  type="text"
                  size="small"
                  icon={<Clock size={14} />}
                  onClick={() => onUpdateStatus?.(record.id, 'preparing')}
                  style={{ color: customStyles.colors.warning }}
                >
                  制作
                </ActionButton>
              )}
              
              {record.status === 'preparing' && (
                <ActionButton
                  type="text"
                  size="small"
                  icon={<Truck size={14} />}
                  onClick={() => onUpdateStatus?.(record.id, 'delivering')}
                  style={{ color: customStyles.colors.primary }}
                >
                  配送
                </ActionButton>
              )}
              
              {['pending', 'confirmed'].includes(record.status) && (
                <ActionButton
                  type="text"
                  size="small"
                  danger
                  icon={<XCircle size={14} />}
                  onClick={() => onUpdateStatus?.(record.id, 'cancelled')}
                >
                  取消
                </ActionButton>
              )}
            </Space>
          )}
          
          {showUserActions && (
            <Space size="small">
              <ActionButton
                type="primary"
                size="small"
              >
                再来一单
              </ActionButton>
              
              {record.status === 'delivered' && (
                <ActionButton
                  type="text"
                  size="small"
                >
                  评价
                </ActionButton>
              )}
            </Space>
          )}
        </Space>
      )
    }
  ];

  return (
    <StyledTable
      columns={columns || defaultColumns}
      dataSource={orders}
      rowKey="id"
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => 
          `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
      }}
      scroll={{ x: 1200 }}
      size="middle"
    />
  );
};

export default OrderTable;