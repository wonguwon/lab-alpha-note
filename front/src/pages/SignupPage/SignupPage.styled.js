import styled from 'styled-components';
import { flexCenter, flexColumn } from '../../styles/mixins';

/* 회원가입 페이지 컨테이너 */
export const SignupContainer = styled.div`
  ${flexCenter}
  min-height: calc(100vh - 140px);
  padding: ${props => props.theme.spacing[6]};
  background: ${props => props.theme.colors.gray[50]};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    min-height: calc(100vh - 200px);
    margin-bottom: -60px;
  }
`;

/* 회원가입 카드 */
export const SignupCard = styled.div`
  background: transparent;
  padding: ${props => props.theme.spacing[8]};
  width: 100%;
  max-width: 420px;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.spacing[6]};
    margin: ${props => props.theme.spacing[4]};
  }
`;

/* 회원가입 헤더 */
export const SignupHeader = styled.div`
  ${flexColumn}
  align-items: center;
  margin-bottom: ${props => props.theme.spacing[6]};
`;

/* 로고 텍스트 */
export const LogoText = styled.h1`
  color: ${props => props.theme.colors.primary[600]};
  font-size: 3rem;
  font-weight: 800;
  margin: 0 0 ${props => props.theme.spacing[6]} 0;
  letter-spacing: -0.02em;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: ${props => props.theme.colors.primary[600]};
    border-radius: 2px;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 1.8rem;
    margin: 0 0 ${props => props.theme.spacing[3]} 0;
    
    &::after {
      width: 30px;
      height: 2px;
      bottom: -4px;
    }
  }
`;

/* 회원가입 설명 */
export const SignupDescription = styled.p`
  color: ${props => props.theme.colors.gray[600]};
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0 0 ${props => props.theme.spacing[8]} 0;
  text-align: center;
  line-height: 1.6;
  letter-spacing: -0.01em;
  
  br {
    display: block;
    margin: 4px 0;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 0.9rem;
    margin: 0 0 ${props => props.theme.spacing[4]} 0;
  }
`;

/* 회원가입 폼 */
export const SignupForm = styled.form`
  ${flexColumn}
  gap: ${props => props.theme.spacing[4]};
`;

/* 입력 그룹 */
export const InputGroup = styled.div`
  ${flexColumn}
  gap: ${props => props.theme.spacing[1]};
`;

/* 이메일 입력 그룹 (인증 버튼 포함) */
export const EmailInputGroup = styled.div`
  ${flexColumn}
  gap: ${props => props.theme.spacing[1]};
`;

/* 라벨 */
export const Label = styled.label`
  color: ${props => props.theme.colors.gray[700]};
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.medium};
`;

/* 입력 필드 */
export const Input = styled.input`
  padding: ${props => props.theme.spacing[3]};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fonts.size.sm};
  transition: all ${props => props.theme.transitions.base};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.gray[400]};
    box-shadow: 0 0 0 1px ${props => props.theme.colors.gray[300]};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.gray[400]};
  }
`;

/* 인증 버튼 */
export const VerifyButton = styled.button`
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  background: ${props => props.theme.colors.primary[600]};
  color: ${props => props.theme.colors.white};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.medium};
  cursor: pointer;
  transition: background ${props => props.theme.transitions.base};
  white-space: nowrap;
  min-width: 80px;
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary[700]};
  }
  
  &:disabled {
    background: ${props => props.theme.colors.gray[300]};
    cursor: not-allowed;
  }
`;

/* 회원가입 버튼 */
export const SignupButton = styled.button`
  ${flexCenter}
  gap: ${props => props.theme.spacing[2]};
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  background: ${props => props.theme.colors.primary[600]};
  color: ${props => props.theme.colors.white};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.medium};
  cursor: pointer;
  transition: background ${props => props.theme.transitions.base};
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary[700]};
  }
  
  &:disabled {
    background: ${props => props.theme.colors.gray[300]};
    cursor: not-allowed;
  }
`;

/* 약관 섹션 */
export const TermsSection = styled.div`
  margin: ${props => props.theme.spacing[2]} 0;
`;

/* 약관 텍스트 */
export const TermsText = styled.p`
  font-size: ${props => props.theme.fonts.size.xs};
  color: ${props => props.theme.colors.gray[600]};
  line-height: 1.4;
  margin: 0;
`;

/* 약관 링크 */
export const TermsLink = styled.span`
  color: ${props => props.theme.colors.primary[600]};
  text-decoration: underline;
  cursor: pointer;
  
  &:hover {
    color: ${props => props.theme.colors.primary[700]};
  }
`;

/* 체크박스 그룹 */
export const CheckboxGroup = styled.div`
  margin: ${props => props.theme.spacing[2]} 0;
`;

/* 체크박스 라벨 */
export const CheckboxLabel = styled.label`
  display: flex;
  align-items: flex-start;
  gap: ${props => props.theme.spacing[2]};
  font-size: ${props => props.theme.fonts.size.sm};
  color: ${props => props.theme.colors.gray[600]};
  line-height: 1.4;
  cursor: pointer;
  
  span {
    flex: 1;
  }
`;

/* 체크박스 */
export const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  margin: 0;
  margin-top: 2px; /* 텍스트 베이스라인에 맞춤 */
  cursor: pointer;
  accent-color: ${props => props.theme.colors.primary[600]};
  flex-shrink: 0;
  border-radius: 3px;
`;

/* 로그인 링크 */
export const LoginLink = styled.div`
  text-align: center;
  margin-top: ${props => props.theme.spacing[4]};
  
  span {
    color: ${props => props.theme.colors.gray[600]};
    font-size: ${props => props.theme.fonts.size.sm};
  }
  
  a {
    color: ${props => props.theme.colors.primary[600]};
    text-decoration: none;
    font-weight: ${props => props.theme.fonts.weight.medium};
    margin-left: ${props => props.theme.spacing[1]};
    
    &:hover {
      text-decoration: underline;
    }
  }
`;