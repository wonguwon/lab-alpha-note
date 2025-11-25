import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { habitService } from '../../api/services';
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
  HelperText,
  Input,
  TextArea,
  ColorPickerWrapper,
  ColorOption,
  ColorInput,
  NumberInput,
  DateInput,
  CharCount,
  ButtonGroup,
  CancelButton,
  SubmitButton,
  ErrorMessage
} from './HabitCreatePage.styled';

const HabitCreatePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    color: '#10B981', // 기본 색상 (녹색)
    targetCount: 1,
    startDate: new Date().toISOString().split('T')[0] // 오늘 날짜
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const colorInputRef = React.useRef(null);

  // 색상 팔레트
  const colorOptions = [
    '#10B981', // 녹색
    '#3B82F6', // 파랑
    '#F59E0B', // 주황
    '#EF4444', // 빨강
    '#8B5CF6', // 보라
    '#EC4899', // 핑크
    '#14B8A6', // 청록
    '#F97316'  // 오렌지
  ];

  const handleTitleChange = (e) => {
    const value = e.target.value;
    if (value.length <= 100) {
      setFormData({ ...formData, title: value });
      if (errors.title) {
        setErrors({ ...errors, title: '' });
      }
    }
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= 1000) {
      setFormData({ ...formData, description: value });
      if (errors.description) {
        setErrors({ ...errors, description: '' });
      }
    }
  };

  const handleColorChange = (color) => {
    setFormData({ ...formData, color });
  };

  const handleColorPickerClick = () => {
    colorInputRef.current?.click();
  };

  const handleColorInputChange = (e) => {
    const color = e.target.value;
    setFormData({ ...formData, color });
  };

  const handleTargetCountChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= 0 && value <= 100) {
      setFormData({ ...formData, targetCount: value });
      if (errors.targetCount) {
        setErrors({ ...errors, targetCount: '' });
      }
    }
  };

  const handleStartDateChange = (e) => {
    setFormData({ ...formData, startDate: e.target.value });
    if (errors.startDate) {
      setErrors({ ...errors, startDate: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = '습관명을 입력해주세요.';
    } else if (formData.title.length > 100) {
      newErrors.title = '습관명은 100자 이하로 입력해주세요.';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = '설명은 1000자 이하로 입력해주세요.';
    }

    if (!formData.targetCount || formData.targetCount < 1) {
      newErrors.targetCount = '하루 목표 횟수는 최소 1회 이상이어야 합니다.';
    } else if (formData.targetCount > 100) {
      newErrors.targetCount = '하루 목표 횟수는 최대 100회까지 설정할 수 있습니다.';
    }

    if (!formData.startDate) {
      newErrors.startDate = '시작일을 선택해주세요.';
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

    try {
      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        color: formData.color,
        targetCount: formData.targetCount,
        startDate: formData.startDate
      };

      await habitService.createHabit(submitData);
      alert('습관이 성공적으로 생성되었습니다!');
      navigate('/habits');
    } catch (error) {
      console.error('습관 생성 실패:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('습관 생성에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (formData.title || formData.description) {
      if (window.confirm('작성 중인 내용이 있습니다. 정말 취소하시겠습니까?')) {
        navigate('/habits');
      }
    } else {
      navigate('/habits');
    }
  };

  return (
    <CreateContainer>
      <CreateCard>
        <CreateHeader>
          <PageTitle>새 습관 만들기</PageTitle>
          <PageDescription>
            새로운 습관을 만들고 매일 기록하여 꾸준히 실천해보세요.
          </PageDescription>
        </CreateHeader>

        <form onSubmit={handleSubmit}>
          <FormSection>
            <FormGroup>
              <Label>
                습관명<RequiredMark>*</RequiredMark>
              </Label>
              <Input
                type="text"
                placeholder="예: 운동하기, 독서하기, 물 마시기"
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
              <Label>설명</Label>
              <TextArea
                placeholder="습관에 대한 설명을 입력해주세요 (선택사항)"
                value={formData.description}
                onChange={handleDescriptionChange}
                $error={!!errors.description}
                maxLength={1000}
              />
              <CharCount $exceeded={formData.description.length > 1000}>
                {formData.description.length} / 1000
              </CharCount>
              {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>색상</Label>
              <ColorPickerWrapper>
                {colorOptions.map(color => (
                  <ColorOption
                    key={color}
                    type="button"
                    $color={color}
                    $selected={formData.color === color}
                    onClick={() => handleColorChange(color)}
                  />
                ))}
                <ColorOption
                  type="button"
                  $isPicker
                  $customColor={!colorOptions.includes(formData.color) ? formData.color : null}
                  onClick={handleColorPickerClick}
                  title="직접 선택"
                />
                <ColorInput
                  ref={colorInputRef}
                  type="color"
                  value={formData.color}
                  onChange={handleColorInputChange}
                />
              </ColorPickerWrapper>
              <HelperText>
                습관을 나타낼 색상을 선택하거나 직접 선택해주세요.
              </HelperText>
            </FormGroup>

            <FormGroup>
              <Label>
                하루 목표 횟수<RequiredMark>*</RequiredMark>
              </Label>
              <NumberInput
                type="number"
                min="1"
                max="100"
                value={formData.targetCount}
                onChange={handleTargetCountChange}
                $error={!!errors.targetCount}
              />
              <HelperText>하루에 몇 번 실천할지 목표를 설정해주세요. (1~100회)</HelperText>
              {errors.targetCount && <ErrorMessage>{errors.targetCount}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>
                시작일<RequiredMark>*</RequiredMark>
              </Label>
              <DateInput
                type="date"
                value={formData.startDate}
                onChange={handleStartDateChange}
                max={new Date().toISOString().split('T')[0]}
                $error={!!errors.startDate}
              />
              <HelperText>습관을 시작할 날짜를 선택해주세요.</HelperText>
              {errors.startDate && <ErrorMessage>{errors.startDate}</ErrorMessage>}
            </FormGroup>
          </FormSection>

          <ButtonGroup>
            <CancelButton type="button" onClick={handleCancel}>
              취소
            </CancelButton>
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? '생성 중...' : '습관 만들기'}
            </SubmitButton>
          </ButtonGroup>
        </form>
      </CreateCard>
    </CreateContainer>
  );
};

export default HabitCreatePage;
