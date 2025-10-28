import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useInput from '../../hooks/useInput';
import { authService } from '../../api/services';
import {
  SignupContainer,
  SignupCard,
  SignupHeader,
  LogoText,
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

const SignupPage = () => {
  const navigate = useNavigate();
  const email = useInput('');
  const password = useInput('');
  const confirmPassword = useInput('');
  const nickname = useInput('');
  const verificationCode = useInput('');

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [emailSubscribed, setEmailSubscribed] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 이메일이 변경되면 인증 상태 초기화
  const handleEmailChange = (e) => {
    email.bind.onChange(e);
    if (e.target.value !== verifiedEmail) {
      setIsCodeSent(false);
      setIsEmailVerified(false);
      verificationCode.reset();
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!isEmailVerified) {
      setErrorMessage('이메일 인증을 완료해주세요.');
      return;
    }

    if (password.value !== confirmPassword.value) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.value.length < 6) {
      setErrorMessage('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    if (!nickname.value.trim()) {
      setErrorMessage('닉네임을 입력해주세요.');
      return;
    }

    if (nickname.value.length > 20) {
      setErrorMessage('닉네임은 최대 20자까지 입력 가능합니다.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const registerData = {
        email: email.value,
        password: password.value,
        nickname: nickname.value,
        emailSubscribed
      };

      // 응답 형식: { success, message, data, errorCode }
      const response = await authService.register(registerData);

      if (response.success) {
        alert(response.message || '회원가입이 완료되었습니다.');
        navigate('/login');
      } else {
        setErrorMessage(response.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || '회원가입에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendVerificationCode = async () => {
    if (!email.value) {
      setErrorMessage('이메일을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // 이메일 중복 확인
      // 응답 형식: { success, message, data: { available }, errorCode }
      const checkResponse = await authService.checkEmailAvailability(email.value);

      if (checkResponse.success && checkResponse.data) {
        if (!checkResponse.data.available) {
          setErrorMessage(checkResponse.message || '이미 가입된 이메일입니다.');
          setIsLoading(false);
          return;
        }

        // 중복이 아닐 경우 인증 코드 발송
        // 응답 형식: { success, message, data, errorCode }
        const sendResponse = await authService.sendEmailVerification(email.value);

        if (sendResponse.success) {
          setIsCodeSent(true);
          alert(sendResponse.message || '인증 코드가 이메일로 전송되었습니다.');
        } else {
          setErrorMessage(sendResponse.message || '인증 코드 전송에 실패했습니다.');
        }
      } else {
        setErrorMessage(checkResponse.message || '이메일 확인에 실패했습니다.');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || '인증 코드 전송에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.value) {
      setErrorMessage('인증 코드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // 응답 형식: { success, message, data, errorCode }
      const response = await authService.verifyEmail(email.value, verificationCode.value);

      if (response.success) {
        setIsEmailVerified(true);
        setVerifiedEmail(email.value);
        alert(response.message || '이메일 인증이 완료되었습니다.');
      } else {
        setErrorMessage(response.message || '인증 코드가 올바르지 않습니다.');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || '인증 코드가 올바르지 않습니다.');
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
          <LogoText>AlphaNote</LogoText>
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
                {isLoading ? '발송 중...' : isCodeSent ? '전송완료' : '인증코드 발송'}
              </VerifyButton>
            </div>
            {errorMessage && (
              <div style={{ color: '#e74c3c', fontSize: '0.875rem', marginTop: '4px' }}>
                {errorMessage}
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
                  {isLoading ? '확인 중...' : '확인'}
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
              required
            />
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

          <SignupButton type="submit" disabled={!isEmailVerified || isLoading}>
            {isLoading ? '가입 중...' : '회원가입'}
          </SignupButton>
        </SignupForm>

        <LoginLink>
          <span>이미 계정이 있으신가요?</span>
          <Link to="/login">로그인</Link>
        </LoginLink>
      </SignupCard>

      {/* 임시 약관 모달 */}
      {showTermsModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowTermsModal(false)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '8px',
              maxWidth: '500px',
              maxHeight: '70vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>계정 및 서비스 이용약관</h2>
            <div style={{ marginBottom: '1rem', lineHeight: 1.6, color: '#666' }}>
              <p><strong>제1조 (목적)</strong><br />
              이 약관은 AlphaNote(이하 "회사")가 제공하는 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
              
              <p><strong>제2조 (서비스의 제공)</strong><br />
              회사는 이용자에게 성장 기록 및 관리 서비스를 제공합니다.</p>
              
              <p><strong>제3조 (개인정보보호)</strong><br />
              회사는 이용자의 개인정보를 소중히 여기며 관련 법령에 따라 보호합니다.</p>
              
              <p><strong>제4조 (서비스 이용의 제한)</strong><br />
              회사는 이용자가 본 약관을 위반하거나 서비스의 정상적인 운영을 방해하는 경우 서비스 이용을 제한할 수 있습니다.</p>
            </div>
            <button 
              onClick={() => setShowTermsModal(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* 임시 개인정보 처리방침 모달 */}
      {showPrivacyModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowPrivacyModal(false)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '8px',
              maxWidth: '500px',
              maxHeight: '70vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>개인정보 처리방침</h2>
            <div style={{ marginBottom: '1rem', lineHeight: 1.6, color: '#666' }}>
              <p><strong>1. 개인정보의 수집 및 이용목적</strong><br />
              AlphaNote는 다음의 목적을 위해 개인정보를 수집 및 이용합니다.<br />
              - 서비스 제공 및 관리<br />
              - 회원 식별 및 인증<br />
              - 고객 상담 및 지원</p>
              
              <p><strong>2. 수집하는 개인정보 항목</strong><br />
              - 필수항목: 이메일, 비밀번호, 닉네임<br />
              - 선택항목: 마케팅 수신 동의</p>
              
              <p><strong>3. 개인정보의 보유 및 이용기간</strong><br />
              회원 탈퇴 시까지 보유하며, 탈퇴 후 즉시 삭제합니다.</p>
              
              <p><strong>4. 개인정보의 제3자 제공</strong><br />
              회사는 이용자의 개인정보를 제3자에게 제공하지 않습니다.</p>
            </div>
            <button 
              onClick={() => setShowPrivacyModal(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </SignupContainer>
  );
};

export default SignupPage;