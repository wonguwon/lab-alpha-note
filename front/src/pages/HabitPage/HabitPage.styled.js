import styled from 'styled-components';
import { container, flexBetween } from '../../styles/mixins';

export const HabitContainer = styled.div`
  ${container}
  padding: ${props => props.theme.spacing[6]} ${props => props.theme.spacing[4]};
  max-width: 1200px;
  min-height: calc(100vh - 200px);
`;

export const HabitHeader = styled.div`
  ${flexBetween}
  margin-bottom: ${props => props.theme.spacing[6]};

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${props => props.theme.spacing[4]};
  }
`;

export const PageTitle = styled.h1`
  font-size: ${props => props.theme.fonts.size['3xl']};
  font-weight: ${props => props.theme.fonts.weight.bold};
  color: ${props => props.theme.colors.gray[900]};
  margin: 0;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
    width: 100%;
  }
`;

export const ToggleGroup = styled.div`
  display: flex;
  background: ${props => props.theme.colors.gray[100]};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing[1]};
`;

export const ToggleButton = styled.button`
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[4]};
  background: ${props => props.$active ? props.theme.colors.white : 'transparent'};
  color: ${props => props.$active ? props.theme.colors.primary[600] : props.theme.colors.gray[600]};
  border: none;
  border-radius: ${props => props.theme.borderRadius.base};
  font-weight: ${props => props.$active ? props.theme.fonts.weight.semibold : props.theme.fonts.weight.medium};
  font-size: ${props => props.theme.fonts.size.sm};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};
  white-space: nowrap;
  box-shadow: ${props => props.$active ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'};

  &:hover {
    color: ${props => props.theme.colors.primary[600]};
  }
`;

export const CreateButton = styled.button`
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[6]};
  background: ${props => props.theme.colors.primary[600]};
  color: ${props => props.theme.colors.white};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  font-size: ${props => props.theme.fonts.size.sm};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};
  white-space: nowrap;

  &:hover {
    background: ${props => props.theme.colors.primary[700]};
    transform: translateY(-1px);
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 100%;
  }
`;

export const HabitList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${props => props.theme.spacing[4]};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

export const HabitCard = styled.div`
  background: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing[6]};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.gray[300]};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

export const HabitCardHeader = styled.div`
  ${flexBetween}
  margin-bottom: ${props => props.theme.spacing[4]};
`;

export const HabitInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
`;

export const HabitColor = styled.div`
  width: 4px;
  height: 40px;
  background: ${props => props.$color || props.theme.colors.primary[500]};
  border-radius: ${props => props.theme.borderRadius.full};
`;

export const HabitTitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[1]};
`;

export const HabitTitle = styled.h3`
  font-size: ${props => props.theme.fonts.size.lg};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.theme.colors.gray[900]};
  margin: 0;
`;

export const HabitOwner = styled.span`
  font-size: ${props => props.theme.fonts.size.xs};
  color: ${props => props.theme.colors.gray[500]};
  font-weight: ${props => props.theme.fonts.weight.medium};
`;

export const HabitDescription = styled.p`
  font-size: ${props => props.theme.fonts.size.sm};
  color: ${props => props.theme.colors.gray[600]};
  margin: 0;
`;

export const StatsAndNavRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${props => props.theme.spacing[3]};
  margin-bottom: ${props => props.theme.spacing[2]};

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${props => props.theme.spacing[3]};
    align-items: flex-start;
  }
`;

export const HabitStats = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[4]};

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    gap: ${props => props.theme.spacing[3]};
  }
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing[1]};
`;

export const StatValue = styled.span`
  font-size: ${props => props.theme.fonts.size.base};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.theme.colors.gray[900]};
`;

export const StatLabel = styled.span`
  font-size: 9px;
  color: ${props => props.theme.colors.gray[500]};
  text-transform: uppercase;
  letter-spacing: 0.02em;
`;

export const StreakBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[4]};
  background: #FFF7ED;
  border-radius: ${props => props.theme.borderRadius.full};

  .fire-icon {
    font-size: ${props => props.theme.fonts.size.xl};
  }

  .streak-number {
    font-size: ${props => props.theme.fonts.size.lg};
    font-weight: ${props => props.theme.fonts.weight.bold};
    color: #EA580C;
  }

  .streak-text {
    font-size: ${props => props.theme.fonts.size.sm};
    color: ${props => props.theme.colors.gray[600]};
  }
`;

export const CalendarContainer = styled.div`
  margin-top: ${props => props.theme.spacing[3]};
`;

