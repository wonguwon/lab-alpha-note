import styled from 'styled-components';
import { flexCenter, flexColumn } from '../../styles/mixins';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  ${flexCenter}
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const ModalContent = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.lg};
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideUp 0.2s ease-out;

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

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 95%;
    max-height: 95vh;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing[6]};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.spacing[4]};
  }
`;

export const ModalTitle = styled.h2`
  font-size: ${props => props.theme.fonts.size.xl};
  font-weight: ${props => props.theme.fonts.weight.bold};
  color: ${props => props.theme.colors.gray[900]};
  margin: 0;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: ${props => props.theme.fonts.size.lg};
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.gray[500]};
  font-size: 24px;
  cursor: pointer;
  padding: ${props => props.theme.spacing[2]};
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

export const ModalBody = styled.div`
  padding: ${props => props.theme.spacing[6]};
  ${flexColumn}
  gap: ${props => props.theme.spacing[6]};

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.spacing[4]};
    gap: ${props => props.theme.spacing[4]};
  }
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
  margin: 0;
  line-height: 1.5;
`;

export const TagInputWrapper = styled.div`
  margin-bottom: ${props => props.theme.spacing[2]};
`;

export const TagInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing[3]};
  font-size: ${props => props.theme.fonts.size.sm};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  outline: none;
  transition: all ${props => props.theme.transitions.base};

  &:focus {
    border-color: ${props => props.theme.colors.primary[600]};
    box-shadow: 0 0 0 1px ${props => props.theme.colors.primary[600]};
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
  font-size: 20px;
  font-weight: ${props => props.theme.fonts.weight.bold};
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

export const FileInputWrapper = styled.div`
  width: 100%;
`;

export const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: ${props => props.$hasImage ? 'auto' : '200px'};
  border: ${props => props.$hasImage ? 'none' : `2px dashed ${props.theme.colors.gray[300]}`};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.$hasImage ? 'transparent' : props.theme.colors.gray[50]};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};
  overflow: hidden;

  &:hover {
    border-color: ${props => !props.$hasImage && props.theme.colors.primary[400]};
    background: ${props => !props.$hasImage && props.theme.colors.primary[50]};
  }
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const UploadPlaceholder = styled.div`
  ${flexColumn}
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
  color: ${props => props.theme.colors.gray[500]};
  font-size: ${props => props.theme.fonts.size.sm};
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: cover;
  border-radius: ${props => props.theme.borderRadius.md};
`;

export const RemoveImageButton = styled.button`
  margin-top: ${props => props.theme.spacing[2]};
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[4]};
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.medium};
  color: ${props => props.theme.colors.danger[600]};
  background: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.danger[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    background: ${props => props.theme.colors.danger[50]};
    border-color: ${props => props.theme.colors.danger[400]};
  }
`;

export const ErrorMessage = styled.div`
  margin-top: ${props => props.theme.spacing[1]};
  font-size: ${props => props.theme.fonts.size.sm};
  color: #ef4444;
  font-weight: ${props => props.theme.fonts.weight.medium};
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing[3]};
  padding: ${props => props.theme.spacing[6]};
  border-top: 1px solid ${props => props.theme.colors.gray[200]};

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.spacing[4]};
  }
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

  &:hover {
    background: ${props => props.theme.colors.primary[700]};
  }
`;
