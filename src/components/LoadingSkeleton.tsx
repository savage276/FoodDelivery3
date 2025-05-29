import React from 'react';
import { Skeleton, Card, Row, Col } from 'antd';
import styled from 'styled-components';
import { customStyles } from '../styles/theme';

interface LoadingSkeletonProps {
  type: 'merchant' | 'menuItem' | 'detail';
  count?: number;
}

const SkeletonCard = styled(Card)`
  margin-bottom: ${customStyles.spacing.md};
  border-radius: 8px;
  overflow: hidden;
`;

const MerchantImageSkeleton = styled.div`
  height: 160px;
  background-color: #f5f5f5;
  margin-bottom: ${customStyles.spacing.md};
`;

const MenuItemSkeleton = styled.div`
  display: flex;
  gap: ${customStyles.spacing.md};
  margin-bottom: ${customStyles.spacing.md};
`;

const MenuItemImageSkeleton = styled.div`
  width: 120px;
  height: 120px;
  background-color: #f5f5f5;
  flex-shrink: 0;
  border-radius: 8px;
  
  @media (max-width: 576px) {
    width: 80px;
    height: 80px;
  }
`;

const DetailHeaderSkeleton = styled.div`
  height: 200px;
  background-color: #f5f5f5;
  margin-bottom: ${customStyles.spacing.lg};
  position: relative;
  border-radius: 8px;
`;

const DetailLogoSkeleton = styled.div`
  width: 80px;
  height: 80px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  bottom: -40px;
  left: ${customStyles.spacing.lg};
`;

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type, count = 4 }) => {
  const renderMerchantSkeletons = () => {
    return Array(count).fill(null).map((_, index) => (
      <Col xs={24} sm={12} md={8} lg={6} key={index}>
        <SkeletonCard>
          <MerchantImageSkeleton />
          <Skeleton active paragraph={{ rows: 3 }} />
        </SkeletonCard>
      </Col>
    ));
  };

  const renderMenuItemSkeletons = () => {
    return Array(count).fill(null).map((_, index) => (
      <MenuItemSkeleton key={index}>
        <MenuItemImageSkeleton />
        <div style={{ flex: 1 }}>
          <Skeleton active paragraph={{ rows: 2 }} />
        </div>
      </MenuItemSkeleton>
    ));
  };

  const renderDetailSkeleton = () => {
    return (
      <>
        <DetailHeaderSkeleton>
          <DetailLogoSkeleton />
        </DetailHeaderSkeleton>
        
        <Skeleton active paragraph={{ rows: 2 }} />
        
        <Row gutter={[16, 16]} style={{ marginTop: customStyles.spacing.lg }}>
          <Col span={24}>
            <Skeleton active title={{ width: '30%' }} paragraph={{ rows: 0 }} />
          </Col>
          
          {Array(6).fill(null).map((_, index) => (
            <Col xs={24} sm={12} md={8} key={index}>
              <MenuItemSkeleton>
                <MenuItemImageSkeleton />
                <div style={{ flex: 1 }}>
                  <Skeleton active paragraph={{ rows: 2 }} />
                </div>
              </MenuItemSkeleton>
            </Col>
          ))}
        </Row>
      </>
    );
  };

  switch (type) {
    case 'merchant':
      return <Row gutter={[16, 16]}>{renderMerchantSkeletons()}</Row>;
    case 'menuItem':
      return <>{renderMenuItemSkeletons()}</>;
    case 'detail':
      return renderDetailSkeleton();
    default:
      return null;
  }
};

export default LoadingSkeleton;