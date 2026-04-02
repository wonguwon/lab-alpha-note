import styled from 'styled-components';

export const ContactContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing[12]} ${props => props.theme.spacing[4]};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing[8]} ${props => props.theme.spacing[4]};
  }
`;

export const ContactHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[10]};
`;

export const ContactTitle = styled.h1`
  font-size: ${props => props.theme.fonts.size['4xl']};
  font-weight: ${props => props.theme.fonts.weight.bold};
  color: ${props => props.theme.colors.gray[900]};
  margin-bottom: ${props => props.theme.spacing[3]};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fonts.size['3xl']};
  }
`;

export const ContactSubtitle = styled.p`
  font-size: ${props => props.theme.fonts.size.lg};
  color: ${props => props.theme.colors.gray[600]};
`;

export const ContactForm = styled.form`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.lg};
  padding: ${props => props.theme.spacing[8]};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing[6]};
  }
`;

export const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing[6]};
`;

export const FormLabel = styled.label`
  display: block;
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.medium};
  color: ${props => props.theme.colors.gray[700]};
  margin-bottom: ${props => props.theme.spacing[2]};
`;

export const FormInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing[3]};
  font-size: ${props => props.theme.fonts.size.base};
  color: ${props => props.theme.colors.gray[900]};
  background: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.transitions.base};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.gray[300]};
  }

  &::placeholder {
    color: ${props => props.theme.colors.gray[400]};
  }
`;

export const FormSelect = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing[3]};
  font-size: ${props => props.theme.fonts.size.base};
  color: ${props => props.theme.colors.gray[900]};
  background: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.transitions.base};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.gray[300]};
  }
`;

export const FormTextarea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: ${props => props.theme.spacing[3]};
  font-size: ${props => props.theme.fonts.size.base};
  color: ${props => props.theme.colors.gray[900]};
  background: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  resize: vertical;
  font-family: inherit;
  line-height: ${props => props.theme.fonts.lineHeight.relaxed};
  transition: all ${props => props.theme.transitions.base};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.gray[300]};
  }

  &::placeholder {
    color: ${props => props.theme.colors.gray[400]};
  }
`;

export const FormError = styled.p`
  margin-top: ${props => props.theme.spacing[2]};
  font-size: ${props => props.theme.fonts.size.sm};
  color: ${props => props.theme.colors.danger[600]};
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing[4]};
  font-size: ${props => props.theme.fonts.size.base};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.theme.colors.white};
  background: ${props => props.theme.colors.primary[600]};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    background: ${props => props.theme.colors.primary[700]};
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.md};
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: ${props => props.theme.colors.gray[400]};
    cursor: not-allowed;
    transform: none;
  }
`;

export const SuccessMessage = styled.div`
  padding: ${props => props.theme.spacing[4]};
  background: ${props => props.theme.colors.success[50]};
  border: 1px solid ${props => props.theme.colors.success[200]};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing[6]};
`;

export const SuccessTitle = styled.h3`
  font-size: ${props => props.theme.fonts.size.lg};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.theme.colors.success[800]};
  margin-bottom: ${props => props.theme.spacing[2]};
`;

export const SuccessText = styled.p`
  font-size: ${props => props.theme.fonts.size.base};
  color: ${props => props.theme.colors.success[700]};
  line-height: ${props => props.theme.fonts.lineHeight.relaxed};
`;

export const ErrorMessage = styled.div`
  padding: ${props => props.theme.spacing[4]};
  background: ${props => props.theme.colors.danger[50]};
  border: 1px solid ${props => props.theme.colors.danger[200]};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing[6]};
`;

export const ErrorTitle = styled.h3`
  font-size: ${props => props.theme.fonts.size.lg};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.theme.colors.danger[800]};
  margin-bottom: ${props => props.theme.spacing[2]};
`;

export const ErrorText = styled.p`
  font-size: ${props => props.theme.fonts.size.base};
  color: ${props => props.theme.colors.danger[700]};
  line-height: ${props => props.theme.fonts.lineHeight.relaxed};
`;

/* 알림 팝업 오버레이 */
export const AlertOverlay = styled.div`
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

/* 알림 팝업 */
export const AlertModal = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows['2xl']};
  padding: ${props => props.theme.spacing[8]};
  max-width: 400px;
  width: 90%;
  text-align: center;
  animation: slideUp 0.3s ease-out;

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

/* 알림 아이콘 */
export const AlertIcon = styled.div`
  width: 60px;
  height: 60px;
  margin: 0 auto ${props => props.theme.spacing[4]};
  background: ${props => props.theme.colors.success[100]};
  border-radius: ${props => props.theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.fonts.size['3xl']};
  color: ${props => props.theme.colors.success[600]};
`;

/* 알림 제목 */
export const AlertTitle = styled.h3`
  font-size: ${props => props.theme.fonts.size['2xl']};
  font-weight: ${props => props.theme.fonts.weight.bold};
  color: ${props => props.theme.colors.gray[900]};
  margin-bottom: ${props => props.theme.spacing[3]};
`;

/* 알림 메시지 */
export const AlertMessage = styled.p`
  font-size: ${props => props.theme.fonts.size.base};
  color: ${props => props.theme.colors.gray[600]};
  line-height: ${props => props.theme.fonts.lineHeight.relaxed};
  margin-bottom: ${props => props.theme.spacing[6]};
`;

/* 알림 확인 버튼 */
export const AlertButton = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[6]};
  font-size: ${props => props.theme.fonts.size.base};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.theme.colors.white};
  background: ${props => props.theme.colors.primary[600]};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    background: ${props => props.theme.colors.primary[700]};
  }

  &:active {
    transform: scale(0.98);
  }
`;
