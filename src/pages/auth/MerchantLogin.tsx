import React from 'react';
import { Form, Input, Button, Typography, Space } from 'antd';
import { Mail, Lock } from 'lucide-react';
import styled from 'styled-components';
import { useMerchantAuth } from '../../contexts/MerchantAuthContext';
import { customStyles } from '../../styles/theme';

const { Text } = Typography;

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: ${customStyles.spacing.md};
  }
`;

const MerchantLogin: React.FC = () => {
  const { merchant_login } = useMerchantAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values: { account: string; password: string }) => {
    setLoading(true);
    try {
      await merchant_login(values.account, values.password);
    } catch (error) {
      // Error is handled in MerchantAuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledForm
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{ account: 'merchant@example.com', password: 'password' }}
    >
      <Form.Item
        name="account"
        rules={[
          { required: true, message: '请输入商家账户' },
          {
            validator: (_, value) => {
              if (!value) return Promise.resolve();
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              const phoneRegex = /^1[3-9]\d{9}$/;
              if (emailRegex.test(value) || phoneRegex.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('请输入有效的邮箱或手机号'));
            }
          }
        ]}
      >
        <Input 
          prefix={<Mail size={16} />} 
          placeholder="邮箱或手机号" 
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

      <div style={{ textAlign: 'center' }}>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          登录即表示您同意我们的商家服务条款
        </Text>
      </div>
    </StyledForm>
  );
};

export default MerchantLogin;