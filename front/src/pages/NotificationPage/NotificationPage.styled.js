import styled from 'styled-components';
import { flexBetween, flexColumn, container } from '../../styles/mixins';

export const NotificationContainer = styled.div`
  ${container}
  padding: ${props => props.theme.spacing[6]} ${props => props.theme.spacing[4]};
  max-width: 800px;
`;

export const NotificationHeader = styled.div`
  ${flexBetween}
  margin-bottom: ${props => props.theme.spacing[6]};
  gap: ${props => props.theme.spacing[3]};
`;

export const PageTitle = styled.h1`
  font-size: ${props => props.theme.fonts.size['3xl']};
  font-weight: ${props => props.theme.fonts.weight.bold};
  color: ${props => props.theme.colors.gray[900]};
  margin: 0;
`;

export const ActionButton = styled.button`
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[4]};
  background: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.gray[700]};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.fonts.weight.medium};
  font-size: ${props => props.theme.fonts.size.sm};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    background: ${props => props.theme.colors.gray[50]};
    border-color: ${props => props.theme.colors.gray[400]};
  }
`;

export const NotificationList = styled.div`
  ${flexColumn}
  gap: ${props => props.theme.spacing[2]};
`;

export const NotificationItem = styled.div`
  padding: ${props => props.theme.spacing[4]};
  background: ${props => props.$isRead ? props.theme.colors.white : props.theme.colors.primary[50]};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-left: 4px solid ${props => props.$isRead ? 'transparent' : props.theme.colors.primary[600]};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    background: ${props => props.theme.colors.gray[50]};
    border-color: ${props => props.theme.colors.primary[300]};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const NotificationItemContent = styled.div`
  ${flexColumn}
  gap: ${props => props.theme.spacing[2]};
`;

export const NotificationTitle = styled.div`
  font-weight: ${props => props.$isRead ? props.theme.fonts.weight.medium : props.theme.fonts.weight.semibold};
  font-size: ${props => props.theme.fonts.size.base};
  color: ${props => props.theme.colors.gray[900]};
`;

export const NotificationContent = styled.div`
  font-size: ${props => props.theme.fonts.size.sm};
  color: ${props => props.theme.colors.gray[600]};
  line-height: ${props => props.theme.fonts.lineHeight.relaxed};
`;

export const NotificationTime = styled.div`
  font-size: ${props => props.theme.fonts.size.xs};
  color: ${props => props.theme.colors.gray[500]};
  margin-top: ${props => props.theme.spacing[1]};
`;

export const EmptyState = styled.div`
  ${flexColumn}
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing[16]} ${props => props.theme.spacing[4]};
  text-align: center;
`;

export const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: ${props => props.theme.spacing[4]};
`;

export const EmptyTitle = styled.h3`
  font-size: ${props => props.theme.fonts.size.xl};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.theme.colors.gray[900]};
  margin: 0 0 ${props => props.theme.spacing[2]} 0;
`;

export const EmptyDescription = styled.p`
  font-size: ${props => props.theme.fonts.size.base};
  color: ${props => props.theme.colors.gray[600]};
  margin: 0;
`;

export const LoadingState = styled.div`
  ${flexColumn}
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing[16]};
  color: ${props => props.theme.colors.gray[600]};
  font-size: ${props => props.theme.fonts.size.base};
`;