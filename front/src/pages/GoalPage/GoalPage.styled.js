import styled from 'styled-components';
import { flexColumn, flexCenter } from '../../styles/mixins';

export const GoalContainer = styled.div`
  ${flexCenter}
  min-height: calc(100vh - 140px);
  padding: ${props => props.theme.spacing[6]};
  background: ${props => props.theme.colors.gray[50]};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    min-height: calc(100vh - 200px);
    margin-bottom: -60px;
  }
`;

export const GoalCard = styled.div`
  background: transparent;
  padding: ${props => props.theme.spacing[8]};
  width: 100%;
  max-width: 1000px;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.spacing[6]};
    margin: ${props => props.theme.spacing[4]};
  }
`;

export const GoalHeader = styled.div`
  ${flexColumn}
  margin-bottom: ${props => props.theme.spacing[8]};
`;

export const GoalTitle = styled.h1`
  color: ${props => props.theme.colors.primary[600]};
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 ${props => props.theme.spacing[2]} 0;
  letter-spacing: -0.02em;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 1.8rem;
  }
`;

export const GoalDescription = styled.p`
  color: ${props => props.theme.colors.gray[600]};
  font-size: 1rem;
  margin: 0;
`;

export const GoalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${props => props.theme.spacing[4]};
  margin-bottom: ${props => props.theme.spacing[6]};

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[3]};
  }
`;

export const GoalItemCard = styled.div`
  position: relative;
  background: ${props => props.$completed ? props.theme.colors.success[50] : props.theme.colors.white};
  border: 2px solid ${props => props.$completed ? props.theme.colors.success[300] : props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing[5]};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    border-color: ${props => props.$completed ? props.theme.colors.success[400] : props.theme.colors.primary[500]};
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transform: translateY(-2px);
  }

  ${props => props.$completed && `
    box-shadow: 0 2px 4px -1px rgba(5, 150, 105, 0.1), 0 1px 2px -1px rgba(5, 150, 105, 0.06);
  `}
`;

export const GoalItemText = styled.div`
  font-size: ${props => props.theme.fonts.size.base};
  font-weight: ${props => props.$completed ? props.theme.fonts.weight.semibold : props.theme.fonts.weight.medium};
  color: ${props => props.$completed ? props.theme.colors.success[700] : props.theme.colors.gray[900]};
  line-height: 1.6;
  word-break: break-word;
  margin-bottom: ${props => props.theme.spacing[3]};
`;

export const GoalItemFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
`;

export const GoalItemStatus = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  font-size: ${props => props.theme.fonts.size.sm};
  color: ${props => props.$completed ? props.theme.colors.success[600] : props.theme.colors.gray[500]};
  font-weight: ${props => props.theme.fonts.weight.medium};
`;

export const ActionMenuButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.gray[500]};
  cursor: pointer;
  padding: ${props => props.theme.spacing[1]};
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${props => props.theme.transitions.base};
  font-size: 1.2rem;

  &:hover {
    background: ${props => props.theme.colors.gray[100]};
    color: ${props => props.theme.colors.gray[700]};
  }
`;

export const ActionMenu = styled.div`
  position: absolute;
  top: ${props => props.$top || '40px'};
  right: ${props => props.$right || '10px'};
  background: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 100;
  min-width: 150px;
  overflow: hidden;
  animation: fadeIn 0.15s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const ActionMenuItem = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  background: transparent;
  border: none;
  text-align: left;
  font-size: ${props => props.theme.fonts.size.sm};
  color: ${props => {
    if (props.$variant === 'danger') return props.theme.colors.danger[600];
    if (props.$variant === 'success') return props.theme.colors.success[600];
    return props.theme.colors.gray[700];
  }};
  cursor: pointer;
  transition: background ${props => props.theme.transitions.base};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};

  &:hover {
    background: ${props => props.theme.colors.gray[50]};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.gray[100]};
  }
`;

export const AddGoalButton = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing[4]};
  background: ${props => props.theme.colors.white};
  border: 2px dashed ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.lg};
  color: ${props => props.theme.colors.gray[600]};
  font-size: ${props => props.theme.fonts.size.base};
  font-weight: ${props => props.theme.fonts.weight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};
  margin-bottom: ${props => props.theme.spacing[6]};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing[2]};

  &:hover {
    background: ${props => props.theme.colors.primary[50]};
    border-color: ${props => props.theme.colors.primary[400]};
    color: ${props => props.theme.colors.primary[600]};
  }
`;

export const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.danger[500]};
  font-size: ${props => props.theme.fonts.size.sm};
  margin-bottom: ${props => props.theme.spacing[4]};
  padding: ${props => props.theme.spacing[3]};
  background: ${props => props.theme.colors.danger[50]};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.danger[200]};
`;

export const EmptyState = styled.div`
  ${flexCenter}
  ${flexColumn}
  padding: ${props => props.theme.spacing[12]};
  text-align: center;
  color: ${props => props.theme.colors.gray[500]};
`;

export const EmptyStateText = styled.p`
  font-size: ${props => props.theme.fonts.size.lg};
  margin: ${props => props.theme.spacing[4]} 0 0 0;
`;

export const ModalInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing[3]};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fonts.size.base};
  color: ${props => props.theme.colors.gray[900]};
  transition: all ${props => props.theme.transitions.base};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.gray[300]};
  }

  &::placeholder {
    color: ${props => props.theme.colors.gray[400]};
  }
`;

export const ModalTextarea = styled.textarea`
  width: 100%;
  padding: ${props => props.theme.spacing[3]};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fonts.size.base};
  color: ${props => props.theme.colors.gray[900]};
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: all ${props => props.theme.transitions.base};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.gray[300]};
  }

  &::placeholder {
    color: ${props => props.theme.colors.gray[400]};
  }
`;
