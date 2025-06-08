import React from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { User, Mail, Lock, Phone } from 'lucide-react';
import styled from 'styled-components';
import { useMerchantAuth } from '../../contexts/MerchantAuthContext';
import { customStyles } from '../../styles/theme';

const { Text } = Typography;

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: ${customStyles.spacing.md};
  }
`;

const MerchantRegister: React.FC = () => {
  const { merchant_register } = useMerchantAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values: { name: string; account: string; password: string; contact: string }) => {
    setLoading(true);
    try {
      await merchant_register(values.name, values.account, values.password, values.contact);
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
    >
      <Form.Item
        name="name"
        rules={[{ required: true, message: '请输入店铺名称' }]}
      >
        <Input 
          prefix={<User size={16} />} 
          placeholder="店铺名称" 
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="account"
        rules={[
          { required: true, message: '请输入邮箱或手机号' },
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
        name="contact"
        rules={[
          { required: true, message: '请输入联系方式' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
        ]}
      >
        <Input 
          prefix={<Phone size={16} />} 
          placeholder="联系手机号" 
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

      <div style={{ textAlign: 'center' }}>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          注册即表示您同意我们的商家服务条款和隐私政策
        </Text>
      </div>
    </StyledForm>
  );
};

export default MerchantRegister;