export const TwoMonthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const MonthLabelsRow = styled.div`
  display: flex;
  gap: 2px;
  margin-bottom: ${props => props.theme.spacing[1]};
  padding-left: 0;
`;

export const MonthLabel = styled.div`
  font-size: 10px;
  font-weight: ${props => props.theme.fonts.weight.normal};
  color: ${props => props.theme.colors.gray[500]};
  width: ${props => props.$width || 'auto'};
  text-align: left;
`;

export const CalendarWrapper = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[1]};
`;

export const MonthGrid = styled.div`
  display: grid;
  grid-template-rows: repeat(7, 1fr);
  grid-auto-flow: column;
  gap: 2px;
  width: fit-content;
  max-width: 100%;
  overflow-x: auto;

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
`;

export const DayCell = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background: ${props => {
    if (props.$isEmpty) return 'transparent';
    if (props.$intensity === 0) return props.theme.colors.gray[100];
    if (props.$intensity === 1) return '#BBF7D0';
    if (props.$intensity === 2) return '#4ADE80';
    if (props.$intensity === 3) return '#22C55E';
    return '#16A34A';
  }};
  transition: all 0.2s;
  position: relative;
  cursor: ${props => props.$isEmpty ? 'default' : 'pointer'};

  ${props => !props.$isEmpty && `
    &:hover {
      transform: scale(1.5);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      z-index: 10;
    }
  `}

  ${props => props.$isToday && `
    box-shadow: 0 0 0 1.5px ${props.theme.colors.primary[500]};
  `}
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing[16]} ${props => props.theme.spacing[4]};
  text-align: center;
  background: ${props => props.theme.colors.white};
  border: 2px dashed ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.lg};
`;

export const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: ${props => props.theme.spacing[4]};
`;

export const EmptyTitle = styled.h3`
  font-size: ${props => props.theme.fonts.size.xl};
  font-weight: ${props => props.theme.fonts.weight.semibold};
  color: ${props => props.theme.colors.gray[900]};
  margin-bottom: ${props => props.theme.spacing[2]};
`;

export const EmptyDescription = styled.p`
  font-size: ${props => props.theme.fonts.size.sm};
  color: ${props => props.theme.colors.gray[600]};
  margin-bottom: ${props => props.theme.spacing[6]};
`;

export const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${props => props.theme.spacing[16]};
  font-size: ${props => props.theme.fonts.size.lg};
  color: ${props => props.theme.colors.gray[500]};
`;

// 필터 및 검색 섹션
export const FilterSection = styled.div`
  ${flexBetween}
  margin-bottom: ${props => props.theme.spacing[6]};
  gap: ${props => props.theme.spacing[4]};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const FilterTabs = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]};
  background: ${props => props.theme.colors.gray[100]};
  padding: ${props => props.theme.spacing[1]};
  border-radius: ${props => props.theme.borderRadius.lg};

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 100%;
  }
`;

export const FilterTab = styled.button`
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[4]};
  background: ${props => props.$active ? props.theme.colors.white : 'transparent'};
  color: ${props => props.$active ? props.theme.colors.primary[600] : props.theme.colors.gray[600]};
  border: none;
  border-radius: ${props => props.theme.borderRadius.base};
  font-weight: ${props => props.$active ? props.theme.fonts.weight.semibold : props.theme.fonts.weight.medium};
  font-size: ${props => props.theme.fonts.size.sm};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};
  white-space: nowrap;
  box-shadow: ${props => props.$active ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'};

  &:hover {
    color: ${props => props.theme.colors.primary[600]};
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex: 1;
  }
`;

export const SearchBox = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]};
  align-items: center;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 100%;
  }
`;

export const SearchTypeSelect = styled.select`
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.base};
  font-size: ${props => props.theme.fonts.size.sm};
  color: ${props => props.theme.colors.gray[700]};
  background: ${props => props.theme.colors.white};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 90px;
  }
`;

export const SearchInput = styled.input`
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[4]};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.base};
  font-size: ${props => props.theme.fonts.size.sm};
  min-width: 240px;
  transition: all ${props => props.theme.transitions.base};

  &::placeholder {
    color: ${props => props.theme.colors.gray[400]};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    min-width: auto;
    flex: 1;
  }
`;

export const SearchButton = styled.button`
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[4]};
  background: ${props => props.theme.colors.primary[600]};
  color: ${props => props.theme.colors.white};
  border: none;
  border-radius: ${props => props.theme.borderRadius.base};
  font-weight: ${props => props.theme.fonts.weight.medium};
  font-size: ${props => props.theme.fonts.size.sm};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};
  white-space: nowrap;

  &:hover {
    background: ${props => props.theme.colors.primary[700]};
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  }
`;
