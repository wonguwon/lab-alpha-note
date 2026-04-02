import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  ErrorMessage,
  ToggleWrapper,
  ToggleSwitch,
  ToggleInput,
  ToggleSlider,
  ToggleLabel,
  EndDateWrapper
} from './HabitCreatePage.styled';

const HabitEditPage = () => {
  const { habitId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    color: '#10B981',
    targetCount: 1,
    endDate: ''
  });
  const [hasEndDate, setHasEndDate] = useState(false);
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

  // 습관 데이터 불러오기
  useEffect(() => {
    const loadHabitData = async () => {
      try {
        setLoading(true);
        const habitData = await habitService.getHabit(habitId);

        setFormData({
          title: habitData.title,
          description: habitData.description || '',
          color: habitData.color,
          targetCount: habitData.targetCount,
          endDate: habitData.endDate || ''
        });

        setHasEndDate(!!habitData.endDate);
      } catch (error) {
        console.error('습관 정보 조회 실패:', error);
        alert('습관 정보를 불러올 수 없습니다.');
        navigate('/habits');
      } finally {
        setLoading(false);
      }
    };

    if (habitId) {
      loadHabitData();
    }
  }, [habitId, navigate]);

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

  const handleEndDateToggle = (e) => {
    const checked = e.target.checked;
    setHasEndDate(checked);
    if (!checked) {
      setFormData({ ...formData, endDate: '' });
      if (errors.endDate) {
        setErrors({ ...errors, endDate: '' });
      }
    }
  };

  const handleEndDateChange = (e) => {
    setFormData({ ...formData, endDate: e.target.value });
    if (errors.endDate) {
      setErrors({ ...errors, endDate: '' });
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
        targetCount: formData.targetCount
      };

      // 종료일이 설정된 경우에만 추가
      if (hasEndDate && formData.endDate) {
        submitData.endDate = formData.endDate;
      }

      await habitService.updateHabit(habitId, submitData);
      alert('습관이 성공적으로 수정되었습니다!');
      navigate(`/habits/${habitId}`);
    } catch (error) {
      console.error('습관 수정 실패:', error);
      if (error.response?.data?.error?.code === 'HABIT_ACCESS_DENIED') {
        alert('본인의 습관만 수정할 수 있습니다.');
      } else if (error.response?.data?.error?.code === 'HABIT_NOT_FOUND') {
        alert('습관을 찾을 수 없습니다.');
        navigate('/habits');
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('습관 수정에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/habits/${habitId}`);
  };

  if (loading) {
    return (
      <CreateContainer>
        <CreateCard>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            로딩 중...
          </div>
        </CreateCard>
      </CreateContainer>
    );
  }

  return (
    <CreateContainer>
      <CreateCard>
        <CreateHeader>
          <PageTitle>습관 수정하기</PageTitle>
          <PageDescription>
            습관 정보를 수정하세요. 시작일은 변경할 수 없습니다.
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
              <Label>종료일</Label>
              <ToggleWrapper>
                <ToggleSwitch>
                  <ToggleInput
                    type="checkbox"
                    checked={hasEndDate}
                    onChange={handleEndDateToggle}
                  />
                  <ToggleSlider />
                </ToggleSwitch>
                <ToggleLabel>종료일 설정</ToggleLabel>
              </ToggleWrapper>
              <EndDateWrapper $disabled={!hasEndDate}>
                <DateInput
                  type="date"
                  value={formData.endDate}
                  onChange={handleEndDateChange}
                  $error={!!errors.endDate}
                  disabled={!hasEndDate}
                />
                <HelperText>
                  {hasEndDate
                    ? '습관을 종료할 날짜를 선택해주세요. 종료일 이후에는 기록할 수 없습니다.'
                    : '종료일을 설정하지 않으면 계속해서 기록할 수 있습니다.'}
                </HelperText>
                {errors.endDate && <ErrorMessage>{errors.endDate}</ErrorMessage>}
              </EndDateWrapper>
            </FormGroup>
          </FormSection>

          <ButtonGroup>
            <CancelButton type="button" onClick={handleCancel}>
              취소
            </CancelButton>
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? '수정 중...' : '습관 수정하기'}
            </SubmitButton>
          </ButtonGroup>
        </form>
      </CreateCard>
    </CreateContainer>
  );
};

export default HabitEditPage;
