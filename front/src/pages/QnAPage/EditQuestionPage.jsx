import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { qnaService } from '../../api/services';
import TiptapEditor from '../../components/TiptapEditor';
import {
  AskContainer,
  AskCard,
  AskHeader,
  PageTitle,
  FormSection,
  FormGroup,
  Label,
  RequiredMark,
  HelperText,
  Input,
  TagInputWrapper,
  TagInput,
  TagList,
  Tag,
  RemoveTagButton,
  ButtonGroup,
  CancelButton,
  SubmitButton,
  ErrorMessage
} from './AskQuestionPage.styled';

const EditQuestionPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 질문 데이터 로드
  useEffect(() => {
    loadQuestion();
  }, [id]);

  const loadQuestion = async () => {
    try {
      const data = await qnaService.getQuestionDetail(id);
      setFormData({
        title: data.title,
        content: data.content,
        tags: data.tags?.map(tag => tag.name) || []
      });
    } catch (error) {
      console.error('질문 불러오기 실패:', error);
      alert('질문을 불러오는데 실패했습니다.');
      navigate('/qna');
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    if (value.length <= 255) {
      setFormData({ ...formData, title: value });
      if (errors.title) {
        setErrors({ ...errors, title: '' });
      }
    }
  };

  const handleContentChange = (html) => {
    setFormData({ ...formData, content: html });
    if (errors.content) {
      setErrors({ ...errors, content: '' });
    }
  };

  const handleTagInputKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (!tag) return;

    if (formData.tags.length >= 5) {
      setErrors({ ...errors, tags: '태그는 최대 5개까지 추가할 수 있습니다.' });
      return;
    }

    if (formData.tags.includes(tag)) {
      setErrors({ ...errors, tags: '이미 추가된 태그입니다.' });
      return;
    }

    setFormData({ ...formData, tags: [...formData.tags, tag] });
    setTagInput('');
    setErrors({ ...errors, tags: '' });
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    } else if (formData.title.length > 255) {
      newErrors.title = '제목은 255자 이하로 입력해주세요.';
    }

    if (!formData.content.trim()) {
      newErrors.content = '내용을 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await qnaService.updateQuestion(id, {
        title: formData.title.trim(),
        content: formData.content.trim(),
        tags: formData.tags
      });

      navigate(`/qna/${id}`);
    } catch (error) {
      console.error('질문 수정 실패:', error);
      setErrors({ submit: '질문 수정에 실패했습니다. 다시 시도해주세요.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('수정을 취소하시겠습니까?')) {
      navigate(`/qna/${id}`);
    }
  };

  if (loading) {
    return (
      <AskContainer>
        <AskCard>
          <div style={{ padding: '40px', textAlign: 'center' }}>로딩 중...</div>
        </AskCard>
      </AskContainer>
    );
  }

  return (
    <AskContainer>
      <AskCard>
        <AskHeader>
          <PageTitle>질문 수정</PageTitle>
        </AskHeader>

        <FormSection onSubmit={handleSubmit}>
          {/* 제목 */}
          <FormGroup>
            <Label>
              제목 <RequiredMark>*</RequiredMark>
            </Label>
            <HelperText>질문 내용을 한눈에 알 수 있도록 명확히 작성하세요. (최소 15자 이상)</HelperText>
            <Input
              type="text"
              placeholder="문제를 명확히 표현하세요. (예: &quot;Spring Boot에서 MySQL 연결 오류 발생 시 해결 방법?&quot;)"
              value={formData.title}
              onChange={handleTitleChange}
              error={errors.title}
            />
            {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
          </FormGroup>

          {/* 내용 */}
          <FormGroup>
            <Label>
              내용 <RequiredMark>*</RequiredMark>
            </Label>
            <HelperText>구체적으로 작성하고, 다른 사람에게 설명하듯 물어보세요.</HelperText>
            <TiptapEditor
              content={formData.content}
              onChange={handleContentChange}
              placeholder="좋은 질문이 좋은 답을 얻습니다.
- 현재 발생한 문제를 구체적으로 설명하세요.
- 해결을 위해 시도한 방법을 적어주세요.
- 코드는 코드블록으로 깔끔하게 정리하세요."
              error={errors.content}
            />
            {errors.content && <ErrorMessage>{errors.content}</ErrorMessage>}
          </FormGroup>

          {/* 태그 */}
          <FormGroup>
            <Label>태그</Label>
            <HelperText>질문과 관련된 주제나 기술 키워드를 입력하세요. (최대 5개)</HelperText>
            <TagInputWrapper>
              <TagInput
                type="text"
                placeholder="관련 기술이나 주제를 입력하세요. (예: springboot, mysql, aws)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagInputKeyPress}
                onBlur={addTag}
              />
            </TagInputWrapper>
            {formData.tags.length > 0 && (
              <TagList>
                {formData.tags.map((tag, index) => (
                  <Tag key={index}>
                    {tag}
                    <RemoveTagButton onClick={() => removeTag(tag)}>×</RemoveTagButton>
                  </Tag>
                ))}
              </TagList>
            )}
            {errors.tags && <ErrorMessage>{errors.tags}</ErrorMessage>}
          </FormGroup>

          {/* 제출 오류 */}
          {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}

          {/* 버튼 */}
          <ButtonGroup>
            <CancelButton type="button" onClick={handleCancel}>
              취소
            </CancelButton>
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? '수정 중...' : '수정 완료'}
            </SubmitButton>
          </ButtonGroup>
        </FormSection>
      </AskCard>
    </AskContainer>
  );
};

export default EditQuestionPage;
