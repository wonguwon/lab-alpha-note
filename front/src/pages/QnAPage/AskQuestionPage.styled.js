import styled from 'styled-components';
import { flexCenter, flexColumn } from '../../styles/mixins';

export const AskContainer = styled.div`
  ${flexCenter}
  min-height: calc(100vh - 140px);
  padding: ${props => props.theme.spacing[6]};
  background: ${props => props.theme.colors.gray[50]};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    min-height: calc(100vh - 200px);
    padding: ${props => props.theme.spacing[4]};
  }
`;

export const AskCard = styled.div`
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

export const AskHeader = styled.div`
  ${flexColumn}
  align-items: center;
  margin-bottom: ${props => props.theme.spacing[6]};
  padding-bottom: ${props => props.theme.spacing[6]};
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

export const Input = styled.input`
  padding: ${props => props.theme.spacing[3]};
  border: 1px solid ${props => props.error ? '#ef4444' : props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fonts.size.sm};
  transition: all ${props => props.theme.transitions.base};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.gray[300]};
  }

  &::placeholder {
    color: ${props => props.theme.colors.gray[400]};
  }
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
    border-color: ${props => props.theme.colors.gray[300]};
  }

  &::placeholder {
    color: ${props => props.theme.colors.gray[400]};
  }
`;

export const CategorySelect = styled.select`
  padding: ${props => props.theme.spacing[3]};
  border: 1px solid ${props => props.error ? '#ef4444' : props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fonts.size.sm};
  background: ${props => props.theme.colors.white};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.gray[300]};
  }

  option {
    padding: ${props => props.theme.spacing[2]};
  }
`;

export const TagInputWrapper = styled.div`
  margin-bottom: ${props => props.theme.spacing[2]};
`;

export const TagInput = styled.input`
  padding: ${props => props.theme.spacing[3]};
  font-size: ${props => props.theme.fonts.size.sm};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  outline: none;
  transition: all ${props => props.theme.transitions.base};
  width: 100%;

  &:focus {
    border-color: ${props => props.theme.colors.gray[300]};
  }

  &::placeholder {
    color: ${props => props.theme.colors.gray[400]};
  }
`;

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing[2]};
`;

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  background: ${props => props.theme.colors.primary[50]};
  color: ${props => props.theme.colors.primary[700]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.medium};
`;

export const RemoveTagButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary[700]};
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  transition: color ${props => props.theme.transitions.base};

  &:hover {
    color: ${props => props.theme.colors.primary[800]};
  }
`;

export const CharCount = styled.div`
  text-align: right;
  font-size: ${props => props.theme.fonts.size.xs};
  color: ${props => props.theme.colors.gray[500]};
  margin-top: ${props => props.theme.spacing[1]};
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
