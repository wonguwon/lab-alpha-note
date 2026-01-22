import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useInput from '../../hooks/useInput';
import useAuthStore from '../../store/authStore';
import { authService } from '../../api/services';
import { Alert } from '../../components/common/Modal';
import { useAlert } from '../../hooks/useModal';
import { ButtonSpinner } from '../../components/common/Loading';
import TermsModal from './TermsModal';
import PrivacyModal from './PrivacyModal';
import {
  SignupContainer,
  SignupCard,
  SignupHeader,
  SignupDescription,
  SignupForm,
  InputGroup,
  Label,
  Input,
  SignupButton,
  TermsSection,
  TermsText,
  TermsLink,
  CheckboxGroup,
  CheckboxLabel,
  Checkbox
} from './SignupPage.styled';

const SocialSignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const nickname = useInput('');
  const [email, setEmail] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [emailSubscribed, setEmailSubscribed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // 필드별 에러 메시지
  const [nicknameError, setNicknameError] = useState('');
  const [generalError, setGeneralError] = useState('');
  
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // 모든 에러 초기화 헬퍼 함수
  const clearAllErrors = () => {
    setNicknameError('');
    setGeneralError('');
  };

  const { isOpen: isAlertOpen, showAlert, alertProps } = useAlert();
  const { login, setUser } = useAuthStore();

  useEffect(() => {
    // URL에서 tempToken과 email 추출
    const params = new URLSearchParams(location.search);
    const token = params.get('tempToken');
    const emailParam = params.get('email');

    if (!token) {
      showAlert('유효하지 않은 접근입니다.', {
        variant: 'error',
        onClose: () => navigate('/signup')
      });
      return;
    }

    setTempToken(token);
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location, navigate, showAlert]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 모든 에러 초기화
    clearAllErrors();

    // 유효성 검사
    let hasError = false;

    if (!nickname.value.trim()) {
      setNicknameError('닉네임을 입력해주세요.');
      hasError = true;
    }

    if (nickname.value.length > 20) {
      setNicknameError('닉네임은 최대 20자까지 입력 가능합니다.');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setIsLoading(true);

    try {
      await authService.oauth2Register(
        tempToken,
        nickname.value,
        emailSubscribed
      );

      // 사용자 정보 로드 (쿠키가 자동으로 설정됨)
      const userData = await authService.getUserInfo();
      setUser(userData);
      
      // 로그인 처리
      login();

      showAlert('회원가입이 완료되었습니다.', {
        variant: 'success',
        onClose: () => navigate('/')
      });
    } catch (error) {
      setGeneralError(error.message || '회원가입에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTermsClick = () => {
    setShowTermsModal(true);
  };

  const handlePrivacyClick = () => {
    setShowPrivacyModal(true);
  };

  return (
    <SignupContainer>
      <SignupCard>
        <SignupHeader>
          <img src="/logo.png" alt="AlphaNote" style={{ height: '125px', marginBottom: '16px' }} />
          <SignupDescription>
            추가 정보를 입력하여<br />
            회원가입을 완료하세요.
          </SignupDescription>
        </SignupHeader>

        <SignupForm onSubmit={handleSubmit}>
          {email && (
            <InputGroup>
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                disabled
                style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
              />
            </InputGroup>
          )}

          <InputGroup>
            <Label htmlFor="nickname">닉네임</Label>
            <Input
              id="nickname"
              name="nickname"
              type="text"
              placeholder="닉네임을 입력하세요"
              {...nickname.bind}
              required
              autoFocus
            />
            {nicknameError && (
              <div style={{ color: '#e74c3c', fontSize: '0.875rem', marginTop: '8px' }}>
                {nicknameError}
              </div>
            )}
          </InputGroup>

          <CheckboxGroup>
            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                checked={emailSubscribed}
                onChange={(e) => setEmailSubscribed(e.target.checked)}
              />
              <span>AlphaNote에서 주최하는 다양한 이벤트, 정보성 뉴스레터 및 광고를 받아보겠습니다.</span>
            </CheckboxLabel>
          </CheckboxGroup>

          <TermsSection>
            <TermsText>
              AlphaNote 가입 시, <TermsLink onClick={handleTermsClick}>계정 및 서비스 이용약관</TermsLink>, <TermsLink onClick={handlePrivacyClick}>개인정보 처리방침</TermsLink>에 동의하는 것으로 간주합니다.
            </TermsText>
          </TermsSection>

          {generalError && (
            <div style={{ 
              color: '#e74c3c', 
              fontSize: '0.875rem', 
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#fee2e2',
              borderRadius: '6px',
              border: '1px solid #fecaca'
            }}>
              {generalError}
            </div>
          )}

          <SignupButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                가입 중
                <ButtonSpinner size="small" />
              </>
            ) : (
              '회원가입 완료'
            )}
          </SignupButton>
        </SignupForm>
      </SignupCard>

      {/* 약관 모달 */}
      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />

      {/* 개인정보 처리방침 모달 */}
      <PrivacyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />

      {/* Alert 컴포넌트 */}
      <Alert isOpen={isAlertOpen} {...alertProps} />
    </SignupContainer>
  );
};

export default SocialSignupPage;

