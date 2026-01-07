import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useInput from '../../hooks/useInput';
import { authService } from '../../api/services';
import { useAlert } from '../../hooks/useModal';
import { Alert } from '../../components/common/Modal';
import { ButtonSpinner } from '../../components/common/Loading';
import {
  LoginContainer,
  LoginCard,
  LoginHeader,
  LoginTitle,
  LoginDescription,
  LoginForm,
  InputGroup,
  Label,
  Input,
  LoginButton,
  SignupLink
} from '../LoginPage/LoginPage.styled';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const email = useInput('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { isOpen: isAlertOpen, showAlert, alertProps } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.value.trim()) {
      showAlert('이메일을 입력해주세요.', { variant: 'error' });
      return;
    }

    setIsLoading(true);

    try {
      await authService.requestPasswordReset(email.value);
      setIsSuccess(true);
    } catch (error) {
      // 에러 응답에서 errorCode와 message 추출
      const errorData = error.response?.data;
      const errorCode = errorData?.errorCode || errorData?.code;
      let errorMessage = errorData?.message || error.message || '비밀번호 찾기 요청에 실패했습니다.';
      
      // 소셜 계정인 경우 명확한 메시지 표시
      if (errorCode === 'A011') {
        errorMessage = '소셜 가입된 계정입니다. 소셜 로그인을 이용해주세요.';
      }
      
      showAlert(errorMessage, { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <LoginContainer>
        <LoginCard>
          <LoginHeader>
            <LoginTitle>이메일을 확인해주세요</LoginTitle>
            <LoginDescription>
              비밀번호 재설정 링크가 발송되었습니다.<br />
              이메일을 확인하여 링크를 클릭해주세요.
            </LoginDescription>
          </LoginHeader>
          <SignupLink>
            <span>로그인 페이지로</span>
            <Link to="/login">돌아가기</Link>
          </SignupLink>
        </LoginCard>
      </LoginContainer>
    );
  }

  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <LoginTitle>비밀번호 찾기</LoginTitle>
          <LoginDescription>
            가입하신 이메일 주소를 입력해주세요.<br />
            비밀번호 재설정 링크를 발송해드립니다.
          </LoginDescription>
        </LoginHeader>

        <LoginForm onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="이메일을 입력하세요"
              {...email.bind}
              disabled={isLoading}
              required
            />
          </InputGroup>

          <LoginButton type="submit" disabled={isLoading}>
            {isLoading ? <ButtonSpinner /> : '재설정 링크 발송'}
          </LoginButton>
        </LoginForm>

        <SignupLink>
          <span>계정이 있으신가요?</span>
          <Link to="/login">로그인</Link>
        </SignupLink>
      </LoginCard>

      <Alert isOpen={isAlertOpen} {...alertProps} />
    </LoginContainer>
  );
};

export default ForgotPasswordPage;

