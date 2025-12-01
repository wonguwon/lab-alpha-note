import styled from 'styled-components';

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

export const HabitHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding-bottom: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
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
  gap: ${props => props.theme.spacing.xs};
`;

export const HabitTitle = styled.h2`
  font-size: ${props => props.theme.fontSize.xl};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

export const HabitMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

export const TargetInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.fontSize.md};
  color: ${props => props.theme.colors.text.primary};
  font-weight: ${props => props.theme.fontWeight.medium};
`;

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.gray[50]};
  border-radius: ${props => props.theme.borderRadius.md};
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
`;

export const StatValue = styled.div`
  font-size: ${props => props.theme.fontSize.xl};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
`;

export const StatLabel = styled.div`
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

export const TimelineContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding-right: ${props => props.theme.spacing.sm};

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px;
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
`;

export const Timeline = styled.div`
  position: relative;
  padding-left: ${props => props.theme.spacing.xl};

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
  padding-bottom: ${props => props.theme.spacing.lg};

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
    background: ${props => props.$color || props.theme.colors.primary};
    border: 2px solid white;
    box-shadow: 0 0 0 2px ${props => props.$color || props.theme.colors.primary};
    z-index: 1;
  }
`;

export const RecordCard = styled.div`
  background: white;
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.gray[300]};
    box-shadow: ${props => props.theme.shadows.sm};
  }
`;

export const RecordHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

export const RecordDate = styled.div`
  font-size: ${props => props.theme.fontSize.md};
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

export const RecordTimeAgo = styled.span`
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.normal};
  color: ${props => props.theme.colors.text.secondary};
  margin-left: ${props => props.theme.spacing.xs};
`;

export const ProgressContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing.sm};
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${props => props.theme.colors.gray[100]};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: ${props => props.theme.spacing.xs};
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
  font-size: ${props => props.theme.fontSize.sm};
`;

export const CountText = styled.span`
  color: ${props => props.theme.colors.text.primary};
  font-weight: ${props => props.theme.fontWeight.medium};
`;

export const AchievementBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: ${props => props.theme.fontSize.xs};
  font-weight: ${props => props.theme.fontWeight.medium};
  color: ${props => {
    if (props.$type === 'exceed') return '#16A34A';
    if (props.$type === 'achieve') return '#22C55E';
    return props.theme.colors.text.secondary;
  }};
`;

export const RecordNote = styled.div`
  margin-top: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.gray[50]};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl} 0;
  color: ${props => props.theme.colors.text.secondary};
`;

export const LoadingState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl} 0;
  color: ${props => props.theme.colors.text.secondary};
`;
