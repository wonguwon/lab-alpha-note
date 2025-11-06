import styled from 'styled-components';
import { flexCenter, flexColumn } from '../../../styles/mixins';

/* 모달 오버레이 */
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  ${flexCenter}
  z-index: 1000;
  animation: fadeIn 0.2s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

/* 모달 컨테이너 */
export const ModalContainer = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  max-width: ${props => props.$maxWidth || '500px'};
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideUp 0.2s ease-in-out;

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

/* 모달 헤더 */
export const ModalHeader = styled.div`
  padding: ${props => props.theme.spacing[5]};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

/* 모달 제목 */
export const ModalTitle = styled.h2`
  margin: 0;
  font-size: ${props => props.theme.fonts.size.lg};
  font-weight: ${props => props.theme.fonts.weight.bold};
  color: ${props => props.theme.colors.gray[900]};
`;

/* 닫기 버튼 */
export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${props => props.theme.colors.gray[500]};
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    background: ${props => props.theme.colors.gray[100]};
    color: ${props => props.theme.colors.gray[700]};
  }
`;

/* 모달 바디 */
export const ModalBody = styled.div`
  padding: ${props => props.theme.spacing[5]};
  ${flexColumn}
  gap: ${props => props.theme.spacing[3]};
`;

/* 모달 푸터 */
export const ModalFooter = styled.div`
  padding: ${props => props.theme.spacing[4]} ${props => props.theme.spacing[5]};
  border-top: 1px solid ${props => props.theme.colors.gray[200]};
  display: flex;
  justify-content: ${props => props.$justify || 'flex-end'};
  gap: ${props => props.theme.spacing[2]};
`;

/* 모달 버튼 */
export const ModalButton = styled.button`
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[4]};
  background: ${props => {
    if (props.$variant === 'primary') return props.theme.colors.primary[600];
    if (props.$variant === 'danger') return '#e74c3c';
    if (props.$variant === 'success') return '#27ae60';
    if (props.$variant === 'warning') return '#f39c12';
    return props.theme.colors.gray[200];
  }};
  color: ${props => {
    if (props.$variant === 'primary' || props.$variant === 'danger' ||
        props.$variant === 'success' || props.$variant === 'warning') {
      return props.theme.colors.white;
    }
    return props.theme.colors.gray[700];
  }};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};
  min-width: 80px;

  &:hover:not(:disabled) {
    background: ${props => {
      if (props.$variant === 'primary') return props.theme.colors.primary[700];
      if (props.$variant === 'danger') return '#c0392b';
      if (props.$variant === 'success') return '#229954';
      if (props.$variant === 'warning') return '#e67e22';
      return props.theme.colors.gray[300];
    }};
  }

  &:disabled {
    background: ${props => props.theme.colors.gray[300]};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
