import styled from 'styled-components';
import { container } from '../../styles/mixins';

export const CreateContainer = styled.div`
  ${container}
  padding: ${props => props.theme.spacing[6]} ${props => props.theme.spacing[4]};
  max-width: 800px;
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
  min-height: 120px;
  padding: ${props => props.theme.spacing[3]};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.base};
  font-size: ${props => props.theme.fonts.size.base};
  color: ${props => props.theme.colors.gray[900]};
  font-family: inherit;
  resize: vertical;
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

export const ColorPickerWrapper = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]};
  flex-wrap: wrap;
`;

export const ColorOption = styled.button`
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.base};
  border: 2px solid ${props => props.$selected ? props.theme.colors.gray[900] : props.theme.colors.gray[300]};
  background: ${props => props.$color || props.theme.colors.white};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.1);
  }

  ${props => props.$selected && !props.$isPicker && `
    &::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 18px;
      font-weight: bold;
      text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
    }
  `}

  ${props => props.$isPicker && !props.$customColor && `
    background: linear-gradient(135deg,
      #ff0000 0%, #ff7f00 14%, #ffff00 28%,
      #00ff00 42%, #0000ff 57%, #4b0082 71%,
      #9400d3 85%, #ff0000 100%);

    &::before {
      content: '+';
      color: white;
      font-size: 24px;
      font-weight: bold;
      text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
    }
  `}

  ${props => props.$isPicker && props.$customColor && `
    background: ${props.$customColor};
    border-color: ${props.theme.colors.gray[900]};

    &::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 18px;
      font-weight: bold;
      text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
    }
  `}
`;

export const ColorInput = styled.input`
  display: none;
`;

export const NumberInput = styled(Input)`
  max-width: 200px;
`;

export const DateInput = styled(Input)`
  max-width: 200px;
`;

export const CharCount = styled.span`
  font-size: ${props => props.theme.fonts.size.xs};
  color: ${props => props.$exceeded ? props.theme.colors.danger[500] : props.theme.colors.gray[500]};
  margin-top: ${props => props.theme.spacing[1]};
  display: block;
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
