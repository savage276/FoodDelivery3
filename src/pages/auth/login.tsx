import React from 'react';
import { Form, Input, Button, Card, Typography, Space, Divider } from 'antd';
import { Mail, Lock, LogIn } from 'lucide-react';
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

const LoginCard = styled(Card)`
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

const Login: React.FC = () => {
  const { user_login } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await user_login(values.email, values.password);
    } catch (error) {
      // Error is handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <LoginCard>
        <Logo>
          <LogIn size={32} />
          <Title level={3} style={{ margin: 0 }}>登录</Title>
        </Logo>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ email: 'zhangsan@example.com', password: 'password' }}
        >
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
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password 
              prefix={<Lock size={16} />} 
              placeholder="密码" 
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
              登录
            </Button>
          </Form.Item>

          <Divider>
            <Text type="secondary">还没有账号？</Text>
          </Divider>

          <Link to="/register">
            <Button block size="large">
              注册新账号
            </Button>
          </Link>
        </Form>
      </LoginCard>
    </PageContainer>
  );
};

export default Login;