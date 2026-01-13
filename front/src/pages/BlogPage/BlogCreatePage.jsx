import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TiptapEditor from '../../components/TiptapEditor';
import {
  CreateContainer,
  CreateCard,
  CreateHeader,
  PageTitle,
  PageDescription,
  FormSection,
  FormGroup,
  Label,
  RequiredMark,
  Input,
  CharCount,
  ButtonGroup,
  CancelButton,
  SubmitButton,
  ErrorMessage,
  FileInputWrapper,
  FileInputLabel,
  HiddenFileInput,
  UploadPlaceholder,
  PreviewImage,
  HelperText
} from './BlogCreatePage.styled';

const BlogCreatePage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tag: '',
        image: null,
        imagePreview: null
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleTitleChange = (e) => {
        const value = e.target.value;
        if (value.length <= 100) {
            setFormData({ ...formData, title: value });
            if (errors.title) setErrors({ ...errors, title: '' });
        }
    };

    const handleContentChange = (html) => {
        setFormData({ ...formData, content: html });
        if (errors.content) setErrors({ ...errors, content: '' });
    };

    const handleTagChange = (e) => {
        const value = e.target.value;
        if (value.length <= 20) {
            setFormData({ ...formData, tag: value });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({
                    ...formData,
                    image: file,
                    imagePreview: reader.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = '제목을 입력해주세요.';
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

        // TODO: API 연결
        setTimeout(() => {
            alert('게시글이 작성되었습니다 (데모)');
            setIsSubmitting(false);
            navigate('/blogs');
        }, 1000);
    };

    const handleCancel = () => {
        if (formData.title || formData.content) {
            if (window.confirm('작성 중인 내용이 있습니다. 정말 취소하시겠습니까?')) {
                navigate('/blogs');
            }
        } else {
            navigate('/blogs');
        }
    };

    return (
        <CreateContainer>
            <CreateCard>
                <CreateHeader>
                    <PageTitle>새 글 작성하기</PageTitle>
                    <PageDescription>
                        자유롭게 당신의 이야기를 들려주세요.
                    </PageDescription>
                </CreateHeader>

                <form onSubmit={handleSubmit}>
                    <FormSection>
                        <FormGroup>
                            <Label>
                                제목<RequiredMark>*</RequiredMark>
                            </Label>
                            <Input
                                type="text"
                                placeholder="제목을 입력하세요"
                                value={formData.title}
                                onChange={handleTitleChange}
                                $error={!!errors.title}
                                maxLength={100}
                            />
                            <CharCount $exceeded={formData.title.length > 100}>
                                {formData.title.length} / 100
                            </CharCount>
                            {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
                        </FormGroup>

                        <FormGroup>
                            <Label>태그</Label>
                            <Input
                                type="text"
                                placeholder="태그를 입력하세요 (예: 일상, 개발, 여행)"
                                value={formData.tag}
                                onChange={handleTagChange}
                                maxLength={20}
                            />
                            <HelperText>주제와 관련된 태그를 하나 입력해주세요.</HelperText>
                        </FormGroup>

                        <FormGroup>
                            <Label>대표 이미지</Label>
                            <FileInputWrapper>
                                <FileInputLabel $hasImage={!!formData.imagePreview}>
                                    {formData.imagePreview ? (
                                        <PreviewImage src={formData.imagePreview} alt="Preview" />
                                    ) : (
                                        <UploadPlaceholder>
                                            <span style={{ fontSize: '24px' }}>📷</span>
                                            <span>이미지 업로드</span>
                                        </UploadPlaceholder>
                                    )}
                                    <HiddenFileInput 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </FileInputLabel>
                            </FileInputWrapper>
                        </FormGroup>

                        <FormGroup>
                            <Label>
                                내용<RequiredMark>*</RequiredMark>
                            </Label>
                            <TiptapEditor
                                content={formData.content}
                                onChange={handleContentChange}
                                placeholder="당신의 이야기를 자유롭게 적어주세요..."
                                error={errors.content}
                            />
                            {errors.content && <ErrorMessage>{errors.content}</ErrorMessage>}
                        </FormGroup>
                    </FormSection>

                    <ButtonGroup>
                        <CancelButton type="button" onClick={handleCancel}>
                            취소
                        </CancelButton>
                        <SubmitButton type="submit" disabled={isSubmitting}>
                            {isSubmitting ? '작성 중...' : '글 게시하기'}
                        </SubmitButton>
                    </ButtonGroup>
                </form>
            </CreateCard>
        </CreateContainer>
    );
};

export default BlogCreatePage;
