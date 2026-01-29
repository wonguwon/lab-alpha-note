import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing[6]} ${props => props.theme.spacing[4]};
  min-height: 100vh;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing[4]} ${props => props.theme.spacing[3]};
  }
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing[1]};
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  margin-bottom: ${props => props.theme.spacing[4]};
  background: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.gray[700]};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    background: ${props => props.theme.colors.gray[50]};
    border-color: ${props => props.theme.colors.gray[400]};
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[6]};
`;

export const HabitHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[4]};
  padding: ${props => props.theme.spacing[6]};
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: ${props => props.theme.spacing[4]};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing[4]};
  }
`;

export const HabitColorBar = styled.div`
  width: 4px;
  height: 60px;
  background: ${props => props.$color || props.theme.colors.primary};
  border-radius: 2px;
  flex-shrink: 0;
`;

export const HabitInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[1]};
`;

export const HabitTitle = styled.h1`
  font-size: ${props => props.theme.fonts.size['2xl']};
  font-weight: ${props => props.theme.fonts.weight.bold};
  color: ${props => props.theme.colors.gray[900]};
  margin: 0;
  line-height: ${props => props.theme.fonts.lineHeight.tight};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fonts.size.xl};
  }
`;

export const HabitMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[4]};
  font-size: ${props => props.theme.fonts.size.sm};
  color: ${props => props.theme.colors.gray[500]};
`;

export const TargetInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[1]};
  font-size: ${props => props.theme.fonts.size.base};
  color: ${props => props.theme.colors.gray[900]};
  font-weight: ${props => props.theme.fonts.weight.medium};
`;

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${props => props.theme.spacing[4]};
  padding: ${props => props.theme.spacing[6]};
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.lg};

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    gap: ${props => props.theme.spacing[3]};
    padding: ${props => props.theme.spacing[4]};
  }
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing[1]};
`;

export const StatValue = styled.div`
  font-size: ${props => props.theme.fonts.size.xl};
  font-weight: ${props => props.theme.fonts.weight.bold};
  color: ${props => props.theme.colors.gray[900]};
`;

export const StatLabel = styled.div`
  font-size: ${props => props.theme.fonts.size.sm};
  color: ${props => props.theme.colors.gray[500]};
`;

// 캘린더 섹션
export const CalendarSection = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing[5]};
  overflow-x: auto;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing[4]};
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const CalendarTitle = styled.h3`
  font-size: ${props => props.theme.fonts.size.base};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.theme.colors.gray[900]};
  margin: 0 0 ${props => props.theme.spacing[3]} 0;
`;

export const CalendarContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    overflow-x: auto;
    width: fit-content;
    max-width: 100%;

    /* 스크롤바 스타일링 */
    &::-webkit-scrollbar {
      height: 6px;
    }

    &::-webkit-scrollbar-track {
      background: ${props => props.theme.colors.gray[100]};
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: ${props => props.theme.colors.gray[300]};
      border-radius: 3px;

      &:hover {
        background: ${props => props.theme.colors.gray[400]};
      }
    }
  }
`;

export const MonthLabelsRow = styled.div`
  display: grid;
  grid-auto-flow: column;
  gap: 3px;
  margin-bottom: ${props => props.theme.spacing[1]};

  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    gap: 2.5px;
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    gap: 2px;
  }
`;

export const MonthLabel = styled.div`
  font-size: 10px;
  font-weight: ${props => props.theme.fonts.weight.normal};
  color: ${props => props.theme.colors.gray[500]};
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  grid-column: span ${props => props.$columnSpan || 1};
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-rows: repeat(7, 1fr);
  grid-auto-flow: column;
  gap: 3px;

  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    gap: 2.5px;
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    gap: 2px;
  }
