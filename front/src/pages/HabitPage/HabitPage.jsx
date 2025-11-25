import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { habitService } from '../../api/services';
import useAuthStore from '../../store/authStore';
import {
  HabitContainer,
  HabitHeader,
  PageTitle,
  HeaderActions,
  ToggleGroup,
  ToggleButton,
  CreateButton,
  FilterSection,
  FilterTabs,
  FilterTab,
  SearchBox,
  SearchTypeSelect,
  SearchInput,
  SearchButton,
  HabitList,
  HabitCard,
  HabitCardHeader,
  HabitInfo,
  HabitColor,
  HabitTitleSection,
  HabitTitle,
  HabitOwner,
  HabitDescription,
  HabitStats,
  StatItem,
  StatValue,
  StatLabel,
  StreakBadge,
  CalendarContainer,
  TwoMonthContainer,
  MonthLabelsRow,
  MonthLabel,
  MonthGrid,
  DayCell,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
  Loading
} from './HabitPage.styled';

const HabitPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [calendarData, setCalendarData] = useState({});
  const [viewMode, setViewMode] = useState('all'); // 'my' or 'all'
  const [sortType, setSortType] = useState('LATEST'); // 정렬 타입
  const [searchKeyword, setSearchKeyword] = useState(''); // 검색어
  const [searchType, setSearchType] = useState('TITLE'); // 검색 타입

  // 습관 목록 조회
  useEffect(() => {
    loadHabits();
  }, [isAuthenticated, user, viewMode, sortType]);

  const loadHabits = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const startMonth = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      const startMonthStr = `${startMonth.getFullYear()}-${String(startMonth.getMonth() + 1).padStart(2, '0')}`;

      const params = {
        status: 'ACTIVE',
        size: 100,
        startMonth: startMonthStr,
        endMonth: currentMonth,
        sortType: sortType // 정렬 타입 추가
      };

      // 로그인한 경우 viewMode에 따라 조회
      // 비로그인은 항상 모든 습관 조회
      if (isAuthenticated && viewMode === 'my' && user?.id) {
        params.userId = user.id;
      }

      // 검색어가 있는 경우 검색 파라미터 추가
      if (searchKeyword.trim()) {
        params.keyword = searchKeyword;
        params.searchType = searchType;
      }

      // 대시보드 API 사용 (습관 목록 + 6개월 캘린더 데이터 한번에 조회)
      const data = await habitService.getHabitDashboard(params);

      // 습관 목록과 캘린더 데이터 분리
      const habits = data.habits || [];
      setHabits(habits);

      // 캘린더 데이터 매핑
      const calendarMap = {};
      habits.forEach(habit => {
        calendarMap[habit.id] = habit.calendar || {};
      });
      setCalendarData(calendarMap);

    } catch (error) {
      console.error('습관 대시보드 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 6개월 캘린더 렌더링 (GitHub 스타일)
  const renderSixMonthCalendar = (habitId, targetCount) => {
    const today = new Date();
    const now = new Date();

    // 6개월 전 1일부터 시작
    const startMonth = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    // 해당 월의 첫 주 시작일 (일요일)
    const firstDay = new Date(startMonth);
    firstDay.setDate(firstDay.getDate() - firstDay.getDay());

    // 현재 월의 마지막 날
    const endMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // 마지막 주의 종료일 (토요일)
    const lastDay = new Date(endMonth);
    lastDay.setDate(lastDay.getDate() + (6 - lastDay.getDay()));

    const days = [];
    const monthLabels = [];
    const monthStartIndices = new Map(); // 각 월의 시작 인덱스 저장
    let currentDate = new Date(firstDay);
    let lastMonthProcessed = -1;

    // 시작일부터 종료일까지 모든 날짜 생성
    while (currentDate <= lastDay) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

      // 6개월 범위 내인지 확인
      const isInRange = currentDate >= startMonth && currentDate <= endMonth;
      const count = calendarData[habitId]?.[dateStr] || 0;
      const intensity = isInRange ? getIntensity(count, targetCount) : null;
      const isToday = currentDate.toDateString() === today.toDateString();

      // 월 레이블 추출 (각 월의 첫 주 일요일에만)
      if (currentDate.getDay() === 0 && currentDate.getMonth() !== lastMonthProcessed && isInRange) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const columnIndex = Math.floor(days.length / 7);
        monthStartIndices.set(currentDate.getMonth(), columnIndex);
        monthLabels.push({
          month: currentDate.getMonth(),
          label: monthNames[currentDate.getMonth()],
          columnIndex
        });
        lastMonthProcessed = currentDate.getMonth();
      }

      days.push({
        date: dateStr,
        intensity,
        isToday,
        count,
        isEmpty: !isInRange
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // 각 월 레이블의 너비 계산 (다음 월 시작까지의 열 수 * 12px)
    const totalColumns = Math.ceil(days.length / 7);
    monthLabels.forEach((label, idx) => {
      const nextColumnIndex = idx < monthLabels.length - 1
        ? monthLabels[idx + 1].columnIndex
        : totalColumns;
      const columnCount = nextColumnIndex - label.columnIndex;
      label.width = columnCount * 12; // 10px cell + 2px gap
    });

    return (
      <TwoMonthContainer>
        <MonthLabelsRow>
          {monthLabels.map((label, idx) => (
            <MonthLabel key={idx} $width={`${label.width}px`}>
              {label.label}
            </MonthLabel>
          ))}
        </MonthLabelsRow>
        <MonthGrid>
          {days.map((day, index) => (
            <DayCell
              key={index}
              $intensity={day.isEmpty ? null : day.intensity}
              $isToday={day.isToday}
              $isEmpty={day.isEmpty}
              title={day.isEmpty ? '' : `${day.date}: ${day.count}회`}
            />
          ))}
        </MonthGrid>
      </TwoMonthContainer>
    );
  };

  // 강도 계산 (0~4)
  const getIntensity = (count, targetCount) => {
    if (count === 0) return 0;
    const percentage = (count / targetCount) * 100;
    if (percentage < 50) return 1;
    if (percentage < 100) return 2;
    if (percentage === 100) return 3;
    return 4; // 목표 초과
  };

  const handleCreateHabit = () => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    navigate('/habits/create');
  };

  // 정렬 변경 핸들러
  const handleSortChange = (newSortType) => {
    setSortType(newSortType);
  };

  // 검색 핸들러
  const handleSearch = () => {
    loadHabits();
  };

  // 엔터 키 검색
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <HabitContainer>
      <HabitHeader>
        <PageTitle>Habit</PageTitle>
        <HeaderActions>
          {isAuthenticated && (
            <ToggleGroup>
              <ToggleButton
                $active={viewMode === 'my'}
                onClick={() => setViewMode('my')}
              >
                내 습관
              </ToggleButton>
              <ToggleButton
                $active={viewMode === 'all'}
                onClick={() => setViewMode('all')}
              >
                모든 습관
              </ToggleButton>
            </ToggleGroup>
          )}
          {isAuthenticated && (
            <CreateButton onClick={handleCreateHabit}>새 습관 만들기</CreateButton>
          )}
        </HeaderActions>
      </HabitHeader>

      {/* 필터 및 검색 */}
      <FilterSection>
        <FilterTabs>
          <FilterTab
            $active={sortType === 'LATEST'}
            onClick={() => handleSortChange('LATEST')}
          >
            최신순
          </FilterTab>
          <FilterTab
            $active={sortType === 'CURRENT_STREAK'}
            onClick={() => handleSortChange('CURRENT_STREAK')}
          >
            현재 연속
          </FilterTab>
          <FilterTab
            $active={sortType === 'LONGEST_STREAK'}
            onClick={() => handleSortChange('LONGEST_STREAK')}
          >
            최장 연속
          </FilterTab>
        </FilterTabs>
        <SearchBox>
          <SearchTypeSelect
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="TITLE">습관명</option>
            <option value="AUTHOR">작성자</option>
          </SearchTypeSelect>
          <SearchInput
            type="text"
            placeholder="습관 검색..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <SearchButton onClick={handleSearch}>검색</SearchButton>
        </SearchBox>
      </FilterSection>

      {/* 습관 목록 영역 */}
      {loading ? (
        <Loading>습관 목록을 불러오는 중...</Loading>
      ) : habits.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📋</EmptyIcon>
          <EmptyTitle>아직 습관이 없습니다</EmptyTitle>
          <EmptyDescription>
            {isAuthenticated
              ? '새로운 습관을 만들어 매일 기록해보세요!'
              : '로그인하고 습관을 만들어보세요!'}
          </EmptyDescription>
          {isAuthenticated && (
            <CreateButton onClick={handleCreateHabit}>첫 습관 만들기</CreateButton>
          )}
        </EmptyState>
      ) : (
        <HabitList>
          {habits.map(habit => (
            <HabitCard key={habit.id}>
              <HabitCardHeader>
                <HabitInfo>
                  <HabitColor $color={habit.color} />
                  <HabitTitleSection>
                    <HabitTitle>{habit.title}</HabitTitle>
                    <HabitOwner>by {habit.userNickname || '익명'}</HabitOwner>
                    {habit.description && (
                      <HabitDescription>{habit.description}</HabitDescription>
                    )}
                  </HabitTitleSection>
                </HabitInfo>

                {habit.currentStreak > 0 && (
                  <StreakBadge>
                    <span className="fire-icon">🔥</span>
                    <span className="streak-number">{habit.currentStreak}</span>
                    <span className="streak-text">일 연속</span>
                  </StreakBadge>
                )}
              </HabitCardHeader>

              <HabitStats>
                <StatItem>
                  <StatValue>{habit.currentStreak}</StatValue>
                  <StatLabel>현재 연속</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{habit.longestStreak}</StatValue>
                  <StatLabel>최장 연속</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{habit.totalRecords}</StatValue>
                  <StatLabel>총 기록</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{habit.targetCount}</StatValue>
                  <StatLabel>일일 목표</StatLabel>
                </StatItem>
              </HabitStats>

              <CalendarContainer>
                {renderSixMonthCalendar(habit.id, habit.targetCount)}
              </CalendarContainer>
            </HabitCard>
          ))}
        </HabitList>
      )}
    </HabitContainer>
  );
};

export default HabitPage;
