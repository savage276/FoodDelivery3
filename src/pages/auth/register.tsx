import React from 'react';
import { Form, Input, Button, Card, Typography, Space, Divider } from 'antd';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { customStyles } from '../../styles/theme';

const { Title, Text } = Typography;

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${customStyles.spacing.lg};
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const RegisterCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  box-shadow: ${customStyles.shadows.medium};
  border-radius: ${customStyles.borderRadius.lg};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${customStyles.spacing.sm};
  margin-bottom: ${customStyles.spacing.lg};
  color: ${customStyles.colors.primary};
  
  svg {
    width: 32px;
    height: 32px;
  }
`;

const Register: React.FC = () => {
  const { user_register } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values: { username: string; email: string; password: string }) => {
    setLoading(true);
    try {
      await user_register(values.username, values.email, values.password);
    } catch (error) {
      // Error is handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <RegisterCard>
        <Logo>
          <UserPlus size={32} />
          <Title level={3} style={{ margin: 0 }}>注册</Title>
        </Logo>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input 
              prefix={<User size={16} />} 
              placeholder="用户名" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input 
              prefix={<Mail size={16} />} 
              placeholder="邮箱" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码长度至少为6位' }
            ]}
          >
            <Input.Password 
              prefix={<Lock size={16} />} 
              placeholder="密码" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<Lock size={16} />} 
              placeholder="确认密码" 
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              size="large"
              loading={loading}
            >
              注册
            </Button>
          </Form.Item>

          <Divider>
            <Text type="secondary">已有账号？</Text>
          </Divider>

          <Link to="/login">
            <Button block size="large">
              登录
            </Button>
          </Link>
        </Form>
      </RegisterCard>
    </PageContainer>
  );
};

export default Register;