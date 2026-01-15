import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useInput from '../../hooks/useInput';
import useAuthStore from '../../store/authStore';
import { authService } from '../../api/services';
import { getMeWithRetry } from '../../api/authUtils';
import { Alert, Modal } from '../../components/common/Modal';
import { useAlert } from '../../hooks/useModal';
import { ButtonSpinner } from '../../components/common/Loading';
import GoogleIcon from '../../assets/icons/google_login.svg';
import {
  LoginContainer,
  LoginCard,
  LoginHeader,
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
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryData, setRecoveryData] = useState(null);

  const { isOpen: isAlertOpen, showAlert, alertProps } = useAlert();

  const { login, setUser, setLoading, setError, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      // API 로그인 호출 - 쿠키가 자동으로 설정됨
      await authService.login({
        email: email.value,
        password: password.value
      });

      // 사용자 정보 로드 (retry 로직 포함)
      const userData = await getMeWithRetry();
      setUser(userData);
      
      // 로그인 상태 설정
      login();

      // 홈페이지로 리다이렉트
      navigate('/');
    } catch (error) {
      // U010 에러 코드 확인 (탈퇴한 계정)
      if (error.response?.data?.errorCode === 'U010') {
        const data = error.response.data.data;
        if (data?.canRecover && data?.recoveryToken) {
          // 복구 가능한 경우 모달 표시
          setRecoveryData({
            recoveryToken: data.recoveryToken,
            email: data.email
          });
          setShowRecoveryModal(true);
          setErrorMessage('');
        } else {
          setErrorMessage(error.message);
        }
      } else {
        setErrorMessage(error.message);
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // 계정 복구 처리
  const handleRecover = async () => {
    if (!recoveryData?.recoveryToken) return;

    setLoading(true);
    setErrorMessage('');

    try {
      await authService.recoverAccount(recoveryData.recoveryToken);

      // 사용자 정보 로드 (retry 로직 포함)
      const userData = await getMeWithRetry();
      setUser(userData);
      
      // 로그인 상태 설정
      login();
      
      showAlert('계정이 성공적으로 복구되었습니다.', {
        variant: 'success',
        onClose: () => navigate('/')
      });
    } catch (error) {
      setErrorMessage(error.message || '계정 복구에 실패했습니다.');
      setShowRecoveryModal(false);
    } finally {
      setLoading(false);
    }
  };

  // 복구 취소
  const handleCancelRecovery = () => {
    setShowRecoveryModal(false);
    setRecoveryData(null);
  };

  const handleGoogleLogin = () => {
    // 서버의 OAuth2 인증 엔드포인트로 리다이렉트
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
    window.location.href = `${apiUrl}/oauth2/authorization/google`;
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <img src="/logo.png" alt="AlphaNote" style={{ height: '125px', marginBottom: '16px' }} />
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
            {isLoading ? (
              <>
                로그인 중
                <ButtonSpinner size="small" />
              </>
            ) : (
              '로그인'
            )}
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
        <SignupLink style={{ marginTop: '8px' }}>
          <span>비밀번호를 잊으셨나요?</span>
          <Link to="/forgot-password">비밀번호 찾기</Link>
        </SignupLink>
      </LoginCard>

      {/* 계정 복구 모달 */}
      <Modal
        isOpen={showRecoveryModal}
        onClose={handleCancelRecovery}
        title="탈퇴한 계정입니다"
        maxWidth="450px"
        actions={[
          {
            label: '아니요',
            onClick: handleCancelRecovery,
            variant: 'secondary'
          },
          {
            label: isLoading ? (
              <>
                복구 중
                <ButtonSpinner size="small" />
              </>
            ) : '예, 복구합니다',
            onClick: handleRecover,
            variant: 'primary',
            disabled: isLoading
          }
        ]}
      >
        <div style={{ lineHeight: '1.6' }}>
          <p style={{ margin: '0 0 16px 0', color: '#4b5563', fontSize: '0.9375rem' }}>
            <strong>{recoveryData?.email}</strong> 계정은 탈퇴 처리되었습니다.
          </p>
          <p style={{ margin: '0 0 16px 0', color: '#4b5563', fontSize: '0.9375rem' }}>
            탈퇴일로부터 <strong>60일 이내</strong>에는 계정을 복구할 수 있습니다.
          </p>
          <p style={{ margin: '16px 0', color: '#1f2937', fontSize: '0.9375rem', fontWeight: '600' }}>
            계정을 복구하시겠습니까?
          </p>
          <p style={{ margin: '0', color: '#6b7280', fontSize: '0.875rem' }}>
            복구 시 이전 데이터가 모두 복원됩니다.
          </p>
        </div>
      </Modal>

      {/* Alert 컴포넌트 */}
      <Alert isOpen={isAlertOpen} {...alertProps} />
    </LoginContainer>
  );
};

export default LoginPage;