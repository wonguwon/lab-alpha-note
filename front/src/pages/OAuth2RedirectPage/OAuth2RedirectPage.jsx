import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { Loading } from '../../components/common/Loading';
import {
  RedirectContainer,
  Message,
  ErrorMessage
} from './OAuth2RedirectPage.styled';

const OAuth2RedirectPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('로그인 처리 중...');
  const [isError, setIsError] = useState(false);

  const { login, setLoading, setError } = useAuthStore();

  useEffect(() => {
    const processOAuth2Login = async () => {
      setLoading(true);

      try {
        // URL에서 파라미터 추출
        const token = searchParams.get('token');
        const tempToken = searchParams.get('tempToken');
        const mode = searchParams.get('mode');
        const errorCode = searchParams.get('errorCode');

        // 에러 코드 처리
        if (errorCode) {
          setIsError(true);
          
          // 에러 코드별 메시지 매핑
          const errorMessages = {
            'A007': '이미 가입된 계정입니다. 로그인 페이지로 이동해주세요.',
            'A008': '회원가입이 필요합니다. 회원가입 페이지로 이동해주세요.',
            'A009': 'OAuth2 인증에 실패했습니다. 다시 시도해주세요.',
            'A010': '다른 로그인 방식으로 가입된 계정입니다. 해당 로그인 방식을 사용해주세요.'
          };
          
          const errorMessage = errorMessages[errorCode] || '인증 처리 중 오류가 발생했습니다.';
          setMessage(errorMessage);
          setError(errorMessage);

          // 에러 코드별 리다이렉트 경로
          const redirectPath = errorCode === 'A008' ? '/signup' : '/login';
          setTimeout(() => {
            navigate(redirectPath);
          }, 3000);
          return;
        }

        // 임시 토큰이 있는 경우 (회원가입 모드)
        if (tempToken && mode === 'signup') {
          setMessage('회원가입을 진행합니다...');
          
          // 소셜 가입 페이지로 리다이렉트
          setTimeout(() => {
            navigate(`/signup/social?tempToken=${tempToken}`);
          }, 500);
          return;
        }

        // 정식 토큰이 있는 경우 (로그인 완료)
        if (token) {
          // 토큰 저장 (사용자 정보는 App.jsx에서 자동 로드)
          login(token);

          setMessage('로그인 성공! 메인 페이지로 이동합니다...');

          // 1초 후 홈페이지로 리다이렉트
          setTimeout(() => {
            navigate('/');
          }, 1000);
          return;
        }

        // 토큰이 없는 경우
        setIsError(true);
        setMessage('인증 정보가 없습니다.');
        setError('No token or tempToken provided');

        setTimeout(() => {
          navigate('/login');
        }, 3000);

      } catch (error) {
        console.error('OAuth2 처리 중 오류:', error);
        setIsError(true);
        setMessage('처리 중 오류가 발생했습니다.');
        setError(error.message);

        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    processOAuth2Login();
  }, [searchParams, login, navigate, setLoading, setError]);

  return (
    <RedirectContainer>
      {!isError && <Loading size="large" text={message} color="#667eea" textColor="#374151" />}
      {isError && <ErrorMessage>{message}</ErrorMessage>}
    </RedirectContainer>
  );
};

export default OAuth2RedirectPage;
