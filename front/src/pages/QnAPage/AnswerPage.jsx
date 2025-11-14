import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { qnaService } from '../../api/services';
import TiptapEditor from '../../components/TiptapEditor';
import {
  AnswerContainer,
  AnswerCard,
  AnswerHeader,
  PageTitle,
  QuestionPreview,
  QuestionTitle,
  QuestionContent,
  FormSection,
  FormGroup,
  Label,
  RequiredMark,
  HelperText,
  TextArea,
  ButtonGroup,
  CancelButton,
  SubmitButton,
  ErrorMessage,
  LoadingState
} from './AnswerPage.styled';

const AnswerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestion();
  }, [id]);

  const loadQuestion = async () => {
    setLoading(true);
    try {
      const data = await qnaService.getQuestionDetail(id);
      setQuestion(data);
    } catch (err) {
      console.error('질문 조회 실패:', err);
      setError('질문을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = (html) => {
    setContent(html);
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    if (!content.trim()) {
      setError('답변 내용을 입력해주세요.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await qnaService.createAnswer(id, {
        content: content.trim()
      });

      // 답변 작성 성공 후 질문 상세 페이지로 이동
      navigate(`/qna/${id}`);
    } catch (err) {
      console.error('답변 작성 실패:', err);
      setError(err.response?.data?.message || '답변 작성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (content.trim()) {
      if (window.confirm('작성 중인 내용이 있습니다. 정말 취소하시겠습니까?')) {
        navigate(`/qna/${id}`);
      }
    } else {
      navigate(`/qna/${id}`);
    }
  };

  if (loading) {
    return (
      <AnswerContainer>
        <LoadingState>로딩 중...</LoadingState>
      </AnswerContainer>
    );
  }

  if (!question) {
    return (
      <AnswerContainer>
        <ErrorMessage>질문을 찾을 수 없습니다.</ErrorMessage>
      </AnswerContainer>
    );
  }

  return (
    <AnswerContainer>
      <AnswerCard>
        <AnswerHeader>
          <PageTitle>답변 하기</PageTitle>
        </AnswerHeader>

        {/* 질문 미리보기 */}
        <QuestionPreview>
          <QuestionTitle>{question.title}</QuestionTitle>
          <QuestionContent dangerouslySetInnerHTML={{
            __html: question.content.length > 500
              ? `${question.content.substring(0, 500)}...`
              : question.content
          }} />
        </QuestionPreview>

        <FormSection onSubmit={handleSubmit}>
          {/* 답변 내용 */}
          <FormGroup>
            <Label>
              답변 <RequiredMark>*</RequiredMark>
            </Label>
            <HelperText>
              질문자가 이해하기 쉽도록 구체적이고 명확하게 작성해주세요.
            </HelperText>
            <TiptapEditor
              content={content}
              onChange={handleContentChange}
              placeholder="좋은 답변의 예시:
- 문제의 원인을 설명하고 해결 방법을 제시합니다.
- 코드 예시를 포함하여 구체적으로 설명합니다.
- 관련 문서나 참고 자료 링크를 추가합니다."
              error={error}
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </FormGroup>

          {/* 버튼 */}
          <ButtonGroup>
            <CancelButton type="button" onClick={handleCancel}>
              취소
            </CancelButton>
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? '작성 중...' : '답변 등록'}
            </SubmitButton>
          </ButtonGroup>
        </FormSection>
      </AnswerCard>
    </AnswerContainer>
  );
};

export default AnswerPage;
