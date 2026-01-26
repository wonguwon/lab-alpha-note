import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MarkdownEditor from '../../components/MarkdownEditor';
import BlogMetadataModal from '../../components/BlogMetadataModal';
import DraftListModal from '../../components/DraftListModal';
import { blogService, storageService } from '../../api/services';
import {
  CreateContainer,
  CreateCard,
  CreateHeader,
  PageTitle,
  FormSection,
  FormGroup,
  Label,
  RequiredMark,
  Input,
  CharCount,
  ButtonGroup,
  CancelButton,
  DraftButtonWrapper,
  DraftButton,
  DraftDivider,
  DraftCountButton,
  SubmitButton,
  ErrorMessage
} from './BlogCreatePage.styled';

const BlogCreatePage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: [],
        image: null,
        imagePreview: null
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDraftListOpen, setIsDraftListOpen] = useState(false);
    const [draftCount, setDraftCount] = useState(0);

    useEffect(() => {
        loadDraftCount();
    }, []);

    const loadDraftCount = async () => {
        try {
            const response = await blogService.getDraftCount();
            setDraftCount(response || 0);
        } catch (error) {
            console.error('임시저장 갯수 조회 실패:', error);
        }
    };

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

    const handleSaveDraft = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const result = await blogService.createBlog({
                title: formData.title,
                content: formData.content,
                tags: formData.tags,
                thumbnailUrl: formData.imagePreview,
                status: 'DRAFT',
                visibility: 'PRIVATE'
            });

            alert('임시저장되었습니다');
            loadDraftCount(); // 카운트 갱신

            // 임시저장 후 수정 페이지로 이동 (계속 작성 가능)
            if (result?.id) {
                navigate(`/blogs/${result.id}/edit`);
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || '임시저장 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDraftListOpen = () => {
        setIsDraftListOpen(true);
    };

    const handleDraftDeleted = () => {
        loadDraftCount(); // 삭제 후 카운트 갱신
    };

    const handleMetadataSubmit = async (metadata) => {
        setIsSubmitting(true);

        try {
            let thumbnailUrl = null;

            // 대표 이미지가 있는 경우 업로드
            if (metadata.image) {
                const file = metadata.image;

                // 1. Presigned URL 발급
                // 파일명 충돌 방지를 위해 현재 시간 추가
                const fileName = `${Date.now()}_${file.name}`;
                const { uploadUrl, fileUrl } = await storageService.getPresignedUrl(
                    fileName,
                    file.type,
                    'public/blogs/thumbnails', // 블로그 썸네일 경로
                    file.size
                );

                // 2. S3에 파일 업로드
                await storageService.uploadToS3(uploadUrl, file, file.type);

                thumbnailUrl = fileUrl;
            }

            // 발행
            await blogService.createBlog({
                title: formData.title,
                content: formData.content,
                tags: metadata.tags,
                thumbnailUrl: thumbnailUrl,
                status: 'PUBLISHED',
                visibility: metadata.visibility || 'PUBLIC'
            });

            alert('게시글이 발행되었습니다');
            navigate('/blogs');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || '게시글 작성 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
            setIsModalOpen(false);
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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        // 메타데이터 팝업 열기
        setIsModalOpen(true);
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
                    <PageTitle>Blog</PageTitle>
                </CreateHeader>

                <FormSection onSubmit={handleSubmit}>
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
                            <Label>
                                내용<RequiredMark>*</RequiredMark>
                            </Label>
                            <MarkdownEditor
                                content={formData.content}
                                onChange={handleContentChange}
                                placeholder="당신의 이야기를 자유롭게 적어주세요..."
                                error={errors.content}
                            />
                            {errors.content && <ErrorMessage>{errors.content}</ErrorMessage>}
                        </FormGroup>

                    <ButtonGroup>
                        <CancelButton type="button" onClick={handleCancel}>
                            취소
                        </CancelButton>
                        <DraftButtonWrapper>
                            <DraftButton type="button" onClick={handleSaveDraft} disabled={isSubmitting}>
                                임시저장
                            </DraftButton>
                            <DraftDivider />
                            <DraftCountButton type="button" onClick={handleDraftListOpen}>
                                {draftCount}
                            </DraftCountButton>
                        </DraftButtonWrapper>
                        <SubmitButton type="submit" disabled={isSubmitting}>
                            {isSubmitting ? '발행 중...' : '발행'}
                        </SubmitButton>
                    </ButtonGroup>
                </FormSection>
            </CreateCard>

            <BlogMetadataModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleMetadataSubmit}
                initialTags={formData.tags}
                initialImage={formData.image}
                initialImagePreview={formData.imagePreview}
                isPublishing={isSubmitting}
                submitButtonText="발행"
                initialVisibility="PUBLIC"
            />

            <DraftListModal
                isOpen={isDraftListOpen}
                onClose={() => setIsDraftListOpen(false)}
                onDraftDeleted={handleDraftDeleted}
            />
        </CreateContainer>
    );
};

export default BlogCreatePage;
