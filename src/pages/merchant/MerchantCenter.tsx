import React, { useState } from 'react';
import { 
  Typography, 
  Card, 
  Form, 
  Input, 
  Button, 
  Select, 
  Upload, 
  Avatar, 
  Row, 
  Col,
  Divider,
  Switch,
  message,
  Statistic,
  Tag,
  Space,
  Modal,
  Progress
} from 'antd';
import { 
  User, 
  Store, 
  Phone, 
  Mail, 
  MapPin, 
  Camera, 
  Shield, 
  TrendingUp,
  Award,
  Clock,
  DollarSign,
  Edit,
  Save,
  Lock
} from 'lucide-react';
import styled from 'styled-components';
import { useMerchantAuth } from '../../contexts/MerchantAuthContext';
import { useUpdateMerchantProfile } from '../../hooks/useMerchant';
import { customStyles } from '../../styles/theme';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${customStyles.spacing.lg};
  
  @media (max-width: 768px) {
    padding: ${customStyles.spacing.md};
  }
`;

const ProfileCard = styled(Card)`
  margin-bottom: ${customStyles.spacing.lg};
  
  .ant-card-body {
    padding: ${customStyles.spacing.lg};
  }
`;

const AvatarUpload = styled.div`
  position: relative;
  display: inline-block;
  margin-bottom: ${customStyles.spacing.md};

  .upload-button {
    position: absolute;
    bottom: 0;
    right: 0;
    background: ${customStyles.colors.primary};
    color: white;
    border-radius: 50%;
    padding: 8px;
    cursor: pointer;
    box-shadow: ${customStyles.shadows.small};
    border: 2px solid white;
  }
`;

const InfoCard = styled(Card)`
  margin-bottom: ${customStyles.spacing.md};
  
  .ant-card-head {
    background: #fafafa;
  }
`;

const EditableSection = styled.div<{ $editing: boolean }>`
  border: ${props => props.$editing ? `2px dashed ${customStyles.colors.primary}` : '2px dashed transparent'};
  border-radius: 8px;
  padding: ${props => props.$editing ? '16px' : '0'};
  transition: all 0.3s ease;
`;

const StatCard = styled(Card)`
  text-align: center;
  
  .ant-statistic-title {
    color: ${customStyles.colors.textSecondary};
  }
`;

const VerificationBadge = styled.div<{ $verified: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  background: ${props => props.$verified ? '#f6ffed' : '#fff2e8'};
  color: ${props => props.$verified ? '#52c41a' : '#fa8c16'};
  border: 1px solid ${props => props.$verified ? '#b7eb8f' : '#ffd591'};
`;

