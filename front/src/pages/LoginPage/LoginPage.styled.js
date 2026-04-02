import styled from 'styled-components';
import { flexCenter, flexColumn } from '../../styles/mixins';

/* 로그인 페이지 컨테이너 */
export const LoginContainer = styled.div`
  ${flexCenter}
  min-height: calc(100vh - 140px); /* 헤더와 푸터 높이를 뺀 높이 */
  padding: ${props => props.theme.spacing[6]};
  background: ${props => props.theme.colors.gray[50]};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    min-height: calc(100vh - 200px); /* 모바일에서 헤더, 푸터, 하단네비 높이를 뺀 높이 */
    margin-bottom: -60px; /* 하단 네비게이션 여백 제거 */
  }
`;

/* 로그인 카드 */
export const LoginCard = styled.div`
  background: transparent;
  padding: ${props => props.theme.spacing[8]};
  width: 100%;
  max-width: 400px;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.spacing[6]};
    margin: ${props => props.theme.spacing[4]};
  }
`;

/* 로그인 헤더 */
export const LoginHeader = styled.div`
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

/* 로그인 제목 */
export const LoginTitle = styled.h2`
  color: ${props => props.theme.colors.gray[900]};
  font-size: ${props => props.theme.fonts.size.lg};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  margin: 0 0 ${props => props.theme.spacing[1]} 0;
  text-align: center;
`;

/* 로그인 설명 */
export const LoginDescription = styled.p`
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

/* 로그인 폼 */
export const LoginForm = styled.form`
  ${flexColumn}
  gap: ${props => props.theme.spacing[4]};
`;

/* 입력 그룹 */
export const InputGroup = styled.div`
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
    border-color: ${props => props.theme.colors.gray[300]};
  }

  &::placeholder {
    color: ${props => props.theme.colors.gray[400]};
  }
`;

/* 로그인 버튼 */
export const LoginButton = styled.button`
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
  
  &:hover {
    background: ${props => props.theme.colors.primary[700]};
  }
  
  &:disabled {
    background: ${props => props.theme.colors.gray[300]};
    cursor: not-allowed;
  }
`;

/* 구분선 */
export const Divider = styled.div`
  ${flexCenter}
  margin: ${props => props.theme.spacing[4]} 0;
  
  &::before {
    content: '';
    flex: 1;
    height: 1px;
    background: ${props => props.theme.colors.gray[300]};
  }
  
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${props => props.theme.colors.gray[300]};
  }
  
  span {
    color: ${props => props.theme.colors.gray[500]};
    font-size: ${props => props.theme.fonts.size.sm};
    padding: 0 ${props => props.theme.spacing[3]};
  }
`;

/* Google 로그인 버튼 - 공식 가이드라인 준수 */
export const GoogleLoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  height: 40px;
  padding: 0 12px;
  background-color: #ffffff;
  border: 1px solid #dadce0;
  border-radius: 4px;
  font-family: 'Roboto', arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.25px;
  color: #3c4043;
  cursor: pointer;
  outline: none;
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background-color: #f8f9fa;
    border-color: #dadce0;
    box-shadow: 0 1px 2px rgba(60, 64, 67, 0.1);
  }
  
  &:focus {
    background-color: #f8f9fa;
    border-color: #4285f4;
    box-shadow: 0 1px 2px rgba(66, 133, 244, 0.2);
  }
  
  &:active {
    background-color: #f1f3f4;
    border-color: #dadce0;
    box-shadow: none;
  }
`;

/* 회원가입 링크 */
export const SignupLink = styled.div`
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