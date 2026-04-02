import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${props => props.theme.spacing[4]};
`;

export const ModalContent = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.lg};
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing[5]};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
`;

export const ModalTitle = styled.h2`
  font-size: ${props => props.theme.fonts.size.xl};
  font-weight: ${props => props.theme.fonts.weight.bold};
  color: ${props => props.theme.colors.gray[900]};
  margin: 0;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.gray[500]};
  font-size: 24px;
  cursor: pointer;
  padding: ${props => props.theme.spacing[1]};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color ${props => props.theme.transitions.base};

  &:hover {
    color: ${props => props.theme.colors.gray[700]};
  }
`;

export const ModalBody = styled.div`
  padding: ${props => props.theme.spacing[5]};
  overflow-y: auto;
  flex: 1;
`;

export const DraftList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[3]};
`;

export const DraftItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing[4]};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    border-color: ${props => props.theme.colors.primary[300]};
    background: ${props => props.theme.colors.gray[50]};
  }
`;

export const DraftInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const DraftTitle = styled.h3`
  font-size: ${props => props.theme.fonts.size.base};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.theme.colors.gray[900]};
  margin: 0 0 ${props => props.theme.spacing[1]} 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const DraftDate = styled.p`
  font-size: ${props => props.theme.fonts.size.sm};
  color: ${props => props.theme.colors.gray[500]};
  margin: 0;
`;

export const DeleteButton = styled.button`
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  background: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.danger[600]};
  border: 1px solid ${props => props.theme.colors.danger[300]};
  border-radius: ${props => props.theme.borderRadius.base};
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};
  white-space: nowrap;
  margin-left: ${props => props.theme.spacing[3]};

  &:hover {
    background: ${props => props.theme.colors.danger[50]};
    border-color: ${props => props.theme.colors.danger[400]};
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing[10]} ${props => props.theme.spacing[4]};
  color: ${props => props.theme.colors.gray[500]};
`;

export const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${props => props.theme.spacing[3]};
`;

export const EmptyText = styled.p`
  font-size: ${props => props.theme.fonts.size.base};
  margin: 0;
`;

export const LoadingState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing[10]};
  color: ${props => props.theme.colors.gray[500]};
  font-size: ${props => props.theme.fonts.size.base};
`;
