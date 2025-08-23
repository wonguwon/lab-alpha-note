import React, { useEffect } from 'react';
import useInput from '../../hooks/useInput';
import GoogleIcon from '../../assets/icons/google_login.svg';
import {
  LoginContainer,
  LoginCard,
  LoginHeader,
  LogoText,
  LoginTitle,
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
  const email = useInput('');
  const password = useInput('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // 로그인 로직 구현
    console.log('Login attempt:', {
      email: email.value,
      password: password.value
    });
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

          <LoginButton type="submit">
            로그인
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
          <a href="/signup">회원가입</a>
        </SignupLink>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage;