import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useInput from '../../hooks/useInput';
import { authService } from '../../api/services';
import { validatePassword, PASSWORD_RULES } from '../../utils/passwordValidator';
import { Alert } from '../../components/common/Modal';
import { useAlert } from '../../hooks/useModal';
import { ButtonSpinner } from '../../components/common/Loading';
import TermsModal from './TermsModal';
import PrivacyModal from './PrivacyModal';
import GoogleIcon from '../../assets/icons/google_login.svg';
import {
  SignupContainer,
  SignupCard,
  SignupHeader,
  SignupDescription,
  SignupForm,
  InputGroup,
  EmailInputGroup,
  Label,
  Input,
  VerifyButton,
  SignupButton,
  TermsSection,
  TermsText,
  TermsLink,
  CheckboxGroup,
  CheckboxLabel,
  Checkbox,
  LoginLink
} from './SignupPage.styled';
import { Divider, GoogleLoginButton } from '../LoginPage/LoginPage.styled';

const SignupPage = () => {
  const navigate = useNavigate();
  const email = useInput('');
  const password = useInput('');
  const confirmPassword = useInput('');
  const nickname = useInput('');
  const verificationCode = useInput('');

  const { isOpen: isAlertOpen, showAlert, alertProps } = useAlert();

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [emailSubscribed, setEmailSubscribed] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // 필드별 에러 메시지
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [generalError, setGeneralError] = useState('');
  
  const [passwordValidation, setPasswordValidation] = useState(null);
  const [showPasswordRules, setShowPasswordRules] = useState(false);

  // 모든 에러 초기화 헬퍼 함수
  const clearAllErrors = () => {
    setEmailError('');
    setPasswordError('');
    setNicknameError('');
    setGeneralError('');
  };

  // 비밀번호 실시간 검증
  useEffect(() => {
    if (password.value) {
      const validation = validatePassword(password.value, email.value);
      setPasswordValidation(validation);
    } else {
      setPasswordValidation(null);
    }
  }, [password.value, email.value]);

  // 이메일이 변경되면 인증 상태 초기화
  const handleEmailChange = (e) => {
    email.bind.onChange(e);
    if (e.target.value !== verifiedEmail) {
      setIsCodeSent(false);
      setIsEmailVerified(false);
      verificationCode.reset();
      setEmailError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 모든 에러 초기화
    clearAllErrors();

    // 유효성 검사
    let hasError = false;

    if (!isEmailVerified) {
      setEmailError('이메일 인증을 완료해주세요.');
      hasError = true;
    }

    // 비밀번호 검증
    const passwordCheck = validatePassword(password.value, email.value);
    if (!passwordCheck.isValid) {
      setPasswordError('비밀번호가 보안 요구사항을 충족하지 않습니다.');
      hasError = true;
    }

    if (password.value !== confirmPassword.value) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
      hasError = true;
    }

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
      const registerData = {
        email: email.value,
        password: password.value,
        nickname: nickname.value,
        emailSubscribed
      };

      await authService.register(registerData);
      showAlert('회원가입이 완료되었습니다.', {
        variant: 'success',
        onClose: () => navigate('/login')
      });
    } catch (error) {
      setGeneralError(error.message || '회원가입에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendVerificationCode = async () => {
    if (!email.value) {
      setEmailError('이메일을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setEmailError('');

    try {
      // 이메일 중복 확인 - 반환: { available }
      const checkData = await authService.checkEmailAvailability(email.value);

      if (!checkData.available) {
        setEmailError('이미 가입된 이메일입니다.');
        setIsLoading(false);
        return;
      }

      // 중복이 아닐 경우 인증 코드 발송
      await authService.sendEmailVerification(email.value);
      setIsCodeSent(true);
      showAlert('인증 코드가 이메일로 전송되었습니다.');
    } catch (error) {
      setEmailError(error.message || '이메일 인증 코드 발송에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.value) {
      setEmailError('인증 코드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setEmailError('');

    try {
      await authService.verifyEmail(email.value, verificationCode.value);
      setIsEmailVerified(true);
      setVerifiedEmail(email.value);
      showAlert('이메일 인증이 완료되었습니다.', { variant: 'success' });
    } catch (error) {
      setEmailError(error.message || '이메일 인증에 실패했습니다.');
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

  const handleGoogleSignup = () => {
    // 서버의 OAuth2 인증 엔드포인트로 리다이렉트 (google-signup registration 사용)
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
    window.location.href = `${apiUrl}/oauth2/authorization/google-signup`;
  };

  return (
    <SignupContainer>
      <SignupCard>
        <SignupHeader>
          <img src="/logo.png" alt="AlphaNote" style={{ height: '125px', marginBottom: '16px' }} />
          <SignupDescription>
            포기하지 않은 날들을 모아,<br />
            당신만의 성장을 기록하세요.
          </SignupDescription>
        </SignupHeader>

        <SignupForm onSubmit={handleSubmit}>
          <EmailInputGroup>
            <Label htmlFor="email">이메일</Label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="이메일을 입력하세요"
                value={email.value}
                onChange={handleEmailChange}
                required
                style={{ flex: 1 }}
              />
              <VerifyButton
                type="button"
                onClick={handleSendVerificationCode}
                disabled={!email.value || isCodeSent || isLoading || isEmailVerified}
              >
                {isLoading ? (
                  <>
                    발송 중
                    <ButtonSpinner size="small" />
                  </>
                ) : isCodeSent ? (
                  '전송완료'
                ) : (
                  '코드발송'
                )}
              </VerifyButton>
            </div>
            {emailError && (
              <div style={{ color: '#e74c3c', fontSize: '0.875rem', marginTop: '4px' }}>
                {emailError}
              </div>
            )}
          </EmailInputGroup>

          {isCodeSent && !isEmailVerified && (
            <EmailInputGroup>
              <Label htmlFor="verificationCode">인증 코드</Label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Input
                  id="verificationCode"
                  name="verificationCode"
                  type="text"
                  placeholder="인증 코드를 입력하세요"
                  {...verificationCode.bind}
                  required
                  style={{ flex: 1 }}
                />
                <VerifyButton
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={!verificationCode.value || isLoading}
                >
                  {isLoading ? (
                    <>
                      확인 중
                      <ButtonSpinner size="small" />
                    </>
                  ) : (
                    '확인'
                  )}
                </VerifyButton>
              </div>
            </EmailInputGroup>
          )}

          {isEmailVerified && (
            <div style={{ color: '#27ae60', fontSize: '0.875rem', marginTop: '-8px', marginBottom: '16px' }}>
              ✓ 이메일 인증이 완료되었습니다.
            </div>
          )}

          <InputGroup>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              {...password.bind}
              onFocus={() => setShowPasswordRules(true)}
              required
            />
            {/* 비밀번호 검증 규칙 표시 */}
            {showPasswordRules && password.value && (
              <div style={{
                marginTop: '12px',
                padding: '12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px',
                fontSize: '0.8125rem',
                lineHeight: '1.6'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '8px', color: '#495057' }}>
                  비밀번호 보안 요구사항
                </div>
                {PASSWORD_RULES.map((rule) => {
                  const isValid = passwordValidation?.[rule.key];
                  return (
                    <div key={rule.key} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginBottom: '4px',
                      color: isValid ? '#27ae60' : '#95a5a6'
                    }}>
                      <span style={{ fontSize: '0.75rem' }}>
                        {isValid ? '✓' : '○'}
                      </span>
                      <span>{rule.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
            {passwordError && (
              <div style={{ color: '#e74c3c', fontSize: '0.875rem', marginTop: '8px' }}>
                {passwordError}
              </div>
            )}
          </InputGroup>

          <InputGroup>
            <Label htmlFor="confirmPassword">비밀번호 확인</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              {...confirmPassword.bind}
              required
            />
            {/* 비밀번호 일치 여부 표시 */}
            {confirmPassword.value && (
              <div style={{
                marginTop: '8px',
                fontSize: '0.8125rem',
                color: password.value === confirmPassword.value ? '#27ae60' : '#e74c3c'
              }}>
                {password.value === confirmPassword.value ? '✓ 비밀번호가 일치합니다' : '✗ 비밀번호가 일치하지 않습니다'}
              </div>
            )}
          </InputGroup>

          <InputGroup>
            <Label htmlFor="nickname">닉네임</Label>
            <Input
              id="nickname"
              name="nickname"
              type="text"
              placeholder="닉네임을 입력하세요"
              {...nickname.bind}
              required
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

          <SignupButton type="submit" disabled={!isEmailVerified || isLoading}>
            {isLoading ? (
              <>
                가입 중
                <ButtonSpinner size="small" />
              </>
            ) : (
              '회원가입'
            )}
          </SignupButton>
        </SignupForm>

        <Divider>
          <span>또는</span>
        </Divider>

        <GoogleLoginButton onClick={handleGoogleSignup}>
          <img src={GoogleIcon} alt="Google" width="18" height="18" />
          Google 계정으로 회원가입
        </GoogleLoginButton>

        <LoginLink>
          <span>이미 계정이 있으신가요?</span>
          <Link to="/login">로그인</Link>
        </LoginLink>
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

export default SignupPage;