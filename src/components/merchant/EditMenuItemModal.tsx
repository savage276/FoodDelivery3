import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Upload, Button, message, Switch } from 'antd';
import { Upload as UploadIcon } from 'lucide-react';
import { MenuItem } from '../../types';

const { Option } = Select;
const { TextArea } = Input;

interface EditMenuItemModalProps {
  visible: boolean;
  item: MenuItem | null;
  onCancel: () => void;
  onSubmit: (id: string, item: Partial<MenuItem>) => Promise<void>;
}

const categories = [
  '特色推荐',
  '粤式烧腊',
  '粥品',
  '炖汤',
  '小炒',
  '海鲜',
  '点心',
  '甜品',
  '饮品'
];

const EditMenuItemModal: React.FC<EditMenuItemModalProps> = ({
  visible,
  item,
  onCancel,
  onSubmit
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (item && visible) {
      form.setFieldsValue({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        stock: item.stock || 0,
        isAvailable: item.isAvailable,
        isSpicy: item.isSpicy || false,
        isVegetarian: item.isVegetarian || false,
        isPopular: item.isPopular || false
      });
    }
  }, [item, visible, form]);

  const handleSubmit = async () => {
    if (!item) return;

    try {
      const values = await form.validateFields();
      setLoading(true);
      
      const updatedItem: Partial<MenuItem> = {
        name: values.name,
        description: values.description,
        price: values.price,
        category: values.category,
        stock: values.stock,
        isAvailable: values.isAvailable,
        isSpicy: values.isSpicy,
        isVegetarian: values.isVegetarian,
        isPopular: values.isPopular
      };

      await onSubmit(item.id, updatedItem);
      onCancel();
      message.success('菜品更新成功');
    } catch (error) {
      console.error('更新菜品失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const uploadProps = {
    name: 'file',
    action: '/api/upload', // Mock upload endpoint
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
        message.success(`${info.file.name} 上传成功`);
        form.setFieldsValue({ image: info.file.response?.url });
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };

  return (
    <Modal
      title="编辑菜品"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
      okText="保存"
      cancelText="取消"
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="name"
          label="菜品名称"
          rules={[{ required: true, message: '请输入菜品名称' }]}
        >
          <Input placeholder="请输入菜品名称" />
        </Form.Item>

        <Form.Item
          name="category"
          label="菜品分类"
          rules={[{ required: true, message: '请选择菜品分类' }]}
        >
          <Select placeholder="请选择菜品分类">
            {categories.map(category => (
              <Option key={category} value={category}>
                {category}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="price"
          label="价格"
          rules={[{ required: true, message: '请输入价格' }]}
        >
          <InputNumber
            min={0}
            precision={2}
            style={{ width: '100%' }}
            placeholder="请输入价格"
            addonAfter="元"
          />
        </Form.Item>

        <Form.Item
          name="stock"
          label="库存"
          rules={[{ required: true, message: '请输入库存数量' }]}
        >
          <InputNumber
            min={0}
            style={{ width: '100%' }}
            placeholder="请输入库存数量"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="菜品描述"
          rules={[{ required: true, message: '请输入菜品描述' }]}
        >
          <TextArea
            rows={3}
            placeholder="请输入菜品描述"
          />
        </Form.Item>

        <Form.Item
          name="image"
          label="菜品图片"
        >
          <Upload {...uploadProps}>
            <Button icon={<UploadIcon size={16} />}>
              点击上传图片
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item name="isAvailable" label="是否可售" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item name="isSpicy" label="辣味菜品" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item name="isVegetarian" label="素食菜品" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item name="isPopular" label="热门推荐" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditMenuItemModal;