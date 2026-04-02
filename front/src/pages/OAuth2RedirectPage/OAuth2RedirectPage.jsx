import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { authService } from '../../api/services';
import { getMeWithRetry } from '../../api/authUtils';
import { Loading } from '../../components/common/Loading';
import {
  RedirectContainer,
  Message,
  ErrorMessage,
  RecoveryButton,
  ButtonGroup,
  SecondaryButton
} from './OAuth2RedirectPage.styled';

const OAuth2RedirectPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('로그인 처리 중...');
  const [isError, setIsError] = useState(false);
  const [recoveryToken, setRecoveryToken] = useState(null);
  const [isRecovering, setIsRecovering] = useState(false);

  const { login, setUser, setLoading, setError } = useAuthStore();

  const handleRecover = async () => {
    if (!recoveryToken || isRecovering) return;

    setIsRecovering(true);
    setLoading(true);
    setMessage('계정 복구 중...');

    try {
      // 복구 API 호출 (쿠키 설정도 함께 처리됨)
      await authService.recoverAccount(recoveryToken);

      // 사용자 정보 로드 및 로그인 처리
      const userData = await getMeWithRetry(5, 500);
      setUser(userData);
      login();

      setMessage('계정이 성공적으로 복구되었습니다! 메인 페이지로 이동합니다...');
      setIsError(false);

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('계정 복구 실패:', error);
      setMessage(error.message || '계정 복구에 실패했습니다. 고객센터로 문의해주세요.');
      setIsError(true);
      setError(error.message);
    } finally {
      setIsRecovering(false);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/login');
  };

  useEffect(() => {
    const processOAuth2Login = async () => {
      setLoading(true);

      try {
        // URL에서 파라미터 추출
        const token = searchParams.get('token');
        const tempToken = searchParams.get('tempToken');
        const errorCode = searchParams.get('errorCode');
        const rToken = searchParams.get('recoveryToken');

        // 에러 코드 처리
        if (errorCode) {
          setIsError(true);

          // 에러 코드별 메시지 매핑
          const errorMessages = {
            'A007': '이미 가입된 계정입니다. 로그인 페이지로 이동합니다.',
            'A008': '회원가입이 필요합니다. 회원가입 페이지로 이동됩니다',
            'A009': 'OAuth2 인증에 실패했습니다. 다시 시도해주세요.',
            'A010': '다른 로그인 방식으로 가입된 계정입니다. 해당 로그인 방식을 사용해주세요.',
            'U009': '탈퇴 신청된 계정입니다. 복구하시겠습니까?',
            'U011': '복구 가능 기간(60일)이 경과하여 복구할 수 없는 계정입니다.'
          };

          const errorMessage = errorMessages[errorCode] || '인증 처리 중 오류가 발생했습니다.';
          setMessage(errorMessage);
          setError(errorMessage);

          // 계정 복구가 가능한 경우 (U009)
          if (errorCode === 'U009' && rToken) {
            setRecoveryToken(rToken);
            return; // 자동 리다이렉트 중지
          }

          // 에러 코드별 리다이렉트 경로
          const redirectPath = errorCode === 'A008' ? '/signup' : '/login';
          setTimeout(() => {
            navigate(redirectPath);
          }, 3000);
          return;
        }

        // 임시 토큰이 있는 경우 (회원가입 모드)
        if (tempToken) {
          setMessage('회원가입을 진행합니다...');
          navigate(`/signup/social?tempToken=${tempToken}`, { replace: true });
          return;
        }

        // 정식 토큰이 있거나 success 파라미터가 있는 경우 (로그인 완료)
        const success = searchParams.get('success');
        if (token || success === 'true') {
          // ... 기존 로그인 처리 ...
          const userData = await getMeWithRetry(5, 500);
          setUser(userData);
          login();
          setMessage('로그인 성공! 메인 페이지로 이동합니다...');
          setTimeout(() => {
            navigate('/');
          }, 1000);
          return;
        }

        // 인증 정보가 없는 경우
        setIsError(true);
        setMessage('인증 정보가 없습니다.');
        setTimeout(() => navigate('/login'), 3000);

      } catch (error) {
        console.error('OAuth2 처리 중 오류:', error);
        setIsError(true);
        setMessage('처리 중 오류가 발생했습니다.');
        setError(error.message);
        setTimeout(() => navigate('/login'), 3000);
      } finally {
        setLoading(false);
      }
    };

    processOAuth2Login();
  }, [searchParams, login, navigate, setLoading, setError, setUser]);

  return (
    <RedirectContainer>
      {!isError && <Loading size="large" text={message} color="#667eea" textColor="#374151" />}
      {isError && (
        <>
          <ErrorMessage>{message}</ErrorMessage>
          {recoveryToken && (
            <ButtonGroup>
              <RecoveryButton onClick={handleRecover} disabled={isRecovering}>
                {isRecovering ? '복구 처리 중...' : '계정 복구하기'}
              </RecoveryButton>
              <SecondaryButton onClick={handleCancel} disabled={isRecovering}>
                아니요
              </SecondaryButton>
            </ButtonGroup>
          )}
        </>
      )}
    </RedirectContainer>
  );
};

export default OAuth2RedirectPage;