`;

export const DayCell = styled.div`
  width: 100%;
  aspect-ratio: 1;
  max-width: 15px;
  max-height: 15px;
  min-width: 8px;
  min-height: 8px;
  border-radius: 2px;
  background: ${props => {
    if (props.$isEmpty) return 'transparent';
    if (props.$isBeforeStart) return props.theme.colors.gray[300]; // 시작일 이전 또는 미래 (어두운 회색)
    if (props.$intensity === 0) return props.theme.colors.gray[100];
    if (props.$intensity === 1) return '#BBF7D0';
    if (props.$intensity === 2) return '#4ADE80';
    if (props.$intensity === 3) return '#22C55E';
    return '#16A34A';
  }};
  transition: all 0.2s;
  position: relative;
  cursor: ${props => props.$isEmpty || props.$isBeforeStart ? 'default' : 'pointer'};

  ${props => !props.$isEmpty && !props.$isBeforeStart && `
    &:hover {
      transform: scale(1.5);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      z-index: 10;
    }
  `}

  ${props => props.$isToday && `
    box-shadow: 0 0 0 1.5px ${props.theme.colors.primary[500]};
  `}

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    width: 10px;
    height: 10px;
    max-width: 10px;
    max-height: 10px;
  }
`;

export const CalendarLegend = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[1]};
  margin-top: ${props => props.theme.spacing[3]};
  justify-content: flex-end;
`;

export const LegendLabel = styled.span`
  font-size: ${props => props.theme.fonts.size.xs};
  color: ${props => props.theme.colors.gray[500]};
`;

export const LegendItem = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background: ${props => {
    switch (props.$intensity) {
      case 0: return props.theme.colors.gray[100];
      case 1: return '#BBF7D0';
      case 2: return '#4ADE80';
      case 3: return '#22C55E';
      case 4: return '#16A34A';
      default: return props.theme.colors.gray[100];
    }
  }};
`;

export const Section = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
`;

export const SectionHeader = styled.div`
  padding: ${props => props.theme.spacing[5]};
  border-bottom: 1px solid ${props => props.theme.colors.gray[100]};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${props => props.theme.spacing[4]};

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${props => props.theme.spacing[3]};
  }
`;

export const SectionTitle = styled.h2`
  font-size: ${props => props.theme.fonts.size.lg};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.theme.colors.gray[900]};
  margin: 0;
`;

export const MonthSelector = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
`;

export const MonthButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.gray[700]};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.base};
  font-size: ${props => props.theme.fonts.size.xs};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.gray[50]};
    border-color: ${props => props.theme.colors.gray[400]};
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

export const MonthDisplay = styled.div`
  min-width: 100px;
  text-align: center;
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.theme.colors.gray[900]};
`;

export const TimelineContainer = styled.div`
  padding: ${props => props.theme.spacing[6]};
`;

export const Timeline = styled.div`
  position: relative;
  padding-left: ${props => props.theme.spacing[10]};

  /* 세로선 */
  &::before {
    content: '';
    position: absolute;
    left: 8px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: ${props => props.$color || props.theme.colors.gray[200]};
    opacity: 0.3;
  }
`;

export const RecordItem = styled.div`
  position: relative;
  padding-bottom: ${props => props.theme.spacing[6]};

  &:last-child {
    padding-bottom: 0;
  }

  /* 타임라인 점 */
  &::before {
    content: '';
    position: absolute;
    left: -28px;
    top: 6px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${props => props.$color || props.theme.colors.primary[500]};
    border: 2px solid white;
    box-shadow: 0 0 0 2px ${props => props.$color || props.theme.colors.primary[500]};
    z-index: 1;
  }
`;

export const RecordCard = styled.div`
  background: ${props => props.theme.colors.gray[50]};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing[4]};
  transition: all 0.2s ease;

  &:hover {
    background: white;
    border-color: ${props => props.theme.colors.gray[300]};
    box-shadow: ${props => props.theme.shadows.sm};
  }
`;

export const RecordHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing[2]};
`;

export const RecordDate = styled.div`
  font-size: ${props => props.theme.fonts.size.base};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.theme.colors.gray[900]};
`;

export const RecordTimeAgo = styled.span`
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.normal};
  color: ${props => props.theme.colors.gray[500]};
  margin-left: ${props => props.theme.spacing[1]};
`;

export const ProgressContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing[2]};
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${props => props.theme.colors.gray[100]};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: ${props => props.theme.spacing[1]};
`;

export const ProgressFill = styled.div`
  height: 100%;
  width: ${props => Math.min(props.$percentage, 100)}%;
  background: ${props => {
    if (props.$percentage >= 100) return '#16A34A'; // 목표 달성
    if (props.$percentage >= 50) return '#22C55E';
    return '#BBF7D0';
  }};
  transition: width 0.3s ease;
`;

export const RecordCountInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${props => props.theme.fonts.size.sm};
`;

export const CountText = styled.span`
  color: ${props => props.theme.colors.gray[900]};
  font-weight: ${props => props.theme.fonts.weight.medium};
`;

