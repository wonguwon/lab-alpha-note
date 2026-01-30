import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supportService } from '../../api/services';
import useAuthStore from '../../store/authStore';
import {
  ContactContainer,
  ContactHeader,
  ContactTitle,
  ContactSubtitle,
  ContactForm,
  FormGroup,
  FormLabel,
  FormInput,
  FormSelect,
  FormTextarea,
  FormError,
  SubmitButton,
  ErrorMessage,
  ErrorTitle,
  ErrorText,
  AlertOverlay,
  AlertModal,
  AlertIcon,
  AlertTitle,
  AlertMessage,
  AlertButton
} from './ContactPage.styled';

const ContactPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [formData, setFormData] = useState({
    type: 'INQUIRY',
    email: '',
    subject: '',
    content: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // 로그인한 사용자인 경우 이메일 자동 세팅
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      setFormData(prev => ({
        ...prev,
        email: user.email
      }));
    }
  }, [isAuthenticated, user]);

  const contactTypes = [
    { value: 'INQUIRY', label: '일반 문의' },
    { value: 'ERROR', label: '에러 보고' },
    { value: 'FEATURE', label: '기능 제안' },
    { value: 'COLLABORATION', label: '협업 제안' },
    { value: 'OTHER', label: '기타' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 필드 변경 시 해당 필드 에러 제거
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = '제목을 입력해주세요.';
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = '제목은 최소 5자 이상이어야 합니다.';
    }

    if (!formData.content.trim()) {
      newErrors.content = '내용을 입력해주세요.';
    } else if (formData.content.trim().length < 10) {
      newErrors.content = '내용은 최소 10자 이상이어야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await supportService.submitContact(formData);

      // 성공 팝업 표시
      setShowAlert(true);

      // 폼 초기화
      setFormData({
        type: 'INQUIRY',
        email: '',
        subject: '',
        content: ''
      });

    } catch (error) {
      console.error('문의사항 전송 실패:', error);
      setSubmitError(
        error.response?.data?.message ||
        '문의사항 전송에 실패했습니다. 잠시 후 다시 시도해주세요.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    navigate('/');
  };

  return (
    <>
      <ContactContainer>
        <ContactHeader>
          <ContactTitle>문의하기</ContactTitle>
          <ContactSubtitle>
            궁금하신 점이나 건의사항이 있으시면 언제든지 문의해주세요.
          </ContactSubtitle>
        </ContactHeader>

        {submitError && (
          <ErrorMessage>
            <ErrorTitle>전송 실패</ErrorTitle>
            <ErrorText>{submitError}</ErrorText>
          </ErrorMessage>
        )}

        <ContactForm onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel htmlFor="type">문의 유형 *</FormLabel>
            <FormSelect
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              {contactTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </FormSelect>
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="email">작성자 이메일 *</FormLabel>
            <FormInput
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
            />
            {errors.email && <FormError>{errors.email}</FormError>}
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="subject">제목 *</FormLabel>
            <FormInput
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="문의 제목을 입력해주세요"
            />
            {errors.subject && <FormError>{errors.subject}</FormError>}
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="content">내용 *</FormLabel>
            <FormTextarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="문의 내용을 상세히 입력해주세요"
            />
            {errors.content && <FormError>{errors.content}</FormError>}
          </FormGroup>

          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? '전송 중...' : '문의하기'}
          </SubmitButton>
        </ContactForm>
      </ContactContainer>

      {/* 성공 알림 팝업 */}
      {showAlert && (
        <AlertOverlay onClick={handleCloseAlert}>
          <AlertModal onClick={(e) => e.stopPropagation()}>
            <AlertIcon>✓</AlertIcon>
            <AlertTitle>전송 완료!</AlertTitle>
            <AlertMessage>
              문의사항이 성공적으로 전송되었습니다.<br />
              빠른 시일 내에 확인 후 답변드리겠습니다.
            </AlertMessage>
            <AlertButton onClick={handleCloseAlert}>확인</AlertButton>
          </AlertModal>
        </AlertOverlay>
      )}
    </>
  );
};

export default ContactPage;
