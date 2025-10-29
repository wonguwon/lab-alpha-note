import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import {
  RedirectContainer,
  LoadingSpinner,
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
        // URL에서 토큰 추출
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        // 에러가 있는 경우
        if (error) {
          setIsError(true);
          setMessage(`로그인 실패: ${error}`);
          setError(error);

          // 3초 후 로그인 페이지로 리다이렉트
          setTimeout(() => {
            navigate('/login');
          }, 3000);
          return;
        }

        // 토큰이 없는 경우
        if (!token) {
          setIsError(true);
          setMessage('인증 토큰이 없습니다.');
          setError('No token provided');

          setTimeout(() => {
            navigate('/login');
          }, 3000);
          return;
        }

        // 토큰 저장 (사용자 정보는 App.jsx에서 자동 로드)
        login(token);

        setMessage('로그인 성공! 메인 페이지로 이동합니다...');

        // 1초 후 홈페이지로 리다이렉트
        setTimeout(() => {
          navigate('/');
        }, 1000);

      } catch (error) {
        console.error('OAuth2 로그인 처리 중 오류:', error);
        setIsError(true);
        setMessage('로그인 처리 중 오류가 발생했습니다.');
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
      <LoadingSpinner />
      {isError ? (
        <ErrorMessage>{message}</ErrorMessage>
      ) : (
        <Message>{message}</Message>
      )}
    </RedirectContainer>
  );
};

export default OAuth2RedirectPage;