export const AchievementBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: ${props => props.theme.fonts.size.xs};
  font-weight: ${props => props.theme.fonts.weight.medium};
  color: ${props => {
    if (props.$type === 'exceed') return '#16A34A';
    if (props.$type === 'achieve') return '#22C55E';
    return props.theme.colors.gray[500];
  }};
`;

export const RecordList = styled.div`
  margin-top: ${props => props.theme.spacing[3]};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[2]};
`;

export const RecordListItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
  padding: ${props => props.theme.spacing[3]};
  background: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    ${props => props.$clickable && `
      background: ${props.theme.colors.gray[50]};
      border-color: ${props.theme.colors.primary[300]};
    `}
  }
`;

export const RecordNumber = styled.div`
  flex-shrink: 0;
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[2]};
  background: ${props => props.theme.colors.primary[100]};
  color: ${props => props.theme.colors.primary[700]};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fonts.size.xs};
  font-weight: ${props => props.theme.fonts.weight.semibold};
`;

export const RecordNoteText = styled.div`
  flex: 1;
  font-size: ${props => props.theme.fonts.size.sm};
  color: ${props => props.theme.colors.gray[700]};
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const EditIcon = styled.span`
  flex-shrink: 0;
  font-size: ${props => props.theme.fonts.size.sm};
  opacity: 0.5;
  transition: opacity ${props => props.theme.transitions.base};

  ${RecordListItem}:hover & {
    opacity: 1;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing[10]} 0;
  color: ${props => props.theme.colors.gray[500]};
`;

export const LoadingState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing[10]} 0;
  color: ${props => props.theme.colors.gray[500]};
`;

// 습관 기록 추가 폼
export const AddRecordSection = styled.div`
  background: ${props => props.theme.colors.white};
  border: 2px dashed ${props => props.theme.colors.primary[300]};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing[4]};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing[3]};
  }
`;

export const AddRecordTitle = styled.h3`
  font-size: ${props => props.theme.fonts.size.base};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.theme.colors.gray[900]};
  margin: 0 0 ${props => props.theme.spacing[3]} 0;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
`;

export const AddRecordForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[3]};
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[1]};
`;

export const FormLabel = styled.label`
  font-size: ${props => props.theme.fonts.size.xs};
  font-weight: ${props => props.theme.fonts.weight.medium};
  color: ${props => props.theme.colors.gray[600]};
`;

export const NoteTextarea = styled.textarea`
  width: 100%;
  min-height: 60px;
  padding: ${props => props.theme.spacing[2]};
  font-size: ${props => props.theme.fonts.size.sm};
  font-family: ${props => props.theme.fonts.family.primary};
  color: ${props => props.theme.colors.gray[900]};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.base};
  background: ${props => props.theme.colors.white};
  resize: vertical;
  transition: all ${props => props.theme.transitions.base};

  &::placeholder {
    color: ${props => props.theme.colors.gray[400]};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.gray[300]};
  }
`;

export const FormActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]};
  justify-content: flex-end;
`;

export const SubmitButton = styled.button`
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[4]};
  background: ${props => props.theme.colors.primary[600]};
  color: ${props => props.theme.colors.white};
  border: none;
  border-radius: ${props => props.theme.borderRadius.base};
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary[700]};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const CancelButton = styled.button`
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[6]};
  background: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.gray[700]};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.base};
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    background: ${props => props.theme.colors.gray[50]};
    border-color: ${props => props.theme.colors.gray[400]};
  }
`;

export const CharCount = styled.div`
  font-size: ${props => props.theme.fonts.size.xs};
  color: ${props => props.theme.colors.gray[500]};
  text-align: right;
  margin-top: ${props => props.theme.spacing[1]};
`;

// 모달 관련 스타일
export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[4]};
`;

export const ModalInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
  padding: ${props => props.theme.spacing[3]};
  background: ${props => props.theme.colors.gray[50]};
  border-radius: ${props => props.theme.borderRadius.sm};
`;

export const ModalInfoLabel = styled.div`
  font-size: ${props => props.theme.fonts.size.sm};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.theme.colors.gray[700]};
`;

export const ModalInfoValue = styled.div`
  font-size: ${props => props.theme.fonts.size.sm};
  color: ${props => props.theme.colors.gray[900]};
`;