const MerchantCenter: React.FC = () => {
  const { merchant } = useMerchantAuth();
  const updateProfileMutation = useUpdateMerchantProfile(merchant?.id);
  const [editingBasic, setEditingBasic] = useState(false);
  const [editingSecurity, setEditingSecurity] = useState(false);
  const [basicForm] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  if (!merchant) {
    return null;
  }

  const handleBasicInfoSave = async (values: any) => {
    try {
      await updateProfileMutation.mutateAsync({
        name: values.name,
        phone: values.phone,
        email: values.email,
        address: values.address,
        description: values.description,
        cuisine: values.cuisine
      });
      setEditingBasic(false);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleSecuritySave = async (values: any) => {
    try {
      // Mock API call for security settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('安全设置更新成功');
      setEditingSecurity(false);
    } catch (error) {
      message.error('更新失败');
    }
  };

  const handlePasswordChange = async (values: any) => {
    try {
      // Mock API call for password change
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('密码修改成功');
      setPasswordModalVisible(false);
    } catch (error) {
      message.error('密码修改失败');
    }
  };

  const uploadProps = {
    name: 'file',
    action: '/api/upload',
    beforeUpload: (file: File) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('只能上传 JPG/PNG 格式的图片!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图片大小不能超过 2MB!');
      }
      return isJpgOrPng && isLt2M;
    },
    onChange: (info: any) => {
      if (info.file.status === 'done') {
        message.success('头像上传成功');
        // Update merchant logo in real-time
        updateProfileMutation.mutate({ logo: info.file.response?.url });
      } else if (info.file.status === 'error') {
        message.error('头像上传失败');
      }
    },
  };

  // Mock data for demonstration
  const businessStats = {
    totalOrders: 1248,
    monthlyRevenue: 45680,
    averageRating: 4.8,
    completionRate: 98.5
  };

  const verificationStatus = {
    businessLicense: true,
    foodSafety: true,
    identity: true,
    bankAccount: false
  };

  return (
    <PageContainer>
      <Title level={2}>商家中心</Title>
      
      {/* Profile Header */}
      <ProfileCard>
        <Row gutter={24} align="middle">
          <Col>
            <AvatarUpload>
              <Upload {...uploadProps} showUploadList={false}>
                <Avatar 
                  size={100} 
                  src={merchant.logo} 
                  icon={<Store />}
                />
                <div className="upload-button">
                  <Camera size={16} />
                </div>
              </Upload>
            </AvatarUpload>
          </Col>
          <Col flex="1">
            <Title level={3} style={{ margin: 0 }}>{merchant.name}</Title>
            <Space direction="vertical" size={4}>
              <Text type="secondary">{merchant.email}</Text>
              <Space>
                <Tag color="green">营业中</Tag>
                <VerificationBadge $verified={true}>
                  <Award size={12} />
                  已认证商家
                </VerificationBadge>
              </Space>
            </Space>
          </Col>
        </Row>
      </ProfileCard>

      {/* Business Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: customStyles.spacing.lg }}>
        <Col xs={12} sm={6}>
          <StatCard>
            <Statistic
              title="总订单数"
              value={businessStats.totalOrders}
              prefix={<TrendingUp size={16} />}
            />
          </StatCard>
        </Col>
        <Col xs={12} sm={6}>
          <StatCard>
            <Statistic
              title="月营业额"
              value={businessStats.monthlyRevenue}
              precision={2}
              prefix={<DollarSign size={16} />}
              suffix="元"
            />
          </StatCard>
        </Col>
        <Col xs={12} sm={6}>
          <StatCard>
            <Statistic
              title="平均评分"
              value={businessStats.averageRating}
              precision={1}
              prefix={<Award size={16} />}
              suffix="/5.0"
            />
          </StatCard>
        </Col>
        <Col xs={12} sm={6}>
          <StatCard>
            <Statistic
              title="完成率"
              value={businessStats.completionRate}
              precision={1}
              prefix={<Clock size={16} />}
              suffix="%"
            />
          </StatCard>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          {/* Basic Information */}
          <InfoCard
            title={
              <Space>
                <User size={16} />
                基本信息
                <Button
                  type="text"
                  icon={editingBasic ? <Save size={14} /> : <Edit size={14} />}
                  loading={updateProfileMutation.isPending}
                  onClick={() => {
                    if (editingBasic) {
                      basicForm.submit();
                    } else {
                      setEditingBasic(true);
                      basicForm.setFieldsValue({
                        name: merchant.name,
                        phone: merchant.phone,
                        email: merchant.email,
                        address: merchant.address,
                        description: merchant.description,
                        cuisine: merchant.cuisine
                      });
                    }
                  }}
                >
                  {editingBasic ? '保存' : '编辑'}
                </Button>
              </Space>
            }
          >
            <EditableSection $editing={editingBasic}>
              {editingBasic ? (
                <Form
                  form={basicForm}
                  layout="vertical"
                  onFinish={handleBasicInfoSave}
                >
                  <Form.Item
                    name="name"
                    label="店铺名称"
                    rules={[{ required: true, message: '请输入店铺名称' }]}
                  >
                    <Input />
                  </Form.Item>
                  
                  <Form.Item
                    name="phone"
                    label="联系电话"
                    rules={[{ required: true, message: '请输入联系电话' }]}
                  >
                    <Input />
                  </Form.Item>
                  
                  <Form.Item
                    name="email"
                    label="邮箱地址"
                    rules={[{ required: true, type: 'email', message: '请输入有效邮箱' }]}
                  >
                    <Input />
                  </Form.Item>
                  
                  <Form.Item
                    name="address"
                    label="店铺地址"
                    rules={[{ required: true, message: '请输入店铺地址' }]}
                  >
                    <Input />
                  </Form.Item>
                  
                  <Form.Item
                    name="cuisine"
                    label="经营类别"
                    rules={[{ required: true, message: '请选择经营类别' }]}
                  >
                    <Select mode="multiple" placeholder="选择经营类别">
                      <Option value="中餐">中餐</Option>
                      <Option value="西餐">西餐</Option>
                      <Option value="日料">日料</Option>
                      <Option value="韩餐">韩餐</Option>
                      <Option value="快餐">快餐</Option>
                      <Option value="甜品">甜品</Option>
                      <Option value="饮品">饮品</Option>
                    </Select>
                  </Form.Item>
                  
                  <Form.Item
                    name="description"
                    label="店铺描述"
                  >
                    <TextArea rows={3} placeholder="介绍一下您的店铺特色" />
                  </Form.Item>
                  
                  <Space>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={updateProfileMutation.isPending}
                    >
                      保存
                    </Button>
                    <Button onClick={() => setEditingBasic(false)}>
                      取消
                    </Button>
                  </Space>
                </Form>
              ) : (
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                  <div>
                    <Text strong>店铺名称：</Text>
                    <Text>{merchant.name}</Text>
                  </div>
                  <div>
                    <Text strong>联系电话：</Text>
                    <Text>{merchant.phone}</Text>
                  </div>
                  <div>
                    <Text strong>邮箱地址：</Text>
                    <Text>{merchant.email}</Text>
                  </div>
                  <div>
                    <Text strong>店铺地址：</Text>
                    <Text>{merchant.address}</Text>
                  </div>
                  <div>
                    <Text strong>经营类别：</Text>
                    <Space>
                      {merchant.cuisine.map(type => (
                        <Tag key={type} color="blue">{type}</Tag>
                      ))}
                    </Space>
                  </div>
                  <div>
                    <Text strong>店铺描述：</Text>
                    <Paragraph>{merchant.description}</Paragraph>
                  </div>
                </Space>
              )}
            </EditableSection>
          </InfoCard>

          {/* Account Security */}
          <InfoCard
            title={
              <Space>
                <Shield size={16} />
                账户安全
                <Button
                  type="text"
                  icon={editingSecurity ? <Save size={14} /> : <Edit size={14} />}
                  onClick={() => {
                    if (editingSecurity) {
                      securityForm.submit();
                    } else {
                      setEditingSecurity(true);
                    }
                  }}
                >
                  {editingSecurity ? '保存' : '编辑'}
                </Button>
              </Space>
            }
          >
            <EditableSection $editing={editingSecurity}>
              {editingSecurity ? (
                <Form
                  form={securityForm}
                  layout="vertical"
                  onFinish={handleSecuritySave}
                  initialValues={{
                    twoFactorEnabled: false,
                    emailNotifications: true,
                    smsNotifications: true
                  }}
                >
                  <Form.Item
                    name="twoFactorEnabled"
                    label="双重认证"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  
                  <Form.Item
                    name="emailNotifications"
                    label="邮件通知"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  
                  <Form.Item
                    name="smsNotifications"
                    label="短信通知"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  
                  <Space>
                    <Button 
                      type="primary" 
                      htmlType="submit"
                    >
                      保存
                    </Button>
                    <Button onClick={() => setEditingSecurity(false)}>
                      取消
                    </Button>
                  </Space>
                </Form>
              ) : (
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>登录密码：</Text>
                    <Button 
                      type="link" 
                      icon={<Lock size={14} />}
                      onClick={() => setPasswordModalVisible(true)}
                    >
                      修改密码
                    </Button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>双重认证：</Text>
                    <Tag color="orange">未启用</Tag>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>邮件通知：</Text>
                    <Tag color="green">已启用</Tag>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>短信通知：</Text>
                    <Tag color="green">已启用</Tag>
                  </div>
                </Space>
              )}
            </EditableSection>
          </InfoCard>
        </Col>

        <Col xs={24} lg={12}>
          {/* Verification Status */}
          <InfoCard
            title={
              <Space>
                <Award size={16} />
                认证信息
              </Space>
            }
          >
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>营业执照认证</Text>
                <VerificationBadge $verified={verificationStatus.businessLicense}>
                  {verificationStatus.businessLicense ? '已认证' : '待认证'}
                </VerificationBadge>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>食品安全许可</Text>
                <VerificationBadge $verified={verificationStatus.foodSafety}>
                  {verificationStatus.foodSafety ? '已认证' : '待认证'}
                </VerificationBadge>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>身份认证</Text>
                <VerificationBadge $verified={verificationStatus.identity}>
                  {verificationStatus.identity ? '已认证' : '待认证'}
                </VerificationBadge>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>银行账户认证</Text>
                <VerificationBadge $verified={verificationStatus.bankAccount}>
                  {verificationStatus.bankAccount ? '已认证' : '待认证'}
                </VerificationBadge>
              </div>
              
              <Divider />
              
              <div>
                <Text strong>认证进度</Text>
                <Progress 
                  percent={75} 
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                  style={{ marginTop: 8 }}
                />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  完成所有认证可提升店铺信誉度
                </Text>
              </div>
            </Space>
          </InfoCard>

          {/* Business Data */}
          <InfoCard
            title={
              <Space>
                <TrendingUp size={16} />
                经营数据
              </Space>
            }
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="今日订单"
                  value={23}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="今日营业额"
                  value={1580}
                  precision={2}
                  suffix="元"
                  valueStyle={{ color: '#3f8600' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="本月订单"
                  value={456}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="客户满意度"
                  value={96.8}
                  precision={1}
                  suffix="%"
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
            </Row>
            
            <Divider />
            
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>热门菜品：</Text>
                <Text strong>脆皮烧鸭</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>平均配送时间：</Text>
                <Text strong>25分钟</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>复购率：</Text>
                <Text strong>68%</Text>
              </div>
            </Space>
          </InfoCard>
        </Col>
      </Row>

      {/* Password Change Modal */}
      <Modal
        title="修改密码"
        open={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        footer={null}
        width={400}
      >
        <Form
          layout="vertical"
          onFinish={handlePasswordChange}
        >
          <Form.Item
            name="currentPassword"
            label="当前密码"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password />
          </Form.Item>
          
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码长度至少6位' }
            ]}
          >
            <Input.Password />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          
          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setPasswordModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                确认修改
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default MerchantCenter;