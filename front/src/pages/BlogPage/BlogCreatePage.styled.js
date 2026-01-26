import styled from 'styled-components';
import { container } from '../../styles/mixins';

export const CreateContainer = styled.div`
  ${container}
  padding: ${props => props.theme.spacing[6]} ${props => props.theme.spacing[4]};
  max-width: 900px;
  min-height: calc(100vh - 200px);
`;

export const CreateCard = styled.div`
  background: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing[8]};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const CreateHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing[8]};
  padding-bottom: ${props => props.theme.spacing[6]};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
`;

export const PageTitle = styled.h1`
  font-size: ${props => props.theme.fonts.size['2xl']};
  font-weight: ${props => props.theme.fonts.weight.bold};
  color: ${props => props.theme.colors.gray[900]};
  margin: 0 0 ${props => props.theme.spacing[2]} 0;
`;

export const PageDescription = styled.p`
  font-size: ${props => props.theme.fonts.size.sm};
  color: ${props => props.theme.colors.gray[600]};
  margin: 0;
`;

export const FormSection = styled.div`
  margin-bottom: ${props => props.theme.spacing[6]};
`;

export const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing[6]};

  &:last-child {
    margin-bottom: 0;
  }
`;

export const Label = styled.label`
  display: flex;
  align-items: center;
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.theme.colors.gray[700]};
  margin-bottom: ${props => props.theme.spacing[2]};
`;

export const RequiredMark = styled.span`
  color: ${props => props.theme.colors.danger[500]};
  margin-left: ${props => props.theme.spacing[1]};
`;

export const HelperText = styled.p`
  font-size: ${props => props.theme.fonts.size.xs};
  color: ${props => props.theme.colors.gray[500]};
  margin: ${props => props.theme.spacing[2]} 0 0 0;
`;

export const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing[3]};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.base};
  font-size: ${props => props.theme.fonts.size.base};
  color: ${props => props.theme.colors.gray[900]};
  transition: all ${props => props.theme.transitions.base};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }

  &::placeholder {
    color: ${props => props.theme.colors.gray[400]};
  }

  ${props => props.$error && `
    border-color: ${props.theme.colors.danger[500]};
    &:focus {
      border-color: ${props.theme.colors.danger[500]};
      box-shadow: 0 0 0 3px ${props.theme.colors.danger[100]};
    }
  `}
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 400px;
  padding: ${props => props.theme.spacing[3]};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.base};
  font-size: ${props => props.theme.fonts.size.base};
  color: ${props => props.theme.colors.gray[900]};
  font-family: inherit;
  resize: vertical;
  line-height: 1.6;
  transition: all ${props => props.theme.transitions.base};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }

  &::placeholder {
    color: ${props => props.theme.colors.gray[400]};
  }

  ${props => props.$error && `
    border-color: ${props.theme.colors.danger[500]};
    &:focus {
      border-color: ${props.theme.colors.danger[500]};
      box-shadow: 0 0 0 3px ${props.theme.colors.danger[100]};
    }
  `}
`;

export const CharCount = styled.span`
  font-size: ${props => props.theme.fonts.size.xs};
  color: ${props => props.$exceeded ? props.theme.colors.danger[500] : props.theme.colors.gray[500]};
  margin-top: ${props => props.theme.spacing[1]};
  display: block;
  text-align: right;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[3]};
  justify-content: flex-end;
  margin-top: ${props => props.theme.spacing[8]};
  padding-top: ${props => props.theme.spacing[6]};
  border-top: 1px solid ${props => props.theme.colors.gray[200]};

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column-reverse;
  }
`;

export const CancelButton = styled.button`
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[6]};
  background: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.gray[700]};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.base};
  font-size: ${props => props.theme.fonts.size.base};
  font-weight: ${props => props.theme.fonts.weight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    background: ${props => props.theme.colors.gray[50]};
    border-color: ${props => props.theme.colors.gray[400]};
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 100%;
  }
`;

export const DraftButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  background: ${props => props.theme.colors.white};
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    border-color: ${props => props.theme.colors.gray[400]};
    background: ${props => props.theme.colors.gray[50]};
  }
`;

export const DraftButton = styled.button`
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.medium};
  color: ${props => props.theme.colors.gray[700]};
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const DraftDivider = styled.div`
  width: 1px;
  height: 24px;
  background: ${props => props.theme.colors.gray[300]};
`;

export const DraftCountButton = styled.button`
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.theme.colors.primary[600]};
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};
  white-space: nowrap;

  &:hover {
    color: ${props => props.theme.colors.primary[700]};
  }
`;

export const SubmitButton = styled.button`
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[6]};
  background: ${props => props.theme.colors.primary[600]};
  color: ${props => props.theme.colors.white};
  border: none;
  border-radius: ${props => props.theme.borderRadius.base};
  font-size: ${props => props.theme.fonts.size.base};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary[700]};
    transform: translateY(-1px);
  }

  &:disabled {
    background: ${props => props.theme.colors.gray[300]};
    cursor: not-allowed;
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 100%;
  }
`;

export const ErrorMessage = styled.p`
  font-size: ${props => props.theme.fonts.size.sm};
  color: ${props => props.theme.colors.danger[500]};
  margin: ${props => props.theme.spacing[2]} 0 0 0;
`;

export const FileInputWrapper = styled.div`
  width: 100%;
`;

export const FileInputLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  border: 2px dashed ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.lg};
  cursor: pointer;
  background: ${props => props.theme.colors.gray[50]};
  transition: all ${props => props.theme.transitions.base};
  overflow: hidden;

  &:hover {
    background: ${props => props.theme.colors.gray[100]};
    border-color: ${props => props.theme.colors.primary[400]};
  }
  
  ${props => props.$hasImage && `
    border-style: solid;
    padding: 0;
  `}
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const UploadPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  color: ${props => props.theme.colors.gray[500]};
  
  span {
    font-size: ${props => props.theme.fonts.size.sm};
  }
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const TagInputWrapper = styled.div`
  margin-bottom: ${props => props.theme.spacing[2]};
`;

export const TagInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing[3]};
  font-size: ${props => props.theme.fonts.size.base};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.base};
  outline: none;
  transition: all ${props => props.theme.transitions.base};

  &:focus {
    border-color: ${props => props.theme.colors.primary[600]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }

  &::placeholder {
    color: ${props => props.theme.colors.gray[400]};
  }
`;

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing[2]};
  margin-top: ${props => props.theme.spacing[2]};
`;

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  background: ${props => props.theme.colors.primary[50]};
  color: ${props => props.theme.colors.primary[700]};
  border-radius: ${props => props.theme.borderRadius.base};
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
