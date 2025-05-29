import React from 'react';
import { Button } from 'antd';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { customStyles } from '../styles/theme';

interface BackButtonProps {
  className?: string;
  onNavigateBack?: () => void;
}

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  color: ${customStyles.colors.primary};
  font-weight: 500;
  
  @media (max-width: 768px) {
    padding: 12px;
  }

  &:hover {
    color: ${customStyles.colors.primary};
    opacity: 0.85;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const BackButton: React.FC<BackButtonProps> = ({
  className,
  onNavigateBack,
}) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (onNavigateBack) {
      onNavigateBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <StyledButton
      type="text"
      icon={<ChevronLeft />}
      onClick={handleBack}
      className={className}
    >
      返回
    </StyledButton>
  );
};

export default BackButton;