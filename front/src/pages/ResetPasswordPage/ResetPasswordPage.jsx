import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import useInput from '../../hooks/useInput';
import { authService } from '../../api/services';
import { validatePassword } from '../../utils/passwordValidator';
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

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const password = useInput('');
  const confirmPassword = useInput('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorInfo, setErrorInfo] = useState(null); // { message, canRetry }
  const [passwordValidation, setPasswordValidation] = useState(null);
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const { isOpen: isAlertOpen, showAlert, alertProps } = useAlert();

  // 토큰이 없으면 에러
  useEffect(() => {
    if (!token) {
      showAlert('유효하지 않은 링크입니다.', { variant: 'error' });
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [token, navigate, showAlert]);

  // 비밀번호 실시간 검증
  useEffect(() => {
    if (password.value) {
      const validation = validatePassword(password.value, '');
      setPasswordValidation(validation);
    } else {
      setPasswordValidation(null);
    }
  }, [password.value]);

  // 비밀번호 검증 에러 메시지 생성
  const getPasswordErrors = () => {
    if (!passwordValidation) return [];
    const errors = [];
    if (!passwordValidation.length) errors.push('8~20자 사이로 입력해주세요');
    if (!passwordValidation.complexity) errors.push('영문 대소문자, 숫자, 특수문자 중 3가지 이상 조합해주세요');
    if (!passwordValidation.noRepeat) errors.push('동일 문자 3회 이상 반복은 불가합니다');
    if (!passwordValidation.noSpace) errors.push('공백 문자는 사용할 수 없습니다');
    return errors;
  };

  // 비밀번호 확인 일치 검증
  useEffect(() => {
    if (confirmPassword.value && password.value) {
      if (confirmPassword.value !== password.value) {
        setPasswordMatchError('비밀번호가 일치하지 않습니다.');
      } else {
        setPasswordMatchError('');
      }
    } else {
      setPasswordMatchError('');
    }
  }, [password.value, confirmPassword.value]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      showAlert('유효하지 않은 링크입니다.', { variant: 'error' });
      return;
    }

    if (!password.value.trim()) {
      showAlert('비밀번호를 입력해주세요.', { variant: 'error' });
      return;
    }

    if (!confirmPassword.value.trim()) {
      showAlert('비밀번호 확인을 입력해주세요.', { variant: 'error' });
      return;
    }

    if (password.value !== confirmPassword.value) {
      showAlert('비밀번호가 일치하지 않습니다.', { variant: 'error' });
      return;
    }

    if (passwordValidation && !passwordValidation.isValid) {
      showAlert('비밀번호가 요구사항을 만족하지 않습니다.', { variant: 'error' });
      return;
    }

    setIsLoading(true);

    try {
      await authService.confirmPasswordReset(token, password.value, confirmPassword.value);
      setIsSuccess(true);
    } catch (error) {
      const errorData = error.response?.data;
      const errorCode = errorData?.errorCode || errorData?.code;
      let errorMessage = errorData?.message || '비밀번호 재설정에 실패했습니다.';
      let canRetry = true; // 폼에서 다시 시도 가능 여부

      // 에러 코드별 메시지 처리 (토큰 관련 에러는 재시도 불가)
      if (errorCode === 'A012') {
        errorMessage = '유효하지 않은 링크입니다.';
        canRetry = false;
      } else if (errorCode === 'A013') {
        errorMessage = '링크가 만료되었습니다.';
        canRetry = false;
      } else if (errorCode === 'A014') {
        errorMessage = '이미 사용된 링크입니다.';
        canRetry = false;
      }

      // 토큰 관련 에러는 별도 화면으로, 그 외는 Alert으로 처리
      if (!canRetry) {
        setErrorInfo({ message: errorMessage, canRetry });
      } else {
        showAlert(errorMessage, { variant: 'error' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return null;
  }

  // 성공 화면
  if (isSuccess) {
    return (
      <LoginContainer>
        <LoginCard>
          <LoginHeader>
            <LoginTitle>비밀번호 재설정 완료</LoginTitle>
            <LoginDescription>
              비밀번호가 성공적으로 변경되었습니다.<br />
              새 비밀번호로 로그인해주세요.
            </LoginDescription>
          </LoginHeader>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
            <LoginButton onClick={() => navigate('/login')}>
              로그인하러 가기
            </LoginButton>
          </div>
        </LoginCard>
      </LoginContainer>
    );
  }

  // 실패 화면 (토큰 관련 에러)
  if (errorInfo) {
    return (
      <LoginContainer>
        <LoginCard>
          <LoginHeader>
            <LoginTitle>비밀번호 재설정 실패</LoginTitle>
            <LoginDescription>
              {errorInfo.message}<br />
              비밀번호 찾기를 다시 진행해주세요.
            </LoginDescription>
          </LoginHeader>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
            <LoginButton onClick={() => navigate('/forgot-password')}>
              비밀번호 찾기로 이동
            </LoginButton>
          </div>
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
          <LoginTitle>비밀번호 재설정</LoginTitle>
          <LoginDescription>
            새로운 비밀번호를 입력해주세요.
          </LoginDescription>
        </LoginHeader>

        <LoginForm onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="password">새 비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              {...password.bind}
              disabled={isLoading}
              required
            />
            {passwordValidation && !passwordValidation.isValid && (
              <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>
                {getPasswordErrors().map((error, index) => (
                  <div key={index}>• {error}</div>
                ))}
              </div>
            )}
          </InputGroup>

          <InputGroup>
            <Label htmlFor="confirmPassword">비밀번호 확인</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              {...confirmPassword.bind}
              disabled={isLoading}
              required
            />
            {passwordMatchError && (
              <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>
                {passwordMatchError}
              </div>
            )}
            {confirmPassword.value && !passwordMatchError && password.value === confirmPassword.value && (
              <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>
                비밀번호가 일치합니다.
              </div>
            )}
          </InputGroup>

          <LoginButton type="submit" disabled={isLoading || !!passwordMatchError || (passwordValidation && !passwordValidation.isValid)}>
            {isLoading ? <ButtonSpinner /> : '비밀번호 재설정'}
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

export default ResetPasswordPage;

