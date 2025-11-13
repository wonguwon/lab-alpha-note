import styled from 'styled-components';
import { flexCenter, flexColumn } from '../../styles/mixins';

export const AnswerContainer = styled.div`
  ${flexCenter}
  min-height: calc(100vh - 140px);
  padding: ${props => props.theme.spacing[6]};
  background: ${props => props.theme.colors.gray[50]};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    min-height: calc(100vh - 200px);
    padding: ${props => props.theme.spacing[4]};
  }
`;

export const AnswerCard = styled.div`
  background: transparent;
  padding: ${props => props.theme.spacing[8]};
  width: 100%;
  max-width: 900px;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing[6]};
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.spacing[4]};
  }
`;

export const AnswerHeader = styled.div`
  ${flexColumn}
  align-items: center;
  margin-bottom: ${props => props.theme.spacing[6]};
  padding-bottom: ${props => props.theme.spacing[4]};
`;

export const PageTitle = styled.h1`
  color: ${props => props.theme.colors.primary[600]};
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.02em;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 1.5rem;
  }
`;

export const QuestionPreview = styled.div`
  background: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing[6]};
  margin-bottom: ${props => props.theme.spacing[6]};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

export const QuestionTitle = styled.h2`
  font-size: ${props => props.theme.fonts.size.xl};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.theme.colors.gray[900]};
  margin: 0 0 ${props => props.theme.spacing[3]} 0;
  line-height: ${props => props.theme.fonts.lineHeight.tight};
`;

export const QuestionContent = styled.p`
  font-size: ${props => props.theme.fonts.size.sm};
  color: ${props => props.theme.colors.gray[600]};
  line-height: ${props => props.theme.fonts.lineHeight.relaxed};
  margin: 0;
  white-space: pre-wrap;
`;

export const FormSection = styled.form`
  ${flexColumn}
  gap: ${props => props.theme.spacing[5]};
`;

export const FormGroup = styled.div`
  ${flexColumn}
  gap: ${props => props.theme.spacing[2]};
`;

export const Label = styled.label`
  color: ${props => props.theme.colors.gray[700]};
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.semibold};
`;

export const HelperText = styled.p`
  font-size: ${props => props.theme.fonts.size.xs};
  color: ${props => props.theme.colors.gray[500]};
  margin: 4px 0 0 0;
  line-height: 1.5;
`;

export const RequiredMark = styled.span`
  color: #ef4444;
  margin-left: ${props => props.theme.spacing[1]};
`;

export const TextArea = styled.textarea`
  padding: ${props => props.theme.spacing[3]};
  font-size: ${props => props.theme.fonts.size.sm};
  font-family: inherit;
  line-height: 1.6;
  border: 1px solid ${props => props.error ? '#ef4444' : props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  outline: none;
  resize: vertical;
  transition: all ${props => props.theme.transitions.base};

  &:focus {
    border-color: ${props => props.error ? '#ef4444' : props.theme.colors.primary[600]};
    box-shadow: 0 0 0 1px ${props => props.error ? '#ef4444' : props.theme.colors.primary[600]};
  }

  &::placeholder {
    color: ${props => props.theme.colors.gray[400]};
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing[3]};
  margin-top: ${props => props.theme.spacing[6]};
  padding-top: ${props => props.theme.spacing[6]};
`;

export const CancelButton = styled.button`
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[6]};
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.medium};
  color: ${props => props.theme.colors.gray[700]};
  background: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    background: ${props => props.theme.colors.gray[50]};
    border-color: ${props => props.theme.colors.gray[400]};
  }
`;

export const SubmitButton = styled.button`
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[8]};
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.theme.colors.white};
  background: ${props => props.theme.colors.primary[600]};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: background ${props => props.theme.transitions.base};

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary[700]};
  }

  &:disabled {
    background: ${props => props.theme.colors.gray[400]};
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.div`
  margin-top: ${props => props.theme.spacing[1]};
  font-size: ${props => props.theme.fonts.size.sm};
  color: #ef4444;
  font-weight: ${props => props.theme.fonts.weight.medium};
`;

export const LoadingState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing[8]};
  color: ${props => props.theme.colors.gray[600]};
  font-size: ${props => props.theme.fonts.size.lg};
`;
