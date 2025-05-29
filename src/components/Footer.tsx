import React from 'react';
import { Layout, Row, Col, Typography, Space, Divider } from 'antd';
import { PhoneCall, Mail, Globe, Facebook, Twitter, Instagram } from 'lucide-react';
import styled from 'styled-components';
import { customStyles } from '../styles/theme';

const { Footer: AntFooter } = Layout;
const { Title, Text, Link } = Typography;

const StyledFooter = styled(AntFooter)`
  background-color: #f7f7f7;
  padding: ${customStyles.spacing.xl} ${customStyles.spacing.lg};
`;

const FooterTitle = styled(Title)`
  font-size: 16px !important;
  margin-bottom: ${customStyles.spacing.md} !important;
`;

const FooterLink = styled(Link)`
  display: block;
  margin-bottom: ${customStyles.spacing.sm};
  color: ${customStyles.colors.textSecondary} !important;
  
  &:hover {
    color: ${customStyles.colors.primary} !important;
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${customStyles.spacing.sm};
  
  svg {
    margin-right: ${customStyles.spacing.sm};
    color: ${customStyles.colors.primary};
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${customStyles.spacing.md};
  margin-top: ${customStyles.spacing.md};
  
  svg {
    color: ${customStyles.colors.textSecondary};
    transition: color 0.3s ease;
    
    &:hover {
      color: ${customStyles.colors.primary};
    }
  }
`;

const Copyright = styled(Text)`
  display: block;
  text-align: center;
  margin-top: ${customStyles.spacing.lg};
  color: ${customStyles.colors.textLight};
`;

const Footer: React.FC = () => {
  return (
    <StyledFooter>
      <Row gutter={[32, 24]}>
        <Col xs={24} sm={12} md={6}>
          <FooterTitle level={4}>关于我们</FooterTitle>
          <FooterLink href="#">品牌故事</FooterLink>
          <FooterLink href="#">美饭博客</FooterLink>
          <FooterLink href="#">加入我们</FooterLink>
          <FooterLink href="#">新闻中心</FooterLink>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <FooterTitle level={4}>用户服务</FooterTitle>
          <FooterLink href="#">如何点餐</FooterLink>
          <FooterLink href="#">会员计划</FooterLink>
          <FooterLink href="#">帮助中心</FooterLink>
          <FooterLink href="#">优惠活动</FooterLink>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <FooterTitle level={4}>商家服务</FooterTitle>
          <FooterLink href="#">商家入驻</FooterLink>
          <FooterLink href="#">商家后台</FooterLink>
          <FooterLink href="#">商家资源</FooterLink>
          <FooterLink href="#">成功案例</FooterLink>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <FooterTitle level={4}>联系我们</FooterTitle>
          <ContactItem>
            <PhoneCall size={16} />
            <Text>400-123-4567</Text>
          </ContactItem>
          <ContactItem>
            <Mail size={16} />
            <Text>support@meifan.com</Text>
          </ContactItem>
          <ContactItem>
            <Globe size={16} />
            <Text>www.meifan.com</Text>
          </ContactItem>
          
          <SocialLinks>
            <Facebook size={20} />
            <Twitter size={20} />
            <Instagram size={20} />
          </SocialLinks>
        </Col>
      </Row>
      
      <Divider />
      
      <Copyright>
        © {new Date().getFullYear()} 美饭外卖. 保留所有权利.
      </Copyright>
    </StyledFooter>
  );
};

export default Footer;