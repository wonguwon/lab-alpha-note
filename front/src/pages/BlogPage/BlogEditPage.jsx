import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MarkdownEditor from '../../components/MarkdownEditor';
import BlogMetadataModal from '../../components/BlogMetadataModal';
import { blogService, storageService } from '../../api/services';
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
  MetadataSection,
  MetadataSummary,
  MetadataTag,
  MetadataImage,
  MetadataButton
} from './BlogCreatePage.styled';

const BlogEditPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: [],
        thumbnailUrl: null,
        image: null,
        imagePreview: null
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadBlog();
    }, [id]);

    const loadBlog = async () => {
        try {
            const data = await blogService.getBlog(id);
            setFormData({
                title: data.title,
                content: data.content,
                tags: data.tags?.map(tag => typeof tag === 'string' ? tag : tag.name) || [],
                thumbnailUrl: data.thumbnailUrl,
                image: null,
                imagePreview: data.thumbnailUrl
            });
        } catch (error) {
            console.error('블로그 불러오기 실패:', error);
            alert('게시글을 불러오는데 실패했습니다.');
            navigate('/blogs');
        } finally {
            setLoading(false);
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

    const handleMetadataSubmit = (metadata) => {
        setFormData({
            ...formData,
            tags: metadata.tags,
            image: metadata.image,
            imagePreview: metadata.imagePreview
        });
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

        try {
            let finalThumbnailUrl = formData.thumbnailUrl;

            // 새 이미지가 선택된 경우 업로드
            if (formData.image) {
                const file = formData.image;
                const fileName = `${Date.now()}_${file.name}`;
                const { uploadUrl, fileUrl } = await storageService.getPresignedUrl(
                    fileName,
                    file.type,
                    'public/blogs/thumbnails', // 블로그 썸네일 경로
                    file.size
                );

                await storageService.uploadToS3(uploadUrl, file, file.type);
                finalThumbnailUrl = fileUrl;
            }

             await blogService.updateBlog(id, {
                title: formData.title,
                content: formData.content,
                tags: formData.tags,
                thumbnailUrl: finalThumbnailUrl
            });

            alert('게시글이 수정되었습니다.');
            navigate(`/blogs/${id}`);
        } catch (error) {
            console.error('블로그 수정 실패:', error);
            alert(error.response?.data?.message || '게시글 수정 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (formData.title || formData.content) {
            if (window.confirm('수정을 취소하시겠습니까?')) {
                navigate(`/blogs/${id}`);
            }
        } else {
            navigate(`/blogs/${id}`);
        }
    };

    if (loading) {
        return (
            <CreateContainer>
                <CreateCard>
                    <div style={{ padding: '40px', textAlign: 'center' }}>로딩 중...</div>
                </CreateCard>
            </CreateContainer>
        );
    }

    return (
        <CreateContainer>
            <CreateCard>
                <CreateHeader>
                    <PageTitle>글 수정하기</PageTitle>
                    <PageDescription>
                        내용을 자유롭게 수정해주세요.
                    </PageDescription>
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

                        <MetadataSection>
                            {formData.tags.length === 0 && !formData.imagePreview ? (
                                <MetadataSummary>메타데이터 미설정</MetadataSummary>
                            ) : (
                                <MetadataSummary>
                                    {formData.tags.map((tag, index) => (
                                        <MetadataTag key={index}>{tag}</MetadataTag>
                                    ))}
                                    {formData.imagePreview && <MetadataImage>📷</MetadataImage>}
                                </MetadataSummary>
                            )}
                            <MetadataButton type="button" onClick={() => setIsModalOpen(true)}>
                                메타데이터 설정
                            </MetadataButton>
                        </MetadataSection>

                    <ButtonGroup>
                        <CancelButton type="button" onClick={handleCancel}>
                            취소
                        </CancelButton>
                        <SubmitButton type="submit" disabled={isSubmitting}>
                            {isSubmitting ? '수정 중...' : '수정 완료'}
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
            />
        </CreateContainer>
    );
};

export default BlogEditPage;
