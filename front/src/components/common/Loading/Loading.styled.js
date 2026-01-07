import styled, { keyframes, css } from 'styled-components';

// 부드러운 회전 애니메이션
const spin = keyframes`
  0% { 
    transform: rotate(0deg);
  }
  100% { 
    transform: rotate(360deg);
  }
`;

// 펄스 애니메이션 (오버레이용)
const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
`;

// 스피너 크기별 스타일
const getSpinnerSize = (size) => {
  switch (size) {
    case 'small':
      return {
        width: '20px',
        height: '20px',
        borderWidth: '2px',
      };
    case 'large':
      return {
        width: '60px',
        height: '60px',
        borderWidth: '5px',
      };
    default: // medium
      return {
        width: '40px',
        height: '40px',
        borderWidth: '3px',
      };
  }
};

export const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

export const Spinner = styled.div`
  ${props => {
    const { width, height, borderWidth } = getSpinnerSize(props.size);
    return css`
      width: ${width};
      height: ${height};
      border: ${borderWidth} solid ${props.color || 'rgba(102, 126, 234, 0.2)'};
      border-top-color: ${props.color || '#667eea'};
      border-radius: 50%;
      animation: ${spin} 0.8s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    `;
  }}
`;

export const LoadingText = styled.div`
  color: ${props => props.$textColor || props.theme?.colors?.gray?.[600] || '#6b7280'};
  font-size: ${props => props.theme?.fonts?.size?.sm || '14px'};
  font-weight: 500;
  text-align: center;
  margin-top: 4px;
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  ${css`
    animation: ${pulse} 2s ease-in-out infinite;
  `}
`;

// 버튼 내부용 점 애니메이션
const dotBounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
`;

export const ButtonSpinnerContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: 8px;

  .spinner-dot {
    width: ${props => props.size === 'small' ? '4px' : '6px'};
    height: ${props => props.size === 'small' ? '4px' : '6px'};
    border-radius: 50%;
    background-color: ${props => props.color || 'currentColor'};
    ${css`
      animation: ${dotBounce} 1.4s ease-in-out infinite;
    `}
    
    &:nth-child(1) {
      animation-delay: -0.32s;
    }
    
    &:nth-child(2) {
      animation-delay: -0.16s;
    }
    
    &:nth-child(3) {
      animation-delay: 0s;
    }
  }
`;

