import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useInput from '../../hooks/useInput';
import useAuthStore from '../../store/authStore';
import { authService } from '../../api/services';
import GoogleIcon from '../../assets/icons/google_login.svg';
import {
  LoginContainer,
  LoginCard,
  LoginHeader,
  LogoText,
  LoginDescription,
  LoginForm,
  InputGroup,
  Label,
  Input,
  LoginButton,
  Divider,
  GoogleLoginButton,
  SignupLink
} from './LoginPage.styled';

const LoginPage = () => {
  const navigate = useNavigate();
  const email = useInput('');
  const password = useInput('');
  const [errorMessage, setErrorMessage] = useState('');

  const { login, setLoading, setError, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      // API 로그인 호출
      // 응답 형식: { success, message, data: { token, user }, errorCode }
      const response = await authService.login({
        email: email.value,
        password: password.value
      });

      if (response.success && response.data) {
        // Zustand 스토어에 로그인 정보 저장
        await login(response.data.token, response.data.user);

        // 홈페이지로 리다이렉트
        navigate('/');
      } else {
        // success가 false인 경우
        setErrorMessage(response.message || '로그인에 실패했습니다.');
        setError(response.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      // 서버 에러 응답: { success: false, message, data: null, errorCode }
      const message = error.response?.data?.message || '로그인에 실패했습니다.';
      setErrorMessage(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // 서버의 OAuth2 인증 엔드포인트로 리다이렉트
    window.location.href = "http://localhost:8001/oauth2/authorization/google";
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <LogoText>AlphaNote</LogoText>
          <LoginDescription>
            포기하지 않은 날들을 모아<br />
            당신만의 성장을 기록하세요.
          </LoginDescription>
        </LoginHeader>

        <LoginForm onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="이메일을 입력하세요"
              {...email.bind}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              {...password.bind}
              required
            />
          </InputGroup>

          {errorMessage && (
            <div style={{ color: '#ef4444', fontSize: '14px', marginTop: '8px' }}>
              {errorMessage}
            </div>
          )}

          <LoginButton type="submit" disabled={isLoading}>
            {isLoading ? '로그인 중...' : '로그인'}
          </LoginButton>
        </LoginForm>

        <Divider>
          <span>또는</span>
        </Divider>

        <GoogleLoginButton onClick={handleGoogleLogin}>
          <img src={GoogleIcon} alt="Google" width="18" height="18" />
          Google 계정으로 로그인
        </GoogleLoginButton>

        <SignupLink>
          <span>아직 계정이 없으신가요?</span>
          <Link to="/signup">회원가입</Link>
        </SignupLink>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage;