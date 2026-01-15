import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TiptapEditor from '../../components/TiptapEditor';
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
  FileInputWrapper,
  FileInputLabel,
  HiddenFileInput,
  UploadPlaceholder,
  PreviewImage,
  HelperText,
  TagInputWrapper,
  TagInput,
  TagList,
  Tag,
  RemoveTagButton
} from './BlogEditPage.styled';

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
    const [tagInput, setTagInput] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                            <HelperText>주제와 관련된 태그를 입력하세요. (최대 5개)</HelperText>
                            <TagInputWrapper>
                                <TagInput
                                    type="text"
                                    placeholder="관련 기술이나 주제를 입력하세요. (예: 일상, 개발, 여행)"
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
                                            <RemoveTagButton type="button" onClick={() => removeTag(tag)}>×</RemoveTagButton>
                                        </Tag>
                                    ))}
                                </TagList>
                            )}
                            {errors.tags && <ErrorMessage>{errors.tags}</ErrorMessage>}
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
                            {isSubmitting ? '수정 중...' : '수정 완료'}
                        </SubmitButton>
                    </ButtonGroup>
                </form>
            </CreateCard>
        </CreateContainer>
    );
};

export default BlogEditPage;
