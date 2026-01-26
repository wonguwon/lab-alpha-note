import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import { storageService } from '../../api/services';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  FormGroup,
  Label,
  HelperText,
  TagInputWrapper,
  TagInput,
  TagList,
  Tag,
  RemoveTagButton,
  FileInputWrapper,
  FileInputLabel,
  HiddenFileInput,
  UploadPlaceholder,
  PreviewImage,
  RemoveImageButton,
  ErrorMessage,
  ModalFooter,
  CancelButton,
  SubmitButton,
  RadioGroup,
  RadioLabel,
  RadioInput
} from './BlogMetadataModal.styled';

const BlogMetadataModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialTags = [],
  initialImage = null,
  initialImagePreview = null,
  isPublishing = false,
  submitButtonText = '확인',
  initialVisibility = 'PUBLIC'
}) => {
  const [tags, setTags] = useState(initialTags);
  const [tagInput, setTagInput] = useState('');
  const [image, setImage] = useState(initialImage);
  const [imagePreview, setImagePreview] = useState(initialImagePreview);
  const [visibility, setVisibility] = useState(initialVisibility);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setTags(initialTags);
      setImage(initialImage);
      setImagePreview(initialImagePreview);
      setVisibility(initialVisibility);
      setErrors({});
    }
  }, [isOpen, initialTags, initialImage, initialImagePreview, initialVisibility]);

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  const handleClose = () => {
    setTagInput('');
    setErrors({});
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
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

    if (tags.length >= 5) {
      setErrors({ ...errors, tags: '태그는 최대 5개까지 추가할 수 있습니다.' });
      return;
    }

    if (tags.includes(tag)) {
      setErrors({ ...errors, tags: '이미 추가된 태그입니다.' });
      return;
    }

    setTags([...tags, tag]);
    setTagInput('');
    setErrors({ ...errors, tags: '' });
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 파일 크기 검증 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors({ ...errors, image: '이미지 크기는 10MB 이하여야 합니다.' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(file);
        setImagePreview(reader.result);
        setErrors({ ...errors, image: '' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    setErrors({ ...errors, image: '' });
  };

  const handleSubmit = () => {
    onSubmit({ tags, image, imagePreview, visibility });
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>게시정보 설정</ModalTitle>
          <CloseButton onClick={handleClose}>
            <MdClose />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Label>공개 범위</Label>
            <RadioGroup>
              <RadioLabel>
                <RadioInput
                  type="radio"
                  name="visibility"
                  value="PUBLIC"
                  checked={visibility === 'PUBLIC'}
                  onChange={() => setVisibility('PUBLIC')}
                />
                공개
              </RadioLabel>
              <RadioLabel>
                <RadioInput
                  type="radio"
                  name="visibility"
                  value="PRIVATE"
                  checked={visibility === 'PRIVATE'}
                  onChange={() => setVisibility('PRIVATE')}
                />
                비공개
              </RadioLabel>
            </RadioGroup>
          </FormGroup>

          <FormGroup>
            <Label>태그</Label>
            <HelperText>주제와 관련된 태그를 입력하세요. (최대 5개)</HelperText>
            <TagInputWrapper>
              <TagInput
                type="text"
                placeholder="태그를 입력하세요 (Enter 또는 쉼표로 추가)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagInputKeyPress}
                onBlur={addTag}
              />
            </TagInputWrapper>
            {tags.length > 0 && (
              <TagList>
                {tags.map((tag, index) => (
                  <Tag key={index}>
                    {tag}
                    <RemoveTagButton type="button" onClick={() => removeTag(tag)}>
                      ×
                    </RemoveTagButton>
                  </Tag>
                ))}
              </TagList>
            )}
            {errors.tags && <ErrorMessage>{errors.tags}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>대표 이미지</Label>
            <HelperText>블로그 글의 대표 이미지를 설정하세요. (최대 10MB)</HelperText>
            <FileInputWrapper>
              <FileInputLabel $hasImage={!!imagePreview}>
                {imagePreview ? (
                  <PreviewImage src={imagePreview} alt="Preview" />
                ) : (
                  <UploadPlaceholder>
                    <span style={{ fontSize: '48px' }}>📷</span>
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
            {imagePreview && (
              <RemoveImageButton type="button" onClick={handleRemoveImage}>
                이미지 제거
              </RemoveImageButton>
            )}
            {errors.image && <ErrorMessage>{errors.image}</ErrorMessage>}
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <CancelButton type="button" onClick={handleClose} disabled={isPublishing}>
            취소
          </CancelButton>
          <SubmitButton type="button" onClick={handleSubmit} disabled={isPublishing}>
            {isPublishing ? '게시 중...' : submitButtonText}
          </SubmitButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default BlogMetadataModal;
